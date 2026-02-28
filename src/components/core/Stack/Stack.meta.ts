import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const stackMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Stack",

  kind: "primitive",

  anatomy: ["Root"],

  slots: ["root"],

  controlled: {
    pattern: null,
  },

  variants: {
    direction: ["row", "column"],
    gap: ["xs", "sm", "md", "lg", "xl", "none"],
    align: ["start", "center", "end", "stretch", "baseline"],
    justify: ["start", "center", "end", "between", "evenly"],
  },
} satisfies ComponentMeta;
