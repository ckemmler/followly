import { PortableText } from '@portabletext/react'
import { PortableTextBlock } from 'next-sanity'
import { LANGUAGES } from '@/utils/languages'
import { Snippet } from '@/types/generated'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiKey = process.env.SANITY_API_KEY!


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
     <main className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
       <div className="text-center space-y-8 max-w-xl">
         <h1 className="font-heading text-3xl font-bold">
           <PortableText value={snippets.welcomeMessage ?? []} />
         </h1>
         <div className="font-body text-lg">
           <PortableText value={snippets.homepageNotice ?? []} />
         </div>
       </div>
     </main>
   )
 }