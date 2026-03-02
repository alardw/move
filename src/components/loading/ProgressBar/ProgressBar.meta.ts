// Generated from ProgressBar.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const progressBarMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "ProgressBar",
  kind: "primitive",
  anatomy: ["Root"],
  slots: ["root", "indicator"],
  controlled: {
    pattern: null,
  },
  variants: {
    variant: ["default", "success", "warning", "error"],
    size: ["sm", "md", "lg"],
  },
  intent: ["feedback"],
} satisfies ComponentMeta;
