import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import schemaTypes from './schemaTypes'
import {translateAllLanguages} from './actions/translateAllLanguages'
import {testAction} from './actions/testAction'

export default defineConfig({
  name: 'default',
  title: 'followly',

  projectId: 'd7z4iom2',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev) => [...prev, translateAllLanguages, testAction],
  },
})
