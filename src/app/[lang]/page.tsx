import { getLocalizedBlock, LANGUAGES, LocalizedBlock } from '@/utils/languages'
import { Snippet } from '@generated/schemas'
import { PortableText } from '@portabletext/react'
import LanguageSelector from '@/components/LanguageSelector'
import ClientVideo360Wrapper from '@/components/Video360BackgroundWrapper'

const projectId = "d7z4iom2"
const dataset = "production"
const apiKey = "skCx8nkpXZ4v9RBHpJUcgYABZEGsYWMY2HR58HfW8GG4RwvV13Q4VG9HB03riFbXmrHCK7EcScGLthb5BH5QmGR1EB4xbKGPbu3eJx1cSIdgASazA10L8in9sEOhPRIP9e4ixWCrKYpdxqynioQjzW2J2vdoJ5WT6vQtqqDs4WT3L00f4beY"

export async function generateStaticParams() {
  return LANGUAGES.map(lang => ({ lang }))
}

async function getSnippets(): Promise<Record<string, LocalizedBlock[]>> {
  const query = `
    *[_type == "snippet" && key in ["welcomeMessage", "homepageSnippet"]] {
      key,
      content
    }
  `
  const encoded = encodeURIComponent(query)
  const url = `https://${projectId}.api.sanity.io/v1/data/query/${dataset}?query=${encoded}`

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    next: { revalidate: false },
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Sanity error (${res.status}): ${error}`)
  }

  const { result }: { result: Snippet[] } = await res.json()
  return Object.fromEntries(result.map(r => [r.key, r.content]))
}

export default async function LangPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const snippets = await getSnippets()
  
  return (
    <div className="relative min-h-screen bg-gray-900 ">
      
      {/* Language selector in a higher z-index layer */}
      <div className="absolute z-20 top-4 right-4">
        <LanguageSelector currentLang={lang} languages={LANGUAGES} />
      </div>
      
      {/* Content with higher z-index to appear above video */}
      <main className="relative z-10 flex items-center justify-center min-h-screen text-white pointer-events-none">
        <div className="max-w-xl space-y-8 text-center">
          <h1 className="text-3xl font-bold font-heading">
            <PortableText value={getLocalizedBlock(snippets.welcomeMessage, lang)} />
          </h1>
          <div className="text-lg font-body">
            <PortableText value={getLocalizedBlock(snippets.homepageSnippet, lang)} />
          </div>
        </div>
      </main>
      <ClientVideo360Wrapper />
    </div>
  )
}