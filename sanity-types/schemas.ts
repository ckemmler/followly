import type { SanityReference, SanityKeyedReference, SanityAsset, SanityImage, SanityFile, SanityGeoPoint, SanityBlock, SanityDocument, SanityImageCrop, SanityImageHotspot, SanityKeyed, SanityImageAsset, SanityImageMetadata, SanityImageDimensions, SanityImagePalette, SanityImagePaletteSwatch } from "sanity-codegen";

export type { SanityReference, SanityKeyedReference, SanityAsset, SanityImage, SanityFile, SanityGeoPoint, SanityBlock, SanityDocument, SanityImageCrop, SanityImageHotspot, SanityKeyed, SanityImageAsset, SanityImageMetadata, SanityImageDimensions, SanityImagePalette, SanityImagePaletteSwatch };

/**
 * Article
 *
 *
 */
export interface Article extends SanityDocument {
  _type: "article";

  /**
   * Id — `string`
   *
   *
   */
  id?: string;

  /**
   * Title — `internationalizedArrayString`
   *
   *
   */
  title?: InternationalizedArrayString;

  /**
   * Slug — `internationalizedArrayString`
   *
   *
   */
  slug?: InternationalizedArrayString;

  /**
   * Body — `internationalizedArrayPortableText`
   *
   *
   */
  body?: InternationalizedArrayPortableText;

  /**
   * Published At — `datetime`
   *
   *
   */
  publishedAt?: string;
}

/**
 * Snippet
 *
 *
 */
export interface Snippet extends SanityDocument {
  _type: "snippet";

  /**
   * Language — `string`
   *
   *
   */
  language?: string;

  /**
   * Key — `string`
   *
   * Unique identifier (e.g. "welcomeMessage", "footerLegal")
   */
  key?: string;

  /**
   * Content — `internationalizedArrayPortableText`
   *
   *
   */
  content?: InternationalizedArrayPortableText;
}

export type InternationalizedArraySlug = Array<
  SanityKeyed<{
    /**
     * locale — `string`
     *
     *
     */
    locale?: string;

    /**
     * value — `slug`
     *
     *
     */
    value?: { _type: "value"; current: string };
  }>
>;

export type Documents = Article | Snippet;

/**
 * This interface is a stub. It was referenced in your sanity schema but
 * the definition was not actually found. Future versions of
 * sanity-codegen will let you type this explicity.
 */
type InternationalizedArrayString = any;

/**
 * This interface is a stub. It was referenced in your sanity schema but
 * the definition was not actually found. Future versions of
 * sanity-codegen will let you type this explicity.
 */
type InternationalizedArrayPortableText = any;
