import { Accordion } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  return (
    <Accordion.Root type="single" collapsible>
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          Yes. It adheres to the WAI-ARIA design pattern.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Header>
          <Accordion.Trigger>Is it unstyled?</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          Yes. It's unstyled by default, giving you full control.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Header>
          <Accordion.Trigger>Can it be animated?</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          Yes! Uses spring physics for smooth animations.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

function MultipleExample() {
  return (
    <Accordion.Root type="multiple" defaultValue={['item-1']}>
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Accordion.Trigger>First section</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          Multiple items can be open at once.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Header>
          <Accordion.Trigger>Second section</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          Click to expand this section too.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Single item open at a time, collapsible.',
    component: <DefaultExample />,
    code: `<Accordion.Root type="single" collapsible>
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>
      Yes. It adheres to the WAI-ARIA design pattern.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>`,
  },
  {
    id: 'multiple',
    name: 'Multiple',
    description: 'Allow multiple items open simultaneously.',
    component: <MultipleExample />,
    code: `<Accordion.Root type="multiple" defaultValue={['item-1']}>
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>First section</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>
      Multiple items can be open at once.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function AccordionDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="Accordion"
        description="A vertically stacked set of interactive headings that reveal content."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
