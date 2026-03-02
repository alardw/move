// Generated from Button.spec.ts (schemaVersion: 6, specHash: 2082df0a)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const buttonMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "Button",
  kind: "compound",
  anatomy: ["Root", "Group"],
  slots: ["root"],
  controlled: {
    pattern: null,
  },
  variants: {
    variant: ["primary", "secondary", "ghost", "danger"],
    size: ["sm", "md", "lg"],
  },
  constraints: {
    supportsAnimation: true,
    supportsAsChild: true,
  },
  intent: ["interactive"],
} satisfies ComponentMeta;
