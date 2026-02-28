import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const dialog.storiesMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Dialog.stories",

  kind: "primitive",

  anatomy: ["Root"],

  slots: [],

  controlled: {
    pattern: null,
  },

  variants: {},
} satisfies ComponentMeta;
