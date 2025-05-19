// app/[lang]/page.tsx

import { Trigger } from "@/types/followly";
import { getAllSceneIds, getSceneById } from "@/utils/queries";
import client from "@/utils/sanity-client";
import { Frame, Script } from "@sanity-types";
import { SUPPORTED_LANGUAGES } from "../../../../../sanity/config/languages";
import SceneClient from "./SceneClient";

export async function generateStaticParams() {
  const scenes = await client.fetch(getAllSceneIds());
  
  const params = [];
  
  // For each scene, create entries for all supported languages
  for (const scene of scenes) {
    for (const language of SUPPORTED_LANGUAGES) {
      params.push({
        lang: language.id,
        sceneId: scene.id
      });
    }
  }
  
  return params;
}

export default async function Page(props: { params: Promise<{ lang: string, sceneId: string }> }) {
	const params = await props.params
  const scene = await client.fetch(getSceneById(params.sceneId));
  const script = scene.script as Script;
  const stack = script.stack as unknown as Array<{ frame: Frame; triggers: Array<Trigger> }>;

  return (
    <SceneClient
      params={params}
			scene={scene}
			stack={stack}
    />
  );
}