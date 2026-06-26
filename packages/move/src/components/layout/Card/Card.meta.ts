// Generated from Card.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const cardMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "Card",
  kind: "compound",
  anatomy: ["Root", "Header", "Title", "Description", "Body", "Footer", "FooterStart", "FooterEnd"],
  slots: ["root", "header", "title", "description", "body", "footer", "footerStart", "footerEnd"],
  controlled: {
    pattern: null,
  },
  variants: {
    variant: ["default", "elevated", "ghost"],
    size: ["sm", "md", "lg"],
  },
  intent: ["display"],
} satisfies ComponentMeta;
