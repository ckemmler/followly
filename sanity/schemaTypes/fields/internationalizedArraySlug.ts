import {defineType} from 'sanity'

export default defineType({
  name: 'internationalizedArraySlug',
  title: 'Localized Slug',
  type: 'array',
  of: [
    {
      type: 'object',
      fields: [
        {name: 'locale', type: 'string'},
        {
          name: 'value',
          type: 'slug',
          options: {
            source: 'title', // or customize per document type
            maxLength: 96,
          },
        },
      ],
      preview: {
        select: {
          locale: 'locale',
          slug: 'value.current',
        },
        prepare({locale, slug}) {
          return {
            title: `${locale}: ${slug}`,
          }
        },
      },
    },
  ],
})
