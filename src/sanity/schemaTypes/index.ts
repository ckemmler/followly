import { type SchemaTypeDefinition } from "sanity";
import article from "./article";
import snippet from "./snippet";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [article, snippet],
};
