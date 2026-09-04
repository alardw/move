// Registry of the cross-cutting hooks Move ships (the ones documented on the
// Hooks page). Component-headless hooks (useAccordion, useCalendar, …) are
// documented on their component pages and intentionally NOT listed here.
//
// Completeness is enforced by src/hooks-registry.test.ts: every general-purpose
// hook exported from `move` must appear below, and every entry below must still
// be exported from `move`. Add an entry when you add a hook (the /hook-create
// skill does this for you).

export type HookCategory =
  | "State & refs"
  | "Animation & motion"
  | "Viewport"
  | "Theming & surfaces"
  | "Icons"
  | "Component context"
  | "Focus & popups";

export interface HookDoc {
  /** Exact export name from `move`. */
  name: string;
  /** One-line call signature. */
  signature: string;
  /** One sentence: what it does / when to reach for it. */
  summary: string;
  category: HookCategory;
  /** A paired wrapper component, if any (e.g. useInView → Deferred). */
  companion?: string;
  /** One sentence describing the companion component. */
  companionSummary?: string;
  /** Short usage example (shown as a code block). */
  example?: string;
}

export const HOOKS_REGISTRY: HookDoc[] = [
  // ── State & refs ────────────────────────────────────────────────
  {
    name: "useControlledState",
    signature:
      "useControlledState<T>({ value?, defaultValue?, onChange? }): [T, (v: T) => void, boolean]",
    summary:
      "The canonical controlled/uncontrolled state helper — accept value+onChange, defaultValue, or neither, with one implementation.",
    category: "State & refs",
  },
  {
    name: "useMergedRef",
    signature: "useMergedRef<T>(...refs): React.RefCallback<T>",
    summary:
      "Combine a forwarded ref with an internal one so a component can both expose a ref to consumers and use it itself.",
    category: "State & refs",
  },
  {
    name: "useMoveContext",
    signature: "useMoveContext<TSlots>(): MoveContextValue<TSlots>",
    summary:
      "Read the ambient Move component context (global slot props) — the plumbing behind the withMoveComponent factory.",
    category: "State & refs",
  },

  // ── Viewport ────────────────────────────────────────────────────
  {
    name: "useInView",
    signature:
      "useInView<T>({ rootMargin?, threshold?, once? }): { ref, inView }",
    summary:
      "Report whether an element is at/near the viewport via IntersectionObserver — works inside nested scrollers, with an SSR/jsdom fallback.",
    category: "Viewport",
    companion: "Deferred",
    companionSummary:
      "Deferred is the wrapper over useInView: it mounts its children only once they scroll near the viewport, so a page full of heavy subtrees builds the visible handful on load and the rest as you scroll. Deferral is always opt-in — the children are genuinely absent until revealed. The wrapper is unavoidable, since something has to be in the DOM for the observer to watch, but its element is yours: pass `as` where a div would be wrong, such as a row inside a list.",
    example: `<Deferred rootMargin="300px" style={{ position: 'absolute', inset: 0 }}>
  <ExpensivePreview />
</Deferred>

<ul>
  {rows.map((r) => (
    <Deferred key={r.id} as="li" placeholder={<Skeleton height={40} />}>
      <HeavyRow row={r} />
    </Deferred>
  ))}
</ul>`,
  },
  // ── Focus & popups ──────────────────────────────────────────────
  {
    name: "usePopupFocus",
    signature:
      "usePopupFocus({ mechanism, contentRef, returnRef, anchorRef?, getFocusTarget?, isOpen, onDismiss? }): { onOpenAutoFocus, onCloseAutoFocus }",
    summary:
      "Focus handling for an anchored popup: moves focus in on open, returns it to the field or trigger on close, and dismisses when focus leaves. Pick a mechanism and the focus contract follows from it. Its handlers are Radix events — spread them onto a Radix Popover.Content, DropdownMenu.Content or Select.Content.",
    category: "Focus & popups",
    example: `const handlers = usePopupFocus({
  mechanism: 'field-dialog',
  contentRef,
  returnRef: inputRef,
  anchorRef: rootRef,
  isOpen,
  onDismiss: close,
});

<Popover.Content ref={contentRef} {...handlers}>…</Popover.Content>`,
  },
  {
    name: "useTruncate",
    signature: "useTruncate({ enabled? }): { ref, isTruncated }",
    summary:
      "Report whether a text element is actually clipped by its truncate strategy (re-measured on resize) — so you can show a tooltip only when text is really cut off.",
    category: "Viewport",
  },
  {
    name: "useOverflow",
    signature: "useOverflow({ axis?, enabled? }): { ref, isOverflowing }",
    summary:
      "Report whether an element's content currently overflows it (re-measured on resize and on content growth) — so a scroll region takes focus, or a fade edge appears, only when there is something to scroll.",
    category: "Viewport",
    example: `const { ref, isOverflowing } = useOverflow<HTMLDivElement>();

<div ref={ref} tabIndex={isOverflowing ? 0 : undefined}>…</div>`,
  },

  // ── Animation & motion ──────────────────────────────────────────
  {
    name: "useAnimations",
    signature:
      "useAnimations(config, refs, states?, options?): { handlers, runExit, … }",
    summary:
      "Wire a trigger + sequence config to a ref map. The hook every animated Move component uses internally; reach for it to build your own.",
    category: "Animation & motion",
  },
  {
    name: "usePositionTracker",
    signature: "usePositionTracker(options): { ref, update }",
    summary:
      "Track an active element's position/size within a container and expose an imperative update — the primitive under sliding indicators.",
    category: "Animation & motion",
  },
  {
    name: "useSlidingIndicator",
    signature:
      "useSlidingIndicator({ containerRef, activeSelector, track }): { indicatorRef, update }",
    summary:
      "Position a sliding indicator element over the active item (tab underline, segmented-control pill), re-measuring on resize and font load.",
    category: "Animation & motion",
  },
  {
    name: "useMorphHeight",
    signature: "useMorphHeight<K>({ key, … }): ref",
    summary:
      "Animate an element's height between two natural sizes when a key changes — the piece behind Preview's view toggle.",
    category: "Animation & motion",
  },
  {
    name: "usePresence",
    signature: "usePresence(): [boolean, () => void]",
    summary:
      "Inside a Presence tree, read whether the current child is present and signal when its exit animation has finished.",
    category: "Animation & motion",
  },
  {
    name: "useIsPresent",
    signature: "useIsPresent(): boolean",
    summary:
      "Read-only companion to usePresence — is this subtree currently present (not mid-exit)?",
    category: "Animation & motion",
  },

  // ── Theming & surfaces ──────────────────────────────────────────
  {
    name: "useTheme",
    signature: "useTheme(): ThemeContextValue",
    summary:
      "Read the active theme and switch it from anywhere inside a MoveRoot.",
    category: "Theming & surfaces",
  },
  {
    name: "useSurface",
    signature: "useSurface(): SurfaceTone",
    summary:
      "Read the current surface tone so a component can adapt to the panel it sits on.",
    category: "Theming & surfaces",
  },
  {
    name: "useSurfaceFlip",
    signature: "useSurfaceFlip(): SurfaceTone",
    summary:
      "Compute the flipped surface tone for nested surfaces (a card inside a card reads the alternate tone).",
    category: "Theming & surfaces",
  },
  {
    name: "useLayer",
    signature: "useLayer(): number",
    summary:
      "Read the current stacking layer depth for correct z-index in nested overlays.",
    category: "Theming & surfaces",
  },

  // ── Icons ───────────────────────────────────────────────────────
  {
    name: "useIcon",
    signature: "useIcon(role: IconRole, size?): React.ReactNode | null",
    summary:
      'Resolve a semantic icon role (e.g. "expand", "close") through the active icon set to a renderable node.',
    category: "Icons",
  },
  {
    name: "useResolvedIcon",
    signature:
      "useResolvedIcon(name: string, size: number): React.ReactNode | null",
    summary:
      "Resolve a named icon through the consumer's iconResolver — how components render their built-in icons.",
    category: "Icons",
  },
  {
    name: "useIconContext",
    signature: "useIconContext(): IconContextValue",
    summary:
      "Read the ambient icon configuration (resolver + role overrides) provided by MoveRoot.",
    category: "Icons",
  },
  {
    name: "useIconRoles",
    signature: "useIconRoles(): IconRoleOverrides | null",
    summary:
      "Read the current semantic-role → icon-name overrides, for components that map roles themselves.",
    category: "Icons",
  },

  // ── Component context ───────────────────────────────────────────
  {
    name: "useSidebarContext",
    signature: "useSidebarContext(): { collapsed, toggleCollapsed, … }",
    summary:
      "Read or change the Sidebar's collapsed state from anywhere inside it — the toggle button, the active item, your own footer.",
    category: "Component context",
  },
];

export const HOOK_CATEGORY_ORDER: HookCategory[] = [
  "State & refs",
  "Viewport",
  "Animation & motion",
  "Theming & surfaces",
  "Icons",
  "Component context",
  "Focus & popups",
];
