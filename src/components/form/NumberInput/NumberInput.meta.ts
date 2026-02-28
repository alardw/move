import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const numberInputMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "NumberInput",

  kind: "primitive",

  anatomy: ["Root"],

  slots: ["root", "input", "iconLeft", "controls", "increment", "decrement"],

  controlled: {
    pattern: "value",
  },

  variants: {
    variant: ["outlined", "filled"],
    size: ["sm", "md", "lg"],
    clampBehavior: ["blur", "strict", "none"],
  },
} satisfies ComponentMeta;
