import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const stepperMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Stepper",

  kind: "compound",

  anatomy: ["Root", "Step", "Indicator", "Title", "Description", "Separator", "Completed"],

  slots: ["root", "step", "indicator", "title", "description", "separator"],

  controlled: {
    pattern: null,
  },

  variants: {
    "orientation": ["horizontal", "vertical"],
    "size": ["sm", "md", "lg"],
  },

  constraints: {
    requiresParent: "Stepper.Root",
  },
} satisfies ComponentMeta;
