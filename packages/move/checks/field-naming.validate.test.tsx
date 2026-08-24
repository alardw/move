// check:field-naming — the FormField naming oracle.
// @enforces a11y-7
//
// A form control inside a <FormField> is named by its <FormField.Label>. HOW that
// happens depends on what the control is built from, and the two mechanisms are
// not interchangeable:
//
//   labelable — the control renders ONE labelable element (input, textarea,
//               select, button). `useFieldControl` marks it, it takes the field
//               id, and the Label's `for` points at it.
//   group     — the control has no labelable element: a radio group is a div
//               wrapping inputs, a time field is a row of spinbutton segments,
//               a slider is role="slider" thumbs, a date range is two inputs
//               that already carry their own names. `useFieldGroup` marks the
//               element carrying the widget role, which points aria-labelledby
//               at the Label, and the Label drops its `for`.
//
// Picking the wrong one fails SILENTLY, which is why this gate renders instead of
// reading source. Every failure below shipped and none of them tripped a gate:
//
//   - RadioGroup used the labelable path, so `<label for>` pointed at a
//     div[role=radiogroup]. A <label> can only name a labelable element, so it
//     named nothing at all — while the markup looked completely correct.
//   - PinInput read the context's invalid/describedBy but never its id, so the
//     `for` dangled; its own aria-label then outranked the Label and the field
//     announced "PIN input" instead of what the page said.
//   - Autocomplete and TimeField read no FormField context whatsoever.
//   - NumberInput restated `id={props.id}` BELOW the spread that carried the
//     field id, overwriting it with undefined.
//   - DatePicker in range mode gave the same id to both of its inputs.
//
// axe cannot catch these: it flags a control with no name, but a control named
// by the WRONG mechanism, or by its own fallback aria-label, has a name. The
// docs a11y sweep sat green through every one.
//
// Population is DERIVED from the specs — families.behavior 'form-input' — and
// every such component MUST appear in FIXTURES. A new form control with no
// fixture FAILS rather than being skipped, or this rots into a list of the
// components someone remembered. Exemptions are declared, not absent, so a
// control that opts out has to say why in a place a reader will find it.
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import * as React from 'react';

import { FormField } from '../src/components/forms/FormField';
import { Label } from '../src/components/forms/Label';
import { InputText } from '../src/components/forms/InputText';
import { NumberInput } from '../src/components/forms/NumberInput';
import { Textarea } from '../src/components/forms/Textarea';
import { Password } from '../src/components/forms/Password';
import { ColorInput } from '../src/components/forms/ColorInput';
import { ColorPicker } from '../src/components/forms/ColorPicker';
import { PinInput } from '../src/components/forms/PinInput';
import { Checkbox } from '../src/components/forms/Checkbox';
import { Switch } from '../src/components/forms/Switch';
import { RadioGroup } from '../src/components/forms/RadioGroup';
import { InputRange } from '../src/components/forms/InputRange';
import { FileUpload } from '../src/components/forms/FileUpload';
import { RichTextEditor } from '../src/components/forms/RichTextEditor';
import { TimeField } from '../src/components/date-time/TimeField';
import { Select } from '../src/components/forms/Select';
import { Autocomplete } from '../src/components/forms/Autocomplete';
import { DatePicker } from '../src/components/date-time/DatePicker';
import { Calendar } from '../src/components/date-time/Calendar';
import { ToggleButton } from '../src/components/actions/ToggleButton';
import { ToggleGroup } from '../src/components/actions/ToggleGroup';

const SPEC_MODULES = import.meta.glob('../src/components/*/*/*.spec.ts', { eager: true }) as Record<
  string,
  { spec: Record<string, any> }
>;

// Population comes from the SOURCE, because the spec family is an escape hatch:
// Select, Autocomplete and DatePicker are all real fields that declare only
// 'popup-anchored', so a spec-only population would have skipped the three
// components with the most inner elements to get wrong. Calling either field
// hook IS the claim "a FormField names me", so that is the population.
const SOURCE_MODULES = import.meta.glob('../src/components/*/*/*.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const FIELD_HOOK = /\buseField(Control|Group)\s*\(/;

const componentsUsingFieldHooks = new Set(
  Object.entries(SOURCE_MODULES)
    .filter(([path, src]) => !path.includes('.test.') && FIELD_HOOK.test(src))
    // ../src/components/<category>/<Name>/<File>.tsx → <Name>
    .map(([path]) => path.split('/').at(-2)!),
);

/** Elements a `<label for>` can legally name. Anything else and the `for` is inert. */
const LABELABLE = new Set(['input', 'textarea', 'select', 'button', 'meter', 'output', 'progress']);

type Case = { mechanism: 'labelable' | 'group'; render: () => void };
/** `cases` is for a control whose MODE changes the mechanism — a date range is a
 *  group of two named inputs where a single date is one labelable input. */
type Expectation = Case | { cases: Record<string, Case> } | { exempt: string };

const FIXTURES: Record<string, Expectation> = {
  InputText: { mechanism: 'labelable', render: () => render(field(<InputText />)) },
  NumberInput: { mechanism: 'labelable', render: () => render(field(<NumberInput />)) },
  Textarea: { mechanism: 'labelable', render: () => render(field(<Textarea />)) },
  Password: { mechanism: 'labelable', render: () => render(field(<Password />)) },
  ColorInput: {
    mechanism: 'labelable',
    render: () => render(field(<ColorInput defaultValue="#4c6ef5" />)),
  },
  PinInput: { mechanism: 'labelable', render: () => render(field(<PinInput length={4} />)) },
  Checkbox: { mechanism: 'labelable', render: () => render(field(<Checkbox />)) },
  Switch: {
    mechanism: 'labelable',
    render: () =>
      render(
        field(
          <Switch.Root>
            <Switch.Thumb />
          </Switch.Root>,
        ),
      ),
  },
  RadioGroup: {
    mechanism: 'group',
    render: () =>
      render(
        field(
          <RadioGroup.Root>
            <RadioGroup.Item value="a">A</RadioGroup.Item>
          </RadioGroup.Root>,
        ),
      ),
  },
  InputRange: { mechanism: 'group', render: () => render(field(<InputRange defaultValue={40} />)) },
  Select: {
    mechanism: 'labelable',
    render: () =>
      render(
        field(
          <Select.Root>
            <Select.Trigger>
              <Select.Value placeholder="Pick" />
            </Select.Trigger>
          </Select.Root>,
        ),
      ),
  },
  Autocomplete: {
    mechanism: 'labelable',
    render: () =>
      render(
        field(
          <Autocomplete.Root>
            <Autocomplete.Trigger>
              <Autocomplete.Input />
            </Autocomplete.Trigger>
          </Autocomplete.Root>,
        ),
      ),
  },
  DatePicker: {
    cases: {
      single: {
        mechanism: 'labelable',
        render: () =>
          render(
            field(
              <DatePicker.Root mode="single">
                <DatePicker.Trigger>
                  <DatePicker.Input />
                </DatePicker.Trigger>
              </DatePicker.Root>,
            ),
          ),
      },
      // One field holding BOTH kinds at once: the InputText is labelable and the
      // inline TimeField is a group. The group must not strip the `for` that
      // names the input — it did, and the input fell back to its title.
      'single with inline time': {
        mechanism: 'labelable',
        render: () =>
          render(
            field(
              <DatePicker.Root mode="single" showTime>
                <DatePicker.Trigger>
                  <DatePicker.Input />
                </DatePicker.Trigger>
              </DatePicker.Root>,
            ),
          ),
      },
      range: {
        mechanism: 'group',
        render: () =>
          render(
            field(
              <DatePicker.Root mode="range">
                <DatePicker.Trigger>
                  <DatePicker.Input />
                </DatePicker.Trigger>
              </DatePicker.Root>,
            ),
          ),
      },
    },
  },
  TimeField: {
    mechanism: 'group',
    render: () => render(field(<TimeField defaultValue="09:30" />)),
  },

  // Declared exemptions — each opts out for a reason that is a property of the
  // component, not an oversight. They stay listed so removing the reason means
  // removing the entry, rather than the component quietly never being checked.
  RichTextEditor: {
    exempt:
      'Renders toolbar chrome and a content wrapper with no contenteditable and no ' +
      'textbox role — the consumer supplies the editable region, so there is nothing ' +
      'here for a name to attach to. Naming is the consumer’s, on their element.',
  },
  FileUpload: {
    exempt:
      'The file input is a hidden sibling of a dropzone driven by its own Trigger ' +
      'button, which carries visible text. A FormField label naming the hidden input ' +
      'would name the element the user never interacts with.',
  },
  ColorPicker: {
    exempt:
      'Chromeless panel meant to live inside ColorInput’s popover, which is the ' +
      'field. Used standalone it is a composite of sliders and swatches with no field ' +
      'identity of its own.',
  },
  Calendar: {
    exempt:
      'A date grid, not a field — it names itself through its grid caption. DatePicker ' +
      'is the field wrapping it, and is covered by its own entries below.',
  },
  ToggleButton: {
    exempt:
      'A button named by its own children. It declares form-input for the pressed-state ' +
      'contract, not because it is a labelled field.',
  },
  ToggleGroup: {
    exempt: 'A toolbar of ToggleButtons, each named by its children; no single field.',
  },
  FormField: { exempt: 'The wrapper itself, not a control.' },
};

/** The tree every fixture is measured in: a Label and the control, nothing else. */
function field(control: React.ReactNode) {
  return (
    <FormField.Root>
      <FormField.Label>
        <Label>Field name</Label>
      </FormField.Label>
      <FormField.Field>{control}</FormField.Field>
    </FormField.Root>
  );
}

const declaredFormInputs = Object.values(SPEC_MODULES)
  .map((m) => m?.spec)
  .filter((s) => s?.families?.behavior?.includes('form-input'))
  .map((s) => s.name as string);

const population = [...new Set([...declaredFormInputs, ...componentsUsingFieldHooks])].sort();
const missingFixture = population.filter((n) => !FIXTURES[n]);

/** Flattened to one entry per rendered case, so a mode-dependent control is
 *  exercised in each mode rather than only whichever one was written first. */
const cases: Array<{ label: string; c: Case }> = [];
for (const [name, fixture] of Object.entries(FIXTURES)) {
  if ('exempt' in fixture) continue;
  if ('cases' in fixture) {
    for (const [mode, c] of Object.entries(fixture.cases))
      cases.push({ label: `${name} (${mode})`, c });
  } else {
    cases.push({ label: name, c: fixture });
  }
}

describe('check:field-naming', () => {
  afterEach(cleanup);

  it('every component wired to FormField has a fixture here', () => {
    expect(
      missingFixture,
      `Components calling useFieldControl/useFieldGroup, or declaring ` +
        `families.behavior 'form-input', with nothing here to ` +
        `exercise them. Add a FIXTURES entry naming the mechanism the control uses ` +
        `(labelable via useFieldControl, group via useFieldGroup), or an { exempt } ` +
        `entry saying why it is not a labelled field.`,
    ).toEqual([]);
  });

  it('covers every form control', () => {
    expect(population.length).toBeGreaterThan(0);
  });

  for (const { label: caseName, c: fixture } of cases) {
    describe(caseName, () => {
      it(`is named by its FormField.Label via the ${fixture.mechanism} mechanism`, () => {
        fixture.render();
        const label = document.querySelector('label') as HTMLLabelElement | null;
        expect(label, 'FormField.Label rendered no <label>').not.toBeNull();

        const forTarget = label!.htmlFor ? document.getElementById(label!.htmlFor) : null;
        const byRef = label!.id
          ? document.querySelector(`[aria-labelledby~="${label!.id}"]`)
          : null;

        // Holds whatever the mechanism: a `for` must reach an element a <label>
        // can legally name. Pointing nowhere is the PinInput/Autocomplete shape
        // (markup that reads as wired and names nothing); pointing at a div is
        // the RadioGroup shape (inert, and indistinguishable by eye).
        if (label!.htmlFor) {
          expect(
            forTarget,
            `<label for="${label!.htmlFor}"> points at no element in the tree.`,
          ).not.toBeNull();
          expect(
            LABELABLE.has(forTarget!.tagName.toLowerCase()),
            `The label's \`for\` reaches <${forTarget!.tagName.toLowerCase()}>, which a ` +
              `<label> cannot name. Use useFieldGroup on the element carrying the ` +
              `widget role instead.`,
          ).toBe(true);
        }

        if (fixture.mechanism === 'labelable') {
          expect(
            forTarget,
            `Expected the label's \`for\` to reach the control's labelable element. ` +
              `Mark it with useFieldControl.`,
          ).not.toBeNull();
        } else {
          expect(
            byRef,
            `Expected an element referencing the label via aria-labelledby. Call ` +
              `useFieldGroup on the element that carries the widget role.`,
          ).not.toBeNull();
          expect(
            byRef!.getAttribute('role'),
            `The element pointing aria-labelledby at the label carries no role, so ` +
              `the name is announced by nothing. Put it on the element with the ` +
              `widget role (radiogroup, slider, group…), not on a bare wrapper.`,
          ).toBeTruthy();
        }
      });

      it('emits no duplicate ids', () => {
        fixture.render();
        const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
        const dupes = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
        expect(
          dupes,
          `The same id on more than one element. A control rendering several inner ` +
            `fields must derive ids from the field id rather than each claiming it.`,
        ).toEqual([]);
      });
    });
  }
});
