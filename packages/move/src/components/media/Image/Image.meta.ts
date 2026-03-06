// Generated from Image.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const imageMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "Image",
  kind: "primitive",
  anatomy: ["Root"],
  slots: ["root", "img", "fallback", "action"],
  controlled: {
    pattern: null,
  },
  variants: {
    fit: ["cover", "contain", "fill", "none", "scale-down"],
    radius: ["none", "sm", "md", "lg", "full"],
    position: ["center", "top", "bottom", "left", "right", "top left", "top right", "bottom left", "bottom right"],
  },
  intent: ["display"],
} satisfies ComponentMeta;
