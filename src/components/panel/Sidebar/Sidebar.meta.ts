import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const sidebarMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Sidebar",

  kind: "compound",

  anatomy: ["Provider", "Root", "Header", "Content", "Footer", "Group", "GroupLabel", "Item", "Trigger", "Rail", "Overlay"],

  slots: ["overlay", "root", "header", "content", "footer", "group", "groupLabel", "item", "itemIcon", "itemLabel", "itemBadge", "trigger", "rail"],

  controlled: {
    pattern: null,
  },

  variants: {
    side: ["left", "right"],
  },

  constraints: {
    requiresParent: "Sidebar.Provider",
  },
} satisfies ComponentMeta;
