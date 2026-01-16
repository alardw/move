import { useState, useEffect } from 'react';
import { Progress } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + Math.random() * 10;
      });
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <Progress.Root className="progress-root" value={progress}>
        <Progress.Indicator
          className="progress-indicator"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </Progress.Root>
      <p style={{ marginTop: 12 }}>
        {Math.round(Math.min(progress, 100))}% complete
      </p>
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
    description: 'Animated progress bar.',
    component: <DefaultExample />,
    code: `<Progress.Root value={progress}>
  <Progress.Indicator style={{ width: \`\${progress}%\` }} />
</Progress.Root>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function ProgressDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="Progress"
        description="Displays a progress bar indicating completion status."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
