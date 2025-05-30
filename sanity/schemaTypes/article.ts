import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'article',
  title: 'Articles',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'Id',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
      options: {
        aiAssist: {
          translateAction: true,
        },
      },
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'internationalizedArrayString',
      options: {
        source: 'title',
        maxLength: 96,
        aiAssist: {
          translateAction: true,
        },
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'internationalizedArrayPortableText',
      validation: (Rule) => Rule.required(),
      options: {
        aiAssist: {
          translateAction: true,
        },
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      id: 'id',
    },
    prepare({id}) {
      return {
        title: id || 'Untitled',
      }
    },
  },
})
