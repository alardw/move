// src/meta-schema.ts

/**
 * Increment this when the ComponentMeta contract changes
 * in a breaking way.
 */
export const META_SCHEMA_VERSION = 1 as const;

/**
 * Structural classification of a component.
 */
export type ComponentKind =
  | "primitive"
  | "compound"
  | "composite";

/**
 * Canonical controlled state patterns supported by Move.
 *
 * A controlled pattern requires the full triad:
 * - {state}
 * - default{State}
 * - on{State}Change
 *
 * Example for "open":
 * - open
 * - defaultOpen
 * - onOpenChange
 */
export type ControlledPattern =
  | "open"
  | "value"
  | "checked"
  | null;

/**
 * Functional intent classification.
 * Must remain a small, stable vocabulary.
 * Must not encode domain/business logic.
 */
export type ComponentIntent =
  | "trigger"
  | "input"
  | "selection"
  | "disclosure"
  | "layout"
  | "display"
  | "feedback";

/**
 * Declarative structural contract for a Move component.
 *
 * Meta describes public structure only.
 * It must remain deterministic and stable.
 */
export type ComponentMeta = {
  /**
   * Schema version for migration safety.
   * Must always equal META_SCHEMA_VERSION.
   */
  schemaVersion: typeof META_SCHEMA_VERSION;

  /**
   * Public export name.
   * Must match actual component export.
   */
  name: string;

  /**
   * Structural classification.
   */
  kind: ComponentKind;

  /**
   * Ordered anatomy of sub-components.
   * For primitive components: ["Root"]
   */
  anatomy: readonly string[];

  /**
   * Valid slot keys exposed via `sp`.
   * Must match typed slot union exactly.
   */
  slots: readonly string[];

  /**
   * Controlled/uncontrolled state pattern.
   */
  controlled: {
    pattern: ControlledPattern;
  };

  /**
   * Canonical variant contract.
   * Keys must match public prop names.
   * Values must match literal union types.
   */
  variants: {
    readonly [variantName: string]: readonly string[];
  };

  /**
   * Structural constraints explicitly enforced by implementation.
   */
  constraints?: {
    /**
     * If sub-components require a specific parent.
     * Example: "Dialog.Root"
     */
    requiresParent?: string;

    /**
     * If specific children are structurally required.
     */
    requiresChild?: readonly string[];

    /**
     * True only if public `animate` prop exists.
     */
    supportsAnimation?: boolean;
  };

  /**
   * Functional intent.
   * Must be explicitly declared.
   */
  intent?: readonly ComponentIntent[];
};