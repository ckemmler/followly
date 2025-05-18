import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'scene',
  title: 'Scene',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'ID',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Scene Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'script',
      title: 'Script',
      type: 'reference',
      to: [{ type: 'script' }],
      validation: Rule => Rule.required(),
    }),

    // 👇 Toggle to enable a custom stylesheet
    defineField({
      name: 'enableStylesheet',
      title: 'Enable Custom Stylesheet',
      type: 'boolean',
      initialValue: false,
    }),

    // 👇 Code editor for CSS, shown only if toggle is true
    defineField({
      name: 'stylesheet',
      title: 'CSS Stylesheet',
      type: 'code',
      options: {
        language: 'css',
        withFilename: true,
      },
      hidden: ({ parent }) => !parent?.enableStylesheet,
    }),

    // 👇 Toggle to enable custom audio
    defineField({
      name: 'enableAudio',
      title: 'Enable Audio Track',
      type: 'boolean',
      initialValue: false,
    }),

    // 👇 Audio upload or URL — shown only if toggle is true
    defineField({
      name: 'audio',
      title: 'Audio Track',
      type: 'object',
      hidden: ({ parent }) => !parent?.enableAudio,
      fields: [
        {
          name: 'file',
          title: 'Upload File',
          type: 'file',
          options: {
            accept: 'audio/*',
          },
        },
        {
          name: 'url',
          title: 'External URL',
          type: 'url',
        },
      ],
      description: 'Provide either an uploaded file or an external URL for the audio track.',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      scriptId: 'script.id',
    },
    prepare({ title, scriptId }) {
      return {
        title,
        subtitle: scriptId ? `Script: ${scriptId}` : 'No script assigned',
      };
    },
  },
});