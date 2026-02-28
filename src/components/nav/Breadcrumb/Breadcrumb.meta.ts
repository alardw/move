import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const breadcrumbMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Breadcrumb",

  kind: "compound",

  anatomy: ["Root", "Item", "Link", "Page", "Separator", "Ellipsis"],

  slots: ["root", "list", "item", "link", "page", "separator", "ellipsis"],

  controlled: {
    pattern: null,
  },

  variants: {
    "size": ["sm", "md", "lg"],
  },

  constraints: {
    requiresParent: "Breadcrumb.Root",
  },
} satisfies ComponentMeta;
