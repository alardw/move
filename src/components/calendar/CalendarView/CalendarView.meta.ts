import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const calendarViewMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "CalendarView",

  kind: "compound",

  anatomy: ["Root", "Header", "Nav", "Title", "Today", "ViewSwitcher", "Body"],

  slots: [],

  controlled: {
    pattern: null,
  },

  variants: {},

  constraints: {
    requiresParent: "CalendarView.Root",
  },
} satisfies ComponentMeta;
