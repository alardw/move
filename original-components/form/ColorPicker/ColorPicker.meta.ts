import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const colorPickerMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "ColorPicker",

  kind: "primitive",

  anatomy: ["Root"],

  slots: ["root", "saturation", "hue", "alpha", "swatches", "inputRow", "formatSelect", "channelInput", "alphaInput"],

  controlled: {
    pattern: "value",
  },

  variants: {
    size: ["sm", "md", "lg"],
  },
} satisfies ComponentMeta;
