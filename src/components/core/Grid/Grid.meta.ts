// Generated from Grid.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const gridMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "Grid",
  kind: "compound",
  anatomy: ["Root", "Cell"],
  slots: ["root", "cell"],
  controlled: {
    pattern: null,
  },
  variants: {},
  intent: ["layout"],
} satisfies ComponentMeta;
