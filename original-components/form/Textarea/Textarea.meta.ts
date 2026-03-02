import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const textareaMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Textarea",

  kind: "primitive",

  anatomy: ["Root"],

  slots: ["root", "textarea"],

  controlled: {
    pattern: null,
  },

  variants: {
    variant: ["outlined", "filled"],
    size: ["sm", "md", "lg"],
    resize: ["none", "vertical", "horizontal", "both"],
  },
} satisfies ComponentMeta;
