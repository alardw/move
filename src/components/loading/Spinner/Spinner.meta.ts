// Generated from Spinner.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const spinnerMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "Spinner",
  kind: "primitive",
  anatomy: ["Root"],
  slots: ["root", "svg", "circle"],
  controlled: {
    pattern: null,
  },
  variants: {
    size: ["sm", "md", "lg"],
    variant: ["default", "secondary", "current"],
  },
  intent: ["feedback"],
} satisfies ComponentMeta;
