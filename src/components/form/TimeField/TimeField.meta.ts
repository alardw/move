// Generated from TimeField.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const timeFieldMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "TimeField",
  kind: "compound",
  anatomy: ["Root", "Segment", "Separator", "Period", "Dropdown", "DropdownColumn"],
  slots: ["root", "segment", "separator", "period", "dropdown", "dropdownColumn"],
  controlled: {
    pattern: "value",
  },
  variants: {
    size: ["sm", "md", "lg"],
  },
  constraints: {
    supportsAnimation: true,
  },
  intent: ["input"],
} satisfies ComponentMeta;
