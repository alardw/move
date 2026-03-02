import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const skeletonMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Skeleton",

  kind: "compound",

  anatomy: ["Root", "Circle", "Rectangle", "Rounded", "Text"],

  slots: ["root", "circle", "rectangle", "rounded", "text", "line"],

  controlled: {
    pattern: null,
  },

  variants: {},
} satisfies ComponentMeta;
