// Generated from Autocomplete.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const autocompleteMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "Autocomplete",
  kind: "compound",
  anatomy: ["Root", "Trigger", "Input", "TagList", "Tag", "Icon", "ClearTrigger", "Portal", "Content", "Item", "ItemIndicator", "Group", "GroupLabel", "Empty", "Loading", "Separator"],
  slots: ["trigger", "triggerContent", "triggerActions", "input", "tagList", "tag", "tagRemove", "icon", "clearTrigger", "content", "contentInner", "item", "itemIndicator", "group", "groupLabel", "empty", "loading", "separator"],
  controlled: {
    pattern: "value",
  },
  variants: {
    variant: ["outlined", "filled"],
  },
  constraints: {
    requiresParent: "Autocomplete.Root",
    supportsAnimation: true,
  },
  intent: ["input", "selection"],
} satisfies ComponentMeta;
