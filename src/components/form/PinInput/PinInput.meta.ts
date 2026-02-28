import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const pinInputMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "PinInput",

  kind: "primitive",

  anatomy: ["Root"],

  slots: ["root", "slot"],

  controlled: {
    pattern: null,
  },

  variants: {
    size: ["sm", "md", "lg"],
  },
} satisfies ComponentMeta;
