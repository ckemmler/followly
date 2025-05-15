import { createClient } from 'next-sanity'
import { getScriptById } from '@/utils/queries'
import { PortableText } from '@portabletext/react'
import { SUPPORTED_LANGUAGES } from '../../../../sanity/config/languages'

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(({id}) => ({
    lang: id,
  }))
}
const client = createClient({
  projectId: 'd7z4iom2',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: true,
})

const INITIAL_SCRIPT_ID = 'welcome' // <- replace with your actual script ID

export default async function ProgressionPage({
  params,
}: {
  params: { lang: string }
}) {
  const script = await client.fetch(getScriptById(INITIAL_SCRIPT_ID))

	if (!script) {
		return (
			<main className="p-6">
				<p className="text-red-600">Error: No script found. Check your script ID.</p>
			</main>
		)
	}

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{script.title}</h1>

      {script.sequence.map((step: any, i: number) => {
        const card = step.card
        const localized = card.text?.find((entry: any) => entry._key === params.lang)

        return (
          <div key={card._id}>
            <h2 className="text-lg font-semibold">{card.title}</h2>
            {localized ? (
              <PortableText value={localized.value} />
            ) : (
              <p className="text-sm italic text-gray-500">No {params.lang} translation available.</p>
            )}
          </div>
        )
      })}
    </main>
  )
}