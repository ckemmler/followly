import { defineType } from 'sanity'
import { SUPPORTED_LANGUAGES } from '../../config/languages'
import { LocalizedInput } from '../../components/LocalizedInput'

export default defineType({
	name: 'localizedString',
	type: 'object',
	title: 'Localized String',
	fields: SUPPORTED_LANGUAGES.map(lang => ({
		name: lang.id,
		title: lang.title,
		type: 'string',
	})),
	components: {
		input: LocalizedInput
	}
})