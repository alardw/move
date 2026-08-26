/**
 * The spec types — the contracts a consumer writes their own specs against.
 *
 * Move is spec-driven: a typed `.spec.ts` is the source of truth a component is
 * generated from, and the skills a consumer installs with `npx move skills`
 * generate specs in their repo too. Without these types exported, those specs
 * can only be written `as const`, which type-checks nothing — a spec missing
 * twelve required fields passes every gate green, because there is no shape for
 * it to fail against.
 *
 * Exported both here (`move/spec`) and from the main barrel, so
 * `satisfies ComponentSpec` works whichever import a consumer reaches for.
 *
 * Types only. Nothing here has a runtime cost.
 */

// --- Component specs ---------------------------------------------------------
export { SPEC_SCHEMA_VERSION, POPUP_FOCUS_BY_MECHANISM, ANIMATION_PATTERNS } from './spec-type';
export type {
  ComponentSpec,
  ComponentClass,
  ControlledPattern,
  ControlledProps,
  KeyboardPattern,
  FocusPattern,
  PopupMechanism,
  PopupFocusContract,
  PopupKeyboardContract,
  PopupBehavior,
  FormType,
  DismissBehavior,
  SlotDef,
  PropDef,
  TokenDeclaration,
  AnatomyNode,
  AnimationStateDef,
  AnimationStepDef,
  AnimationTriggerBinding,
  AnimationCapability,
  AnimationPattern,
  RenderContract,
} from './spec-type';

// --- Composite specs ---------------------------------------------------------
export type { CompositeSpec, CompositeScope, CompositeLabel } from './composite-spec';

// --- Data-layer specs --------------------------------------------------------
export type { AdapterSpec, AdapterMapping, ApiRef } from './adapter-spec';
export type {
  ApiSpec,
  ApiTransport,
  ApiAuth,
  ApiEndpoint,
  ApiParam,
  ApiField,
  HttpMethod,
  Configurable,
} from './api-spec';
