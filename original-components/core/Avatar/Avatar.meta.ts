import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const avatarMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Avatar",

  kind: "compound",

  anatomy: ["Group", "Root", "Image", "Fallback"],

  slots: ["group", "root", "image", "fallback"],

  controlled: {
    pattern: null,
  },

  variants: {
    size: ["xs", "sm", "md", "lg", "xl"],
  },

  constraints: {
    supportsAnimation: true,
  },
} satisfies ComponentMeta;
