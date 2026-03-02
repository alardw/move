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

  variants: {
    size: ["sm", "md", "lg"],
    orientation: ["horizontal", "vertical"],
  },
} satisfies ComponentMeta;
