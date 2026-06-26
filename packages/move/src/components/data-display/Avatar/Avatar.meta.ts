// Generated from Avatar.spec.ts (schemaVersion: 5, specHash: aeb52a7f)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const avatarMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "Avatar",
  kind: "compound",
  anatomy: ["Group", "Root", "Image", "Fallback"],
  slots: ["root", "image", "fallback", "group"],
  controlled: {
    pattern: null,
  },
  variants: {
    size: ["xs", "sm", "md", "lg", "xl"],
  },
  constraints: {
    supportsAnimation: true,
  },
  intent: ["display"],
} satisfies ComponentMeta;
