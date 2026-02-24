/**
 * Essential built-in SVG icons that ship with Move.
 *
 * These serve as fallbacks so core UI interactions (chevrons, close buttons,
 * status indicators, etc.) always work — even when the user's icon set
 * doesn't include them. The user's IconProvider resolver is always tried
 * first; built-ins only kick in when the resolver returns null.
 *
 * All icons use a 24×24 viewBox with stroke-based rendering (Lucide-compatible).
 */

import * as React from 'react';

// ---------------------------------------------------------------------------
// Shared SVG wrapper
// ---------------------------------------------------------------------------

interface BuiltinSvgProps {
  width: number | string;
  height: number | string;
  children: React.ReactNode;
}

function Svg({ width, height, children }: BuiltinSvgProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Icon definitions
// ---------------------------------------------------------------------------

function ChevronLeft({ width, height }: { width: number | string; height: number | string }) {
  return <Svg width={width} height={height}><path d="m15 18-6-6 6-6" /></Svg>;
}

function ChevronRight({ width, height }: { width: number | string; height: number | string }) {
  return <Svg width={width} height={height}><path d="m9 18 6-6-6-6" /></Svg>;
}

function ChevronDown({ width, height }: { width: number | string; height: number | string }) {
  return <Svg width={width} height={height}><path d="m6 9 6 6 6-6" /></Svg>;
}

function X({ width, height }: { width: number | string; height: number | string }) {
  return (
    <Svg width={width} height={height}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </Svg>
  );
}

function Check({ width, height }: { width: number | string; height: number | string }) {
  return <Svg width={width} height={height}><polyline points="20 6 9 17 4 12" /></Svg>;
}

function Calendar({ width, height }: { width: number | string; height: number | string }) {
  return (
    <Svg width={width} height={height}>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </Svg>
  );
}

function ImageOff({ width, height }: { width: number | string; height: number | string }) {
  return (
    <Svg width={width} height={height}>
      <line x1="2" x2="22" y1="2" y2="22" />
      <path d="M10.41 10.41a2 2 0 1 1-2.83-2.83" />
      <line x1="13.5" x2="6" y1="13.5" y2="21" />
      <line x1="18" x2="21" y1="12" y2="15" />
      <path d="M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59" />
      <path d="M21 15V5a2 2 0 0 0-2-2H9" />
    </Svg>
  );
}

function Info({ width, height }: { width: number | string; height: number | string }) {
  return (
    <Svg width={width} height={height}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </Svg>
  );
}

function CircleCheck({ width, height }: { width: number | string; height: number | string }) {
  return (
    <Svg width={width} height={height}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </Svg>
  );
}

function TriangleAlert({ width, height }: { width: number | string; height: number | string }) {
  return (
    <Svg width={width} height={height}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </Svg>
  );
}

function Eye({ width, height }: { width: number | string; height: number | string }) {
  return (
    <Svg width={width} height={height}>
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </Svg>
  );
}

function EyeOff({ width, height }: { width: number | string; height: number | string }) {
  return (
    <Svg width={width} height={height}>
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <path d="m2 2 20 20" />
    </Svg>
  );
}

function CircleX({ width, height }: { width: number | string; height: number | string }) {
  return (
    <Svg width={width} height={height}>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

type BuiltinIconComponent = React.ComponentType<{ width: number | string; height: number | string }>;

export const BUILTIN_ICONS: Record<string, BuiltinIconComponent> = {
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
  'x': X,
  'check': Check,
  'calendar': Calendar,
  'image-off': ImageOff,
  'info': Info,
  'circle-check': CircleCheck,
  'triangle-alert': TriangleAlert,
  'circle-x': CircleX,
  'eye': Eye,
  'eye-off': EyeOff,
};
