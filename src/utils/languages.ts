import { PortableTextBlock } from "next-sanity";

export type LocalizedBlock = {
  _key: string;
  value: PortableTextBlock[];
};

export const LANGUAGES = ["bg", "cs", "da", "de", "el", "en", "es", "et", "fi", "fr", "ga", "hr", "hu", "it", "lt", "lv", "mt", "nl", "pl", "pt", "ro", "sk", "sl", "sv"];

export function getLocalizedBlock(data: LocalizedBlock[], lang: string): PortableTextBlock[] {
  return data.find((d) => d._key === lang)?.value ?? [];
}
