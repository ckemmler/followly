import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'script',
  title: 'Script',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'ID',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'stack',
      title: 'Frame Stack',
      type: 'array',
      of: [
        {
          name: 'frameReference',
          type: 'object',
          title: 'Frame Step',
          fields: [
            defineField({
              name: 'frame',
              title: 'Frame',
              type: 'reference',
              to: [{ type: 'frame' }],
              validation: Rule => Rule.required(),
            }),
            defineField({
							name: 'triggers',
							title: 'Event Triggers',
							type: 'array',
							of: [
								{
									type: 'object',
									title: 'Trigger',
									fields: [
										defineField({
											name: 'type',
											title: 'Event Type',
											type: 'string',
											options: {
												list: [
													{ title: 'Standard', value: 'standard' },
													{ title: 'Custom', value: 'custom' },
												],
												layout: 'radio',
											},
											validation: Rule => Rule.required(),
										}),
										defineField({
											name: 'standardEvent',
											title: 'Standard Event',
											type: 'string',
											options: {
												list: [
													{ title: 'onClick', value: 'onClick' },
													{ title: 'onScrollDown', value: 'onScrollDown' },
													{ title: 'onScrollUp', value: 'onScrollUp' },
													{ title: 'onTimeout', value: 'onTimeout' },
												],
											},
											hidden: ({ parent }) => parent?.type !== 'standard',
											validation: Rule => Rule.custom((val, ctx) => {
												const parent = ctx.parent as { type?: string }
												return parent.type === 'standard' && !val
													? 'You must choose a standard event'
													: true
											}),
										}),
										defineField({
											name: 'customEvent',
											title: 'Custom Event Name',
											type: 'string',
											description: 'Component-generated event name',
											hidden: ({ parent }) => parent?.type !== 'custom',
											validation: Rule => Rule.custom((val, ctx) => {
												const parent = ctx.parent as { type?: string }
												return parent.type === 'custom' && !val
													? 'You must enter a custom event name'
													: true
											}),
										}),
										defineField({
											name: 'goTo',
											title: 'Go To Frame',
											type: 'reference',
											to: [{ type: 'frame' }],
											validation: Rule => Rule.required(),
										}),
									],
									preview: {
										select: {
											type: 'type',
											standard: 'standardEvent',
											custom: 'customEvent',
											targetTitle: 'goTo.title', // Assumes frame has a 'title' field
										},
										prepare({ type, standard, custom, targetTitle }) {
											const eventName = type === 'standard' ? standard : custom
											return {
												title: eventName || 'Unnamed Event',
												subtitle: targetTitle ? `→ ${targetTitle}` : 'No target frame',
											}
										}
									}
								},
							],
						})
          ],
          preview: {
            select: {
              title: 'frame.title'
            },
            prepare({ title }) {
              return {
                title: title || 'Untitled Frame'
              }
            },
          },
        },
      ],
    }),
  ],
	preview: {
		select: {
			title: 'id',
			stack: 'stack',
		},
		prepare({ title, stack }) {
			const frameCount = Array.isArray(stack) ? stack.length : 0
			return {
				title: `${title} (${frameCount} frame${frameCount !== 1 ? 's' : ''})`,
			}
		}
	}
})