import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const textMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Text",

  kind: "primitive",

  anatomy: ["Root"],

  slots: ["root"],

  controlled: {
    pattern: null,
  },

  variants: {
    as: ["p", "span", "div", "em", "strong", "small", "del"],
    size: ["xs", "sm", "base", "lg", "xl"],
    weight: ["normal", "medium", "semibold", "bold"],
    color: ["base", "muted", "subtle", "primary", "success", "warning", "error"],
    align: ["left", "center", "right"],
  },
} satisfies ComponentMeta;
