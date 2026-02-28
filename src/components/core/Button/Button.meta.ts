import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const buttonMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Button",

  kind: "compound",

  anatomy: ["Root", "Group"],

  slots: ["root"],

  controlled: {
    pattern: null,
  },

  variants: {
    variant: ["primary", "secondary", "ghost", "danger"],
    size: ["sm", "md", "lg"],
  },

  constraints: {
    supportsAnimation: true,
  },
} satisfies ComponentMeta;
