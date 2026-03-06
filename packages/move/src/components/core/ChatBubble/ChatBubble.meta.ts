// Generated from ChatBubble.spec.ts (schemaVersion: 6, specHash: af768c01)
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
  variants: {
    variant: ["neutral", "primary", "success", "warning", "error"],
  },
  constraints: {
    supportsAnimation: true,
  },
  intent: ["display"],
} satisfies ComponentMeta;
