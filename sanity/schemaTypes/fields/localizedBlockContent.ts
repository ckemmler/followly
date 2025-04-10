import { defineType } from 'sanity'
import { SUPPORTED_LANGUAGES } from '../../config/languages'

defineType({
	name: 'localizedBlockContent',
	type: 'object',
	fields: SUPPORTED_LANGUAGES.map(lang => ({
		name: lang.id,
		title: lang.title,
		type: 'array',
		of: [{ type: 'block' }],
	})),
})