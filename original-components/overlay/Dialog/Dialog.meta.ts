import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const dialogMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Dialog",

  kind: "compound",

  anatomy: ["Root", "Trigger", "Portal", "Overlay", "Content", "Header", "Body", "Footer", "FooterStart", "FooterEnd", "Title", "Description", "Close"],

  slots: ["trigger", "overlay", "content", "title", "description", "header", "body", "footer", "footerStart", "footerEnd", "close"],

  controlled: {
    pattern: "open",
  },

  variants: {},

  constraints: {
    requiresParent: "Dialog.Root",
    supportsAnimation: true,
  },
} satisfies ComponentMeta;
