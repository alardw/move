// Generated from FileUpload.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const fileUploadMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "FileUpload",
  kind: "compound",
  anatomy: [
    "Root",
    "Dropzone",
    "Trigger",
    "ItemGroup",
    "Item",
    "ItemPreview",
    "ItemName",
    "ItemSize",
    "ItemDelete",
    "ClearTrigger",
    "ItemProgress",
    "ItemStatus",
    "TotalProgress",
    "UploadTrigger",
  ],
  slots: [
    "root",
    "dropzone",
    "trigger",
    "itemGroup",
    "item",
    "itemPreview",
    "itemName",
    "itemSize",
    "itemDelete",
    "clearTrigger",
    "itemProgress",
    "itemStatus",
    "totalProgress",
    "uploadTrigger",
  ],
  controlled: {
    pattern: "value",
  },
  variants: {
    variant: ["default", "compact"],
    size: ["sm", "md", "lg"],
  },
  constraints: {
    requiresChild: ["Dropzone"],
  },
  intent: ["input"],
} satisfies ComponentMeta;
