import { Accordion, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';

function SingleExample() {
  return (
    <Accordion type="single" collapsible>
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Accordion.Trigger>What is the withMoveComponent factory?</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <p style={{ margin: '0 0 0.75rem' }}>
            The <code>withMoveComponent</code> factory is the foundation of every styled component in
            Move. It enforces a consistent <code>setup() → render()</code> contract that standardises
            how components handle props, refs, class names, and pass-through overrides.
          </p>
          <p style={{ margin: '0 0 0.75rem' }}>
            When you call the factory you provide a <strong>name</strong>, a CSS Module, a list of
            <strong> slots</strong>, and a <code>setup</code> function. The factory takes care of
            merging forwarded and internal refs, stripping Move-specific props from the DOM attributes,
            resolving global and instance pass-through objects, and building the <code>cx()</code> and
            <code>ptm()</code> helpers that the render function uses.
          </p>
          <p style={{ margin: 0 }}>
            This means every component automatically supports theming, global style overrides via
            <code> MoveProvider</code>, instance-level <code>pt</code> props, and CSS Module
            scoping — without any boilerplate in the component itself.
          </p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Header>
          <Accordion.Trigger>How does animation coordination work?</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          The Accordion Root tracks which items are animating in and out via React state.
          Content uses height + opacity animations with sequential timing — height animates first on
          enter, opacity first on exit.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Header>
          <Accordion.Trigger>Does it support keyboard navigation?</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          Yes — Arrow Up/Down moves focus between triggers, Home/End jumps to first/last,
          and Enter/Space toggles the focused item. All powered by the useAccordion headless hook.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

function MultipleExample() {
  return (
    <Accordion type="multiple" defaultValue={['item-1', 'item-3']}>
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Accordion.Trigger>Section One</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          In multiple mode, any number of items can be open simultaneously.
          Each operates independently.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Header>
          <Accordion.Trigger>Section Two</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          Opening this item does not close the others.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Header>
          <Accordion.Trigger>Section Three</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          Multiple items are open by default: item-1 and item-3.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Import and basic usage',
    component: <SingleExample />,
    code: `import { Accordion } from 'move';

<Accordion type="single" collapsible>
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>What is the withMoveComponent factory?</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>
      The withMoveComponent factory is the foundation of every
      styled component in Move.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Header>
      <Accordion.Trigger>How does animation coordination work?</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>
      The Accordion Root tracks which items are animating in
      and out via React state.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-3">
    <Accordion.Header>
      <Accordion.Trigger>Does it support keyboard navigation?</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>
      Yes — Arrow Up/Down moves focus between triggers,
      Home/End jumps to first/last.
    </Accordion.Content>
  </Accordion.Item>
</Accordion>`,
  },
  {
    id: 'multiple',
    name: 'Multiple',
    description: 'Open as many as you want',
    component: <MultipleExample />,
    code: `<Accordion type="multiple" defaultValue={['item-1', 'item-3']}>
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>Section One</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>
      In multiple mode, any number of items can be open simultaneously.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Header>
      <Accordion.Trigger>Section Two</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>
      Opening this item does not close the others.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-3">
    <Accordion.Header>
      <Accordion.Trigger>Section Three</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>
      Multiple items are open by default: item-1 and item-3.
    </Accordion.Content>
  </Accordion.Item>
</Accordion>`,
  },
];

export function AccordionDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Accordion"
        description="Expandable sections that reveal content with smooth animations."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Accordion.Root"
        properties={[
          { name: 'type', type: "'single' | 'multiple'", default: "'single'", description: 'Whether one or multiple items can be open at once.' },
          { name: 'value', type: 'string | string[]', description: 'Controlled open item(s).' },
          { name: 'defaultValue', type: 'string | string[]', description: 'Uncontrolled initial open item(s).' },
          { name: 'onValueChange', type: '(value: string | string[]) => void', description: 'Called when the open item(s) change.' },
          { name: 'collapsible', type: 'boolean', default: 'true', description: 'Allow closing all items in single mode.' },
          { name: 'animate', type: 'AccordionAnimateConfig | false', description: 'Animates Accordion.Item (staggered entrance), Accordion.Content (height expand/collapse), and Accordion.Trigger icon (rotation).' },
        ]}
      />

      <DocPage.ApiSection
        title="Accordion.Item"
        properties={[
          { name: 'value', type: 'string', description: 'Unique identifier for the item.' },
        ]}
      />

      <DocPage.ApiSection
        title="Accordion.Trigger"
        properties={[
          { name: 'icon', type: 'ReactNode', description: 'Custom icon to replace the default chevron.' },
          { name: 'animate', type: "Pick<ElementAnimate, 'hover'> | false", description: 'Hover animation for the trigger, or false to disable.' },
        ]}
      />
    </DocPage.Root>
  );
}
