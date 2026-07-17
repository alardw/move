---
name: app-wcag-audit
description: "Audit a Move app for the WCAG 2.2 A/AA items Move does NOT supply — the consumer's half: alt text, page language, heading structure, skip links, form error wiring (aria-invalid + aria-describedby), label association, link text, autocomplete, reduced-motion for your own animations, and contrast of any theme overrides. Knows what Move already handles so it doesn't re-flag those."
user-invocable: true
argument-hint: "[a path, a route, or the whole app]"
---

# App WCAG Audit — check the half that's yours

Move ships accessible primitives, but a component library can only take you part
of the way. This skill audits **your application code** for the WCAG 2.2 A/AA
criteria Move can't own — the content, structure, and wiring only you can supply —
and reports concrete findings with fixes. It deliberately does **not** re-check
what Move already handles.

Scope it to a path, a route, or the whole app.

---

## What Move already handles — do NOT flag these

<!-- GENERATED:what-move-handles -->
Trust these — Move owns them, and auditing them wastes effort and produces false
positives. Generated from Move's WCAG conformance data, so it cannot drift from what
the library actually does.

- **§1.3.1 Info & Relationships** (A) — Radix roles; FormField wires label↔control (a real <label for>), aria-invalid, and aria-describedby; Checkbox/Radio self-name via aria-labelledby.
- **§1.3.2 Meaningful Sequence** (A) — Components render in logical DOM order; reading/tab order follows.
- **§1.3.4 Orientation** (AA) — No component locks orientation.
- **§1.3.5 Identify Input Purpose** (AA) — Native inputs pass through autocomplete; PinInput sets one-time-code.
- **§1.4.3 Contrast (Minimum)** (AA) — Every theme — built-in light and dark, or one you generate — guarantees its text contrast: body text 7:1, secondary 5.5:1, and the faintest text and links 4.5:1. No text tier ships below AA.
- **§1.4.4 Resize Text** (AA) — Type scale is rem-based; no pixel-locked font sizes.
- **§1.4.9 Images of Text (No Exception)** (AAA) — Components render real text, never rasterised — so the no-exception bar holds (same basis as 1.4.5).
- **§1.4.10 Reflow** (AA) — Container queries and min-width:0 layouts; no fixed-width traps.
- **§1.4.11 Non-text Contrast** (AA) — Control edges — input, checkbox, select, radio — hold 3:1 against whatever surface they sit on, stepping up automatically on raised surfaces so the edge stays clear without turning harsh. The filled variant keeps that edge (a heavier fill, never borderless). The focus ring holds 3:1 too, and the Switch is read by its thumb — 7–19:1 against the track and page.
- **§1.4.12 Text Spacing** (AA) — Every text control (inputs, Select, Button, PinInput, tags) grows with a taller line-height instead of clipping, and wider letter or word spacing scrolls within single-line inputs. Nothing is lost at the WCAG text-spacing test or at 200% zoom.
- **§1.4.13 Content on Hover or Focus** (AA) — Tooltip (Radix) is dismissible, hoverable, and persistent.
- **§2.1.1 Keyboard** (A) — Radix overlays are fully operable. ColorPicker sliders (saturation/hue/opacity) take arrow keys — Shift for coarse steps, Home/End to the ends — plus the channel inputs. Carousel is driven by real prev/next buttons and dot controls (all keyboard-operable); viewport arrow-key paging is an unshipped enhancement, not a barrier.
- **§2.1.2 No Keyboard Trap** (A) — No focus traps; Radix overlays release focus on close.
- **§2.1.3 Keyboard (No Exception)** (AAA) — All functionality is keyboard-operable with no timing — ColorPicker channels take arrow keys, Carousel runs on real buttons — so the no-exception bar holds.
- **§2.2.1 Timing Adjustable** (A) — Toast auto-dismiss pauses on hover/focus and its duration is configurable (or disable-able).
- **§2.2.2 Pause, Stop, Hide** (A) — Reduced-motion is honoured everywhere: animations jump straight to their end state, looping effects (Skeleton and Avatar pulse, PinInput blink) stop, and Carousel autoplay never starts. Toast auto-dismiss also pauses on hover or focus.
- **§2.2.3 No Timing** (AAA) — No session or task time limits are imposed. Toast now defaults to manual close (no auto-dismiss) — pass a duration to opt a toast into a timed dismissal, or set one app-wide with toast.configure({ defaultDuration }).
- **§2.3.1 Three Flashes** (A) — No content flashes above threshold (PinInput caret blinks at 1 Hz).
- **§2.3.2 Three Flashes** (AAA) — Nothing flashes above threshold at all (PinInput caret ~1 Hz) — the stricter no-small-area-exception bar holds.
- **§2.3.3 Animation from Interactions** (AAA) — Motion triggered by interaction respects prefers-reduced-motion end to end, so it can be turned off.
- **§2.4.3 Focus Order** (A) — Focus order is logical, and the mobile Sidebar sheet is now a Radix Dialog — focus moves into it on open, is trapped while open, and restores to the trigger on close.
- **§2.4.7 Focus Visible** (AA) — The focus ring shows only for keyboard users, from one shared style; its offset adapts to the control — hugging an input, floating outside a button, inset on a table row. TimeField uses plain focus — minor.
- **§2.4.13 Focus Appearance** (AAA) — One 2px ring that fully encloses the control, held to at least 3:1 against the surface (5–6:1 in practice) — clearing WCAG’s minimum-area and contrast bars. Inside scroll areas it’s drawn inset so it can’t be clipped. Keyboard-highlighted options in menus and lists carry their own enclosing ring — inset on plain rows, outside the fill on the selected row — so the highlight itself clears 3:1, not just its soft background.
- **§2.5.1 Pointer Gestures** (A) — All interactions are single-pointer; no path or multipoint gestures required.
- **§2.5.2 Pointer Cancellation** (A) — Radix widgets act on up-events; ColorPicker drags commit on pointer-up, and Escape mid-drag aborts and reverts to the pre-drag colour.
- **§2.5.3 Label in Name** (A) — Icon buttons name from labels; Checkbox/Radio visible text is the accessible name via aria-labelledby.
- **§2.5.6 Concurrent Input Mechanisms** (AAA) — No component restricts input to one modality — pointer, keyboard, and touch all work.
- **§2.5.7 Dragging Movements** (AA) — New in 2.2. Every draggable (Slider, ColorPicker, Carousel, Splitter, Drawer) has a tap/keyboard/button alternative.
- **§2.5.8 Target Size (Minimum)** (AA) — Interactive controls meet the 24px minimum. Controls at size sm sit at the 32px control height; Checkbox/Radio expose the whole label row as the target, not just the box. Compact icon buttons (Alert/Toast close) and slider handles (ColorPicker hue/opacity, InputRange thumb) keep a small visual but carry an expanded hit region to 24px. NumberInput steppers rely on full-size text entry, and ColorPicker on its channel inputs — a WCAG 2.5.8 equivalent-control.
- **§3.2.1 On Focus** (A) — No component changes context on focus.
- **§3.2.2 On Input** (A) — No component auto-submits or changes context on input.
- **§3.2.4 Consistent Identification** (AA) — A given component is identified consistently across the library.
- **§3.2.5 Change on Request** (AAA) — No component initiates a context change on its own — navigation and submission happen only on explicit action.
- **§3.3.2 Labels or Instructions** (A) — Label associates via htmlFor (a real <label>); required reaches the control natively or via aria-required (incl. Checkbox). The asterisk is decorative (aria-hidden) — requiredness is programmatic.
- **§3.3.7 Redundant Entry** (A) — New in 2.2. Native inputs support autofill; PinInput enables OTP auto-entry.
- **§3.3.8 Accessible Authentication** (AA) — New in 2.2. No cognitive-test/CAPTCHA components; auth fields support autofill and one-time-code.
- **§3.3.9 Accessible Authentication (Enhanced)** (AAA) — No cognitive-function test anywhere; auth fields support autofill and one-time-code.
- **§4.1.2 Name, Role, Value** (A) — Radix supplies roles/states; names and aria-invalid are exposed across controls. Select is now built on Radix Select — a combobox trigger over a listbox of options — and renders a hidden native <select> when given a name, so its value is a real submittable named form control.
- **§4.1.3 Status Messages** (AA) — Toast, Alert, Loader, Skeleton, Autocomplete, PasswordStrength announce correctly; FormField error messages announce via role=alert. ProgressBar exposes role=progressbar with aria-valuenow when determinate, and aria-busy when indeterminate.
<!-- /GENERATED:what-move-handles -->

---

## What YOU must supply — the audit checklist

For each, the detection heuristic and the fix.

### Content & media
- **§1.1.1 Non-text Content** — every `<img>` needs `alt` (empty `alt=""` for decorative); every icon-only control needs an accessible name. Find: `<img` without `alt`; `<Button>` / icon triggers whose only child is an `<Icon>` and no `aria-label`. Fix: add `alt` / `aria-label`; decorative icons already default to `aria-hidden`.
- **§1.2.x Time-based media** — any `<video>`/`AudioPlayer`/`VideoPlayer` needs captions (`<track kind="captions">`) and, where required, a transcript/description. Flag media without tracks.

### Structure
- **§3.1.1 Language of Page** — `<html lang="…">` must be set. Find: index.html / document head. Fix: add `lang`.
- **§2.4.2 Page Titled** — each route sets a unique, descriptive `<title>`. Find: router without per-route title handling. Fix: set `document.title` per route.
- **§1.3.1 / §2.4.6 Headings** — exactly one `<h1>` per page, no skipped levels. Move `Heading` has a `level` prop — check the levels form a sane outline. Fix: correct the hierarchy.
- **§2.4.1 Bypass Blocks** — a "skip to content" link before the nav, and landmark regions (`<main>`, `<nav>`, `<header>`). The app shell composes landmarks, but you place the skip link and the `<main>`. Fix: add a skip link targeting the main region's id.

### Forms — wire the FormField, don't hand-roll ARIA
Move owns the plumbing: `useFieldControl` is the one place every form control gets its
id, `aria-invalid`, and `aria-describedby`, and it never clobbers a value you passed
explicitly. What's yours is the STRUCTURE — putting the control in a FormField and
supplying the error text. Flag missing structure, not missing ARIA.
- **§3.3.1 / §3.3.3 Error Identification & Suggestion** — an invalid field needs visible error text inside its FormField. Wrap the control in `FormField.Root`, mark it `invalid`, and render `FormField.Description`: the Description registers itself, so `aria-describedby` is set only once one exists and never dangles, and `invalid` reflects as `aria-invalid` on the real input. Find: a control with `invalid` whose error text sits outside a FormField, or isn't rendered at all — a red border with nothing announced. Fix:
  ```tsx
  <FormField.Root invalid={hasError}>
    <FormField.Label>Email</FormField.Label>
    <FormField.Field><InputText /></FormField.Field>
    {hasError && <FormField.Description error>Enter a valid email.</FormField.Description>}
  </FormField.Root>
  ```
  Only set `aria-invalid` / `aria-describedby` by hand for a control OUTSIDE a FormField, or one Move doesn't provide.
- **§1.3.1 / §4.1.2 Label association** — every input needs a programmatic name. Inside a FormField, `FormField.Label` is a real `<label htmlFor>` pointing at the generated control id, so text in it associates. Checkbox and Switch name themselves from their children via `aria-labelledby`. Flag: a bare input with no FormField and no `aria-label`; an icon-only control with neither. In dev, `useFieldControl` warns on any control it can't find a name for — that warning IS the finding.
- **§3.3.2 Required** — required must reach AT: native `required` on text inputs, `aria-required` elsewhere. Checkbox forwards `required` to `aria-required` itself. The Label asterisk is `aria-hidden`, so it isn't the cue — the field still needs the attribute, and ideally the word.
- **§1.3.5 Identify Input Purpose** — identifying fields (name, email, address, tel, OTP) carry `autoComplete`. Find: such inputs without it. Fix: add the token (`email`, `tel`, `one-time-code`, …).

### Interaction & motion (your custom code)
- **§2.4.4 Link Purpose** — no "click here" / empty-text links; link text makes sense out of context.
- **§1.4.1 Use of Color** — app content that conveys meaning by color alone (status dots, chart series) needs a text/shape/pattern backup. (Move's form red border is one such case — see Forms above.)
- **§2.2.2 Pause/Stop/Hide & §2.3.3** — any animation, autoplay, or carousel *you* add must honor `prefers-reduced-motion` and be pausable. Move's `useAnimations` does not globally gate reduced motion, so custom loops need an explicit check.
- **§2.5.8 Target Size** — custom controls (not Move components) must be ≥ 24×24, or add an expanded hit area. Note some Move controls are under 24px at size `sm` — prefer `md`+ for touch, and avoid the ColorPicker sliders / NumberInput steppers where target size is critical without enlarging them.

### Theme overrides
- **§1.4.3 / §1.4.11 Contrast** — if the app overrides theme tokens or hand-authors a theme (not `defineThemes`), the AA guarantee is void. Run `auditTheme` on the resolved theme and report any pair below floor. Also raise any custom border/placeholder tokens above 3:1 — Move's default border tokens sit near 1.24:1.

### Manual / can't be statically checked (flag for human review)
- **§1.3.2 Meaningful Sequence**, **§1.4.10 Reflow** at 400% zoom, **§1.4.12 Text Spacing** overrides, **§3.1.2 Language of Parts**, **§3.2.3/§3.2.4 Consistent Navigation/Identification**, **§3.3.4 Error Prevention** for legal/financial flows. List these as "verify manually," don't silently pass them.

---

## Recipe

1. **Scope** — a file, a route's component tree, or the whole `src/`.
2. **Sweep the checklist above** — grep + read for each heuristic; gather concrete `file:line` findings. Skip anything in "What Move already handles."
3. **Rank** — readability/operability blockers first (missing form error wiring, unlabeled inputs, no page language), then the rest.
4. **Report** — per finding: the criterion, `file:line`, what's wrong, and the exact fix. Separate a "verify manually" list for the non-static criteria.
5. **Theme** — if a custom theme/override exists, run `auditTheme` and fold its violations in.
6. **Offer to fix** — the form `aria-invalid` + `aria-describedby` wiring is usually the biggest win and is mechanical.

## Rules
- Audit the **app**, not the Move library. Don't re-flag what Move owns (see the list above).
- Every finding needs `file:line` and a concrete fix — no generic "improve accessibility."
- Be honest about limits: static analysis can't confirm reading order, cognitive load, or caption quality — mark those "verify manually," never "pass."
- Reference the docs `/accessibility` conformance page for which side owns a criterion.
