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
  return (
    <Svg width={width} height={height}>
      <path d="m15 18-6-6 6-6" />
    </Svg>
  );
}

function ChevronRight({ width, height }: { width: number | string; height: number | string }) {
  return (
    <Svg width={width} height={height}>
      <path d="m9 18 6-6-6-6" />
    </Svg>
  );
}

function ChevronUp({ width, height }: { width: number | string; height: number | string }) {
  return (
    <Svg width={width} height={height}>
      <path d="m18 15-6-6-6 6" />
    </Svg>
  );
}

function ChevronDown({ width, height }: { width: number | string; height: number | string }) {
  return (
    <Svg width={width} height={height}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  );
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
  return (
    <Svg width={width} height={height}>
      <polyline points="20 6 9 17 4 12" />
    </Svg>
  );
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

function FileIcon({ width, height }: { width: number | string; height: number | string }) {
  return (
    <Svg width={width} height={height}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </Svg>
  );
}

function Play({ width, height }: { width: number | string; height: number | string }) {
  return (
    <Svg width={width} height={height}>
      <polygon points="6 3 20 12 6 21 6 3" />
    </Svg>
  );
}

function Pause({ width, height }: { width: number | string; height: number | string }) {
  return (
    <Svg width={width} height={height}>
      <rect x="14" y="4" width="4" height="16" rx="1" />
      <rect x="6" y="4" width="4" height="16" rx="1" />
    </Svg>
  );
}

function Volume2({ width, height }: { width: number | string; height: number | string }) {
  return (
    <Svg width={width} height={height}>
      <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
      <path d="M16 9a5 5 0 0 1 0 6" />
      <path d="M19.364 18.364a9 9 0 0 0 0-12.728" />
    </Svg>
  );
}

function VolumeX({ width, height }: { width: number | string; height: number | string }) {
  return (
    <Svg width={width} height={height}>
      <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
      <line x1="22" x2="16" y1="9" y2="15" />
      <line x1="16" x2="22" y1="9" y2="15" />
    </Svg>
  );
}

function Captions({ width, height }: { width: number | string; height: number | string }) {
  return (
    <Svg width={width} height={height}>
      <rect width="18" height="14" x="3" y="5" rx="2" ry="2" />
      <path d="M7 15h4M15 15h2M7 11h2M13 11h4" />
    </Svg>
  );
}

function Maximize({ width, height }: { width: number | string; height: number | string }) {
  return (
    <Svg width={width} height={height}>
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </Svg>
  );
}

function Minimize({ width, height }: { width: number | string; height: number | string }) {
  return (
    <Svg width={width} height={height}>
      <path d="M8 3v3a2 2 0 0 1-2 2H3" />
      <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
      <path d="M3 16h3a2 2 0 0 1 2 2v3" />
      <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
    </Svg>
  );
}

function Settings({ width, height }: { width: number | string; height: number | string }) {
  return (
    <Svg width={width} height={height}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </Svg>
  );
}

function Pipette({ width, height }: { width: number | string; height: number | string }) {
  return (
    <Svg width={width} height={height}>
      <path d="m2 22 1-1h3l9-9" />
      <path d="M3 21v-3l9-9" />
      <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3L15 6" />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

type BuiltinIconComponent = React.ComponentType<{
  width: number | string;
  height: number | string;
}>;

function Quote({ width, height }: { width: number | string; height: number | string }) {
  return (
    <Svg width={width} height={height}>
      <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
      <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
    </Svg>
  );
}

export const BUILTIN_ICONS: Record<string, BuiltinIconComponent> = {
  'quote': Quote,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
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
  'file': FileIcon,
  'play': Play,
  'pause': Pause,
  'volume-2': Volume2,
  'volume-x': VolumeX,
  'captions': Captions,
  'maximize': Maximize,
  'minimize': Minimize,
  'settings': Settings,
  'pipette': Pipette,
};
