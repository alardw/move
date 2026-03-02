import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const alertMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Alert",

  kind: "primitive",

  anatomy: ["Root"],

  slots: ["root", "icon", "content", "title", "description", "close"],

  controlled: {
    pattern: null,
  },

  variants: {
    variant: ["info", "success", "warning", "danger"],
    size: ["sm", "md", "lg"],
  },

  constraints: {
    supportsAnimation: true,
  },
} satisfies ComponentMeta;
