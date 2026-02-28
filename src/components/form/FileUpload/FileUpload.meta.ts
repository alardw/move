import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const fileUploadMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "FileUpload",

  kind: "compound",

  anatomy: ["Root", "Dropzone", "Trigger", "ItemGroup", "Item", "ItemPreview", "ItemName", "ItemSize", "ItemDelete", "ClearTrigger", "ItemProgress", "ItemStatus", "TotalProgress", "UploadTrigger"],

  slots: ["root", "dropzone", "trigger", "itemGroup", "item", "itemPreview", "itemName", "itemSize", "itemDelete", "clearTrigger", "itemProgress", "itemStatus", "totalProgress", "uploadTrigger"],

  controlled: {
    pattern: null,
  },

  variants: {
    size: ["sm", "md", "lg"],
    variant: ["default", "compact"],
  },

  constraints: {
    requiresParent: "FileUpload.Root",
  },
} satisfies ComponentMeta;
