import { getLocalizedBlock, LANGUAGES, LocalizedBlock } from "@/utils/languages";
import { Snippet } from "@sanity-types";
import LanguageSelector from "@/components/LanguageSelector";
// import ClientVideo360Wrapper from "@/components/Video360BackgroundWrapper";
import AnimatedPages from "@/components/AnimatedPages";
// import getVideoByTitle from "@/utils/get-video-by-title";

const apiKey = process.env.SANITY_API_KEY;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export async function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

async function getSnippets(): Promise<Record<string, LocalizedBlock[]>> {
  const query = `
    *[_type == "snippet" && key in ["navigation", "welcome"]] {
      key,
      content
    }
  `;
  const encoded = encodeURIComponent(query);
  const url = `https://${projectId}.api.sanity.io/v1/data/query/${dataset}?query=${encoded}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    next: { revalidate: false },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Sanity error (${res.status}): ${error}`);
  }

  const { result }: { result: Snippet[] } = await res.json();
  return Object.fromEntries(result.map((r) => [r.key, r.content]));
}

export default async function LangPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  const snippets = await getSnippets();
  //   const video = await getVideoByTitle("Video Test"); // this is the video title in Sanity

  // Pre-localize the content on the server side
  const localizedContent = {
    navigation: getLocalizedBlock(snippets.navigation, lang),
    welcome: getLocalizedBlock(snippets.welcome, lang),
  };

  return (
    <div className="relative min-h-screen bg-gray-900 ">
      {/* Language selector in a higher z-index layer */}
      <div className="absolute z-20 top-4 right-4">
        <LanguageSelector currentLang={lang} languages={LANGUAGES} />
      </div>

      {/* Content with higher z-index to appear above video */}
      <main className="relative z-10 flex items-center justify-center min-h-screen text-white pointer-events-none">
        <AnimatedPages localizedContent={localizedContent} />
      </main>
      {/* {video?.playbackId && <ClientVideo360Wrapper playbackId={video.playbackId} />} */}
    </div>
  );
}
