import { Button, Checkbox, Switch, Collapsible } from 'move';
import { DocPage } from '../components/DocPage';
import { Stack, Text } from '../components';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// =============================================================================
// Styles
// =============================================================================

const sectionStyle: React.CSSProperties = {
  marginTop: 'var(--move-spacing-xl)',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 'var(--move-size-lg)',
  fontWeight: 600,
  color: 'var(--move-fg-base)',
  margin: '0 0 var(--move-spacing-sm) 0',
};

const proseStyle: React.CSSProperties = {
  fontSize: 'var(--move-size-sm)',
  lineHeight: 1.7,
  color: 'var(--move-fg-muted)',
  margin: '0 0 var(--move-spacing-md) 0',
  maxWidth: '65ch',
};

const codeBlockStyle: React.CSSProperties = {
  background: 'var(--move-bg-muted)',
  border: '1px solid var(--move-border-base)',
  borderRadius: 'var(--move-rounded-md)',
  padding: 'var(--move-spacing-md)',
  fontSize: 'var(--move-size-xs)',
  fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
  color: 'var(--move-fg-muted)',
  overflowX: 'auto',
  lineHeight: 1.6,
  margin: '0 0 var(--move-spacing-md) 0',
  whiteSpace: 'pre',
};

const boxStyle: React.CSSProperties = {
  background: 'var(--move-bg-subtle)',
  border: '1px solid var(--move-border-base)',
  borderRadius: 'var(--move-rounded-lg)',
  padding: 'var(--move-spacing-lg)',
};

const monoStyle: React.CSSProperties = {
  fontFamily: "'SF Mono', monospace",
  fontSize: '0.8em',
  background: 'var(--move-bg-muted)',
  padding: '0.125rem 0.375rem',
  borderRadius: 'var(--move-rounded-sm)',
  color: 'var(--move-primary)',
};

const engineBoxStyle: React.CSSProperties = {
  ...boxStyle,
  flex: 1,
  minWidth: '240px',
};

const engineLabelStyle: React.CSSProperties = {
  fontSize: 'var(--move-size-xs)',
  fontWeight: 600,
  color: 'var(--move-fg-base)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  marginBottom: 'var(--move-spacing-xs)',
};

const engineDescStyle: React.CSSProperties = {
  fontSize: 'var(--move-size-sm)',
  color: 'var(--move-fg-muted)',
  margin: 0,
  lineHeight: 1.5,
};

const useCaseStyle: React.CSSProperties = {
  fontSize: 'var(--move-size-xs)',
  color: 'var(--move-fg-subtle)',
  fontFamily: "'SF Mono', monospace",
  marginTop: 'var(--move-spacing-sm)',
  lineHeight: 1.6,
};

// =============================================================================
// Live Examples
// =============================================================================

function CSSTransitionExample() {
  return (
    <div style={boxStyle}>
      <Text size="sm" variant="muted" style={{ marginBottom: 'var(--move-spacing-sm)' }}>
        Hover these buttons — color transitions use CSS custom properties
      </Text>
      <Stack gap="md" wrap>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </Stack>
      <Text size="xs" variant="subtle" style={{ marginTop: 'var(--move-spacing-sm)' }}>
        Powered by <code style={monoStyle}>transition: background-color var(--move-transition-fast) var(--move-ease-default)</code>
      </Text>
    </div>
  );
}

function AnimeJsExample() {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(true);

  return (
    <div style={boxStyle}>
      <Text size="sm" variant="muted" style={{ marginBottom: 'var(--move-spacing-sm)' }}>
        Toggle these — check/uncheck animations use anime.js springs
      </Text>
      <Stack gap="lg" wrap>
        <Stack gap="sm" align="center">
          <Checkbox checked={checked1} onCheckedChange={setChecked1} />
          <Text size="sm">{checked1 ? 'Checked' : 'Unchecked'}</Text>
        </Stack>
        <Stack gap="sm" align="center">
          <Checkbox checked={checked2} onCheckedChange={setChecked2} />
          <Text size="sm">{checked2 ? 'Checked' : 'Unchecked'}</Text>
        </Stack>
        <Stack gap="sm" align="center">
          <Switch.Root defaultChecked label="Switch"><Switch.Thumb /></Switch.Root>
        </Stack>
      </Stack>
      <Text size="xs" variant="subtle" style={{ marginTop: 'var(--move-spacing-sm)' }}>
        Powered by <code style={monoStyle}>spring({'{ mass: 0.8, stiffness: 350, damping: 12 }'})</code> via anime.js
      </Text>
    </div>
  );
}

function ExpandExample() {
  const [open, setOpen] = useState(false);

  return (
    <div style={boxStyle}>
      <Text size="sm" variant="muted" style={{ marginBottom: 'var(--move-spacing-sm)' }}>
        Expand/collapse — height animation orchestrated by anime.js
      </Text>
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger asChild>
          <Button variant="secondary" style={{ width: '100%', justifyContent: 'space-between' }}>
            {open ? 'Collapse' : 'Expand'}
            <ChevronDown size={16} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
          </Button>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div style={{ padding: 'var(--move-spacing-md) 0' }}>
            <Text size="sm" variant="muted">
              This content animates its height from 0 to auto using anime.js. The height is measured,
              then animated with an outQuart easing. Opacity fades in after the height animation completes.
            </Text>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
}

function AnimatePropExample() {
  return (
    <div style={boxStyle}>
      <Text size="sm" variant="muted" style={{ marginBottom: 'var(--move-spacing-sm)' }}>
        Hover and press these — the <code style={monoStyle}>animate</code> prop controls spring behavior
      </Text>
      <Stack gap="md" wrap>
        <Stack direction="column" gap="xs" align="center">
          <Button variant="primary" animate={{ hover: { scale: 1.1, easing: 'poppy' }, press: { scale: 0.85, easing: 'snappy' } }}>
            Bouncy
          </Button>
          <Text size="xs" variant="subtle">poppy hover</Text>
        </Stack>
        <Stack direction="column" gap="xs" align="center">
          <Button variant="secondary" animate={{ hover: { scale: 1.02, easing: 'stiff' }, press: { scale: 0.98, easing: 'stiff' } }}>
            Subtle
          </Button>
          <Text size="xs" variant="subtle">stiff hover</Text>
        </Stack>
        <Stack direction="column" gap="xs" align="center">
          <Button variant="ghost" animate={false}>
            No animation
          </Button>
          <Text size="xs" variant="subtle">animate=false</Text>
        </Stack>
      </Stack>
    </div>
  );
}

// =============================================================================
// Main Demo
// =============================================================================

export function AnimationIntroDemo() {
  return (
    <DocPage.Root>
      <DocPage.Header
        title="Animation"
        description="A dual-engine approach: CSS for simple state changes, anime.js for orchestrated motion."
      />

      {/* Two Engines */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Two Engines, One System</h3>
        <p style={proseStyle}>
          Move uses two animation techniques, each chosen for what it does best.
          Components pick the right tool automatically — you don't need to think about it
          unless you want to customize.
        </p>

        <Stack gap="md" wrap>
          <div style={engineBoxStyle}>
            <div style={engineLabelStyle}>CSS Transitions</div>
            <p style={engineDescStyle}>
              Simple state changes — hover colors, focus borders, opacity fades.
              Driven by semantic tokens so they adapt to any theme.
            </p>
            <div style={useCaseStyle}>
              Button hover · Input focus · Sidebar item hover<br />
              Dropdown item highlight · Tab trigger · Link color
            </div>
          </div>

          <div style={engineBoxStyle}>
            <div style={engineLabelStyle}>anime.js</div>
            <p style={engineDescStyle}>
              Orchestrated motion — spring physics, sequenced animations, staggered
              children, and height expand/collapse.
            </p>
            <div style={useCaseStyle}>
              Checkbox check · Switch toggle · Accordion expand<br />
              Dropdown open · Dialog enter · Toast slide · Tab indicator
            </div>
          </div>
        </Stack>
      </div>

      {/* CSS Transitions */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>CSS Transitions</h3>
        <p style={proseStyle}>
          Every component's hover, focus, and idle state transitions are handled by CSS.
          Two semantic tokens control the timing:
        </p>
        <pre style={codeBlockStyle}>{`/* In component CSS */
transition:
  background-color var(--move-transition-fast) var(--move-ease-default),
  color var(--move-transition-fast) var(--move-ease-default);

/* Semantic tokens (from your theme) */
--move-transition-fast: 100ms;    /* hover, focus */
--move-transition-normal: 200ms;  /* tab switches */
--move-ease-default: ease-out;    /* standard easing */`}</pre>
        <CSSTransitionExample />
      </div>

      {/* anime.js */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>anime.js Animations</h3>
        <p style={proseStyle}>
          For motion that needs spring physics, sequencing, or runtime measurement (like
          animating height to <code style={monoStyle}>auto</code>), components use anime.js.
          Spring presets give animations a natural, physical feel.
        </p>
        <pre style={codeBlockStyle}>{`// Spring presets (from springs.ts)
snappy:  { mass: 1,   stiffness: 500, damping: 30 }  // buttons, quick responses
poppy:   { mass: 0.8, stiffness: 350, damping: 12 }  // scale-up, popovers
gentle:  { mass: 1,   stiffness: 80,  damping: 12 }  // modals, overlays
stiff:   { mass: 1,   stiffness: 400, damping: 35 }  // minimal overshoot`}</pre>
        <Stack direction="column" gap="lg">
          <AnimeJsExample />
          <ExpandExample />
        </Stack>
      </div>

      {/* The animate Prop */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>The animate Prop</h3>
        <p style={proseStyle}>
          Many components accept an <code style={monoStyle}>animate</code> prop to customize
          their anime.js animations. The prop type varies by component category — buttons
          get hover/press, accordions get open/close, checkboxes get checked/unchecked.
          Pass <code style={monoStyle}>false</code> to disable animation entirely.
        </p>
        <pre style={codeBlockStyle}>{`// Customize button animation
<Button animate={{
  hover: { scale: 1.1, easing: 'poppy' },
  press: { scale: 0.85, easing: 'snappy' },
}}>
  Bouncy
</Button>

// Disable animation
<Button animate={false}>Static</Button>

// Customize accordion content animation
<Accordion.Root animate={{
  content: {
    open: { height: [0, 'auto'], opacity: [0, 1], duration: 500 },
    close: { height: ['auto', 0], opacity: [1, 0], duration: 300 },
  },
}}>
  ...
</Accordion.Root>`}</pre>
        <AnimatePropExample />
      </div>

      {/* Presence */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Presence System</h3>
        <p style={proseStyle}>
          Components that mount/unmount (Dialog, Dropdown, Toast, Popover) use a <code style={monoStyle}>Presence</code> wrapper.
          It keeps the element in the DOM during exit animations, then removes it when the animation completes.
        </p>
        <pre style={codeBlockStyle}>{`// How it works internally
<Presence present={isOpen}>
  <DialogContent
    animate={{
      enter: { opacity: [0, 1], scale: [0.9, 1], easing: 'snappy' },
      exit:  { opacity: [1, 0], scale: [1, 0.95], duration: 150 },
    }}
  />
</Presence>

// The Presence component:
// 1. Renders children when present=true
// 2. When present changes to false, keeps children mounted
// 3. Triggers exit animation via context
// 4. Removes children after animation completes`}</pre>
      </div>

      {/* Reduced Motion */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Reduced Motion</h3>
        <p style={proseStyle}>
          Move respects <code style={monoStyle}>prefers-reduced-motion: reduce</code> automatically.
          When enabled, all anime.js animations resolve instantly (duration: 0) and CSS transitions
          continue to work at their normal speed since they're already fast and non-distracting.
        </p>
        <pre style={codeBlockStyle}>{`// In the animation system
if (prefersReducedMotion()) {
  // Skip to end state immediately
  return toInstantParams(animation); // { ...endValues, duration: 0 }
}

// Theme-level control
const theme: Theme = {
  ...darkTheme,
  animation: {
    ...darkTheme.animation,
    reducedMotion: true,  // force reduced motion regardless of OS setting
  },
};`}</pre>
      </div>

      {/* Theme Animation Config */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Theme Animation Config</h3>
        <p style={proseStyle}>
          Each theme includes an <code style={monoStyle}>animation</code> object that sets the
          default spring parameters and transition durations for all components.
        </p>
        <pre style={codeBlockStyle}>{`const darkTheme: Theme = {
  name: 'dark',
  tokens: { ... },
  animation: {
    spring: {
      mass: 0.8,
      stiffness: 500,
      damping: 15,
    },
    duration: {
      fast: 100,     // CSS --move-transition-fast
      normal: 200,   // CSS --move-transition-normal
      slow: 300,     // CSS --move-transition-slow
    },
    reducedMotion: false,
  },
};`}</pre>
      </div>
    </DocPage.Root>
  );
}
