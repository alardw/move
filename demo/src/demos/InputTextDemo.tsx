import { useState } from 'react';
import { InputText, MoveProvider } from 'move';
import { Search, Euro, Eye } from 'lucide-react';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

function UsageExample() {
  return <InputText placeholder="Enter your name" />;
}

function VariantsExample() {
  return (
    <Stack direction="column">
      <InputText variant="outlined" placeholder="Outlined (default)" />
      <InputText variant="filled" placeholder="Filled" />
    </Stack>
  );
}

function SizesExample() {
  return (
    <Stack direction="column">
      <InputText size="sm" placeholder="Small" />
      <InputText size="md" placeholder="Medium (default)" />
      <InputText size="lg" placeholder="Large" />
    </Stack>
  );
}

function StatesExample() {
  const [value, setValue] = useState('john');
  const isInvalid = value.length > 0 && !value.includes('@');

  return (
    <Stack direction="column">
      <InputText
        placeholder="Email address"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        invalid={isInvalid}
      />
      {isInvalid && (
        <p style={{ color: 'var(--move-error)', fontSize: 'var(--move-size-sm)', margin: 0 }}>
          Please enter a valid email address.
        </p>
      )}
      <InputText value="Selectable but not editable" readOnly />
    </Stack>
  );
}

function IconsExample() {
  return (
    <Stack direction="column">
      <InputText iconLeft={<Search size={16} />} placeholder="Search..." />
      <InputText iconLeft={<Euro size={16} />} placeholder="0.00" type="number" />
      <InputText iconRight={<Eye size={16} />} placeholder="Password" type="password" />
      <InputText
        iconLeft={<Euro size={16} />}
        iconRight={<Search size={16} />}
        placeholder="Both sides"
      />
    </Stack>
  );
}

function WidthExample() {
  return (
    <Stack direction="column">
      <InputText placeholder="10001" width="8rem" />
      <InputText placeholder="0.00" width="12rem" iconLeft={<Euro size={16} />} />
      <InputText placeholder="Full width (default)" />
    </Stack>
  );
}

function DisabledExample() {
  return (
    <Stack direction="column">
      <InputText placeholder="Can't touch this" disabled />
      <InputText value="Greyed out and locked" disabled />
    </Stack>
  );
}

function CustomStylingExample() {
  return (
    <MoveProvider pt={{
      InputText: { root: { style: { borderColor: 'var(--move-primary)', background: 'transparent' } } },
    }}>
      <Stack direction="column">
        <InputText placeholder="Global style applied" />
        <InputText
          placeholder="Instance override"
          pt={{ root: { style: { borderRadius: 'var(--move-rounded-full)' } } }}
        />
      </Stack>
    </MoveProvider>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A single-line text input ready for any form.',
    component: <UsageExample />,
    code: `import { InputText } from 'move';

<InputText placeholder="Enter your name" />`,
  },
  {
    id: 'variants',
    name: 'Variants',
    description: 'Outlined for clarity, filled for emphasis.',
    component: <VariantsExample />,
    code: `<InputText variant="outlined" placeholder="Outlined (default)" />
<InputText variant="filled" placeholder="Filled" />`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'From compact to spacious.',
    component: <SizesExample />,
    code: `<InputText size="sm" placeholder="Small" />
<InputText size="md" placeholder="Medium (default)" />
<InputText size="lg" placeholder="Large" />`,
  },
  {
    id: 'icons',
    name: 'Icons',
    description: 'Add leading or trailing icons to provide context.',
    component: <IconsExample />,
    code: `import { Search, Euro, Eye } from 'lucide-react';

<InputText iconLeft={<Search size={16} />} placeholder="Search..." />
<InputText iconLeft={<Euro size={16} />} placeholder="0.00" type="number" />
<InputText iconRight={<Eye size={16} />} placeholder="Password" type="password" />
<InputText
  iconLeft={<Euro size={16} />}
  iconRight={<Search size={16} />}
  placeholder="Both sides"
/>`,
  },
  {
    id: 'states',
    name: 'States',
    description: 'Invalid highlights errors, read-only locks the value.',
    component: <StatesExample />,
    code: `const [value, setValue] = useState('john');
const isInvalid = value.length > 0 && !value.includes('@');

<InputText
  placeholder="Email address"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  invalid={isInvalid}
/>
{isInvalid && (
  <p style={{ color: 'var(--move-error)' }}>
    Please enter a valid email address.
  </p>
)}
<InputText value="Selectable but not editable" readOnly />`,
  },
  {
    id: 'width',
    name: 'Width',
    description: 'Size the field to match its content.',
    component: <WidthExample />,
    code: `<InputText placeholder="10001" width="8rem" />
<InputText placeholder="0.00" width="12rem" iconLeft={<Euro size={16} />} />
<InputText placeholder="Full width (default)" />`,
  },
  {
    id: 'disabled',
    name: 'Disabled',
    description: 'Locked down and untouchable.',
    component: <DisabledExample />,
    code: `<InputText placeholder="Can't touch this" disabled />
<InputText value="Greyed out and locked" disabled />`,
  },
  {
    id: 'custom',
    name: 'Custom Styling',
    description: 'Tweak styles globally or per instance.',
    component: <CustomStylingExample />,
    code: `<MoveProvider pt={{
  InputText: { root: { style: { borderColor: 'var(--move-primary)', background: 'transparent' } } },
}}>
  <InputText placeholder="Global style applied" />
  <InputText
    placeholder="Instance override"
    pt={{ root: { style: { borderRadius: 'var(--move-rounded-full)' } } }}
  />
</MoveProvider>`,
  },
];

export function InputTextDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="InputText"
        description="A single-line text field with variants, sizes, and validation support."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
