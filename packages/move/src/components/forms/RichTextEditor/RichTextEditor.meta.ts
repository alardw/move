// Generated from RichTextEditor.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const richTextEditorMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "RichTextEditor",
  kind: "compound",
  anatomy: ["Root", "Toolbar", "ControlGroup", "Control", "Separator", "Content"],
  slots: ["root", "toolbar", "controlGroup", "control", "separator", "content"],
  controlled: {
    pattern: null,
  },
  variants: {
    variant: ["outline", "subtle"],
    size: ["sm", "md", "lg"],
  },
  intent: ["input"],
} satisfies ComponentMeta;
