import { PortableText } from '@portabletext/react'
import { PortableTextBlock } from 'next-sanity'
import { LANGUAGES } from '@/utils/languages'
import { Snippet } from '@generated/schemas'

const projectId = "d7z4iom2"
const dataset = "production"
const apiKey = "skCx8nkpXZ4v9RBHpJUcgYABZEGsYWMY2HR58HfW8GG4RwvV13Q4VG9HB03riFbXmrHCK7EcScGLthb5BH5QmGR1EB4xbKGPbu3eJx1cSIdgASazA10L8in9sEOhPRIP9e4ixWCrKYpdxqynioQjzW2J2vdoJ5WT6vQtqqDs4WT3L00f4beY"


export async function generateStaticParams() {
   return LANGUAGES.map(lang => ({ lang }))
 }

 async function getSnippets(lang: string): Promise<Record<string, PortableTextBlock[]>> {
   const query = `
     *[_type == "snippet" && language == "${lang}" && key in ["welcomeMessage", "homepageNotice"]] {
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
   const snippets = await getSnippets(lang)
   return (
     <main className="flex items-center justify-center min-h-screen text-white bg-gray-900">
       <div className="max-w-xl space-y-8 text-center">
         <h1 className="text-3xl font-bold font-heading">
           <PortableText value={snippets.welcomeMessage ?? []} />
         </h1>
         <div className="text-lg font-body">
           <PortableText value={snippets.homepageNotice ?? []} />
         </div>
       </div>
     </main>
   )
 }