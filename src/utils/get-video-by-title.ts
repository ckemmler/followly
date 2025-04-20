const apiKey = process.env.SANITY_API_KEY;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export default async function getVideoByTitle(title: string): Promise<{ playbackId: string } | null> {
  const query = `
     *[_type == "video" && title == "${title}"][0]{
       video {
         asset->{
           playbackId
         }
       }
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

  const { result } = await res.json();

  if (!result?.video?.asset?.playbackId) return null;

  return {
    playbackId: result.video.asset.playbackId,
  };
}
