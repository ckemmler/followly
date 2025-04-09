// sanity/schemaTypes/snippet.ts

import { defineType, defineField } from "sanity";
import { SUPPORTED_LANGUAGES } from "../config/languages";

export default defineType({
  name: "snippet",
  title: "Snippet",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Key",
      type: "string",
      description: 'Unique identifier (e.g. "welcomeMessage", "footerLegal")',
      validation: (Rule) => Rule.required().regex(/^[a-zA-Z0-9-_]+$/),
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: SUPPORTED_LANGUAGES.map((lang) => ({
          title: lang.title,
          value: lang.id,
        })),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "translations",
      title: "Translations",
      type: "array",
      of: [{ type: "reference", to: [{ type: "snippet" }] }],
      description: "Optional: manually link translations of this snippet across other languages",
    }),
  ],
  preview: {
    select: {
      title: "key",
      subtitle: "language",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `(${subtitle.toUpperCase()})` : "",
      };
    },
  },
});
