import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const accordionMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Accordion",

  kind: "compound",

  anatomy: ["Root", "Item", "Header", "Trigger", "Content"],

  slots: ["root", "item", "header", "trigger", "icon", "content", "contentInner"],

  controlled: {
    pattern: "value",
  },

  variants: {
    type: ["single", "multiple"],
    size: ["sm", "md", "lg"],
    variant: ["default", "contained", "ghost"],
  },

  constraints: {
    requiresParent: "Accordion.Root",
    supportsAnimation: true,
  },
} satisfies ComponentMeta;
