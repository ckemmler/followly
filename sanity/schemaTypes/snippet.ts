import {defineType, defineField} from 'sanity'

// welcomeMessage: Sillages
// homepageSnippet: Simples fils d'une coexistence invisible, suivons la trame des univers qui nous traversent.

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
      type: 'localizedString',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'key',
    },
    prepare({title}) {
      return {
        title: title,
      }
    },
  },
})
