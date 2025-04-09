// sanity/schemaTypes/article.ts

import { defineType, defineField } from "sanity";
import { SUPPORTED_LANGUAGES } from "../config/languages";

export default defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: SUPPORTED_LANGUAGES.map((lang) => ({
          title: lang.title,
          value: lang.id,
        })),
      },
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
    defineField({
      name: "translations",
      title: "Translations",
      type: "array",
      of: [{ type: "reference", to: [{ type: "article" }] }],
      description: "Other language versions of this article. Link them here for easy switching.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      language: "language",
    },
    prepare({ title, language }) {
      return {
        title: `${title} (${language.toUpperCase()})`,
      };
    },
  },
});
