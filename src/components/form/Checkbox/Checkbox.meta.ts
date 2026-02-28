import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const checkboxMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Checkbox",

  kind: "compound",

  anatomy: ["Root", "Group"],

  slots: ["root", "indicator", "icon"],

  controlled: {
    pattern: "checked",
  },

  variants: {
    size: ["sm", "md", "lg"],
  },

  constraints: {
    supportsAnimation: true,
  },
} satisfies ComponentMeta;
