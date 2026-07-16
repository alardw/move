---
name: component-animate
description: "How to add/repair animations on Move components — triggers, stagger, width-relative scale, overlay wrapper structure, and the Radix Select gotcha. Read before touching any open/close or stagger animation."
user-invocable: true
argument-hint: "[ComponentName]"
---

# Animate — Move Component Animation Guide

Everything animated in Move runs through **one system**: `useAnimations(config, refs, states?, options?)`.
This skill captures the patterns AND the hard-won gotchas (especially overlays on Radix
Select). Read the relevant section before adding or repairing an animation — several of these
cost hours to rediscover.

---

## 1. The engine in one breath

```ts
const { handlers, runEnter, runExit, pauseAll, getAnimation } = useAnimations(
  config,   // AnimationTrigger[] | false | null   — what animates, keyed by trigger
  refs,     // { SlotName: RefObject<HTMLElement> } — the elements the steps target
  states?,  // AnimationState[]                     — data-attr observers (for state triggers)
  options?, // { onEnterComplete }
);
```

- A **trigger** has a `trigger` name, a `sequence` (nested arrays = parallel groups), and
  optional `vars`, `deps`, `direction`, `onComplete`.
- A **step** has a `target` (a slot name in `refs`), an `animation`, and — for staggers —
  `children` (a selector) + `stagger`.
- `config` is derived from the component's `spec` defaults merged with the user's
  `animations` prop via `resolveAnimationsConfig(DEFAULTS, props.animations)`.

## 2. Trigger types — pick the right firing model

| Type | Fires when | Use for |
|---|---|---|
| **lifecycle** `Slot.enter` / `Slot.exit` | enter: on mount (in `useLayoutEffect`); exit: only via `runExit()` | content that **mounts on open** (Dropdown, Popover, Tooltip) |
| **state** `name` + `AnimationState{source:'data-state',...}` | a watched `data-*` attr changes (MutationObserver, `subtree:true`) | anything driven by Radix `data-state` — e.g. the chevron rotate |
| **deps** `deps:[...]` | a dep changes (skips first run) | data-dependent re-runs (height, page slide) |
| **event** `Slot.hover` / `Slot.press` | pointer events | interactive hover/press |

**Lifecycle enter is one-shot per mount** — it's guarded by an internal `lifecycleRan` ref.
It fires the FIRST time `config` becomes non-null and never again for that mounted instance.
Two consequences that bite:
- If `config` becomes non-null while it only contains an **exit** trigger, the lock still
  trips (with nothing to fire) — so a later-added enter trigger will **never auto-fire**.
- `runEnter()` / `runExit()` **ignore the lock** and re-run every call. Use them to fire
  imperatively when the auto-lifecycle can't (see §7).

## 3. Stagger

```ts
{ target: 'ContentInner', children: '[role="option"]', stagger: staggerItems.stagger,
  animation: { scale: { from: '$scaleFrom', to: 1, ease: poppy }, opacity: { from: 0, to: 1 } } }
```

- `staggerAnimate` runs `container.querySelectorAll(children)` on the **target ref's element**,
  so items only need to be **descendants** (a wrapping `display:contents` layer is fine for
  finding them — but see §5 for why not to).
- It **seeds** each item's `from` state (so no first-frame flash) then animates with
  `delay: i * stagger.delay`.
- It **bails** (returns undefined, animates nothing) when `items.length === 0` **or**
  `prefersReducedMotion()`. A stagger that "does nothing" is almost always **0 items at fire
  time** — the enter fired before the rows existed.

## 4. Width-relative scale (don't bounce harder on wide controls)

A fixed scale ratio (`scale: 0.8→1`, e.g. `staggerItems.enter`) moves a wide control **20% of a
large width** — huge absolute travel → more overshoot/bounce for the same ratio. Instead derive
the ratio from a **fixed pixel inset** so travel is constant at any width:

```ts
const SCALE_INSET_PX = 16;
const scaleFrom = (triggerWidth - SCALE_INSET_PX) / triggerWidth; // ~0.92 at 200px, ~0.96 at 400px
// pass through vars; resolve in the step with the $ prefix:
result.push({ trigger: 'Content.enter', sequence: openSteps, vars: { scaleFrom } });
// step: scale: { from: '$scaleFrom', to: 1, ease: poppy }
```

`vars` values are resolved wherever a step value is the string `'$name'`. Springs live in
`animation/easings.ts` (`poppy` = bouncy, damping 12; `smooth`/`brisk` = calmer). Bounce too
strong? Prefer shrinking the travel (bigger inset) before swapping the spring.

## 5. Overlay wrapper structure — keep Radix pristine

Canonical structure (matches Dropdown; the stagger container is a plain div **we** own):

```
Radix*.Content        ← .content   (Radix-managed: ref, positioning, data-state)  — fade target
  └─ Radix*.Viewport  ← Radix-managed (Select only): its own ref/scroll — DO NOT overload
       └─ div.contentInner  ← OURS, a plain div Radix never touches — the STAGGER container + ref
            └─ items         ← DIRECT children
```

Rules:
- **Never** put our animated ref / class / `display:contents` **on a Radix component**. Radix
  attaches its own ref, styles, scroll and positioning and will clobber or reparent ours.
  Our animated element must be a plain `div` **inside** the Radix element.
- Select requires a `Radix.Viewport`; nest our `.contentInner` div **inside** it (pass the ref
  down via context — see `SelectViewportContext` in `forms/Select/Select.tsx`).
- The `Content` only fades; the **item stagger** carries the reveal.

## 6. Integration across the Radix overlays (validated against source)

Every Move overlay wraps a Radix primitive. The docs name the shared reveal patterns —
`press`, `toggle`, **`popupMenu`** (panel + item stagger), `popupSurface` (fade/slide),
`sidePanel` (panel + backdrop), `disclosure` (height) — see `/animation/patterns`. Under the
hood the firing model is the SAME for all of them **except Select**:

| Component(s) | Radix primitive | Content mounts | Firing model |
|---|---|---|---|
| **Dropdown** | DropdownMenu | on open | lifecycle `Content.enter`/`.exit` + `useDismissableExit` |
| **Popover, Autocomplete, DatePicker, TimeField, ColorInput** | Popover | on open | same lifecycle |
| **Tooltip** | Tooltip | on open | same lifecycle |
| **Dialog, Drawer, Sidebar** | Dialog | on open | lifecycle `Content.enter/.exit` **+ `Overlay.enter/.exit`** (backdrop) |
| **Select** | **Select** | **persistent (mounted while closed)** | **special — see §7** |

Why the others "just work": Radix DropdownMenu/Popover/Dialog/Tooltip mount their content **only
while open** (via Presence) and deliver children in one commit, so the **lifecycle enter fires at
the visible open with rows present** — copy Dropdown for any of them. Select is the lone
exception because it's a form control (§7).

**`data-move-state` vs `data-state`.** State triggers that must stay valid *through the exit
animation* (e.g. Autocomplete's chevron) watch a **`data-move-state`** attribute the component
sets itself (`open`/`closed`, reflecting true state including during exit), because Radix's own
`data-state` may flip before the exit finishes. Watch `data-state` only when Radix's timing is
what you want (Select's chevron does).

## 7. THE RADIX SELECT GOTCHA (why Select ≠ Dropdown/Popover)

Radix **Select** is a *form control*, not a floating layer. Unlike DropdownMenu/Popover/Tooltip:
- It **keeps the listbox mounted while closed** (persistent content + a hidden native
  `<select>` for form submit).
- It **commits its option collection one frame AFTER the content mounts** (late rows).
- **mount ≠ visible open** — Radix mounts/positions before revealing.

So the "animate children on mount" pattern that works verbatim for Dropdown **fails** on Select:
the lifecycle enter fires before rows exist (staggers 0 items, locks) or before the popup is
visible (plays invisibly; items are at rest by the time you see it). The working pattern
(implemented in `forms/Select/Select.tsx` — copy it):

1. **`itemsReady`** — a per-frame `requestAnimationFrame` poll that re-reads `innerRef` (which
   mounts LATE inside the Viewport) and flips true only once a `[role="option"]` exists. NEVER a
   blind timer — that races the collection commit and fires against 0 rows.
2. **Suppress the eager auto-enter**: keep `Content.exit` in `config` from the first render so
   the lifecycle lock trips with no enter trigger; add `Content.enter` only once `itemsReady`.
   Because the lock is already tripped, `Content.enter` never auto-fires.
3. **Fire imperatively**: a `requestAnimationFrame` poll watches `contentRef.closest('[data-state]')`;
   on each closed→open transition (with rows present) call `runEnter()`. It ignores the lock, so
   the stagger plays **in view, on every open** (not just the first — persistent content would
   otherwise animate once and never again).
4. Exit stays on `runExit()` via `useDismissableExit` (content is held mounted through the exit
   by `open={isOpen || isClosing}`).

The chevron already proved the state-driven approach: it rotates off `data-state` via a **state
trigger** with `closest:'[data-state]'`. (For content, `closest` only searches self+ancestors —
if `data-state` sits on a descendant, a state trigger won't reach it; the imperative poll above
sidesteps that.)

## 8. Debugging methodology (when a stagger "doesn't work")

Bisect with **isolation probes** before touching the component — throwaway samples you add to
the docs page, then delete (this is how the Select fix was found):
1. **Plain probe** — `useAnimations` + `staggerItems` on plain divs, items present at mount.
   Confirms the engine works. (It always does.)
2. **Deferred probe** — same, but items commit a frame late + `itemsReady` gating. Confirms the
   gating mechanism.
3. **Real-primitive probe** — the actual Radix primitives + our wiring. Where it breaks = the
   primitive's behavior is the cause.

Instrument with a **fixed readout appended to `document.body`** (survives the portal closing —
in-popup logs vanish when the popup blurs shut). Log the deciding facts:
- `count` of `[role="option"]` (rows present?), `data-state` (open?), and **first / mid / last
  item opacity** at frame rate. A real stagger shows them **spread** (`[1 0.5 0.1]`); a plain
  fade shows them **equal**; `op` stuck at `-` means the enter never seeded (never fired).

To inspect a popup without it closing on blur: `setTimeout(() => { debugger }, 3000)` then open;
or DevTools → "Emulate a focused page".

## 9. Checklist for a new/changed overlay animation

- [ ] Animated element is a **plain div we own**, never a Radix component.
- [ ] Content fades; item **stagger** carries the reveal (`children` selector matches the real
      role, e.g. `[role="option"]` / `[role="menuitem"]`).
- [ ] Scale is **width-relative** (`$scaleFrom` via `vars`), not a fixed ratio.
- [ ] Rows guaranteed present at fire time (mount for Dropdown/Popover; `itemsReady` poll +
      imperative `runEnter` on `data-state=open` for **Select**).
- [ ] Fires on **every** open (not just the first) — verify with persistent content.
- [ ] Exit still plays on close.
- [ ] `npx tsc --noEmit` clean, `vitest run src/components/.../<Name>` green. (jsdom has no
      layout/motion — the stagger itself needs a human localhost pass.)
