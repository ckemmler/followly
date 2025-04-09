import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import schemaTypes from './schemaTypes'
import {translateAllLanguages} from './actions/translateAllLanguages'
import {testAction} from './actions/testAction'
import {documentInternationalization} from '@sanity/document-internationalization'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'followly',

  projectId: 'd7z4iom2',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    visionTool(),
    documentInternationalization({
      supportedLanguages: [
        {id: 'en', title: 'English'},
        {id: 'fr', title: 'French'},
        // Add other languages as needed
      ],
      schemaTypes: ['article', 'snippet'], // Add other schema types as needed
    }),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev) => [...prev, translateAllLanguages, testAction],
  },
})
