import * as Heroicons from '@heroicons/react/24/outline';
import type { ComponentType } from 'react';

// This app is deliberately on Heroicons, not the Move default (Lucide) — proof
// that Move's icons are bring-your-own. Heroicons' names diverge from Move's
// internal kebab-case vocabulary (menu → Bars3Icon, panel-left → Bars3BottomLeftIcon),
// so we map the names this app uses once. Anything not aliased falls back to
// Heroicons' PascalCase + "Icon" convention, then to Move's built-in essentials.
// This is the mapping pattern from the docs — see /customize/icons.
const toPascal = (s: string) => s.replace(/(^|-)([a-z])/g, (_, __, c: string) => c.toUpperCase());

const aliases: Record<string, ComponentType> = {
  home: Heroicons.HomeIcon,
  info: Heroicons.InformationCircleIcon,
  menu: Heroicons.Bars3Icon,
  'panel-left': Heroicons.Bars3BottomLeftIcon,
};

export const iconResolver = (name: string): ComponentType | null =>
  aliases[name] ??
  ((Heroicons as Record<string, unknown>)[toPascal(name) + 'Icon'] as ComponentType) ??
  null;
