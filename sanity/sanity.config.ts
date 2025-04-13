import {defineConfig, isKeySegment} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import schemaTypes from './schemaTypes'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {languageFilter} from '@sanity/language-filter'
import {SUPPORTED_LANGUAGES} from './config/languages'

export default defineConfig({
  name: 'default',
  title: 'followly',

  projectId: 'd7z4iom2',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    internationalizedArray({
      languages: SUPPORTED_LANGUAGES,
      buttonAddAll: false,
      defaultLanguages: ['fr'],
      fieldTypes: [
        {name: 'string', type: 'string'},
        {name: 'text', type: 'text'},
        {name: 'portableText', type: 'array', of: [{type: 'block'}]},
      ],
    }),
    languageFilter({
      // Use the same languages as the internationalized array plugin
      supportedLanguages: SUPPORTED_LANGUAGES,
      defaultLanguages: ['fr'],
      documentTypes: ['snippet', 'article'],
      filterField: (enclosingType, member, selectedLanguageIds) => {
        // Filter internationalized arrays
        if (
          enclosingType.jsonType === 'object' &&
          enclosingType.name.startsWith('internationalizedArray') &&
          'kind' in member
        ) {
          // Get last two segments of the field's path
          const pathEnd = member.field.path.slice(-2)
          // If the second-last segment is a _key, and the last segment is `value`,
          // It's an internationalized array value
          // And the array _key is the language of the field
          const language =
            pathEnd[1] === 'value' && isKeySegment(pathEnd[0]) ? pathEnd[0]._key : null

          return language ? selectedLanguageIds.includes(language) : false
        }

        // Filter internationalized objects if you have them
        // `localeString` must be registered as a custom schema type
        if (enclosingType.jsonType === 'object' && enclosingType.name.startsWith('locale')) {
          return selectedLanguageIds.includes(member.name)
        }

        return true
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
