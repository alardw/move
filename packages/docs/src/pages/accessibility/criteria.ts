// The WCAG 2.2 conformance data behind /accessibility — the CLAIM half of Move's
// accessibility story.
//
// Split out of AccessibilityPage.tsx so it is readable by things other than the page:
// `check:wcag-evidence` (which proves every `evidence` name is a real check) and the
// app-wcag-audit skill's generated "what Move already handles" section. A second
// hand-written copy of this list is exactly how that skill drifted into telling
// consumers to wire aria-invalid that FormField already sets.
//
// Scored against the current library — honest, not aspirational. Each value was
// verified against the source criterion by criterion; where Move fell short the fix
// landed first and the row was re-scored after (see the git history of this data).
//
// `evidence` is the other half: WHICH CHECK GOES RED if the claim stops being true.
// Names are CHECKS[].name from ../ai/checks.ts, already held in bijection with the
// real check:* scripts by check:conformance-docs — so a name that isn't a check
// can't hide here. An empty list on a `supports` row is not a failure; it is the
// honest statement that the claim was verified by hand and nothing guards it.

export type Support = 'supports' | 'enables' | 'partial' | 'none' | 'na' | 'consumer';

export interface CriterionNote {
  included?: string; // what Move ships / handles for you
  yours?: string; // what you must wire or supply
  gap?: string; // where Move's own support falls short (unfinished)
}

export interface Criterion {
  sc: string;
  name: string;
  level: string;
  support: Support;
  /** The check(s) that go red if this stops being true. Names are CHECKS[].name.
   *  `[]` = verified by hand, nothing guards it — rendered as such, not hidden. */
  evidence: string[];
  note: CriterionNote;
}

// WCAG 2.2, Levels A + AA. Scored against the current library — honest, not aspirational.
// Support levels distinguish two things people often conflate:
//   "Supports" = Move handles it for you (no action needed beyond using the component).
//   "Enables"  = Move ships the full mechanism, but you must switch it on / supply content
//                (e.g. set invalid + add an error message). Not a Move deficiency.
//   "Partial"  = Move's own support is genuinely incomplete — a real gap on our side.
//   "Yours"    = entirely app-level; Move plays no part.
const PERCEIVABLE: Criterion[] = [
  {
    sc: '1.1.1',
    name: 'Non-text Content',
    level: 'A',
    support: 'enables',
    evidence: [],
    note: {
      included: 'Icons default to aria-hidden; every component accepts aria-label.',
      yours: 'Alt text for images and meaningful icons.',
    },
  },
  {
    sc: '1.2.1',
    name: 'Audio-only & Video-only (Prerecorded)',
    level: 'A',
    support: 'enables',
    evidence: [],
    note: {
      included: 'AudioPlayer/VideoPlayer ship with controls.',
      yours: 'A transcript (audio-only) or an audio/described track (video-only).',
    },
  },
  {
    sc: '1.2.2',
    name: 'Captions (Prerecorded)',
    level: 'A',
    support: 'enables',
    evidence: [],
    note: {
      included: 'VideoPlayer accepts a <track kind="captions">.',
      yours: 'The caption file.',
    },
  },
  {
    sc: '1.2.3',
    name: 'Audio Description or Media Alternative (Prerecorded)',
    level: 'A',
    support: 'consumer',
    evidence: [],
    note: { yours: 'A described audio track or a full text alternative.' },
  },
  {
    sc: '1.2.4',
    name: 'Captions (Live)',
    level: 'AA',
    support: 'consumer',
    evidence: [],
    note: { yours: 'Real-time captions for live audio.' },
  },
  {
    sc: '1.2.5',
    name: 'Audio Description (Prerecorded)',
    level: 'AA',
    support: 'consumer',
    evidence: [],
    note: { yours: 'A synchronized audio-description track.' },
  },
  {
    sc: '1.3.1',
    name: 'Info & Relationships',
    level: 'A',
    support: 'supports',
    evidence: ['a11y-sweep'],
    note: {
      included:
        'Radix roles; FormField wires label↔control (a real <label for>), aria-invalid, and aria-describedby; Checkbox/Radio self-name via aria-labelledby.',
    },
  },
  {
    sc: '1.3.2',
    name: 'Meaningful Sequence',
    level: 'A',
    support: 'supports',
    evidence: [],
    note: {
      included: 'Components render in logical DOM order; reading/tab order follows.',
      yours: 'Page-level sequence.',
    },
  },
  {
    sc: '1.3.3',
    name: 'Sensory Characteristics',
    level: 'A',
    support: 'consumer',
    evidence: [],
    note: { yours: 'Instructions that rely on shape/position are content-level.' },
  },
  {
    sc: '1.3.4',
    name: 'Orientation',
    level: 'AA',
    support: 'supports',
    evidence: ['a11y-sweep'],
    note: { included: 'No component locks orientation.' },
  },
  {
    sc: '1.3.5',
    name: 'Identify Input Purpose',
    level: 'AA',
    support: 'supports',
    evidence: ['a11y-sweep'],
    note: { included: 'Native inputs pass through autocomplete; PinInput sets one-time-code.' },
  },
  {
    sc: '1.4.1',
    name: 'Use of Color',
    level: 'A',
    support: 'enables',
    evidence: [],
    note: {
      included:
        'Link defaults to an always-on underline (not color alone). The invalid state is a red border.',
      yours: 'Add a FormField.Description error (auto-associated) so the cue is not color-only.',
    },
  },
  {
    sc: '1.4.2',
    name: 'Audio Control',
    level: 'A',
    support: 'na',
    evidence: [],
    note: { included: 'Nothing auto-plays audio; players expose pause/stop.' },
  },
  {
    sc: '1.4.3',
    name: 'Contrast (Minimum)',
    level: 'AA',
    support: 'supports',
    evidence: ['theme-contrast'],
    note: {
      included:
        'Every theme — built-in light and dark, or one you generate — guarantees its text contrast: body text 7:1, secondary 5.5:1, and the faintest text and links 4.5:1. No text tier ships below AA.',
      yours:
        'Colours you override by hand are your call — grade them in the Theme Builder, or call auditTheme on your resolved theme (both use the same contrast audit Move runs on its own themes).',
    },
  },
  {
    sc: '1.4.4',
    name: 'Resize Text',
    level: 'AA',
    support: 'supports',
    evidence: ['a11y-sweep'],
    note: { included: 'Type scale is rem-based; no pixel-locked font sizes.' },
  },
  {
    sc: '1.4.5',
    name: 'Images of Text',
    level: 'AA',
    support: 'na',
    evidence: [],
    note: { included: 'Components render real text, never images of text.' },
  },
  {
    sc: '1.4.6',
    name: 'Contrast (Enhanced)',
    level: 'AAA',
    support: 'enables',
    evidence: [],
    note: {
      included:
        'Primary body text is the highest-contrast tier everywhere (14–17:1) — well past AAA.',
      yours:
        'For a blanket AAA claim, keep body text on the high-contrast tiers: the muted (~6.5–7.7:1) and subtle (~4.5:1) tiers are AA and deliberately quieter — pushing them to 7:1 would flatten the primary-to-faint hierarchy.',
    },
  },
  {
    sc: '1.4.7',
    name: 'Low or No Background Audio',
    level: 'AAA',
    support: 'na',
    evidence: [],
    note: { included: 'No multi-track/background audio; players expose volume and mute.' },
  },
  {
    sc: '1.4.8',
    name: 'Visual Presentation',
    level: 'AAA',
    support: 'enables',
    evidence: [],
    note: {
      included:
        'Any Text or Heading caps its line length to a readable measure (~66 characters, under the 80 limit) with the readableWidth prop; Prose applies the same cap plus paragraph spacing, and never justifies. Resizing and reflow to 200% come from 1.4.4 / 1.4.10.',
      yours:
        'Add readableWidth to a standalone paragraph, or use Prose for long-form. Reader-chosen colours come from the browser.',
    },
  },
  {
    sc: '1.4.9',
    name: 'Images of Text (No Exception)',
    level: 'AAA',
    support: 'supports',
    evidence: [],
    note: {
      included:
        'Components render real text, never rasterised — so the no-exception bar holds (same basis as 1.4.5).',
    },
  },
  {
    sc: '1.4.10',
    name: 'Reflow',
    level: 'AA',
    support: 'supports',
    evidence: [],
    note: {
      included: 'Container queries and min-width:0 layouts; no fixed-width traps.',
      yours: 'Spot-check Autocomplete tags at 200%.',
    },
  },
  {
    sc: '1.4.11',
    name: 'Non-text Contrast',
    level: 'AA',
    support: 'supports',
    evidence: ['theme-contrast'],
    note: {
      included:
        'Control edges — input, checkbox, select, radio — hold 3:1 against whatever surface they sit on, stepping up automatically on raised surfaces so the edge stays clear without turning harsh. The filled variant keeps that edge (a heavier fill, never borderless). The focus ring holds 3:1 too, and the Switch is read by its thumb — 7–19:1 against the track and page.',
    },
  },
  {
    sc: '1.4.12',
    name: 'Text Spacing',
    level: 'AA',
    support: 'supports',
    evidence: ['a11y-sweep'],
    note: {
      included:
        'Every text control (inputs, Select, Button, PinInput, tags) grows with a taller line-height instead of clipping, and wider letter or word spacing scrolls within single-line inputs. Nothing is lost at the WCAG text-spacing test or at 200% zoom.',
    },
  },
  {
    sc: '1.4.13',
    name: 'Content on Hover or Focus',
    level: 'AA',
    support: 'supports',
    evidence: [],
    note: { included: 'Tooltip (Radix) is dismissible, hoverable, and persistent.' },
  },
];

const OPERABLE: Criterion[] = [
  {
    sc: '2.1.1',
    name: 'Keyboard',
    level: 'A',
    support: 'supports',
    evidence: ['a11y-sweep', 'keyboard-entry'],
    note: {
      included:
        'Radix overlays are fully operable. ColorPicker sliders (saturation/hue/opacity) take arrow keys — Shift for coarse steps, Home/End to the ends — plus the channel inputs. Carousel is driven by real prev/next buttons and dot controls (all keyboard-operable); viewport arrow-key paging is an unshipped enhancement, not a barrier.',
    },
  },
  {
    sc: '2.1.2',
    name: 'No Keyboard Trap',
    level: 'A',
    support: 'supports',
    evidence: [],
    note: { included: 'No focus traps; Radix overlays release focus on close.' },
  },
  {
    sc: '2.1.3',
    name: 'Keyboard (No Exception)',
    level: 'AAA',
    support: 'supports',
    evidence: ['a11y-sweep'],
    note: {
      included:
        'All functionality is keyboard-operable with no timing — ColorPicker channels take arrow keys, Carousel runs on real buttons — so the no-exception bar holds.',
    },
  },
  {
    sc: '2.1.4',
    name: 'Character Key Shortcuts',
    level: 'A',
    support: 'na',
    evidence: [],
    note: { included: 'No single-character shortcuts are imposed.' },
  },
  {
    sc: '2.2.1',
    name: 'Timing Adjustable',
    level: 'A',
    support: 'supports',
    evidence: ['a11y-sweep'],
    note: {
      included:
        'Toast auto-dismiss pauses on hover/focus and its duration is configurable (or disable-able).',
    },
  },
  {
    sc: '2.2.2',
    name: 'Pause, Stop, Hide',
    level: 'A',
    support: 'supports',
    evidence: ['a11y-sweep'],
    note: {
      included:
        'Reduced-motion is honoured everywhere: animations jump straight to their end state, looping effects (Skeleton and Avatar pulse, PinInput blink) stop, and Carousel autoplay never starts. Toast auto-dismiss also pauses on hover or focus.',
    },
  },
  {
    sc: '2.2.3',
    name: 'No Timing',
    level: 'AAA',
    support: 'supports',
    evidence: [],
    note: {
      included:
        'No session or task time limits are imposed. Toast now defaults to manual close (no auto-dismiss) — pass a duration to opt a toast into a timed dismissal, or set one app-wide with toast.configure({ defaultDuration }).',
    },
  },
  {
    sc: '2.3.1',
    name: 'Three Flashes',
    level: 'A',
    support: 'supports',
    evidence: [],
    note: { included: 'No content flashes above threshold (PinInput caret blinks at 1 Hz).' },
  },
  {
    sc: '2.3.2',
    name: 'Three Flashes',
    level: 'AAA',
    support: 'supports',
    evidence: [],
    note: {
      included:
        'Nothing flashes above threshold at all (PinInput caret ~1 Hz) — the stricter no-small-area-exception bar holds.',
    },
  },
  {
    sc: '2.3.3',
    name: 'Animation from Interactions',
    level: 'AAA',
    support: 'supports',
    evidence: [],
    note: {
      included:
        'Motion triggered by interaction respects prefers-reduced-motion end to end, so it can be turned off.',
    },
  },
  {
    sc: '2.4.1',
    name: 'Bypass Blocks',
    level: 'A',
    support: 'enables',
    evidence: [],
    note: { included: 'The shell composes landmarks.', yours: 'Place the skip link.' },
  },
  {
    sc: '2.4.2',
    name: 'Page Titled',
    level: 'A',
    support: 'consumer',
    evidence: [],
    note: { yours: 'Document <title>, set by your app/router.' },
  },
  {
    sc: '2.4.3',
    name: 'Focus Order',
    level: 'A',
    support: 'supports',
    evidence: [],
    note: {
      included:
        'Focus order is logical, and the mobile Sidebar sheet is now a Radix Dialog — focus moves into it on open, is trapped while open, and restores to the trigger on close.',
    },
  },
  {
    sc: '2.4.4',
    name: 'Link Purpose (In Context)',
    level: 'A',
    support: 'enables',
    evidence: [],
    note: { included: 'Link renders a real anchor.', yours: 'The link text.' },
  },
  {
    sc: '2.4.5',
    name: 'Multiple Ways',
    level: 'AA',
    support: 'consumer',
    evidence: [],
    note: { yours: 'Site navigation strategy is app-level.' },
  },
  {
    sc: '2.4.6',
    name: 'Headings & Labels',
    level: 'AA',
    support: 'enables',
    evidence: [],
    note: {
      included: 'Heading + Label components provide the structure.',
      yours: 'The descriptive text.',
    },
  },
  {
    sc: '2.4.7',
    name: 'Focus Visible',
    level: 'AA',
    support: 'supports',
    evidence: [],
    note: {
      included:
        'The focus ring shows only for keyboard users, from one shared style; its offset adapts to the control — hugging an input, floating outside a button, inset on a table row. TimeField uses plain focus — minor.',
    },
  },
  {
    sc: '2.4.11',
    name: 'Focus Not Obscured (Minimum)',
    level: 'AA',
    support: 'enables',
    evidence: [],
    note: {
      included:
        'New in 2.2. Most components never obscure focus. Where Move owns the scroll container behind a sticky header — Calendar month & agenda views, the Select/Autocomplete listboxes — it sets scroll-padding so a focused item scrolls clear of the header.',
      yours:
        'When you enable a component sticky header (Table data-sticky-header, a height-constrained editor toolbar) inside a page or region YOU scroll, set scroll-padding-block-start on that scroll container to the header height so a tabbed-to element clears it.',
    },
  },
  {
    sc: '2.4.12',
    name: 'Focus Not Obscured (Enhanced)',
    level: 'AAA',
    support: 'enables',
    evidence: [],
    note: {
      included:
        'Same mechanism as 2.4.11 — where Move owns the scroll container, scroll-padding is sized to the full sticky header, so no part of a focused element is hidden (the enhanced bar).',
      yours:
        'Set scroll-padding on your own scroll region for any component sticky header you place in a page you scroll.',
    },
  },
  {
    sc: '2.4.13',
    name: 'Focus Appearance',
    level: 'AAA',
    support: 'supports',
    evidence: [],
    note: {
      included:
        'One 2px ring that fully encloses the control, held to at least 3:1 against the surface (5–6:1 in practice) — clearing WCAG’s minimum-area and contrast bars. Inside scroll areas it’s drawn inset so it can’t be clipped. Keyboard-highlighted options in menus and lists carry their own enclosing ring — inset on plain rows, outside the fill on the selected row — so the highlight itself clears 3:1, not just its soft background.',
    },
  },
  {
    sc: '2.5.1',
    name: 'Pointer Gestures',
    level: 'A',
    support: 'supports',
    evidence: [],
    note: {
      included: 'All interactions are single-pointer; no path or multipoint gestures required.',
    },
  },
  {
    sc: '2.5.2',
    name: 'Pointer Cancellation',
    level: 'A',
    support: 'supports',
    evidence: [],
    note: {
      included:
        'Radix widgets act on up-events; ColorPicker drags commit on pointer-up, and Escape mid-drag aborts and reverts to the pre-drag colour.',
    },
  },
  {
    sc: '2.5.3',
    name: 'Label in Name',
    level: 'A',
    support: 'supports',
    evidence: ['a11y-sweep', 'aria-label-name'],
    note: {
      included:
        'Icon buttons name from labels; Checkbox/Radio visible text is the accessible name via aria-labelledby.',
    },
  },
  {
    sc: '2.5.4',
    name: 'Motion Actuation',
    level: 'A',
    support: 'na',
    evidence: [],
    note: { included: 'No device-motion actuation.' },
  },
  {
    sc: '2.5.5',
    name: 'Target Size (Enhanced)',
    level: 'AAA',
    support: 'enables',
    evidence: [],
    note: {
      included:
        'The default (md) meets the AA 24px target; size="lg" controls are exactly 44px (--move-control-height-lg) — the enhanced bar.',
      yours:
        'Opt into size="lg" where 44px matters (touch-first UIs). Forcing 44px everywhere would bloat dense layouts, so it is not the default; the smallest handles (ColorPicker sliders) stay below 44px even at lg.',
    },
  },
  {
    sc: '2.5.6',
    name: 'Concurrent Input Mechanisms',
    level: 'AAA',
    support: 'supports',
    evidence: [],
    note: {
      included:
        'No component restricts input to one modality — pointer, keyboard, and touch all work.',
    },
  },
  {
    sc: '2.5.7',
    name: 'Dragging Movements',
    level: 'AA',
    support: 'supports',
    evidence: [],
    note: {
      included:
        'New in 2.2. Every draggable (Slider, ColorPicker, Carousel, Splitter, Drawer) has a tap/keyboard/button alternative.',
    },
  },
  {
    sc: '2.5.8',
    name: 'Target Size (Minimum)',
    level: 'AA',
    support: 'supports',
    evidence: ['a11y-sweep', 'control-size'],
    note: {
      included:
        'Interactive controls meet the 24px minimum. Controls at size sm sit at the 32px control height; Checkbox/Radio expose the whole label row as the target, not just the box. Compact icon buttons (Alert/Toast close) and slider handles (ColorPicker hue/opacity, InputRange thumb) keep a small visual but carry an expanded hit region to 24px. NumberInput steppers rely on full-size text entry, and ColorPicker on its channel inputs — a WCAG 2.5.8 equivalent-control.',
    },
  },
];

const UNDERSTANDABLE: Criterion[] = [
  {
    sc: '3.1.1',
    name: 'Language of Page',
    level: 'A',
    support: 'consumer',
    evidence: [],
    note: { yours: '<html lang>, set by your app.' },
  },
  {
    sc: '3.1.2',
    name: 'Language of Parts',
    level: 'AA',
    support: 'consumer',
    evidence: [],
    note: { yours: 'Marking foreign-language content is content-level.' },
  },
  {
    sc: '3.2.1',
    name: 'On Focus',
    level: 'A',
    support: 'supports',
    evidence: [],
    note: { included: 'No component changes context on focus.' },
  },
  {
    sc: '3.2.2',
    name: 'On Input',
    level: 'A',
    support: 'supports',
    evidence: [],
    note: { included: 'No component auto-submits or changes context on input.' },
  },
  {
    sc: '3.2.3',
    name: 'Consistent Navigation',
    level: 'AA',
    support: 'consumer',
    evidence: [],
    note: { yours: 'Navigation consistency is an app concern.' },
  },
  {
    sc: '3.2.4',
    name: 'Consistent Identification',
    level: 'AA',
    support: 'supports',
    evidence: [],
    note: { included: 'A given component is identified consistently across the library.' },
  },
  {
    sc: '3.2.5',
    name: 'Change on Request',
    level: 'AAA',
    support: 'supports',
    evidence: ['a11y-sweep'],
    note: {
      included:
        'No component initiates a context change on its own — navigation and submission happen only on explicit action.',
    },
  },
  {
    sc: '3.2.6',
    name: 'Consistent Help',
    level: 'A',
    support: 'consumer',
    evidence: [],
    note: { yours: 'New in 2.2. A repeated help mechanism is app-level.' },
  },
  {
    sc: '3.3.1',
    name: 'Error Identification',
    level: 'A',
    support: 'enables',
    evidence: [],
    note: {
      included:
        'aria-invalid on the control, plus the message auto-linked via aria-describedby and announced (role=alert).',
      yours: 'Set invalid and supply the message text.',
    },
  },
  {
    sc: '3.3.2',
    name: 'Labels or Instructions',
    level: 'A',
    support: 'supports',
    evidence: ['a11y-sweep'],
    note: {
      included:
        'Label associates via htmlFor (a real <label>); required reaches the control natively or via aria-required (incl. Checkbox). The asterisk is decorative (aria-hidden) — requiredness is programmatic.',
    },
  },
  {
    sc: '3.3.3',
    name: 'Error Suggestion',
    level: 'AA',
    support: 'enables',
    evidence: [],
    note: {
      included:
        'FormField.Description error is auto-associated (aria-describedby) and announced, so suggestion text reaches the user.',
      yours: 'Write the wording of the suggestion.',
    },
  },
  {
    sc: '3.3.4',
    name: 'Error Prevention',
    level: 'AA',
    support: 'consumer',
    evidence: [],
    note: { yours: 'Confirm/undo for legal/financial submissions is app-flow.' },
  },
  {
    sc: '3.3.7',
    name: 'Redundant Entry',
    level: 'A',
    support: 'supports',
    evidence: [],
    note: {
      included: 'New in 2.2. Native inputs support autofill; PinInput enables OTP auto-entry.',
    },
  },
  {
    sc: '3.3.8',
    name: 'Accessible Authentication',
    level: 'AA',
    support: 'supports',
    evidence: [],
    note: {
      included:
        'New in 2.2. No cognitive-test/CAPTCHA components; auth fields support autofill and one-time-code.',
    },
  },
  {
    sc: '3.3.9',
    name: 'Accessible Authentication (Enhanced)',
    level: 'AAA',
    support: 'supports',
    evidence: [],
    note: {
      included:
        'No cognitive-function test anywhere; auth fields support autofill and one-time-code.',
      yours: 'Don’t add a CAPTCHA or puzzle.',
    },
  },
];

const ROBUST: Criterion[] = [
  {
    sc: '4.1.2',
    name: 'Name, Role, Value',
    level: 'A',
    support: 'supports',
    evidence: ['a11y-sweep', 'combobox-name'],
    note: {
      included:
        'Radix supplies roles/states; names and aria-invalid are exposed across controls. Select is now built on Radix Select — a combobox trigger over a listbox of options — and renders a hidden native <select> when given a name, so its value is a real submittable named form control.',
    },
  },
  {
    sc: '4.1.3',
    name: 'Status Messages',
    level: 'AA',
    support: 'supports',
    evidence: [],
    note: {
      included:
        'Toast, Alert, Loader, Skeleton, Autocomplete, PasswordStrength announce correctly; FormField error messages announce via role=alert. ProgressBar exposes role=progressbar with aria-valuenow when determinate, and aria-busy when indeterminate.',
    },
  },
];

export const GROUPS: { key: string; title: string; lede: string; rows: Criterion[] }[] = [
  {
    key: 'perceivable',
    title: '1. Perceivable',
    lede: 'Information and UI must be presentable in ways users can perceive.',
    rows: PERCEIVABLE,
  },
  {
    key: 'operable',
    title: '2. Operable',
    lede: 'Interface components and navigation must be operable.',
    rows: OPERABLE,
  },
  {
    key: 'understandable',
    title: '3. Understandable',
    lede: 'Information and operation must be understandable.',
    rows: UNDERSTANDABLE,
  },
  {
    key: 'robust',
    title: '4. Robust',
    lede: 'Content must be robust enough for assistive technologies.',
    rows: ROBUST,
  },
];

export const TOTAL_CRITERIA = GROUPS.reduce((n, g) => n + g.rows.length, 0);
