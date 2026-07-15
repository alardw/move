/**
 * Type surface for the plain-ESM creation spec, so TypeScript consumers (the docs
 * app renders the file manifest + options straight from it) get types without a
 * build step. The runtime values live in `creation-spec.mjs`; keep this in sync
 * with its exports.
 */

export type Shell = 'sidebar' | 'top-nav' | 'minimal';
export type Router = 'react-router' | 'tanstack' | 'none';
export type Icons = 'lucide' | 'none';
export type Theme = 'light' | 'dark';
export type Ci = 'github' | 'none';

export interface CreationOptions {
  shell: Shell;
  router: Router;
  icons: Icons;
  theme: Theme;
  ci: Ci;
}

export interface ScaffoldFile {
  /** Path relative to the project root. */
  path: string;
  /** True if this is a directory, not a file. */
  dir?: boolean;
  /** Whether the app must have it — a flat boolean or a predicate over options. */
  required: boolean | ((o: CreationOptions) => boolean);
  /** One-line description of what it's for. */
  role: string;
  /** Substrings the file must contain (source-file invariants). */
  mustContain?: string[];
}

export const CREATION_SCHEMA_VERSION: number;
export const OPTION_VALUES: {
  shell: Shell[];
  router: Router[];
  icons: Icons[];
  theme: Theme[];
  ci: Ci[];
};
export const DEFAULT_OPTIONS: CreationOptions;
export const BASE_DEPS: Record<string, string>;
export const BASE_DEV_DEPS: Record<string, string>;
export const OPTION_DEPS: {
  router: Record<Router, Record<string, string>>;
  icons: Record<Icons, Record<string, string>>;
};
export const REQUIRED_SCRIPTS: Record<string, string>;
export const MOVE_CONFIG: { check: { components: string; composites: string } };
export const FILES: ScaffoldFile[];
export function resolveDeps(options: CreationOptions): {
  deps: Record<string, string>;
  devDeps: Record<string, string>;
};
export function requiredFiles(options: CreationOptions): ScaffoldFile[];
export const creationSpec: {
  schemaVersion: number;
  optionValues: typeof OPTION_VALUES;
  defaultOptions: CreationOptions;
  packageJson: {
    baseDeps: Record<string, string>;
    baseDevDeps: Record<string, string>;
    optionDeps: typeof OPTION_DEPS;
    requiredScripts: Record<string, string>;
  };
  moveConfig: typeof MOVE_CONFIG;
  files: ScaffoldFile[];
};
