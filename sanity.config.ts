import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const id = projectId || "placeholder";

export default defineConfig({
  name: "bilgewater-market",
  title: "Bilgewater Market",
  projectId: id,
  dataset,
  basePath: "/studio",
  schema: {
    types: schemaTypes,
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
