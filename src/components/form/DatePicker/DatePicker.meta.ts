import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const datePickerMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "DatePicker",

  kind: "compound",

  anatomy: ["Root", "Trigger", "Input", "Icon", "Portal", "Content"],

  slots: [],

  controlled: {
    pattern: "open",
  },

  variants: {},

  constraints: {
    supportsAnimation: true,
  },
} satisfies ComponentMeta;
