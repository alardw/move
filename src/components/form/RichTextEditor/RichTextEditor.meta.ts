import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const richTextEditorMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "RichTextEditor",

  kind: "compound",

  anatomy: ["Root", "Toolbar", "ControlGroup", "Control", "Separator", "Content"],

  slots: ["toolbar", "controlGroup", "control", "separator", "content"],

  controlled: {
    pattern: null,
  },

  variants: {
    variant: ["outline", "subtle"],
    size: ["sm", "md", "lg"],
  },
} satisfies ComponentMeta;
