import { Tooltip, Button, MoveProvider } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

function BasicExample() {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button>Hover me</Button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content sideOffset={5}>
            This is a tooltip
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

function SidesExample() {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Stack direction="row" gap="md" style={{ flexWrap: 'wrap' }}>
        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
          <Tooltip.Root key={side}>
            <Tooltip.Trigger asChild>
              <Button variant="secondary">{side}</Button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content side={side} sideOffset={5}>
                Tooltip on {side}
                <Tooltip.Arrow />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        ))}
      </Stack>
    </Tooltip.Provider>
  );
}

function InstantExample() {
  return (
    <Tooltip.Provider delayDuration={0}>
      <Stack direction="row" gap="md">
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Button variant="secondary">No delay</Button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content sideOffset={5}>
              Appears instantly
              <Tooltip.Arrow />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Button variant="secondary">Also instant</Button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content sideOffset={5}>
              Same provider, no delay
              <Tooltip.Arrow />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Stack>
    </Tooltip.Provider>
  );
}

function CustomStylingExample() {
  return (
    <MoveProvider pt={{
      TooltipContent: { content: { style: { backgroundColor: 'var(--move-primary)', color: 'var(--move-primary-fg)' } } },
      TooltipArrow: { arrow: { style: { fill: 'var(--move-primary)' } } },
    }}>
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Button>Styled tooltip</Button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content sideOffset={5}>
              Custom branded tooltip
              <Tooltip.Arrow />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </MoveProvider>
  );
}

function LongTextExample() {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button variant="secondary">Terms &amp; Conditions</Button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content sideOffset={5}>
            By proceeding you agree to our terms of service, privacy policy, and cookie policy.
            Your data will be processed in accordance with applicable data protection regulations.
            You may withdraw your consent at any time by contacting support.
            <Tooltip.Arrow />
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
    description: 'Basic tooltip on hover with arrow',
    component: <BasicExample />,
    code: `import { Tooltip, Button } from 'move';

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <Button>Hover me</Button>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content sideOffset={5}>
        This is a tooltip
        <Tooltip.Arrow />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>`,
  },
  {
    id: 'sides',
    name: 'Placement',
    description: 'Tooltip positioned on each side of the trigger',
    component: <SidesExample />,
    code: `<Tooltip.Provider delayDuration={200}>
  {['top', 'right', 'bottom', 'left'].map((side) => (
    <Tooltip.Root key={side}>
      <Tooltip.Trigger asChild>
        <Button variant="secondary">{side}</Button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content side={side} sideOffset={5}>
          Tooltip on {side}
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  ))}
</Tooltip.Provider>`,
  },
  {
    id: 'instant',
    name: 'Instant',
    description: 'Zero-delay tooltips that appear immediately',
    component: <InstantExample />,
    code: `<Tooltip.Provider delayDuration={0}>
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <Button variant="secondary">No delay</Button>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content sideOffset={5}>
        Appears instantly
        <Tooltip.Arrow />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>`,
  },
  {
    id: 'long-text',
    name: 'Long Text',
    description: 'Multiline tooltip with a longer description',
    component: <LongTextExample />,
    code: `<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <Button variant="secondary">Terms &amp; Conditions</Button>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content sideOffset={5}>
        By proceeding you agree to our terms of service,
        privacy policy, and cookie policy. Your data will
        be processed in accordance with applicable data
        protection regulations...
        <Tooltip.Arrow />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>`,
  },
  {
    id: 'custom',
    name: 'Custom Styling',
    description: 'Override tooltip appearance via MoveProvider pass-through',
    component: <CustomStylingExample />,
    code: `<MoveProvider pt={{
  TooltipContent: {
    content: { style: { backgroundColor: 'var(--move-primary)', color: 'var(--move-primary-fg)' } }
  },
  TooltipArrow: {
    arrow: { style: { fill: 'var(--move-primary)' } }
  },
}}>
  <Tooltip.Provider>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Button>Styled tooltip</Button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content sideOffset={5}>
          Custom branded tooltip
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
</MoveProvider>`,
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
    </DocPage.Root>
  );
}
