import { useState } from 'react';
import { Collapsible, Button, useCollapsible, Heading } from 'move';
import { ChevronDown, Settings, Plus, Minus } from 'lucide-react';
import { DocPage, type Example } from '../components/DocPage';

// ============================================================================
// Usage — Button trigger with asChild
// ============================================================================

function UsageExample() {
  return (
    <Collapsible.Root style={{ maxWidth: 480 }}>
      <Collapsible.Trigger asChild>
        <Button variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--move-spacing-xs)' }}>
          What is Move?
          <Collapsible.Icon>
            <ChevronDown size={16} />
          </Collapsible.Icon>
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <p style={{ margin: 0, paddingTop: 'var(--move-spacing-sm)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-sm)' }}>
          Move is an animated UI component library for React with a focus on smooth, physics-based motion.
          Every component supports theming, pass-through styling, and coordinated animations out of the box.
        </p>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

// ============================================================================
// Custom Header — styled row as trigger
// ============================================================================

function CustomHeaderExample() {
  return (
    <Collapsible.Root style={{ maxWidth: 480 }}>
      <Collapsible.Trigger asChild>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--move-spacing-sm)',
            padding: 'var(--move-spacing-sm) var(--move-spacing-md)',
            borderRadius: 'var(--move-rounded-md)',
            border: '1px solid var(--move-border)',
            cursor: 'pointer',
          }}
        >
          <Settings size={16} style={{ color: 'var(--move-fg-muted)' }} />
          <span style={{ flex: 1, fontWeight: 500 }}>Advanced Settings</span>
          <Collapsible.Icon>
            <ChevronDown size={16} />
          </Collapsible.Icon>
        </div>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--move-spacing-sm)', paddingTop: 'var(--move-spacing-sm)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--move-spacing-sm)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-sm)' }}>
            <input type="checkbox" /> Enable debug mode
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--move-spacing-sm)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-sm)' }}>
            <input type="checkbox" /> Show performance overlay
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--move-spacing-sm)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-sm)' }}>
            <input type="checkbox" /> Verbose logging
          </label>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

// ============================================================================
// Inline text trigger
// ============================================================================

function InlineTextExample() {
  return (
    <div style={{ maxWidth: 480 }}>
      <p style={{ margin: 0, color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-sm)', lineHeight: 1.6 }}>
        The component library includes buttons, inputs, dialogs, and more.
      </p>
      <Collapsible.Root>
        <Collapsible.Trigger
          style={{
            color: 'var(--move-primary)',
            fontSize: 'var(--move-size-sm)',
            marginTop: 'var(--move-spacing-xs)',
          }}
        >
          Show more details
        </Collapsible.Trigger>
        <Collapsible.Content>
          <p style={{ margin: 0, paddingTop: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-sm)' }}>
            Each component is built with theming, style overrides, CSS Module scoping, and coordinated
            animations. The headless utilities can be used independently for custom
            implementations.
          </p>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
}

// ============================================================================
// Plus/Minus icon — custom icon swap
// ============================================================================

function PlusMinusExample() {
  const { open, toggle } = useCollapsible({ defaultOpen: false });

  return (
    <Collapsible.Root open={open} onOpenChange={toggle} style={{ maxWidth: 480 }}>
      <Collapsible.Trigger asChild>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--move-spacing-sm) 0',
            borderBottom: '1px solid var(--move-border)',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontWeight: 500 }}>Frequently Asked Questions</span>
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <p style={{ margin: 0, paddingTop: 'var(--move-spacing-sm)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-sm)' }}>
          Yes, you can use any trigger pattern you like — swap icons, use buttons, text links, or
          fully custom layouts. The trigger is unstyled and composable for maximum flexibility.
        </p>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

// ============================================================================
// Controlled
// ============================================================================

function ControlledExample() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 'var(--move-spacing-md)' }}>
      <div style={{ display: 'flex', gap: 'var(--move-spacing-sm)', alignItems: 'center' }}>
        <Button size="sm" variant={open ? 'primary' : 'secondary'} onClick={() => setOpen(!open)}>
          {open ? 'Collapse' : 'Expand'}
        </Button>
        <span style={{ color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-sm)' }}>
          State: <strong>{open ? 'open' : 'closed'}</strong>
        </span>
      </div>
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Content>
          <p style={{ margin: 0, color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-sm)' }}>
            The open state is controlled externally via a separate button.
            Any element can drive the collapsible — it doesn't need an internal trigger.
          </p>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
}

// ============================================================================
// Examples
// ============================================================================

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A button trigger with a rotating chevron icon',
    fullWidth: true,
    component: <UsageExample />,
    code: `import { Collapsible, Button } from 'move';
import { ChevronDown } from 'lucide-react';

<Collapsible.Root>
  <Collapsible.Trigger asChild>
    <Button variant="secondary">
      What is Move?
      <Collapsible.Icon>
        <ChevronDown size={16} />
      </Collapsible.Icon>
    </Button>
  </Collapsible.Trigger>
  <Collapsible.Content>
    Move is an animated UI component library for React.
  </Collapsible.Content>
</Collapsible.Root>`,
  },
  {
    id: 'custom-header',
    name: 'Custom Header',
    description: 'A styled row with icon, label, and chevron as the trigger',
    fullWidth: true,
    component: <CustomHeaderExample />,
    code: `import { Settings, ChevronDown } from 'lucide-react';

<Collapsible.Root>
  <Collapsible.Trigger asChild>
    <div className="settings-header">
      <Settings size={16} />
      <span>Advanced Settings</span>
      <Collapsible.Icon>
        <ChevronDown size={16} />
      </Collapsible.Icon>
    </div>
  </Collapsible.Trigger>
  <Collapsible.Content>
    <label><input type="checkbox" /> Enable debug mode</label>
    <label><input type="checkbox" /> Show performance overlay</label>
    <label><input type="checkbox" /> Verbose logging</label>
  </Collapsible.Content>
</Collapsible.Root>`,
  },
  {
    id: 'inline-text',
    name: 'Text Trigger',
    description: 'An inline text link that reveals more content below',
    fullWidth: true,
    component: <InlineTextExample />,
    code: `<Collapsible.Root>
  <Collapsible.Trigger style={{ color: 'var(--move-primary)' }}>
    Show more details
  </Collapsible.Trigger>
  <Collapsible.Content>
    Additional details revealed on click.
  </Collapsible.Content>
</Collapsible.Root>`,
  },
  {
    id: 'plus-minus',
    name: 'Plus / Minus',
    description: 'Swap between plus and minus icons instead of rotating',
    fullWidth: true,
    component: <PlusMinusExample />,
    code: `import { Collapsible, useCollapsible } from 'move';
import { Plus, Minus } from 'lucide-react';

const { open, toggle } = useCollapsible({ defaultOpen: false });

<Collapsible.Root open={open} onOpenChange={toggle}>
  <Collapsible.Trigger asChild>
    <div className="faq-header">
      <span>Frequently Asked Questions</span>
      {open ? <Minus size={16} /> : <Plus size={16} />}
    </div>
  </Collapsible.Trigger>
  <Collapsible.Content>
    Content here.
  </Collapsible.Content>
</Collapsible.Root>`,
  },
  {
    id: 'controlled',
    name: 'Controlled',
    description: 'Drive the section open and closed from an external button',
    fullWidth: true,
    component: <ControlledExample />,
    code: `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(!open)}>
  {open ? 'Collapse' : 'Expand'}
</Button>

<Collapsible.Root open={open} onOpenChange={setOpen}>
  <Collapsible.Content>
    Controlled externally — no trigger inside.
  </Collapsible.Content>
</Collapsible.Root>`,
  },
];

export function CollapsibleDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Collapsible"
        description="A single expandable section with a minimal, unstyled trigger. Compose any element as the trigger."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Collapsible.Root"
        properties={[
          { name: 'open', type: 'boolean', description: 'Controlled open state.' },
          { name: 'defaultOpen', type: 'boolean', description: 'Whether the section is open by default.' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the open state changes.' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents the collapsible from being toggled.' },
          { name: 'animate', type: 'ContentAnimate | false', description: 'Animates Collapsible.Content (height expand/collapse) and Collapsible.Icon (rotation).' },
        ]}
      />

      <DocPage.ApiSection
        title="Collapsible.Trigger"
        properties={[
          { name: 'asChild', type: 'boolean', description: 'Merge props onto the child element instead of rendering a button.' },
        ]}
      />
    </DocPage.Root>
  );
}
