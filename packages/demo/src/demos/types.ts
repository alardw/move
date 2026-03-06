import type React from 'react';

export type Control = {
  name: string;
  kind: string;
  options?: string[];
  defaultValue?: unknown;
  /** True when the spec prop has no default value */
  required?: boolean;
};

export type DemoSubComponent = {
  /** Sub-component name (e.g. 'Avatar', 'Container') */
  name: string;
  /** Controls for this sub-component's props */
  controls: Control[];
  /** Initial prop values for this sub-component */
  initialProps: Record<string, unknown>;
  /** Nested sub-components */
  children?: DemoSubComponent[];
  /** Can this sub-component be toggled off in the demo? */
  optional?: boolean;
  /** Shown by default? Only relevant when optional=true */
  defaultEnabled?: boolean;
};

export type DemoSection = {
  id: string;
  label: string;
  render: (props: Record<string, unknown>) => React.ReactNode;
  code?: string | ((props: Record<string, unknown>) => string);
};

export type DemoDefinition = {
  id: string;
  name: string;
  category: string;
  description?: string;
  /** Flat controls for simple (non-compound) components */
  controls: Control[];
  initialProps: Record<string, unknown>;
  /** Sub-component tree for compound components */
  subComponents?: DemoSubComponent[];
  /**
   * Optional top-level preview sections (e.g. consumer samples vs playground).
   * @deprecated Use the recipe system instead. Recipes live in `demo/src/recipes/`.
   */
  sections?: DemoSection[];
  render: (props: Record<string, unknown>) => React.ReactNode;
};
