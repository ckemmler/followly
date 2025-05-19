// app/[lang]/page.tsx

import { Trigger } from "@/types/followly";
import { getSceneById } from "@/utils/queries";
import client from "@/utils/sanity-client";
import { Frame, Script } from "@sanity-types";
import { SUPPORTED_LANGUAGES } from "../../../../sanity/config/languages";
import ProgressionClient from "./ProgressionClient";

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(({ id }) => ({ lang: id }));
}

export default async function Page(props: { params: Promise<{ lang: string }> }) {
	const params = await props.params
  const scene = await client.fetch(getSceneById("welcome"));
  const script = scene.script as Script;
  const stack = script.stack as unknown as Array<{ frame: Frame; triggers: Array<Trigger> }>;

  return (
    <ProgressionClient
      params={params}
			scene={scene}
			stack={stack}
    />
  );
}