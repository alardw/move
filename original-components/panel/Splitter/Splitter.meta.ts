import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const splitterMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Splitter",

  kind: "compound",

  anatomy: ["Root", "Panel"],

  slots: ["root", "panel"],

  controlled: {
    pattern: null,
  },

  variants: {
    layout: ["horizontal", "vertical"],
  },

  constraints: {
    requiresParent: "Splitter.Root",
  },
} satisfies ComponentMeta;
