import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const calendarContextMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "CalendarContext",

  kind: "primitive",

  anatomy: ["Root"],

  slots: [],

  controlled: {
    pattern: null,
  },

  variants: {},
  constraints: {
    requiresParent: "CalendarContext.Root",
    
  },
} satisfies ComponentMeta;
