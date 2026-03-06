// Generated from Splitter.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const splitterMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "Splitter",
  kind: "compound",
  anatomy: ["Root", "Panel"],
  slots: ["root", "panel", "gutter"],
  controlled: {
    pattern: null,
  },
  variants: {},
  intent: ["layout"],
} satisfies ComponentMeta;
