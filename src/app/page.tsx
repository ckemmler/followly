// app/page.tsx
import { PortableText } from '@portabletext/react'
import { PortableTextBlock } from 'next-sanity'

export const dynamic = 'force-static'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiKey = process.env.SANITY_API_KEY!

if (!projectId || !dataset || !apiKey) {
   throw new Error('Missing required environment variables for Sanity')
}


const query = `
  *[_type == "snippet" && language == "fr" && key in ["welcomeMessage", "homepageNotice"]]
`
const encodedQuery = encodeURIComponent(query)
const apiUrl = `https://${projectId}.api.sanity.io/v1/data/query/${dataset}?query=${encodedQuery}`

console.log('Sanity API URL:', apiUrl)

type Snippet = {
  key: string
  content: PortableTextBlock[]
}

export default async function HomePage() {
  const res = await fetch(apiUrl, {
      headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    next: { revalidate: false },
  })

  if (!res.ok) {
   const errorBody = await res.text()
   throw new Error(`Failed to fetch Sanity data: ${res.status} ${res.statusText}\n${errorBody}`)
   }

  const { result }: { result: Snippet[] } = await res.json()

  const getContent = (key: string): PortableTextBlock[] =>
    result.find((s) => s.key === key)?.content ?? []

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center space-y-8 max-w-xl">
        <h1 className="font-heading text-3xl font-bold">
          <PortableText value={getContent('welcomeMessage')} />
        </h1>
        <div className="font-body text-lg">
          <PortableText value={getContent('homepageNotice')} />
        </div>
      </div>
    </main>
  )
}