// Generated from Checkbox.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const checkboxMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "Checkbox",
  kind: "primitive",
  anatomy: ["Root", "Group"],
  slots: ["root", "indicator", "icon"],
  controlled: {
    pattern: "checked",
  },
  variants: {},
  constraints: {
    supportsAnimation: true,
  },
  intent: ["input"],
} satisfies ComponentMeta;
