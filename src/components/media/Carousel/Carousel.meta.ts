import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const carouselMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "Carousel",

  kind: "compound",

  anatomy: ["Root", "Viewport", "Slide", "PrevTrigger", "NextTrigger", "IndicatorGroup", "Indicator"],

  slots: ["viewport", "slide", "prevTrigger", "nextTrigger", "indicatorGroup", "indicator"],

  controlled: {
    pattern: null,
  },

  variants: {
    orientation: ["horizontal", "vertical"],
    align: ["start", "center", "end"],
    triggerPlacement: ["none", "top", "bottom", "overlay", "indicator-sides"],
    triggerAlign: ["start", "center", "end"],
    triggerSize: ["sm", "md", "lg"],
    triggerVariant: ["surface", "ghost", "solid"],
    indicatorPlacement: ["inside-bottom", "below"],
  },

  constraints: {
    requiresParent: "Carousel.Root",
    supportsAnimation: true,
  },
} satisfies ComponentMeta;
