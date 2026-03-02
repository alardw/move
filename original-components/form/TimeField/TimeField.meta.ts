import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const timeFieldMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "TimeField",

  kind: "compound",

  anatomy: ["Root", "Segment", "Separator", "Period", "Dropdown", "DropdownColumn"],

  slots: ["segment", "separator", "period", "dropdownColumn"],

  controlled: {
    pattern: "value",
  },

  variants: {
    size: ["sm", "md", "lg"],
  },

  constraints: {
    requiresParent: "TimeField.Root",
    supportsAnimation: true,
  },
} satisfies ComponentMeta;
