// Generated from Text.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
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
    color: ["base", "muted", "subtle", "primary", "success", "warning", "error"],
    size: ["xs", "sm", "base", "lg", "xl"],
  },
  intent: ["display"],
} satisfies ComponentMeta;
