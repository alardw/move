// Generated from Link.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const linkMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "Link",
  kind: "primitive",
  anatomy: ["Root"],
  slots: ["root"],
  controlled: {
    pattern: null,
  },
  variants: {
    variant: ["default", "muted", "subtle"],
    underline: ["always", "hover", "none"],
    size: ["xs", "sm", "base", "lg", "xl"],
  },
  intent: ["trigger"],
} satisfies ComponentMeta;
