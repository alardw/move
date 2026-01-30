import { Accordion, MoveProvider } from 'move';
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

function PassThroughExample() {
  return (
    <MoveProvider pt={{ AccordionTrigger: { root: { style: { fontStyle: 'italic' } } } }}>
      <Accordion type="single" collapsible>
        <Accordion.Item value="item-1">
          <Accordion.Header>
            <Accordion.Trigger>Trigger with global custom style</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            The trigger text is italic via a global style override on the AccordionTrigger root slot.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Header>
            <Accordion.Trigger pt={{ icon: { style: { color: 'var(--move-primary)' } } }}>
              Trigger with custom icon style
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            The chevron icon is colored via a custom style on the icon slot.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </MoveProvider>
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
  {
    id: 'passthrough',
    name: 'Custom Styling',
    description: 'Fine-tune any part with style overrides',
    component: <PassThroughExample />,
    code: `<MoveProvider pt={{ AccordionTrigger: { root: { style: { fontStyle: 'italic' } } } }}>
  <Accordion type="single" collapsible>
    <Accordion.Item value="item-1">
      <Accordion.Header>
        <Accordion.Trigger>Trigger with global custom style</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content>
        The trigger text is italic via a global style override on the AccordionTrigger root slot.
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="item-2">
      <Accordion.Header>
        <Accordion.Trigger pt={{ icon: { style: { color: 'var(--move-primary)' } } }}>
          Trigger with custom icon style
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content>
        The chevron icon is colored via a custom style on the icon slot.
      </Accordion.Content>
    </Accordion.Item>
  </Accordion>
</MoveProvider>`,
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
    </DocPage.Root>
  );
}
