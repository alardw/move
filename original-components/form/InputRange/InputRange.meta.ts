import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const inputRangeMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "InputRange",

  kind: "primitive",

  anatomy: ["Root"],

  slots: ["root", "track", "range", "thumb", "value"],

  controlled: {
    pattern: "value",
  },

  variants: {
    size: ["sm", "md", "lg"],
    orientation: ["horizontal", "vertical"],
  },

  constraints: {
    supportsAnimation: true,
  },
} satisfies ComponentMeta;
