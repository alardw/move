// Generated from Drawer.spec.ts (schemaVersion: 7, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const drawerMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "Drawer",
  kind: "compound",
  anatomy: ["Root", "Trigger", "Portal", "Overlay", "Content", "Header", "Body", "Footer", "Title", "Description", "Close", "Handle"],
  slots: ["trigger", "overlay", "content", "header", "body", "footer", "title", "description", "close", "handle"],
  controlled: {
    pattern: "open",
  },
  variants: {
    position: ["left", "right", "top", "bottom"],
    size: ["xs", "sm", "md", "lg", "xl", "full"],
  },
  constraints: {
    supportsAnimation: true,
  },
  intent: ["disclosure"],
} satisfies ComponentMeta;
