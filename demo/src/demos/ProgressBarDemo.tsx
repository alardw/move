import { useState, useEffect } from 'react';
import { ProgressBar, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';

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
        ]}
      />
    </DocPage.Root>
  );
}
