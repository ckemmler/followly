// sanity/structure.ts
import {StructureResolver} from 'sanity/structure'
import {SUPPORTED_LANGUAGES} from './config/languages'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content by Language')
    .items(
      SUPPORTED_LANGUAGES.map((lang) =>
        S.listItem()
          .title(lang.title)
          .child(
            S.list()
              .title(`${lang.title} Content`)
              .items([
                S.listItem()
                  .title('Articles')
                  .child(
                    S.documentTypeList('article')
                      .title('Articles')
                      .filter('_type == "article" && language == $lang')
                      .params({lang: lang.id}),
                  ),
                S.listItem()
                  .title('Snippets')
                  .child(
                    S.documentTypeList('snippet')
                      .title('Snippets')
                      .filter('_type == "snippet" && language == $lang')
                      .params({lang: lang.id}),
                  ),
              ]),
          ),
      ),
    )
