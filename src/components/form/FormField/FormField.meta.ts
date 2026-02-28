import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const formFieldMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "FormField",

  kind: "compound",

  anatomy: ["Root", "Label", "Field", "Description"],

  slots: ["root", "label", "field", "description"],

  controlled: {
    pattern: null,
  },

  variants: {},
} satisfies ComponentMeta;
