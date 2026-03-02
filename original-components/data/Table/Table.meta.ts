import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const tableMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Table",

  kind: "compound",

  anatomy: ["Root", "Header", "Body", "Footer", "Row", "Head", "Cell", "Caption"],

  slots: ["root", "header", "body", "footer", "row", "head", "cell", "caption"],

  controlled: {
    pattern: null,
  },

  variants: {
    "variant": ["default", "striped"],
    "size": ["sm", "md", "lg"],
  },

  constraints: {
    supportsAnimation: true,
  },
} satisfies ComponentMeta;
