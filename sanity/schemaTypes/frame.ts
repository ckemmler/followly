import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'frame',
  title: 'Frame',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),

		defineField({
			name: 'tags',
			title: 'Tags',
			type: 'array',
			of: [{ type: 'string' }],
			options: {
				layout: 'tags',
			},
		}),

    defineField({
      name: 'frameType',
      title: 'Frame Type',
      type: 'string',
      options: {
        list: [
          { title: 'Text', value: 'text' },
          { title: 'Video', value: 'video' },
          { title: 'Image', value: 'image' },
          { title: '360 Video', value: '360video' },
          { title: 'Custom', value: 'custom' },
        ],
        layout: 'dropdown',
      },
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'text',
      title: 'Text',
      type: 'internationalizedArrayPortableText',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'componentName',
      title: 'Custom Component Name (Optional)',
      type: 'string',
    }),

		defineField({
			name: 'props',
			title: 'Component Props',
			type: 'array',
			of: [
				{
					type: 'object',
					name: 'propPair',
					title: 'Prop',
					fields: [
						defineField({ name: 'key',   title: 'Key',   type: 'string' }),
						defineField({ name: 'value', title: 'Value', type: 'string' }),
					]
				}
			]
		})
  ],
	preview: {
		select: {
			title: 'title',
		},
		prepare({ title }) {
			return {
				title: title || 'Untitled Frame',
			}
		},
	},})