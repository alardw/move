import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const collapsibleMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Collapsible",

  kind: "compound",

  anatomy: ["Root", "Trigger", "Icon", "Content"],

  slots: ["root", "trigger", "icon", "content", "contentInner"],

  controlled: {
    pattern: "open",
  },

  variants: {},

  constraints: {
    requiresParent: "Collapsible.Root",
    supportsAnimation: true,
  },
} satisfies ComponentMeta;
