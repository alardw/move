import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const tooltipMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Tooltip",

  kind: "compound",

  anatomy: ["Root", "Provider", "Trigger", "Portal", "Content", "Arrow"],

  slots: ["trigger", "content", "arrow"],

  controlled: {
    pattern: "open",
  },

  variants: {},

  constraints: {
    supportsAnimation: true,
  },
} satisfies ComponentMeta;
