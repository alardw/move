import { Select, FormField, Label, Heading } from 'move';
import { Apple, Cherry, Grape, Citrus, MapPin, Plane, Globe } from 'lucide-react';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

function UsageExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Basic">
        <Select.Root>
          <Select.Trigger>
            <Select.Value placeholder="Choose a fruit" />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content sideOffset={4}>
              <Select.Item value="apple">Apple</Select.Item>
              <Select.Item value="banana">Banana</Select.Item>
              <Select.Item value="cherry">Cherry</Select.Item>
              <Select.Item value="grape">Grape</Select.Item>
              <Select.Item value="orange">Orange</Select.Item>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </DemoSample>

      <DemoSample label="Grouped items">
        <Select.Root>
          <Select.Trigger>
            <Select.Value placeholder="Select a country" />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content sideOffset={4}>
              <Select.Group>
                <Select.Label>Europe</Select.Label>
                <Select.Item value="de">Germany</Select.Item>
                <Select.Item value="fr">France</Select.Item>
                <Select.Item value="nl">Netherlands</Select.Item>
              </Select.Group>
              <Select.Separator />
              <Select.Group>
                <Select.Label>Americas</Select.Label>
                <Select.Item value="us">United States</Select.Item>
                <Select.Item value="ca">Canada</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </DemoSample>

      <DemoSample label="Many items">
        <Select.Root>
          <Select.Trigger>
            <Select.Value placeholder="Select a timezone" />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content sideOffset={4}>
              <Select.Item value="utc-12">UTC−12:00</Select.Item>
              <Select.Item value="utc-11">UTC−11:00</Select.Item>
              <Select.Item value="utc-10">UTC−10:00 (Hawaii)</Select.Item>
              <Select.Item value="utc-9">UTC−09:00 (Alaska)</Select.Item>
              <Select.Item value="utc-8">UTC−08:00 (Pacific)</Select.Item>
              <Select.Item value="utc-7">UTC−07:00 (Mountain)</Select.Item>
              <Select.Item value="utc-6">UTC−06:00 (Central)</Select.Item>
              <Select.Item value="utc-5">UTC−05:00 (Eastern)</Select.Item>
              <Select.Item value="utc-4">UTC−04:00 (Atlantic)</Select.Item>
              <Select.Item value="utc-3">UTC−03:00 (Buenos Aires)</Select.Item>
              <Select.Item value="utc-2">UTC−02:00</Select.Item>
              <Select.Item value="utc-1">UTC−01:00 (Azores)</Select.Item>
              <Select.Item value="utc+0">UTC+00:00 (London)</Select.Item>
              <Select.Item value="utc+1">UTC+01:00 (Berlin)</Select.Item>
              <Select.Item value="utc+2">UTC+02:00 (Cairo)</Select.Item>
              <Select.Item value="utc+3">UTC+03:00 (Moscow)</Select.Item>
              <Select.Item value="utc+4">UTC+04:00 (Dubai)</Select.Item>
              <Select.Item value="utc+5">UTC+05:00 (Karachi)</Select.Item>
              <Select.Item value="utc+5.5">UTC+05:30 (Mumbai)</Select.Item>
              <Select.Item value="utc+6">UTC+06:00 (Dhaka)</Select.Item>
              <Select.Item value="utc+7">UTC+07:00 (Bangkok)</Select.Item>
              <Select.Item value="utc+8">UTC+08:00 (Singapore)</Select.Item>
              <Select.Item value="utc+9">UTC+09:00 (Tokyo)</Select.Item>
              <Select.Item value="utc+10">UTC+10:00 (Sydney)</Select.Item>
              <Select.Item value="utc+11">UTC+11:00</Select.Item>
              <Select.Item value="utc+12">UTC+12:00 (Auckland)</Select.Item>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </DemoSample>

      <DemoSample label="Composable items">
        <Stack gap="lg">
          <Select.Root>
            <Select.Trigger>
              <Select.Value placeholder="Pick a fruit" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content sideOffset={4}>
                <Select.Item value="apple" label="Apple" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Apple size={14} /> Apple
                </Select.Item>
                <Select.Item value="cherry" label="Cherry" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Cherry size={14} /> Cherry
                </Select.Item>
                <Select.Item value="grape" label="Grape" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Grape size={14} /> Grape
                </Select.Item>
                <Select.Item value="orange" label="Orange" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Citrus size={14} /> Orange
                </Select.Item>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          <Select.Root>
            <Select.Trigger>
              <Select.Value placeholder="Travel destination" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content sideOffset={4}>
                <Select.Item value="paris" label="Paris" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={14} />
                  <div>
                    <div>Paris</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--move-fg-muted)' }}>City of Light</div>
                  </div>
                </Select.Item>
                <Select.Item value="tokyo" label="Tokyo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plane size={14} />
                  <div>
                    <div>Tokyo</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--move-fg-muted)' }}>Land of the Rising Sun</div>
                  </div>
                </Select.Item>
                <Select.Item value="new-york" label="New York" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Globe size={14} />
                  <div>
                    <div>New York</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--move-fg-muted)' }}>The Big Apple</div>
                  </div>
                </Select.Item>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </Stack>
      </DemoSample>

      <DemoSample label="Overflow">
        <Select.Root defaultValue="long">
          <Select.Trigger>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content sideOffset={4}>
              <Select.Item value="short">Short</Select.Item>
              <Select.Item value="long">Department of Redundancy Department — West Wing, Building 7, Floor 3</Select.Item>
              <Select.Item value="medium">Something in between</Select.Item>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </DemoSample>

      <DemoSample label="Error">
        <Select.Root>
          <Select.Trigger invalid>
            <Select.Value placeholder="Select a category" />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content sideOffset={4}>
              <Select.Item value="a">Category A</Select.Item>
              <Select.Item value="b">Category B</Select.Item>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </DemoSample>

      <DemoSample label="Disabled">
        <Stack gap="lg">
          <Select.Root defaultValue="read">
            <Select.Trigger>
              <Select.Value placeholder="Permission" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content sideOffset={4}>
                <Select.Item value="read">Read</Select.Item>
                <Select.Item value="write">Write</Select.Item>
                <Select.Item value="admin" disabled>Admin</Select.Item>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
          <Select.Root>
            <Select.Trigger disabled>
              <Select.Value placeholder="Disabled select" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content sideOffset={4}>
                <Select.Item value="a">Option A</Select.Item>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </Stack>
      </DemoSample>
    </Stack>
  );
}

function FormFieldExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Basic">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label>Fruit</Label></FormField.Label>
          <FormField.Field>
            <Select.Root>
              <Select.Trigger>
                <Select.Value placeholder="Choose a fruit" />
                <Select.Icon />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content sideOffset={4}>
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="cherry">Cherry</Select.Item>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </FormField.Field>
        </FormField.Root>
      </DemoSample>

      <DemoSample label="Description">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label>Category</Label></FormField.Label>
          <FormField.Field>
            <Select.Root>
              <Select.Trigger>
                <Select.Value placeholder="Select a category" />
                <Select.Icon />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content sideOffset={4}>
                  <Select.Item value="design">Design</Select.Item>
                  <Select.Item value="engineering">Engineering</Select.Item>
                  <Select.Item value="marketing">Marketing</Select.Item>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </FormField.Field>
          <FormField.Description>Pick the team you belong to.</FormField.Description>
        </FormField.Root>
      </DemoSample>

      <DemoSample label="Error">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label required>Category</Label></FormField.Label>
          <FormField.Field>
            <Select.Root>
              <Select.Trigger invalid>
                <Select.Value placeholder="Select a category" />
                <Select.Icon />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content sideOffset={4}>
                  <Select.Item value="design">Design</Select.Item>
                  <Select.Item value="engineering">Engineering</Select.Item>
                  <Select.Item value="marketing">Marketing</Select.Item>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </FormField.Field>
          <FormField.Description error>Please select a category.</FormField.Description>
        </FormField.Root>
      </DemoSample>
    </Stack>
  );
}

function SizesVariantsExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Sizes">
        <Stack gap="lg" align="center">
          <Select.Root>
            <Select.Trigger size="sm">
              <Select.Value placeholder="Small" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content sideOffset={4}>
                <Select.Item value="a">Option A</Select.Item>
                <Select.Item value="b">Option B</Select.Item>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
          <Select.Root>
            <Select.Trigger size="md">
              <Select.Value placeholder="Medium" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content sideOffset={4}>
                <Select.Item value="a">Option A</Select.Item>
                <Select.Item value="b">Option B</Select.Item>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
          <Select.Root>
            <Select.Trigger size="lg">
              <Select.Value placeholder="Large" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content sideOffset={4}>
                <Select.Item value="a">Option A</Select.Item>
                <Select.Item value="b">Option B</Select.Item>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </Stack>
      </DemoSample>
      <DemoSample label="Variants">
        <Stack gap="lg">
          <Select.Root>
            <Select.Trigger variant="outlined">
              <Select.Value placeholder="Outlined" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content sideOffset={4}>
                <Select.Item value="a">Option A</Select.Item>
                <Select.Item value="b">Option B</Select.Item>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
          <Select.Root>
            <Select.Trigger variant="filled">
              <Select.Value placeholder="Filled" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content sideOffset={4}>
                <Select.Item value="a">Option A</Select.Item>
                <Select.Item value="b">Option B</Select.Item>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </Stack>
      </DemoSample>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A dropdown for picking a single value, with animated open/close and item selection.',
    component: <UsageExample />,
    code: `import { Select } from 'move';

<Select.Root>
  <Select.Trigger>
    <Select.Value placeholder="Choose a fruit" />
    <Select.Icon />
  </Select.Trigger>
  <Select.Portal>
    <Select.Content sideOffset={4}>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="banana">Banana</Select.Item>
    </Select.Content>
  </Select.Portal>
</Select.Root>

{/* Composable items — use label for trigger display */}
<Select.Item value="apple" label="Apple">
  <Apple size={14} /> Apple
</Select.Item>

{/* Rich items with description */}
<Select.Item value="paris" label="Paris">
  <MapPin size={14} />
  <div>
    <div>Paris</div>
    <div>City of Light</div>
  </div>
</Select.Item>

{/* Error */}
<Select.Trigger invalid>
  <Select.Value placeholder="Select a category" />
  <Select.Icon />
</Select.Trigger>

{/* Disabled item / trigger */}
<Select.Item value="admin" disabled>Admin</Select.Item>
<Select.Trigger disabled>
  <Select.Value placeholder="Disabled select" />
  <Select.Icon />
</Select.Trigger>`,
  },
  {
    id: 'formfield',
    name: 'In FormField',
    description: 'Select composed with FormField for labels, descriptions, and error messages.',
    component: <FormFieldExample />,
    code: `import { FormField, Label, Select } from 'move';

<FormField.Root labelWidth="8rem">
  <FormField.Label><Label>Fruit</Label></FormField.Label>
  <FormField.Field>
    <Select.Root>
      <Select.Trigger>
        <Select.Value placeholder="Choose a fruit" />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content sideOffset={4}>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
          <Select.Item value="cherry">Cherry</Select.Item>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  </FormField.Field>
</FormField.Root>

{/* With description */}
<FormField.Root labelWidth="8rem">
  <FormField.Label><Label>Category</Label></FormField.Label>
  <FormField.Field>
    <Select.Root>
      <Select.Trigger>
        <Select.Value placeholder="Select a category" />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content sideOffset={4}>
          <Select.Item value="design">Design</Select.Item>
          <Select.Item value="engineering">Engineering</Select.Item>
          <Select.Item value="marketing">Marketing</Select.Item>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  </FormField.Field>
  <FormField.Description>Pick the team you belong to.</FormField.Description>
</FormField.Root>

{/* With error */}
<FormField.Root labelWidth="8rem">
  <FormField.Label><Label required>Category</Label></FormField.Label>
  <FormField.Field>
    <Select.Root>
      <Select.Trigger invalid>
        <Select.Value placeholder="Select a category" />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content sideOffset={4}>
          <Select.Item value="design">Design</Select.Item>
          <Select.Item value="engineering">Engineering</Select.Item>
          <Select.Item value="marketing">Marketing</Select.Item>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  </FormField.Field>
  <FormField.Description error>Please select a category.</FormField.Description>
</FormField.Root>`,
  },
  {
    id: 'sizes-variants',
    name: 'Sizes & Variants',
    description: 'Trigger sizes and visual variants matching InputText.',
    component: <SizesVariantsExample />,
    code: `{/* Sizes */}
<Select.Trigger size="sm">...</Select.Trigger>
<Select.Trigger size="md">...</Select.Trigger>
<Select.Trigger size="lg">...</Select.Trigger>

{/* Variants */}
<Select.Trigger variant="outlined">...</Select.Trigger>
<Select.Trigger variant="filled">...</Select.Trigger>`,
  },
];

export function SelectDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Select"
        description="A dropdown for picking a single value, with animated open/close and item selection."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Select.Root"
        properties={[
          { name: 'value', type: 'string', description: 'Controlled selected value.' },
          { name: 'defaultValue', type: 'string', description: 'Default selected value for uncontrolled usage.' },
          { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the selected value changes.' },
          { name: 'open', type: 'boolean', description: 'Controlled open state of the dropdown.' },
          { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Whether the dropdown is open by default.' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the dropdown open state changes.' },
          { name: 'animate', type: 'PopupAnimate | false', description: 'Animates Select.Content (popup enter/exit), Select.Item (staggered entrance, hover scale), and Select.Icon (rotation).' },
        ]}
      />

      <DocPage.ApiSection
        title="Select.Trigger"
        properties={[
          { name: 'disabled', type: 'boolean', description: 'Whether the trigger is disabled.' },
          { name: 'invalid', type: 'boolean', description: 'Whether the trigger is in an invalid state.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the trigger matching InputText.' },
          { name: 'variant', type: "'outlined' | 'filled'", default: "'outlined'", description: 'Visual variant matching InputText.' },
          { name: 'width', type: 'CSSProperties[\'width\']', description: 'Custom width for the trigger.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props to override the trigger element.' },
        ]}
      />

      <DocPage.ApiSection
        title="Select.Value"
        properties={[
          { name: 'placeholder', type: 'string', description: 'Placeholder text shown when no value is selected.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props to override the value element.' },
        ]}
      />

      <DocPage.ApiSection
        title="Select.Content"
        properties={[
          { name: 'sideOffset', type: 'number', default: '4', description: 'Distance in pixels from the trigger.' },
          { name: 'align', type: "'start' | 'center' | 'end'", description: 'Horizontal alignment relative to the trigger.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for inner elements: content, contentInner.' },
        ]}
      />

      <DocPage.ApiSection
        title="Select.Item"
        properties={[
          { name: 'value', type: 'string', description: 'The unique value of this item.' },
          { name: 'label', type: 'ReactNode', description: 'Label displayed in the trigger when this item is selected.' },
          { name: 'disabled', type: 'boolean', description: 'Whether this item is disabled.' },
          { name: 'onSelect', type: '(e: Event) => void', description: 'Called when this item is selected.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props to override the item element.' },
        ]}
      />
    </DocPage.Root>
  );
}
