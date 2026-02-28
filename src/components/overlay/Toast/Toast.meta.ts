import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const toastMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Toast",

  kind: "compound",

  anatomy: ["Viewport"],

  slots: ["viewport"],

  controlled: {
    pattern: null,
  },

  variants: {},
} satisfies ComponentMeta;
