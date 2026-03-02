import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const gridMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Grid",

  kind: "compound",

  anatomy: ["Root", "Cell"],

  slots: ["root", "cell"],

  controlled: {
    pattern: null,
  },

  variants: {
    gap: ["xs", "sm", "md", "lg", "xl", "none"],
    rowGap: ["xs", "sm", "md", "lg", "xl", "none"],
    columnGap: ["xs", "sm", "md", "lg", "xl", "none"],
  },
} satisfies ComponentMeta;
