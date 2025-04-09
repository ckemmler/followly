// sanity/schemaTypes/snippet.ts

import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'snippet',
  title: 'Snippet',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      hidden: true, // ← Optional: i18n plugin handles it
    }),
    defineField({
      name: 'key',
      title: 'Key',
      type: 'string',
      description: 'Unique identifier (e.g. "welcomeMessage", "footerLegal")',
      validation: (Rule) => Rule.required().regex(/^[a-zA-Z0-9-_]+$/),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'key',
    },
    prepare({title}) {
      return {
        title,
      }
    },
  },
})
