import { useState } from 'react';
import { ColorPicker, Button, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

const SWATCHES = [
  '#ff0000', '#ff8800', '#ffff00', '#00ff00', '#00ffff',
  '#0000ff', '#8800ff', '#ff00ff', '#ffffff', '#000000',
];

function UsageExample() {
  return (
    <DemoSample label="Basic">
      <ColorPicker defaultValue="#3b82f6" />
    </DemoSample>
  );
}

function FormatsExample() {
  const [color1, setColor1] = useState('#3b82f6');
  const [color2, setColor2] = useState('rgba(59, 130, 246, 0.8)');

  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Hex (default, switch via dropdown)">
        <Stack gap="md" align="center">
          <ColorPicker value={color1} onValueChange={setColor1} format="hex" swatches={SWATCHES} />
          <span style={{ fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-muted)' }}>{color1}</span>
        </Stack>
      </DemoSample>

      <DemoSample label="RGBA (with alpha slider + input)">
        <Stack gap="md" align="center">
          <ColorPicker value={color2} onValueChange={setColor2} format="rgba" swatches={SWATCHES} />
          <span style={{ fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-muted)' }}>{color2}</span>
        </Stack>
      </DemoSample>
    </Stack>
  );
}

function SwatchesExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="With picker and swatches">
        <ColorPicker defaultValue="#3b82f6" swatches={SWATCHES} />
      </DemoSample>

      <DemoSample label="Swatches only">
        <ColorPicker defaultValue="#ff0000" swatches={SWATCHES} withPicker={false} />
      </DemoSample>
    </Stack>
  );
}

function SizesExample() {
  return (
    <Stack gap="lg" align="start">
      <DemoSample label="Small">
        <ColorPicker size="sm" defaultValue="#ef4444" />
      </DemoSample>
      <DemoSample label="Medium (default)">
        <ColorPicker size="md" defaultValue="#22c55e" />
      </DemoSample>
      <DemoSample label="Large">
        <ColorPicker size="lg" defaultValue="#8b5cf6" />
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
          <ColorPicker value={color} onValueChange={setColor} swatches={SWATCHES} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--move-spacing-sm)' }}>
            <div
              style={{
                width: 60,
                height: 60,
                backgroundColor: color,
                borderRadius: 'var(--move-rounded-md)',
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
              }}
            />
            <span style={{ fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-muted)' }}>
              {color}
            </span>
            <Button size="sm" variant="secondary" onClick={() => setColor('#3b82f6')}>
              Reset
            </Button>
          </div>
        </Stack>
      </DemoSample>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A standalone color picker with saturation area, hue slider, format selector, and per-channel inputs.',
    component: <UsageExample />,
    code: `import { ColorPicker } from 'move';

<ColorPicker defaultValue="#3b82f6" />`,
  },
  {
    id: 'formats',
    name: 'Formats',
    description: 'Use the format selector dropdown to switch between HEX, RGB, and HSL. Alpha slider and input appear for alpha formats (hexa, rgba, hsla).',
    component: <FormatsExample />,
    code: `<ColorPicker format="hex" defaultValue="#3b82f6" swatches={swatches} />

{/* Alpha slider + alpha input shown automatically */}
<ColorPicker format="rgba" defaultValue="rgba(59, 130, 246, 0.8)" swatches={swatches} />`,
  },
  {
    id: 'swatches',
    name: 'Swatches',
    description: 'Preset color options. Hide the picker to show swatches only.',
    component: <SwatchesExample />,
    code: `const swatches = ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0000ff'];

{/* With picker */}
<ColorPicker defaultValue="#3b82f6" swatches={swatches} />

{/* Swatches only */}
<ColorPicker defaultValue="#ff0000" swatches={swatches} withPicker={false} />`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'Available in small, medium, and large.',
    component: <SizesExample />,
    code: `<ColorPicker size="sm" defaultValue="#ef4444" />
<ColorPicker size="md" defaultValue="#22c55e" />
<ColorPicker size="lg" defaultValue="#8b5cf6" />`,
  },
  {
    id: 'controlled',
    name: 'Controlled',
    description: 'Manage the color value externally with state.',
    component: <ControlledExample />,
    code: `import { useState } from 'react';
import { ColorPicker } from 'move';

const [color, setColor] = useState('#3b82f6');

<ColorPicker
  value={color}
  onValueChange={setColor}
  swatches={['#ff0000', '#00ff00', '#0000ff']}
/>
<span>Color: {color}</span>`,
  },
];

export function ColorPickerDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="ColorPicker"
        description="Standalone color picker with saturation area, hue slider, optional alpha, format selector, per-channel inputs, and swatches."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="ColorPicker"
        properties={[
          { name: 'format', type: "'hex' | 'hexa' | 'rgb' | 'rgba' | 'hsl' | 'hsla'", default: "'hex'", description: 'Initial output color format. Alpha slider appears for alpha formats. User can switch via the format selector.' },
          { name: 'formatOptions', type: "('hex' | 'rgb' | 'hsl')[]", default: "['hex', 'rgb', 'hsl']", description: 'Which base formats to show in the format selector dropdown.' },
          { name: 'onFormatChange', type: '(format: ColorFormat) => void', description: 'Called when the user switches format via the selector.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Picker size.' },
          { name: 'value', type: 'string', description: 'Controlled color value.' },
          { name: 'defaultValue', type: 'string', description: 'Initial color for uncontrolled mode.' },
          { name: 'onValueChange', type: '(value: string) => void', description: 'Called on every color change (including during drag).' },
          { name: 'onChangeEnd', type: '(value: string) => void', description: 'Called when interaction ends (pointer up, swatch click).' },
          { name: 'swatches', type: 'string[]', description: 'Array of preset color strings.' },
          { name: 'swatchesPerRow', type: 'number', default: '7', description: 'Number of swatches per row.' },
          { name: 'withPicker', type: 'boolean', default: 'true', description: 'Show the saturation/hue picker. Set false for swatches only.' },
          { name: 'fullWidth', type: 'boolean', description: 'Stretch to parent width.' },
          { name: 'saturationLabel', type: 'string', description: 'Accessible label for the saturation area.' },
          { name: 'hueLabel', type: 'string', description: 'Accessible label for the hue slider.' },
          { name: 'alphaLabel', type: 'string', description: 'Accessible label for the alpha slider.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for inner elements: root, saturation, hue, alpha, swatches, inputRow, formatSelect, channelInput, alphaInput.' },
        ]}
      />

      <DocPage.ApiSection
        title="useColorPicker"
        properties={[
          { name: 'value', type: 'string', description: 'Controlled color value.' },
          { name: 'defaultValue', type: 'string', description: 'Initial value.' },
          { name: 'onValueChange', type: '(value: string) => void', description: 'Change callback.' },
          { name: 'onChangeEnd', type: '(value: string) => void', description: 'Fires when interaction ends.' },
          { name: 'onFormatChange', type: '(format: ColorFormat) => void', description: 'Fires when format changes.' },
          { name: 'format', type: 'ColorFormat', default: "'hex'", description: 'Initial output format.' },
        ]}
      />
    </DocPage.Root>
  );
}
