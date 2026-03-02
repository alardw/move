// Generated from ImageGroup.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const imageGroupMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "ImageGroup",
  kind: "primitive",
  anatomy: ["Root"],
  slots: ["root"],
  controlled: {
    pattern: null,
  },
  variants: {
    gap: ["xs", "sm", "md", "lg", "xl"],
    radius: ["none", "sm", "md", "lg", "full"],
  },
  constraints: {
    supportsAnimation: true,
  },
  intent: ["display"],
} satisfies ComponentMeta;
