import { useState, useEffect } from 'react';
import { ProgressBar, MoveProvider } from 'move';
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

function CustomStylingExample() {
  return (
    <MoveProvider pt={{
      ProgressBar: {
        root: { style: { height: '8px', borderRadius: '4px' } },
        indicator: { style: { background: 'linear-gradient(90deg, var(--move-success), var(--move-primary))' } },
      },
    }}>
      <ProgressBar value={65} />
    </MoveProvider>
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
    id: 'custom-styling',
    name: 'Custom Styling',
    description: 'Restyle the track and fill globally or per instance',
    component: <CustomStylingExample />,
    code: `<MoveProvider pt={{
  ProgressBar: {
    root: { style: { height: '8px', borderRadius: '4px' } },
    indicator: { style: { background: 'linear-gradient(90deg, var(--move-success), var(--move-primary))' } },
  },
}}>
  <ProgressBar value={65} />
</MoveProvider>`,
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
    </DocPage.Root>
  );
}
