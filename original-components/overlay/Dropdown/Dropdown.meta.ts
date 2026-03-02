import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const dropdownMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Dropdown",

  kind: "compound",

  anatomy: ["Root", "Trigger", "Portal", "Content", "Arrow", "Item", "Group", "Label", "CheckboxItem", "RadioGroup", "RadioItem", "ItemIndicator", "Separator", "Sub", "SubTrigger", "SubContent"],

  slots: ["trigger", "content", "contentInner", "arrow", "item", "group", "label", "checkboxItem", "checkboxIndicator", "checkboxLabel", "radioGroup", "radioItem", "itemIndicator", "separator", "subTrigger", "subContent"],

  controlled: {
    pattern: "open",
  },

  variants: {},

  constraints: {
    requiresParent: "Dropdown.Root",
    supportsAnimation: true,
  },
} satisfies ComponentMeta;
