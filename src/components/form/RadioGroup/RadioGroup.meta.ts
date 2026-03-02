// Generated from RadioGroup.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const radioGroupMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "RadioGroup",
  kind: "compound",
  anatomy: ["Root", "Item"],
  slots: ["root", "item", "indicator", "dot"],
  controlled: {
    pattern: "value",
  },
  variants: {},
  constraints: {
    supportsAnimation: true,
  },
  intent: ["input", "selection"],
} satisfies ComponentMeta;
