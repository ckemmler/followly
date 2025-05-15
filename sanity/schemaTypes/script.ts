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
      name: 'sequence',
      title: 'Card Sequence',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'scriptStep',
          title: 'Script Step',
          fields: [
            defineField({
              name: 'card',
              title: 'Card',
              type: 'reference',
              to: [{ type: 'card' }],
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'navigation',
              title: 'Navigation Logic',
              type: 'object',
              fields: [
                defineField({
                  name: 'onClick',
                  title: 'On Click',
                  type: 'object',
                  fields: [
                    defineField({ name: 'goToCardId', type: 'string', title: 'Go To Card ID' }),
                  ]
                }),
                defineField({
                  name: 'onTimeout',
                  title: 'On Timeout',
                  type: 'object',
                  fields: [
                    defineField({ name: 'duration', type: 'number', title: 'Delay (in seconds)' }),
                    defineField({ name: 'goToCardId', type: 'string', title: 'Go To Card ID' }),
                  ]
                }),
                defineField({
                  name: 'onChoice',
                  title: 'On User Choice',
                  type: 'object',
                  options: { collapsible: true },
                  fields: [
                    defineField({
                      name: 'choices',
                      type: 'array',
                      title: 'Choices Mapping',
                      of: [
                        {
                          type: 'object',
                          name: 'choice',
                          fields: [
                            defineField({ name: 'option', type: 'string', title: 'User Option (e.g., "calm")' }),
                            defineField({ name: 'goToCardId', type: 'string', title: 'Go To Card ID' }),
                          ]
                        }
                      ]
                    })
                  ]
                }),
                defineField({
                  name: 'onLLM',
                  title: 'On LLM Decision',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'promptTemplate',
                      type: 'text',
                      title: 'Prompt Template',
                      description: 'Supports {{ input }} and {{ history }} placeholders'
                    }),
                    defineField({
                      name: 'resolver',
                      type: 'string',
                      title: 'Resolver Function Name',
                      description: 'Client-side or API function to call'
                    }),
                  ]
                }),
                defineField({
                  name: 'onScriptEnd',
                  title: 'On Script End',
                  type: 'object',
                  fields: [
                    defineField({ name: 'goToScriptId', type: 'string', title: 'Go To Script ID' }),
                  ]
                }),
              ]
            }),
            defineField({
              name: 'customAnimation',
              title: 'Custom Animation (Framer / CSS)',
              type: 'string',
            }),
          ],
					preview: {
						select: {
							title: 'card.title',
							cardType: 'card.cardType',
						},
						prepare({ title, cardType }) {
							return {
								title: title || 'Untitled Card',
								subtitle: cardType ? `Type: ${cardType}` : undefined,
							}
						},
					}
        }
      ]
    }) 
  ]
})