// Generated from Sidebar.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const sidebarMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "Sidebar",
  kind: "compound",
  anatomy: ["Provider", "Root", "Overlay", "Header", "Content", "Footer", "Group", "GroupLabel", "Item", "Trigger", "Rail"],
  slots: ["root", "overlay", "header", "content", "footer", "group", "groupLabel", "item", "itemIcon", "itemLabel", "itemBadge", "trigger", "rail"],
  controlled: {
    pattern: "open",
  },
  variants: {},
  constraints: {
    requiresParent: "Sidebar.Provider",
    supportsAnimation: true,
  },
  intent: ["disclosure"],
} satisfies ComponentMeta;
