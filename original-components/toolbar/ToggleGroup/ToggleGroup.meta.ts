import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const toggleGroupMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "ToggleGroup",

  kind: "compound",

  anatomy: ["Root", "Item"],

  slots: ["root", "indicator", "item"],

  controlled: {
    pattern: "value",
  },

  variants: {
    "size": ["sm", "md", "lg"],
    "variant": ["primary", "secondary", "ghost", "danger"],
  },
} satisfies ComponentMeta;
