import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const playerSettingsMenuMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "PlayerSettingsMenu",

  kind: "primitive",

  anatomy: ["Root"],

  slots: [],

  controlled: {
    pattern: null,
  },

  variants: {},
} satisfies ComponentMeta;
