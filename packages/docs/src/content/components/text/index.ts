import { spec } from "@move-specs/typography/Text/Text.spec";

import type { ComponentContent } from "../types";
import { meta } from "./meta";

import Sizes from "./samples/sizes";
import sizesCode from "./samples/sizes?raw";
import Colors from "./samples/colors";
import colorsCode from "./samples/colors?raw";
import Weights from "./samples/weights";
import weightsCode from "./samples/weights?raw";
import Truncate from "./samples/truncate";
import truncateCode from "./samples/truncate?raw";

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: "sizes", title: "Sizes", render: Sizes, code: sizesCode },
    { id: "weights", title: "Weights", render: Weights, code: weightsCode },
    { id: "colors", title: "Colours", render: Colors, code: colorsCode },
    { id: "truncate", title: "Truncate", render: Truncate, code: truncateCode },
  ],
};
