import { useState, useEffect } from 'react';
import { ProgressBar, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

function UsageExample() {
  return <ProgressBar value={60} />;
}

function AnimatedExample() {
  const [value, setValue] = useState(20);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(v => {
        const next = v + 15;
        return next > 100 ? 10 : next;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return <ProgressBar value={value} />;
}

function IndeterminateExample() {
  return <ProgressBar />;
}

function SizesExample() {
  return (
    <Stack gap="lg" style={{ width: '100%' }}>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>sm</p>
        <ProgressBar value={60} size="sm" />
      </div>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>md</p>
        <ProgressBar value={60} size="md" />
      </div>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>lg</p>
        <ProgressBar value={60} size="lg" />
      </div>
    </Stack>
  );
}

function VariantsExample() {
  return (
    <Stack gap="lg" style={{ width: '100%' }}>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>default</p>
        <ProgressBar value={60} variant="default" />
      </div>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>success</p>
        <ProgressBar value={80} variant="success" />
      </div>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>warning</p>
        <ProgressBar value={50} variant="warning" />
      </div>
      <div>
        <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>error</p>
        <ProgressBar value={30} variant="error" />
      </div>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Import and basic usage',
    component: <UsageExample />,
    code: `import { ProgressBar } from 'move';

<ProgressBar value={60} />`,
  },
  {
    id: 'animated',
    name: 'Animated',
    description: 'Value changes animate with a spring bounce',
    component: <AnimatedExample />,
    code: `const [value, setValue] = useState(20);

useEffect(() => {
  const interval = setInterval(() => {
    setValue(v => {
      const next = v + 15;
      return next > 100 ? 10 : next;
    });
  }, 1200);
  return () => clearInterval(interval);
}, []);

<ProgressBar value={value} />`,
  },
  {
    id: 'indeterminate',
    name: 'Indeterminate',
    description: 'No value? A smooth pulse keeps things alive',
    component: <IndeterminateExample />,
    code: `<ProgressBar />`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'Thin, standard, or thick bar',
    component: <SizesExample />,
    code: `<ProgressBar value={60} size="sm" />
<ProgressBar value={60} size="md" />
<ProgressBar value={60} size="lg" />`,
  },
  {
    id: 'variants',
    name: 'Variants',
    description: 'Color variants for different states',
    component: <VariantsExample />,
    code: `<ProgressBar value={60} variant="default" />
<ProgressBar value={80} variant="success" />
<ProgressBar value={50} variant="warning" />
<ProgressBar value={30} variant="error" />`,
  },
];

export function ProgressBarDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="ProgressBar"
        description="Show how far along a task is."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="ProgressBar"
        properties={[
          { name: 'value', type: 'number | null', description: 'Current progress value. Omit or pass null for indeterminate state.' },
          { name: 'max', type: 'number', default: '100', description: 'Maximum value of the progress bar.' },
          { name: 'getValueLabel', type: '(value: number, max: number) => string', description: 'Custom accessible label for the current value.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height of the progress bar.' },
          { name: 'variant', type: "'default' | 'success' | 'warning' | 'error'", default: "'default'", description: 'Color variant of the indicator.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for inner elements: root, indicator.' },
        ]}
      />
    </DocPage.Root>
  );
}
