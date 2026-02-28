import { useState } from 'react';
import { ColorInput, Button, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

const SWATCHES = [
  '#ff0000', '#ff8800', '#ffff00', '#00ff00', '#00ffff',
  '#0000ff', '#8800ff', '#ff00ff', '#ffffff', '#000000',
];

function UsageExample() {
  return (
    <DemoSample label="Basic">
      <ColorInput defaultValue="#3b82f6" placeholder="Pick a color" />
    </DemoSample>
  );
}

function FormatsExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Hex + swatches">
        <ColorInput format="hex" defaultValue="#3b82f6" swatches={SWATCHES} />
      </DemoSample>

      <DemoSample label="RGBA (with alpha)">
        <ColorInput format="rgba" defaultValue="rgba(59, 130, 246, 0.8)" swatches={SWATCHES} />
      </DemoSample>

      <DemoSample label="HSL">
        <ColorInput format="hsl" defaultValue="hsl(217, 91%, 60%)" swatches={SWATCHES} />
      </DemoSample>

      <DemoSample label="Swatches only">
        <ColorInput defaultValue="#ff0000" swatches={SWATCHES} withPicker={false} />
      </DemoSample>
    </Stack>
  );
}

function VariantsExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Sizes">
        <Stack gap="md">
          <ColorInput size="sm" defaultValue="#ef4444" />
          <ColorInput size="md" defaultValue="#22c55e" />
          <ColorInput size="lg" defaultValue="#8b5cf6" />
        </Stack>
      </DemoSample>

      <DemoSample label="Variants">
        <Stack gap="md">
          <ColorInput variant="outlined" defaultValue="#3b82f6" />
          <ColorInput variant="filled" defaultValue="#3b82f6" />
        </Stack>
      </DemoSample>
    </Stack>
  );
}

function StatesExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="States">
        <Stack gap="md">
          <ColorInput invalid defaultValue="#ff0000" />
          <ColorInput disabled defaultValue="#999999" />
          <ColorInput readOnly defaultValue="#3b82f6" />
        </Stack>
      </DemoSample>

      <DemoSample label="Eye dropper (Chrome only)">
        <ColorInput withEyeDropper defaultValue="#3b82f6" />
      </DemoSample>
    </Stack>
  );
}

function ControlledExample() {
  const [color, setColor] = useState('#3b82f6');

  return (
    <Stack direction="column" gap="md">
      <DemoSample label="Controlled">
        <Stack gap="md" align="center">
          <ColorInput
            value={color}
            onValueChange={setColor}
            swatches={SWATCHES}
          />
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: color,
              borderRadius: 'var(--move-rounded-md)',
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-muted)' }}>
            {color}
          </span>
          <Button size="sm" variant="secondary" onClick={() => setColor('#3b82f6')}>
            Reset
          </Button>
        </Stack>
      </DemoSample>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A text input with color preview that opens a color picker with format selector and per-channel inputs.',
    component: <UsageExample />,
    code: `import { ColorInput } from 'move';

<ColorInput defaultValue="#3b82f6" placeholder="Pick a color" />`,
  },
  {
    id: 'formats',
    name: 'Formats & Swatches',
    description: 'Different output formats with preset swatches. Width adapts to the format automatically.',
    component: <FormatsExample />,
    code: `const swatches = ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0000ff'];

<ColorInput format="hex" defaultValue="#3b82f6" swatches={swatches} />
<ColorInput format="rgba" defaultValue="rgba(59, 130, 246, 0.8)" swatches={swatches} />
<ColorInput format="hsl" defaultValue="hsl(217, 91%, 60%)" swatches={swatches} />

{/* Swatches only */}
<ColorInput defaultValue="#ff0000" swatches={swatches} withPicker={false} />`,
  },
  {
    id: 'variants',
    name: 'Variants & Sizes',
    description: 'Visual variants and sizes.',
    component: <VariantsExample />,
    code: `<ColorInput size="sm" defaultValue="#ef4444" />
<ColorInput size="md" defaultValue="#22c55e" />
<ColorInput size="lg" defaultValue="#8b5cf6" />

<ColorInput variant="outlined" defaultValue="#3b82f6" />
<ColorInput variant="filled" defaultValue="#3b82f6" />`,
  },
  {
    id: 'states',
    name: 'States',
    description: 'Validation, disabled, read-only, and eye dropper.',
    component: <StatesExample />,
    code: `<ColorInput invalid defaultValue="#ff0000" />
<ColorInput disabled defaultValue="#999999" />
<ColorInput readOnly defaultValue="#3b82f6" />

{/* Eye dropper (Chromium browsers only) */}
<ColorInput withEyeDropper defaultValue="#3b82f6" />`,
  },
  {
    id: 'controlled',
    name: 'Controlled',
    description: 'Manage the color value externally with state.',
    component: <ControlledExample />,
    code: `import { useState } from 'react';
import { ColorInput, Button } from 'move';

const [color, setColor] = useState('#3b82f6');

<ColorInput
  value={color}
  onValueChange={setColor}
  swatches={['#ff0000', '#00ff00', '#0000ff']}
/>
<span>Color: {color}</span>
<Button onClick={() => setColor('#3b82f6')}>Reset</Button>`,
  },
];

export function ColorInputDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="ColorInput"
        description="Text input with color preview swatch that opens a color picker popover with format selector and per-channel inputs."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="ColorInput"
        properties={[
          { name: 'variant', type: "'outlined' | 'filled'", default: "'outlined'", description: 'Visual style variant.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Input size.' },
          { name: 'format', type: "'hex' | 'hexa' | 'rgb' | 'rgba' | 'hsl' | 'hsla'", default: "'hex'", description: 'Initial output color format. Width adapts automatically.' },
          { name: 'formatOptions', type: "('hex' | 'rgb' | 'hsl')[]", default: "['hex', 'rgb', 'hsl']", description: 'Base formats shown in the picker format selector.' },
          { name: 'onFormatChange', type: '(format: ColorFormat) => void', description: 'Called when the user switches format in the picker.' },
          { name: 'value', type: 'string', description: 'Controlled color value.' },
          { name: 'defaultValue', type: 'string', description: 'Initial color for uncontrolled mode.' },
          { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the color changes.' },
          { name: 'onChangeEnd', type: '(value: string) => void', description: 'Called when interaction ends.' },
          { name: 'swatches', type: 'string[]', description: 'Preset color options shown in the picker.' },
          { name: 'swatchesPerRow', type: 'number', default: '7', description: 'Swatches per row.' },
          { name: 'withPicker', type: 'boolean', default: 'true', description: 'Show the saturation/hue picker in the popover.' },
          { name: 'withEyeDropper', type: 'boolean', description: 'Show an eye dropper button (Chromium browsers only).' },
          { name: 'eyeDropperLabel', type: 'string', description: 'Accessible label for the eye dropper button.' },
          { name: 'swatchLabel', type: 'string', description: 'Accessible label for the color swatch button.' },
          { name: 'closeOnColorSwatchClick', type: 'boolean', default: 'true', description: 'Close popover when a swatch is clicked.' },
          { name: 'invalid', type: 'boolean', description: 'Show error styling.' },
          { name: 'width', type: 'CSSProperties["width"]', description: 'Override the input width.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for inner elements: root, swatch, input, content.' },
        ]}
      />
    </DocPage.Root>
  );
}
