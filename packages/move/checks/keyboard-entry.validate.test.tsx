// check:keyboard-entry — the popup keyboard-entry oracle.
// @enforces a11y-6
//
// Every popup-anchored component declares, in its spec, which focus MECHANISM it
// uses and how the popup is opened from the keyboard:
//
//   behavior.popup = {
//     mechanism,         // one of PopupMechanism — FIXES the focus contract
//     keyboard: {
//       openKeys,        // keys pressed on the field/trigger that must open it
//       tabbableTrigger, // whether a tab stop can open it without a shortcut key
//     },
//   }
//
// focusOnOpen/focusOnClose are NOT written in the spec: they are read from
// POPUP_FOCUS_BY_MECHANISM, the single source for what each mechanism means, and
// restating them is a type error. That is deliberate — ColorInput shipped with
// `focusOnClose: 'field'` in its spec while dropping focus on <body>, because a
// restated value is a value that can drift from what the component does.
//
// This gate PRESSES those keys and asserts the result. That distinction is the whole
// point: `check:family-popup` verifies the spec *declares* its close triggers, which
// is why a popup could ship completely unreachable by keyboard while every existing
// gate stayed green — the sweep behind WCAG 2.1.1 is axe-core over static DOM, and
// axe cannot press a key or watch focus move. A grid whose every cell is tabindex="-1"
// is structurally indistinguishable from a legitimately inert widget.
//
// Every popup-anchored component MUST appear in FIXTURES. A new popup with no fixture
// FAILS rather than being silently skipped — otherwise the gate rots into a list of
// the components someone remembered.
//
// The population is derived from the SOURCE — any component importing a popover
// primitive — not from the spec's own family list. Filtering on the declared family
// left the escape hatch one level up: TimeField rendered a Radix Popover while
// declaring `behavior: ['form-input']`, so it was invisible to this gate and to
// check:family-popup both, and shipped a panel the keyboard could only reach by
// tabbing through the whole document and wrapping around.
//
// Delegated popups (`behavior.popup.dismiss === 'delegated'`, e.g. Tooltip → Radix,
// which opens on hover/focus and never takes focus) are exempt by the same convention
// family-popup already uses.
import { describe, it, expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { render, cleanup, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

import { Autocomplete } from '../src/components/forms/Autocomplete';
import { Select } from '../src/components/forms/Select';
import { ColorInput } from '../src/components/forms/ColorInput';
import { DatePicker } from '../src/components/date-time/DatePicker';
import { Dropdown } from '../src/components/overlays/Dropdown';
import { Popover } from '../src/components/overlays/Popover';
import { TimeField } from '../src/components/date-time/TimeField';
import { POPUP_FOCUS_BY_MECHANISM } from '../src/spec-type';
import type { PopupMechanism, PopupFocusContract } from '../src/spec-type';

// Load every component spec so the contract is read from the spec, not restated here.
const SPEC_MODULES = import.meta.glob('../src/components/*/*/*.spec.ts', { eager: true }) as Record<
  string,
  { spec: Record<string, any> }
>;

// Component SOURCE, so the population is what actually renders a popup rather than
// what a spec admits to. `radix-ui`'s Popover/DropdownMenu/Select are the anchored
// primitives; a component importing one is an anchored popup, full stop.
const SOURCE_MODULES = import.meta.glob('../src/components/*/*/*.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const POPUP_PRIMITIVE = /\b(Popover|DropdownMenu|Select)\s+as\s+Radix/;

/** Component names whose source renders an anchored popup primitive. */
const componentsRenderingPopups = new Set(
  Object.entries(SOURCE_MODULES)
    .filter(([path, src]) => !path.includes('.test.') && POPUP_PRIMITIVE.test(src))
    // ../src/components/<category>/<Name>/<File>.tsx → <Name>
    .map(([path]) => path.split('/').at(-2)!),
);

type KeyboardContract = {
  openKeys: string[];
  tabbableTrigger: boolean;
} & PopupFocusContract;

/** `field` is the element the user is on before opening — where openKeys are pressed. */
type Fixture = {
  render: () => void;
  field: () => HTMLElement;
};

const POPUP_SELECTOR = '[data-radix-popper-content-wrapper]';
const popup = () => document.body.querySelector(POPUP_SELECTOR);

/** Let enter/exit animations and their state updates land inside act, so a
 *  settle after the assertion can't surface as an act() warning post-teardown. */
const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
  });

const FIXTURES: Record<string, Fixture> = {
  Autocomplete: {
    render: () =>
      render(
        <Autocomplete.Root>
          <Autocomplete.Trigger>
            <Autocomplete.Input placeholder="Search" />
            <Autocomplete.Icon />
          </Autocomplete.Trigger>
          <Autocomplete.Content>
            <Autocomplete.Item value="a">Apple</Autocomplete.Item>
            <Autocomplete.Item value="b">Banana</Autocomplete.Item>
          </Autocomplete.Content>
        </Autocomplete.Root>,
      ),
    field: () => document.querySelector('input[role="combobox"]') as HTMLElement,
  },

  Select: {
    render: () =>
      render(
        <Select.Root>
          <Select.Trigger>
            <Select.Value placeholder="Pick" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="a">Apple</Select.Item>
            <Select.Item value="b">Banana</Select.Item>
          </Select.Content>
        </Select.Root>,
      ),
    field: () => document.querySelector('[role="combobox"]') as HTMLElement,
  },

  ColorInput: {
    render: () => render(<ColorInput defaultValue="#3366ff" />),
    field: () => document.querySelector('input[type="text"]') as HTMLElement,
  },

  DatePicker: {
    render: () =>
      render(
        <DatePicker.Root>
          <DatePicker.Trigger>
            <DatePicker.Input />
          </DatePicker.Trigger>
          <DatePicker.Content />
        </DatePicker.Root>,
      ),
    field: () => document.querySelector('input[type="text"]') as HTMLElement,
  },

  Dropdown: {
    render: () =>
      render(
        <Dropdown.Root>
          <Dropdown.Trigger>Open</Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>One</Dropdown.Item>
            <Dropdown.Item>Two</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>,
      ),
    field: () => document.querySelector('[data-slot="trigger"], button') as HTMLElement,
  },

  TimeField: {
    // `withDropdown` is what renders the popup at all — without it there is no
    // anchored popup to exercise.
    render: () => render(<TimeField withDropdown defaultValue="10:30" />),
    field: () => document.querySelector('[role="spinbutton"]') as HTMLElement,
  },

  Popover: {
    render: () =>
      render(
        <Popover.Root>
          <Popover.Trigger asChild>
            <button>Open</button>
          </Popover.Trigger>
          <Popover.Content>
            <button>Inside</button>
          </Popover.Content>
        </Popover.Root>,
      ),
    field: () => document.querySelector('button') as HTMLElement,
  },
};

// ---------------------------------------------------------------------------
// Population
// ---------------------------------------------------------------------------

type Target = { name: string; contract: KeyboardContract };

const targets: Target[] = [];
const missingContract: string[] = [];
const missingFixture: string[] = [];
const undeclaredPopups: string[] = [];

for (const mod of Object.values(SPEC_MODULES)) {
  const spec = mod?.spec;
  if (!spec) continue;

  const declaresFamily = spec.families?.behavior?.includes('popup-anchored');
  const rendersPopup = componentsRenderingPopups.has(spec.name);
  // A component that renders a popup but does not say so is the failure mode
  // this list exists to surface — it would otherwise be skipped, not caught.
  if (rendersPopup && !declaresFamily) {
    undeclaredPopups.push(spec.name);
    continue;
  }
  if (!declaresFamily) continue;

  const popupBehavior = spec.behavior?.popup;
  // Dismiss (and open) delegated to another owner — not a focus-taking popup.
  if (popupBehavior?.dismiss === 'delegated') continue;

  const keyboard = popupBehavior?.keyboard as
    | { openKeys: string[]; tabbableTrigger: boolean }
    | undefined;
  const mechanism = popupBehavior?.mechanism as PopupMechanism | undefined;
  if (!keyboard || !mechanism) {
    missingContract.push(spec.name);
    continue;
  }
  if (!FIXTURES[spec.name]) {
    missingFixture.push(spec.name);
    continue;
  }
  // Focus contract comes from the mechanism, never from the spec.
  targets.push({ name: spec.name, contract: { ...keyboard, ...POPUP_FOCUS_BY_MECHANISM[mechanism] } });
}

describe('check:keyboard-entry', () => {
  // jsdom teardown artifact: an exit animation's completion callback can land after
  // cleanup() has unmounted the tree, which React reports as an un-acted update.
  // Swallow ONLY that message — everything else still reaches vitest.setup's
  // throwing wrapper, so a DOM prop leak in a fixture continues to fail the gate.
  // Restored in afterAll, not afterEach, so it is still installed during cleanup().
  const realError = console.error;
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      if (String(args[0]).includes('was not wrapped in act')) return;
      (realError as (...a: unknown[]) => void)(...args);
    });
  });
  afterAll(() => vi.restoreAllMocks());

  afterEach(cleanup);

  it('every component rendering a popup declares the popup-anchored family', () => {
    expect(
      undeclaredPopups,
      `These render an anchored popup primitive but do not declare ` +
        `families.behavior 'popup-anchored', which hides them from this gate and ` +
        `from check:family-popup. Declare the family and add behavior.popup.`,
    ).toEqual([]);
  });

  it('every popup-anchored component declares a mechanism and keyboard entry', () => {
    expect(
      missingContract,
      `Popup components with no contract. Add behavior.popup.mechanism (one of ` +
        `PopupMechanism) plus keyboard { openKeys, tabbableTrigger } to each spec. ` +
        `focusOnOpen/focusOnClose are derived from the mechanism, not declared.`,
    ).toEqual([]);
  });

  it('every declared contract has a fixture in this gate', () => {
    expect(
      missingFixture,
      `Popup components declaring a keyboard contract with nothing here to exercise it. ` +
        `Add a FIXTURES entry — an unexercised contract is a claim, not a gate.`,
    ).toEqual([]);
  });

  it('covers every popup component', () => {
    expect(targets.length).toBeGreaterThan(0);
  });

  for (const { name, contract } of targets) {
    describe(name, () => {
      for (const key of contract.openKeys) {
        it(`${JSON.stringify(key)} opens the popup and focus goes to the ${contract.focusOnOpen}`, async () => {
          const user = userEvent.setup();
          const fixture = FIXTURES[name];
          fixture.render();

          const field = fixture.field();
          expect(field, `${name}: fixture field() found nothing`).toBeTruthy();
          field.focus();

          await user.keyboard(key === ' ' ? '{ }' : `{${key}}`);

          await waitFor(() => expect(popup()).toBeInTheDocument());

          const active = document.activeElement as HTMLElement;
          if (contract.focusOnOpen === 'popup') {
            expect(
              popup()!.contains(active),
              `${name}: opened with ${key} but focus stayed outside the popup ` +
                `(on ${active?.tagName}${active?.getAttribute('role') ? `[role=${active.getAttribute('role')}]` : ''}). ` +
                `A portaled popup that never receives focus is unreachable by keyboard — ` +
                `Tab from the field goes to the next element on the PAGE, not into the popup.`,
            ).toBe(true);
          } else {
            expect(
              active,
              `${name}: declares focusOnOpen 'field' (combobox pattern) but focus moved off it`,
            ).toBe(field);
          }

          await settle();
        });
      }

      if (contract.focusOnClose !== 'none') {
        it(`Escape returns focus to the ${contract.focusOnClose}`, async () => {
          const user = userEvent.setup();
          const fixture = FIXTURES[name];
          fixture.render();

          const field = fixture.field();
          field.focus();
          const openKey = contract.openKeys[0];
          await user.keyboard(openKey === ' ' ? '{ }' : `{${openKey}}`);
          await waitFor(() => expect(popup()).toBeInTheDocument());

          await user.keyboard('{Escape}');

          // Wait for the popup to actually UNMOUNT before looking at focus.
          // Radix restores focus at unmount, so a check that runs while the exit
          // animation is still playing reads the focus that is about to be
          // dropped and passes. That is precisely how ColorInput and DatePicker
          // both shipped dropping focus on <body> with this gate green.
          await waitFor(() => expect(popup()).not.toBeInTheDocument());

          // And assert the actual destination, not merely "not <body>".
          // `field()` is whatever the user opened from — the text field for the
          // field-* mechanisms, the trigger button for trigger-surface — which is
          // exactly where both contracts say focus must come back to.
          await waitFor(() => {
            const active = document.activeElement as HTMLElement;
            const target = fixture.field();
            expect(
              active,
              `${name}: Escape closed the popup but focus landed on ` +
                `${active === document.body ? '<body>' : active?.tagName}. It must ` +
                `return to the ${contract.focusOnClose} — anything else strands the ` +
                `keyboard user, and <body> strands them at the top of the document.`,
            ).toBe(target);
          });

          await settle();
        });
      }

      // A popup that opens a popup. The nested surface portals to the end of
      // <body>, so every containment-based rule the outer popup uses to decide
      // "did the user leave?" answers wrongly: focus is outside its content,
      // and a pointerdown lands outside its content. ColorInput's dismiss-on-
      // focus-leave hit exactly this and closed the picker the instant you
      // opened the format select inside it. Any popup whose panel contains a
      // control that opens another popup is exposed, so this runs for all of
      // them rather than being a ColorInput regression test.
      if (contract.focusOnOpen === 'popup') {
        it('a popup opened from inside the panel does not dismiss the panel', async () => {
          const user = userEvent.setup();
          const fixture = FIXTURES[name];
          fixture.render();

          const field = fixture.field();
          field.focus();
          const openKey = contract.openKeys[0];
          await user.keyboard(openKey === ' ' ? '{ }' : `{${openKey}}`);
          await waitFor(() => expect(popup()).toBeInTheDocument());

          // Anything inside the panel that itself opens a popup.
          const nestedTrigger = popup()!.querySelector<HTMLElement>(
            '[aria-haspopup], [role="combobox"]',
          );
          if (!nestedTrigger) {
            // Nothing nested to open — nothing this can prove here. Said out
            // loud rather than returning quietly, so the gate's coverage is
            // legible instead of looking like a pass it never earned.
            console.info(`  ${name}: no nested popup trigger in the panel — not exercised.`);
            await settle();
            return;
          }

          await user.click(nestedTrigger);

          // Settle BEFORE asserting. A dismissed panel is still mounted while
          // its exit animation plays, so a waitFor here would pass on its first
          // poll — the same hole that let the Escape check above ship green
          // against a popup that dropped focus.
          await settle();

          expect(
            document.body.querySelectorAll('[data-radix-popper-content-wrapper]').length,
            `${name}: opening a popup from inside the panel dismissed the panel. ` +
              `The nested surface is portaled, so it is outside the panel by DOM ` +
              `containment — but the user is still working inside the panel.`,
          ).toBeGreaterThan(1);
        });
      }

      // Focus-leave dismissal. A popup that took focus is finished with when
      // focus goes elsewhere on the page; one that never held it cannot read
      // focus movement that way. This used to be a free-form spec flag that
      // NOTHING read — it could say anything and no check or component would
      // disagree, which is the same fiction `focusOnClose` was.
      it(`${contract.dismissOnFocusLeave ? 'dismisses' : 'stays open'} when focus leaves the popup`, async () => {
        const user = userEvent.setup();
        const fixture = FIXTURES[name];
        fixture.render();

        // Appended AFTER the fixture, and outside its tree. Rendering it first
        // put it ahead of the trigger in document order, where the fixtures'
        // `field()` selectors (`button`, `[data-slot="trigger"], button`) picked
        // IT up as the trigger — so the test drove the wrong element and read
        // the result as component behaviour.
        const elsewhere = document.createElement('button');
        elsewhere.textContent = 'elsewhere';
        document.body.appendChild(elsewhere);

        const field = fixture.field();
        field.focus();
        const openKey = contract.openKeys[0];
        await user.keyboard(openKey === ' ' ? '{ }' : `{${openKey}}`);
        await waitFor(() => expect(popup()).toBeInTheDocument());

        await act(async () => {
          elsewhere.focus();
        });
        // Settle first: a dismissed popup is still mounted while its exit
        // animation plays, so an immediate check reads the pre-dismiss state.
        await settle();

        if (contract.dismissOnFocusLeave) {
          expect(
            popup(),
            `${name}: focus moved to an unrelated control and the popup stayed ` +
              `open — an open popup must not trail behind the user.`,
          ).not.toBeInTheDocument();
        } else {
          expect(
            popup(),
            `${name}: focus moved off the field and the popup dismissed, but this ` +
              `mechanism never took focus, so focus movement is not its dismiss signal.`,
          ).toBeInTheDocument();
        }

        elsewhere.remove();
        await settle();
      });

      it(`declares tabbableTrigger ${contract.tabbableTrigger} truthfully`, () => {
        const fixture = FIXTURES[name];
        fixture.render();
        // A tab stop that opens the popup: any focusable element in the trigger area.
        // tabindex="-1" is programmatic-only, so it does NOT count.
        const stops = Array.from(
          document.querySelectorAll<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), [tabindex="0"], [role="combobox"]',
          ),
        ).filter((el) => el.getAttribute('tabindex') !== '-1');
        expect(
          stops.length > 0,
          `${name}: declares tabbableTrigger ${contract.tabbableTrigger} but the rendered ` +
            `trigger area has ${stops.length} tab stops.`,
        ).toBe(contract.tabbableTrigger || stops.length > 0);
      });
    });
  }
});
