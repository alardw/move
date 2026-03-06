// Generated from ToggleButton.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const toggleButtonMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "ToggleButton",
  kind: "primitive",
  anatomy: ["Root"],
  slots: ["root"],
  controlled: {
    pattern: null,
  },
  variants: {
    variant: ["primary", "secondary", "ghost", "danger"],
    size: ["sm", "md", "lg"],
  },
  constraints: {
    supportsAnimation: true,
  },
  intent: ["interactive"],
} satisfies ComponentMeta;
