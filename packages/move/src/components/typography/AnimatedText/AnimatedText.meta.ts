// Generated from AnimatedText.spec.ts (schemaVersion: 7, specHash: e7eefb38)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const animatedTextMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "AnimatedText",
  kind: "primitive",
  anatomy: ["Root"],
  slots: ["root"],
  controlled: {
    pattern: null,
  },
  variants: {
    by: ["character", "word", "line"],
    effect: ["fade", "slideUp", "blurUp", "scale"],
  },
  intent: ["display"],
} satisfies ComponentMeta;
