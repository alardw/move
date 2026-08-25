import { spec } from '@move-specs/data-display/Chart/Chart.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Line from './samples/line';
import lineCode from './samples/line?raw';
import Bar from './samples/bar';
import barCode from './samples/bar?raw';
import Mixed from './samples/mixed';
import mixedCode from './samples/mixed?raw';
import Stacked from './samples/stacked';
import stackedCode from './samples/stacked?raw';
import CurveLinear from './samples/curve-linear';
import curveLinearCode from './samples/curve-linear?raw';
import CurveMonotone from './samples/curve-monotone';
import curveMonotoneCode from './samples/curve-monotone?raw';
import CurveStep from './samples/curve-step';
import curveStepCode from './samples/curve-step?raw';
import Palette from './samples/palette';
import paletteCode from './samples/palette?raw';
import NumericX from './samples/numeric-x';
import numericXCode from './samples/numeric-x?raw';
import Sine from './samples/sine';
import sineCode from './samples/sine?raw';
import Dots from './samples/dots';
import dotsCode from './samples/dots?raw';
import NoTooltip from './samples/no-tooltip';
import noTooltipCode from './samples/no-tooltip?raw';
import Accessible from './samples/accessible';
import accessibleCode from './samples/accessible?raw';
import Recharts from './samples/recharts';
import rechartsCode from './samples/recharts?raw';
import Renderer from './samples/renderer';
import rendererCode from './samples/renderer?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'line', title: 'Line', render: Line, code: lineCode },
    { id: 'bar', title: 'Bar', render: Bar, code: barCode },
    { id: 'mixed', title: 'Mixed types', render: Mixed, code: mixedCode },
    { id: 'stacked', title: 'Stacked', render: Stacked, code: stackedCode },
    { id: 'curve-linear', title: 'Interpolation — linear', render: CurveLinear, code: curveLinearCode },
    { id: 'curve-monotone', title: 'Interpolation — monotone', render: CurveMonotone, code: curveMonotoneCode },
    { id: 'curve-step', title: 'Interpolation — step', render: CurveStep, code: curveStepCode },
    { id: 'dots', title: 'Data points', render: Dots, code: dotsCode },
    { id: 'palette', title: 'Series palette', render: Palette, code: paletteCode },
    { id: 'sine', title: 'A sampled function', render: Sine, code: sineCode },
    { id: 'numeric-x', title: 'Numeric x scale', render: NumericX, code: numericXCode },
    { id: 'no-tooltip', title: 'Without a tooltip', render: NoTooltip, code: noTooltipCode },
    { id: 'accessible', title: 'Text alternative', render: Accessible, code: accessibleCode },
    { id: 'recharts', title: 'Drawn by Recharts', render: Recharts, code: rechartsCode },
    { id: 'renderer', title: 'Writing your own renderer', render: Renderer, code: rendererCode },
  ],
};
