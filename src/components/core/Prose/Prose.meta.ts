// Generated from Prose.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const proseMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "Prose",
  kind: "primitive",
  anatomy: ["Root"],
  slots: ["root"],
  controlled: {
    pattern: null,
  },
  variants: {
    size: ["sm", "base", "lg"],
  },
  constraints: {
    supportsAnimation: false,
  },
  intent: ["display"],
} satisfies ComponentMeta;
