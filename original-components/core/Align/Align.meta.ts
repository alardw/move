import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const alignMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Align",

  kind: "compound",

  anatomy: ["Root", "Start", "Center", "End"],

  slots: ["root", "start", "center", "end"],

  controlled: {
    pattern: null,
  },

  variants: {
    gap: ["xs", "sm", "md", "lg", "xl", "none"],
    align: ["start", "center", "end", "stretch", "baseline"],
  },
} satisfies ComponentMeta;
