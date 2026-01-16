import { Tooltip, Button } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button variant="secondary">Top</Button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="tooltip-content" sideOffset={5} side="top">
            Add to library
            <Tooltip.Arrow className="tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button variant="secondary">Bottom</Button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="tooltip-content" sideOffset={5} side="bottom">
            Add to library
            <Tooltip.Arrow className="tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button variant="secondary">Left</Button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="tooltip-content" sideOffset={5} side="left">
            Add to library
            <Tooltip.Arrow className="tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button variant="secondary">Right</Button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="tooltip-content" sideOffset={5} side="right">
            Add to library
            <Tooltip.Arrow className="tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </div>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Tooltips positioned on different sides.',
    component: <DefaultExample />,
    code: `<Tooltip.Root>
  <Tooltip.Trigger asChild>
    <Button variant="secondary">Hover me</Button>
  </Tooltip.Trigger>
  <Tooltip.Portal>
    <Tooltip.Content sideOffset={5} side="top">
      Add to library
      <Tooltip.Arrow />
    </Tooltip.Content>
  </Tooltip.Portal>
</Tooltip.Root>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function TooltipDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="Tooltip"
        description="A popup that shows information on hover or focus."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
