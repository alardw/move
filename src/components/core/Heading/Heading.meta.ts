// Generated from Heading.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const headingMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "Heading",
  kind: "primitive",
  anatomy: ["Root"],
  slots: ["root"],
  controlled: {
    pattern: null,
  },
  variants: {
    weight: ["medium", "semibold", "bold"],
    color: ["base", "muted", "subtle"],
    tracking: ["tight", "normal"],
    align: ["left", "center", "right"],
  },
} satisfies ComponentMeta;
