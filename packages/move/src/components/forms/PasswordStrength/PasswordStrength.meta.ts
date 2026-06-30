// Generated from PasswordStrength.spec.ts (schemaVersion: 7, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const passwordStrengthMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "PasswordStrength",
  kind: "compound",
  anatomy: ["Root", "Requirements"],
  slots: ["root", "track", "segment", "label"],
  controlled: {
    pattern: null,
  },
  variants: {
    size: ["sm", "md", "lg"],
  },
} satisfies ComponentMeta;
