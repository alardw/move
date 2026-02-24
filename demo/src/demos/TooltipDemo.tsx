import { Tooltip, Button, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

function UsageExample() {
  return (
    <Tooltip.Provider>
      <Stack direction="column" gap="xl">
        <Stack direction="row" gap="md">
          <Tooltip label="This is a tooltip">
            <Button>Hover me</Button>
          </Tooltip>
        </Stack>

        <Stack direction="row" gap="md" style={{ flexWrap: 'wrap' }}>
          {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
            <Tooltip key={side} label={`Tooltip on ${side}`} side={side}>
              <Button variant="secondary">{side}</Button>
            </Tooltip>
          ))}
        </Stack>

        <Stack direction="row" gap="md">
          <Tooltip label="No arrow" arrow={false}>
            <Button variant="secondary">No arrow</Button>
          </Tooltip>
          <Tooltip label="Appears instantly" delayDuration={0}>
            <Button variant="secondary">Instant</Button>
          </Tooltip>
        </Stack>
      </Stack>
    </Tooltip.Provider>
  );
}

function CompoundExample() {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button>Hover me</Button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content sideOffset={6}>
            <Tooltip.Arrow />
            Full control over every part
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Simple tooltip with placement, arrow, and delay options.',
    component: <UsageExample />,
    code: `import { Tooltip, Button } from 'move';

<Tooltip.Provider>
  <Tooltip label="This is a tooltip">
    <Button>Hover me</Button>
  </Tooltip>

  {/* Placement */}
  <Tooltip label="Tooltip on right" side="right">
    <Button>Right</Button>
  </Tooltip>

  {/* No arrow */}
  <Tooltip label="No arrow" arrow={false}>
    <Button>No arrow</Button>
  </Tooltip>

  {/* Instant */}
  <Tooltip label="Appears instantly" delayDuration={0}>
    <Button>Instant</Button>
  </Tooltip>
</Tooltip.Provider>`,
  },
  {
    id: 'compound',
    name: 'Compound API',
    description: 'Full control over every part for advanced use cases.',
    component: <CompoundExample />,
    code: `<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <Button>Hover me</Button>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content sideOffset={6}>
        <Tooltip.Arrow />
        Full control over every part
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>`,
  },
];

export function TooltipDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Tooltip"
        description="A popup label that appears on hover or focus, providing brief context."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Tooltip"
        properties={[
          { name: 'label', type: 'ReactNode', description: 'Tooltip content to display.' },
          { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'top'", description: 'Preferred side of the trigger to render the tooltip.' },
          { name: 'sideOffset', type: 'number', default: '6', description: 'Distance in pixels from the trigger.' },
          { name: 'align', type: "'start' | 'center' | 'end'", description: 'Alignment along the side.' },
          { name: 'arrow', type: 'boolean', default: 'true', description: 'Whether to show the tooltip arrow.' },
          { name: 'delayDuration', type: 'number', description: 'Milliseconds to wait before showing the tooltip.' },
          { name: 'open', type: 'boolean', description: 'Controlled open state.' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the open state changes.' },
          { name: 'animate', type: 'LayerAnimate | false', description: 'Animates Tooltip.Content (directional slide, scale, and opacity on enter).' },
        ]}
      />

      <DocPage.ApiSection
        title="Tooltip.Root"
        properties={[
          { name: 'open', type: 'boolean', description: 'Controlled open state of the tooltip.' },
          { name: 'defaultOpen', type: 'boolean', description: 'Whether the tooltip is open by default.' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the open state changes.' },
          { name: 'delayDuration', type: 'number', description: 'Milliseconds to wait before showing the tooltip.' },
          { name: 'disableHoverableContent', type: 'boolean', description: 'Prevent the tooltip from staying open when hovering over its content.' },
        ]}
      />

      <DocPage.ApiSection
        title="Tooltip.Trigger"
        properties={[
          { name: 'asChild', type: 'boolean', description: 'Merge props onto the child element instead of rendering a button.' },
        ]}
      />

      <DocPage.ApiSection
        title="Tooltip.Content"
        properties={[
          { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", description: 'Preferred side of the trigger to render on.' },
          { name: 'sideOffset', type: 'number', description: 'Distance in pixels from the trigger.' },
          { name: 'align', type: "'start' | 'center' | 'end'", description: 'Alignment along the side.' },
          { name: 'alignOffset', type: 'number', description: 'Offset in pixels from the aligned edge.' },
          { name: 'animate', type: 'LayerAnimate | false', description: 'Animates Tooltip.Content (directional slide, scale, and opacity on enter).' },
        ]}
      />

      <DocPage.ApiSection
        title="Tooltip.Provider"
        properties={[
          { name: 'delayDuration', type: 'number', description: 'Default delay for all tooltips within the provider.' },
          { name: 'skipDelayDuration', type: 'number', description: 'Time before the delay resets after the user leaves a tooltip.' },
          { name: 'disableHoverableContent', type: 'boolean', description: 'Prevent tooltips from staying open when hovering over their content.' },
        ]}
      />

      <DocPage.ApiSection
        title="Tooltip.Arrow"
        properties={[
          { name: 'width', type: 'number', description: 'Width of the arrow in pixels.' },
          { name: 'height', type: 'number', description: 'Height of the arrow in pixels.' },
        ]}
      />
    </DocPage.Root>
  );
}
