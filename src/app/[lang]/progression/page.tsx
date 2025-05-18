import Card from '@/components/Card'
import { getSceneById } from '@/utils/queries'
import { Frame, Scene, Script } from '@sanity-types'
import { PortableText } from '@portabletext/react'
import { createClient } from 'next-sanity'
import { SUPPORTED_LANGUAGES } from '../../../../sanity/config/languages'

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(({id}) => ({
    lang: id,
  }))
}
const client = createClient({
  projectId: 'd7z4iom2',
  dataset: 'production',
  apiVersion: '2025-05-15',
  useCdn: true,
})

const INITIAL_SCRIPT_ID = 'welcome' // <- replace with your actual script ID

export default async function ProgressionPage({
  params,
}: {
  params: { lang: string }
}) {
  // const script: Script = await client.fetch(getScriptById(INITIAL_SCRIPT_ID))
  const scene: Scene = await client.fetch(getSceneById(INITIAL_SCRIPT_ID))
	const script = scene.script as unknown as Script;
	const stack = script.stack as unknown as Array<{frame: Frame; _id: string}>

	if (!script) {
		return (
			<main>
				<p className="text-red-600">Error: No script found. Check your script ID.</p>
			</main>
		)
	}

  return (
    <main>
      <h1 className="text-2xl font-bold">{scene.title}</h1>

      {stack.map((frame: {frame: Frame, _id: string}, index: number) => {
const localized = frame.frame.text?.find(
  (entry) => entry._key === params.lang
)
  return (
    <Card key={index}>
      {localized?.value ? (
        <PortableText value={localized.value} />
      ) : (
        <p className="italic text-gray-400">No {params.lang} translation.</p>
      )}
    </Card>
  )
})}
    </main>
  )
}