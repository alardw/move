import { useState } from 'react';
import { Select, Button, MoveProvider } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

function BasicExample() {
  return (
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
  );
}

function GroupsExample() {
  return (
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
            <Select.Item value="br">Brazil</Select.Item>
          </Select.Group>
          <Select.Separator />
          <Select.Group>
            <Select.Label>Asia</Select.Label>
            <Select.Item value="jp">Japan</Select.Item>
            <Select.Item value="kr">South Korea</Select.Item>
            <Select.Item value="sg">Singapore</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

function ControlledExample() {
  const [value, setValue] = useState('medium');

  return (
    <Stack direction="column">
      <Select.Root value={value} onValueChange={setValue}>
        <Select.Trigger>
          <Select.Value placeholder="Pick a size" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content sideOffset={4}>
            <Select.Item value="small">Small</Select.Item>
            <Select.Item value="medium">Medium</Select.Item>
            <Select.Item value="large">Large</Select.Item>
            <Select.Item value="xl">Extra Large</Select.Item>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      <p style={{ color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-sm)' }}>
        Selected: <strong>{value}</strong>
      </p>
    </Stack>
  );
}

function DisabledExample() {
  return (
    <Stack direction="column">
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
  );
}

function ManyItemsExample() {
  return (
    <Select.Root>
      <Select.Trigger>
        <Select.Value placeholder="Select a timezone" />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content sideOffset={4}>
          <Select.Group>
            <Select.Label>Americas</Select.Label>
            <Select.Item value="est">Eastern (UTC-5)</Select.Item>
            <Select.Item value="cst">Central (UTC-6)</Select.Item>
            <Select.Item value="mst">Mountain (UTC-7)</Select.Item>
            <Select.Item value="pst">Pacific (UTC-8)</Select.Item>
            <Select.Item value="akst">Alaska (UTC-9)</Select.Item>
            <Select.Item value="hst">Hawaii (UTC-10)</Select.Item>
            <Select.Item value="brt">Brasilia (UTC-3)</Select.Item>
            <Select.Item value="art">Argentina (UTC-3)</Select.Item>
          </Select.Group>
          <Select.Separator />
          <Select.Group>
            <Select.Label>Europe</Select.Label>
            <Select.Item value="gmt">London (UTC+0)</Select.Item>
            <Select.Item value="cet">Paris (UTC+1)</Select.Item>
            <Select.Item value="eet">Helsinki (UTC+2)</Select.Item>
            <Select.Item value="msk">Moscow (UTC+3)</Select.Item>
          </Select.Group>
          <Select.Separator />
          <Select.Group>
            <Select.Label>Asia &amp; Pacific</Select.Label>
            <Select.Item value="ist">Mumbai (UTC+5:30)</Select.Item>
            <Select.Item value="bdt">Dhaka (UTC+6)</Select.Item>
            <Select.Item value="ict">Bangkok (UTC+7)</Select.Item>
            <Select.Item value="cst-cn">Shanghai (UTC+8)</Select.Item>
            <Select.Item value="jst">Tokyo (UTC+9)</Select.Item>
            <Select.Item value="kst">Seoul (UTC+9)</Select.Item>
            <Select.Item value="aest">Sydney (UTC+11)</Select.Item>
            <Select.Item value="nzst">Auckland (UTC+13)</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

function CustomStylingExample() {
  return (
    <MoveProvider pt={{
      SelectTrigger: { trigger: { style: { borderColor: 'var(--move-primary)', background: 'transparent' } } },
      SelectContent: { content: { style: { borderColor: 'var(--move-primary)' } } },
    }}>
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="Styled select" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content sideOffset={4}>
            <Select.Item value="a">Option A</Select.Item>
            <Select.Item value="b">Option B</Select.Item>
            <Select.Item value="c">Option C</Select.Item>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </MoveProvider>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A dropdown that lets you pick a single value from a list of options.',
    component: <BasicExample />,
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
      <Select.Item value="cherry">Cherry</Select.Item>
      <Select.Item value="grape">Grape</Select.Item>
      <Select.Item value="orange">Orange</Select.Item>
    </Select.Content>
  </Select.Portal>
</Select.Root>`,
  },
  {
    id: 'groups',
    name: 'Grouped Items',
    description: 'Organize options into labeled groups with separators.',
    component: <GroupsExample />,
    code: `<Select.Root>
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
        <Select.Item value="br">Brazil</Select.Item>
      </Select.Group>
    </Select.Content>
  </Select.Portal>
</Select.Root>`,
  },
  {
    id: 'controlled',
    name: 'Controlled',
    description: 'Manage the selected value from your own state.',
    component: <ControlledExample />,
    code: `const [value, setValue] = useState('medium');

<Select.Root value={value} onValueChange={setValue}>
  <Select.Trigger>
    <Select.Value placeholder="Pick a size" />
    <Select.Icon />
  </Select.Trigger>
  <Select.Portal>
    <Select.Content sideOffset={4}>
      <Select.Item value="small">Small</Select.Item>
      <Select.Item value="medium">Medium</Select.Item>
      <Select.Item value="large">Large</Select.Item>
      <Select.Item value="xl">Extra Large</Select.Item>
    </Select.Content>
  </Select.Portal>
</Select.Root>

<p>Selected: {value}</p>`,
  },
  {
    id: 'disabled',
    name: 'Disabled',
    description: 'Individual items or the entire select can be disabled.',
    component: <DisabledExample />,
    code: `{/* Disabled item */}
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

{/* Disabled trigger */}
<Select.Root>
  <Select.Trigger disabled>
    <Select.Value placeholder="Disabled select" />
    <Select.Icon />
  </Select.Trigger>
</Select.Root>`,
  },
  {
    id: 'many-items',
    name: 'Many Items',
    description: 'A long list with grouped items scrolls within a capped height.',
    component: <ManyItemsExample />,
    code: `<Select.Root>
  <Select.Trigger>
    <Select.Value placeholder="Select a timezone" />
    <Select.Icon />
  </Select.Trigger>
  <Select.Portal>
    <Select.Content sideOffset={4}>
      <Select.Group>
        <Select.Label>Americas</Select.Label>
        <Select.Item value="est">Eastern (UTC-5)</Select.Item>
        <Select.Item value="cst">Central (UTC-6)</Select.Item>
        <Select.Item value="mst">Mountain (UTC-7)</Select.Item>
        <Select.Item value="pst">Pacific (UTC-8)</Select.Item>
        <Select.Item value="akst">Alaska (UTC-9)</Select.Item>
        <Select.Item value="hst">Hawaii (UTC-10)</Select.Item>
        <Select.Item value="brt">Brasilia (UTC-3)</Select.Item>
        <Select.Item value="art">Argentina (UTC-3)</Select.Item>
      </Select.Group>
      <Select.Separator />
      <Select.Group>
        <Select.Label>Europe</Select.Label>
        <Select.Item value="gmt">London (UTC+0)</Select.Item>
        <Select.Item value="cet">Paris (UTC+1)</Select.Item>
        <Select.Item value="eet">Helsinki (UTC+2)</Select.Item>
        <Select.Item value="msk">Moscow (UTC+3)</Select.Item>
      </Select.Group>
      <Select.Separator />
      <Select.Group>
        <Select.Label>Asia & Pacific</Select.Label>
        <Select.Item value="ist">Mumbai (UTC+5:30)</Select.Item>
        <Select.Item value="jst">Tokyo (UTC+9)</Select.Item>
        <Select.Item value="aest">Sydney (UTC+11)</Select.Item>
        <Select.Item value="nzst">Auckland (UTC+13)</Select.Item>
      </Select.Group>
    </Select.Content>
  </Select.Portal>
</Select.Root>`,
  },
  {
    id: 'custom',
    name: 'Custom Styling',
    description: 'Override styles globally with MoveProvider or per-instance with the style prop.',
    component: <CustomStylingExample />,
    code: `<MoveProvider pt={{
  SelectTrigger: {
    trigger: { style: { borderColor: 'var(--move-primary)', background: 'transparent' } }
  },
  SelectContent: {
    content: { style: { borderColor: 'var(--move-primary)' } }
  },
}}>
  <Select.Root>
    <Select.Trigger>
      <Select.Value placeholder="Styled select" />
      <Select.Icon />
    </Select.Trigger>
    <Select.Portal>
      <Select.Content sideOffset={4}>
        <Select.Item value="a">Option A</Select.Item>
        <Select.Item value="b">Option B</Select.Item>
        <Select.Item value="c">Option C</Select.Item>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
</MoveProvider>`,
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
    </DocPage.Root>
  );
}
