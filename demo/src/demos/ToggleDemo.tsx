import { useState } from 'react';
import { ToggleButton, MoveProvider } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';
import { Bold, Italic, Underline } from 'lucide-react';

function BasicExample() {
  return (
    <ToggleButton aria-label="Toggle bold">
      <Bold size={16} />
    </ToggleButton>
  );
}

function WithTextExample() {
  return (
    <Stack direction="row" gap="sm">
      <ToggleButton aria-label="Toggle bold">
        <Bold size={16} /> Bold
      </ToggleButton>
      <ToggleButton aria-label="Toggle italic">
        <Italic size={16} /> Italic
      </ToggleButton>
      <ToggleButton aria-label="Toggle underline">
        <Underline size={16} /> Underline
      </ToggleButton>
    </Stack>
  );
}

function ControlledExample() {
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(true);

  return (
    <Stack direction="column" gap="md">
      <Stack direction="row" gap="sm">
        <ToggleButton pressed={bold} onPressedChange={setBold} aria-label="Toggle bold">
          <Bold size={16} /> Bold
        </ToggleButton>
        <ToggleButton pressed={italic} onPressedChange={setItalic} aria-label="Toggle italic">
          <Italic size={16} /> Italic
        </ToggleButton>
      </Stack>
      <div style={{ fontFamily: 'var(--move-font-body)', fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-muted)' }}>
        Bold: {bold ? 'on' : 'off'}, Italic: {italic ? 'on' : 'off'}
      </div>
    </Stack>
  );
}

function DisabledExample() {
  return (
    <Stack direction="row" gap="sm">
      <ToggleButton disabled aria-label="Disabled off">
        <Bold size={16} /> Off
      </ToggleButton>
      <ToggleButton disabled defaultPressed aria-label="Disabled on">
        <Italic size={16} /> On
      </ToggleButton>
    </Stack>
  );
}

function CustomStylingExample() {
  return (
    <MoveProvider pt={{
      ToggleButton: { root: { style: { borderColor: 'var(--move-primary)', color: 'var(--move-primary)' } } },
    }}>
      <ToggleButton aria-label="Toggle styled">
        <Bold size={16} /> Styled
      </ToggleButton>
    </MoveProvider>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A simple toggle button',
    component: <BasicExample />,
    code: `import { ToggleButton } from 'move';
import { Bold } from 'lucide-react';

<ToggleButton aria-label="Toggle bold">
  <Bold size={16} />
</ToggleButton>`,
  },
  {
    id: 'with-text',
    name: 'With Text',
    description: 'Toggle buttons with icon and text labels',
    component: <WithTextExample />,
    code: `<ToggleButton aria-label="Toggle bold">
  <Bold size={16} /> Bold
</ToggleButton>
<ToggleButton aria-label="Toggle italic">
  <Italic size={16} /> Italic
</ToggleButton>
<ToggleButton aria-label="Toggle underline">
  <Underline size={16} /> Underline
</ToggleButton>`,
  },
  {
    id: 'controlled',
    name: 'Controlled',
    description: 'Controlled toggle state with onPressedChange',
    component: <ControlledExample />,
    code: `const [bold, setBold] = useState(false);
const [italic, setItalic] = useState(true);

<ToggleButton pressed={bold} onPressedChange={setBold}>
  <Bold size={16} /> Bold
</ToggleButton>
<ToggleButton pressed={italic} onPressedChange={setItalic}>
  <Italic size={16} /> Italic
</ToggleButton>`,
  },
  {
    id: 'disabled',
    name: 'Disabled',
    description: 'Disabled toggles in both on and off states',
    component: <DisabledExample />,
    code: `<ToggleButton disabled>
  <Bold size={16} /> Off
</ToggleButton>
<ToggleButton disabled defaultPressed>
  <Italic size={16} /> On
</ToggleButton>`,
  },
  {
    id: 'custom',
    name: 'Custom Styling',
    description: 'Override styles via MoveProvider pass-through',
    component: <CustomStylingExample />,
    code: `<MoveProvider pt={{
  ToggleButton: {
    root: { style: { borderColor: 'var(--move-primary)', color: 'var(--move-primary)' } }
  },
}}>
  <ToggleButton>
    <Bold size={16} /> Styled
  </ToggleButton>
</MoveProvider>`,
  },
];

export function ToggleDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="ToggleButton"
        description="A two-state button that can be toggled on or off, using regular button styling."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
