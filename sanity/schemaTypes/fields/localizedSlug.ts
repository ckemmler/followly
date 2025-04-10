import { defineType } from 'sanity'
import { SUPPORTED_LANGUAGES } from '../../config/languages'
import { LocalizedSlugInput } from '../../components/LocalizedSlugInput'

export default defineType({
	name: 'localizedSlug',
	type: 'object',
	title: 'Localized Slug',
	fields: SUPPORTED_LANGUAGES.map((lang) => ({
		name: lang.id,
		title: lang.title,
		type: 'slug',
		options: {
			source: (doc: any) => doc.title?.[lang.id] ?? '', // assumes a localized title
			slugify: (input: string) =>
				input
					.toLowerCase()
					.replace(/\s+/g, '-')
					.slice(0, 96),
		},
	})),
	components: {
		input: LocalizedSlugInput
	}
})

