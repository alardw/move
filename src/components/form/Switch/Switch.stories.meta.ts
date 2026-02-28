import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const switch.storiesMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Switch.stories",

  kind: "primitive",

  anatomy: ["Root"],

  slots: [],

  controlled: {
    pattern: null,
  },

  variants: {},
} satisfies ComponentMeta;
