import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const chatBubbleMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "ChatBubble",

  kind: "compound",

  anatomy: ["Root", "Avatar", "Container", "Header", "Content", "Footer"],

  slots: ["root", "avatar", "container", "header", "content", "footer"],

  controlled: {
    pattern: null,
  },

  variants: {},

  constraints: {
    supportsAnimation: true,
  },
} satisfies ComponentMeta;
