import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import schemaTypes from './schemaTypes'
import {translateAllLanguages} from './actions/translateAllLanguages'
import {testAction} from './actions/testAction'
// import {documentInternationalization} from '@sanity/document-internationalization'
// import {structure} from './structure'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'

export default defineConfig({
  name: 'default',
  title: 'followly',

  projectId: 'd7z4iom2',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    //  documentInternationalization({
    //    supportedLanguages: [
    //      {id: 'en', title: 'English'},
    //      {id: 'fr', title: 'French'},
    //      // Add other languages as needed
    //    ],
    //    schemaTypes: ['article', 'snippet'], // Add other schema types as needed
    //  }),
    internationalizedArray({
      languages: [
        {id: 'en', title: 'English'},
        {id: 'fr', title: 'Français'},
        {id: 'de', title: 'Deutsch'},
        // ...add all 24
      ],
      fieldTypes: [
        {name: 'string', type: 'string'},
        {name: 'text', type: 'text'},
        {name: 'portableText', type: 'array', of: [{type: 'block'}]},
      ],
    }),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev) => [...prev, translateAllLanguages, testAction],
  },
})
