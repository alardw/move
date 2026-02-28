import { Accordion, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

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
            resolving global and instance slot props, and building the <code>cx()</code> and
            <code>sp()</code> helpers that the render function uses.
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

function SizesExample() {
  return (
    <Stack gap="xl">
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>sm</p>
        <Accordion type="single" collapsible size="sm">
          <Accordion.Item value="a"><Accordion.Header><Accordion.Trigger>Item One</Accordion.Trigger></Accordion.Header><Accordion.Content>Small accordion content.</Accordion.Content></Accordion.Item>
          <Accordion.Item value="b"><Accordion.Header><Accordion.Trigger>Item Two</Accordion.Trigger></Accordion.Header><Accordion.Content>Another section.</Accordion.Content></Accordion.Item>
        </Accordion>
      </div>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>md</p>
        <Accordion type="single" collapsible size="md">
          <Accordion.Item value="a"><Accordion.Header><Accordion.Trigger>Item One</Accordion.Trigger></Accordion.Header><Accordion.Content>Medium accordion content.</Accordion.Content></Accordion.Item>
          <Accordion.Item value="b"><Accordion.Header><Accordion.Trigger>Item Two</Accordion.Trigger></Accordion.Header><Accordion.Content>Another section.</Accordion.Content></Accordion.Item>
        </Accordion>
      </div>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>lg</p>
        <Accordion type="single" collapsible size="lg">
          <Accordion.Item value="a"><Accordion.Header><Accordion.Trigger>Item One</Accordion.Trigger></Accordion.Header><Accordion.Content>Large accordion content.</Accordion.Content></Accordion.Item>
          <Accordion.Item value="b"><Accordion.Header><Accordion.Trigger>Item Two</Accordion.Trigger></Accordion.Header><Accordion.Content>Another section.</Accordion.Content></Accordion.Item>
        </Accordion>
      </div>
    </Stack>
  );
}

function VariantsExample() {
  return (
    <Stack gap="xl">
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>default</p>
        <Accordion type="single" collapsible variant="default">
          <Accordion.Item value="a"><Accordion.Header><Accordion.Trigger>Item One</Accordion.Trigger></Accordion.Header><Accordion.Content>Default bordered style.</Accordion.Content></Accordion.Item>
          <Accordion.Item value="b"><Accordion.Header><Accordion.Trigger>Item Two</Accordion.Trigger></Accordion.Header><Accordion.Content>Another section.</Accordion.Content></Accordion.Item>
        </Accordion>
      </div>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>contained</p>
        <Accordion type="single" collapsible variant="contained">
          <Accordion.Item value="a"><Accordion.Header><Accordion.Trigger>Item One</Accordion.Trigger></Accordion.Header><Accordion.Content>Contained with outer border.</Accordion.Content></Accordion.Item>
          <Accordion.Item value="b"><Accordion.Header><Accordion.Trigger>Item Two</Accordion.Trigger></Accordion.Header><Accordion.Content>Another section.</Accordion.Content></Accordion.Item>
        </Accordion>
      </div>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>ghost</p>
        <Accordion type="single" collapsible variant="ghost">
          <Accordion.Item value="a"><Accordion.Header><Accordion.Trigger>Item One</Accordion.Trigger></Accordion.Header><Accordion.Content>Ghost style, no borders.</Accordion.Content></Accordion.Item>
          <Accordion.Item value="b"><Accordion.Header><Accordion.Trigger>Item Two</Accordion.Trigger></Accordion.Header><Accordion.Content>Another section.</Accordion.Content></Accordion.Item>
        </Accordion>
      </div>
    </Stack>
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
    id: 'sizes',
    name: 'Sizes',
    description: 'Control header and content density',
    component: <SizesExample />,
    code: `<Accordion size="sm">...</Accordion>
<Accordion size="md">...</Accordion>
<Accordion size="lg">...</Accordion>`,
  },
  {
    id: 'variants',
    name: 'Variants',
    description: 'Bordered, contained, or ghost styles',
    component: <VariantsExample />,
    code: `<Accordion variant="default">...</Accordion>
<Accordion variant="contained">...</Accordion>
<Accordion variant="ghost">...</Accordion>`,
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
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Padding and font size of headers and content.' },
          { name: 'variant', type: "'default' | 'contained' | 'ghost'", default: "'default'", description: 'Visual style of the accordion.' },
          { name: 'type', type: "'single' | 'multiple'", default: "'single'", description: 'Whether one or multiple items can be open at once.' },
          { name: 'value', type: 'string | string[]', description: 'Controlled open item(s).' },
          { name: 'defaultValue', type: 'string | string[]', description: 'Uncontrolled initial open item(s).' },
          { name: 'onValueChange', type: '(value: string | string[]) => void', description: 'Called when the open item(s) change.' },
          { name: 'collapsible', type: 'boolean', default: 'true', description: 'Allow closing all items in single mode.' },
          { name: 'animate', type: 'AccordionAnimateConfig | false', description: 'Animates Accordion.Item (staggered entrance), Accordion.Content (height expand/collapse), and Accordion.Trigger icon (rotation).' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props to override the root element.' },
        ]}
      />

      <DocPage.ApiSection
        title="Accordion.Item"
        properties={[
          { name: 'value', type: 'string', description: 'Unique identifier for the item.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props to override the item element.' },
        ]}
      />

      <DocPage.ApiSection
        title="Accordion.Trigger"
        properties={[
          { name: 'icon', type: 'ReactNode', description: 'Custom icon to replace the default chevron.' },
          { name: 'animate', type: "Pick<ElementAnimate, 'hover'> | false", description: 'Hover animation for the trigger, or false to disable.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for inner elements: trigger, icon.' },
        ]}
      />
    </DocPage.Root>
  );
}
