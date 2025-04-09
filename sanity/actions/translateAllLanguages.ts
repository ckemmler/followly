// sanity/actions/translateAllLanguages.ts
import {DocumentActionComponent} from 'sanity'
import {SUPPORTED_LANGUAGES} from '../config/languages'
import {translateWithOpenAI} from '../lib/openai'
import {client} from '../lib/client'
import {Article, Snippet} from '@generated/schemas'

export const translateAllLanguages: DocumentActionComponent = (props) => {
  try {
    const doc = props.draft || props.published
    const schemaType = doc?._type

    // Only activate for articles or snippets
    if (schemaType !== 'article' && schemaType !== 'snippet') return null

    return {
      label: 'Translate to all languages',
      icon: () => '🌍',
      onHandle: async () => {
        alert('[translateAllLanguages] Action triggered.')
        console.log('[translateAllLanguages] Action triggered.')

        if (!doc) {
          console.warn('[translateAllLanguages] No document found.')
          alert('No document to translate.')
          return
        }

        console.log('[translateAllLanguages] Doc:', doc)

        const isArticle = doc._type === 'article'

        const baseLang = isArticle ? (doc as Article).language : (doc as Snippet).language
        const baseContent = isArticle
          ? {
              title: (doc as Article).title ?? '[Untitled]',
              body: (doc as Article).body,
            }
          : {
              title: (doc as Snippet).key ?? '[Unnamed Snippet]',
              body: (doc as Snippet).content,
            }

        const targets = SUPPORTED_LANGUAGES.filter((l) => l.id !== baseLang)

        for (const lang of targets) {
          const translated = await translateWithOpenAI({
            input: baseContent,
            from: baseLang as string,
            to: lang.id,
          })

          await client.create({
            _type: doc._type,
            title: translated.title,
            body: translated.body,
            language: lang.id,
            translations: [{_type: 'reference', _ref: doc._id}],
          })
        }

        props.onComplete()
        alert(`Translated into ${targets.length} languages.`)
      },
    }
  } catch (error) {
    console.error('[translateAllLanguages] Error:', error)
    alert('An error occurred while translating.')
  }
  return null
}
