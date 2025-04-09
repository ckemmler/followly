import type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
} from "sanity-codegen";

export type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
};

/**
 * Article
 *
 *
 */
export interface Article extends SanityDocument {
  _type: "article";

  /**
   * Language — `string`
   *
   *
   */
  language?:
    | "en"
    | "fr"
    | "de"
    | "es"
    | "it"
    | "pl"
    | "ro"
    | "nl"
    | "pt"
    | "cs"
    | "sk"
    | "hu"
    | "bg"
    | "hr"
    | "sl"
    | "lt"
    | "lv"
    | "et"
    | "fi"
    | "sv"
    | "el"
    | "mt"
    | "ga";

  /**
   * Title — `string`
   *
   *
   */
  title?: string;

  /**
   * Slug — `slug`
   *
   *
   */
  slug?: { _type: "slug"; current: string };

  /**
   * Body — `array`
   *
   *
   */
  body?: Array<SanityKeyed<SanityBlock>>;

  /**
   * Published At — `datetime`
   *
   *
   */
  publishedAt?: string;

  /**
   * Translations — `array`
   *
   * Other language versions of this article. Link them here for easy switching.
   */
  translations?: Array<SanityKeyedReference<Article>>;
}

/**
 * Snippet
 *
 *
 */
export interface Snippet extends SanityDocument {
  _type: "snippet";

  /**
   * Key — `string`
   *
   * Unique identifier (e.g. "welcomeMessage", "footerLegal")
   */
  key?: string;

  /**
   * Language — `string`
   *
   *
   */
  language?:
    | "en"
    | "fr"
    | "de"
    | "es"
    | "it"
    | "pl"
    | "ro"
    | "nl"
    | "pt"
    | "cs"
    | "sk"
    | "hu"
    | "bg"
    | "hr"
    | "sl"
    | "lt"
    | "lv"
    | "et"
    | "fi"
    | "sv"
    | "el"
    | "mt"
    | "ga";

  /**
   * Content — `array`
   *
   *
   */
  content?: Array<SanityKeyed<SanityBlock>>;

  /**
   * Translations — `array`
   *
   * Optional: manually link translations of this snippet across other languages
   */
  translations?: Array<SanityKeyedReference<Snippet>>;
}

export type Documents = Article | Snippet;
