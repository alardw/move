import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const tableMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "Table",
  kind: "compound",
  anatomy: ["Root", "Header", "Body", "Footer", "Row", "Head", "Cell", "Caption", "Group", "GroupHeader"],
  slots: ["root", "header", "body", "footer", "row", "head", "cell", "caption", "group", "groupHeader"],
  controlled: {
    pattern: null,
  },
  variants: {
    variant: ["surface", "lines", "bordered", "ghost"],
    size: ["sm", "md", "lg"],
    responsive: ["scroll", "stack", "none"],
  },
  constraints: {
    supportsAnimation: true,
  },
  intent: ["display"],
} satisfies ComponentMeta;
