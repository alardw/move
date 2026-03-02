// Generated from Collapsible.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const collapsibleMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "Collapsible",
  kind: "compound",
  anatomy: ["Root", "Trigger", "Icon", "Content"],
  slots: ["root", "trigger", "icon", "content", "contentInner"],
  controlled: {
    pattern: "open",
  },
  variants: {},
  constraints: {
    supportsAnimation: true,
  },
  intent: ["disclosure"],
} satisfies ComponentMeta;
