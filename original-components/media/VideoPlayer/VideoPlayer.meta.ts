import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const videoPlayerMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "VideoPlayer",

  kind: "primitive",

  anatomy: ["Root"],

  slots: ["root", "video", "controls", "playButton", "progress", "time", "volumeButton", "volumeSlider", "settingsButton", "subtitleButton", "fullscreenButton", "subtitleOverlay"],

  controlled: {
    pattern: null,
  },

  variants: {
    radius: ["none", "sm", "md", "lg"],
  },
} satisfies ComponentMeta;
