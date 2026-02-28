import { useState } from 'react';
import { Stepper, useStepper, Button, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

// ─────────────────────────────────────────────────────────────────
// Usage
// ─────────────────────────────────────────────────────────────────

function UsageExample() {
  const { activeStep, goToNext, goToPrevious, isFirst, isLast } = useStepper({ count: 3 });

  return (
    <Stack direction="column" gap="xl">
      <Stepper active={activeStep}>
        <Stepper.Step>
          <Stepper.Indicator />
          <Stepper.Title>Account</Stepper.Title>
        </Stepper.Step>
        <Stepper.Step>
          <Stepper.Indicator />
          <Stepper.Title>Details</Stepper.Title>
        </Stepper.Step>
        <Stepper.Step>
          <Stepper.Indicator />
          <Stepper.Title>Confirm</Stepper.Title>
        </Stepper.Step>
      </Stepper>

      <Stack direction="row" gap="sm">
        <Button variant="outline" size="sm" onClick={goToPrevious} disabled={isFirst}>Back</Button>
        <Button size="sm" onClick={goToNext} disabled={activeStep > 2}>
          {isLast ? 'Finish' : 'Next'}
        </Button>
      </Stack>
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────────
// With descriptions
// ─────────────────────────────────────────────────────────────────

function DescriptionsExample() {
  const [active, setActive] = useState(1);

  return (
    <Stepper active={active} onStepClick={setActive}>
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Title>Account</Stepper.Title>
        <Stepper.Description>Create your account</Stepper.Description>
      </Stepper.Step>
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Title>Verification</Stepper.Title>
        <Stepper.Description>Verify your email</Stepper.Description>
      </Stepper.Step>
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Title>Complete</Stepper.Title>
        <Stepper.Description>Get started</Stepper.Description>
      </Stepper.Step>
    </Stepper>
  );
}

// ─────────────────────────────────────────────────────────────────
// Vertical
// ─────────────────────────────────────────────────────────────────

function VerticalExample() {
  const [active, setActive] = useState(1);

  return (
    <Stepper active={active} orientation="vertical" onStepClick={setActive}>
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Title>Order placed</Stepper.Title>
        <Stepper.Description>Your order has been confirmed</Stepper.Description>
      </Stepper.Step>
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Title>Shipped</Stepper.Title>
        <Stepper.Description>Your order is on its way</Stepper.Description>
      </Stepper.Step>
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Title>Delivered</Stepper.Title>
        <Stepper.Description>Package has arrived</Stepper.Description>
      </Stepper.Step>
    </Stepper>
  );
}

// ─────────────────────────────────────────────────────────────────
// Sizes
// ─────────────────────────────────────────────────────────────────

function SizesExample() {
  return (
    <Stack direction="column" gap="xl">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <p style={{ marginBottom: 'var(--move-spacing-xs)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>{size}</p>
          <Stepper active={1} size={size}>
            <Stepper.Step>
              <Stepper.Indicator />
              <Stepper.Title>First</Stepper.Title>
            </Stepper.Step>
            <Stepper.Step>
              <Stepper.Indicator />
              <Stepper.Title>Second</Stepper.Title>
            </Stepper.Step>
            <Stepper.Step>
              <Stepper.Indicator />
              <Stepper.Title>Third</Stepper.Title>
            </Stepper.Step>
          </Stepper>
        </div>
      ))}
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────────
// Error status
// ─────────────────────────────────────────────────────────────────

function ErrorExample() {
  return (
    <Stepper active={1}>
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Title>Account</Stepper.Title>
      </Stepper.Step>
      <Stepper.Step status="error">
        <Stepper.Indicator />
        <Stepper.Title>Verification</Stepper.Title>
        <Stepper.Description>Email verification failed</Stepper.Description>
      </Stepper.Step>
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Title>Complete</Stepper.Title>
      </Stepper.Step>
    </Stepper>
  );
}

// ─────────────────────────────────────────────────────────────────
// Examples
// ─────────────────────────────────────────────────────────────────

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A basic stepper with navigation buttons. Use useStepper to manage step state.',
    component: <UsageExample />,
    code: `import { Stepper, useStepper, Button } from 'move';

function MyForm() {
  const { activeStep, goToNext, goToPrevious, isFirst, isLast } = useStepper({ count: 3 });

  return (
    <>
      <Stepper active={activeStep}>
        <Stepper.Step>
          <Stepper.Indicator />
          <Stepper.Title>Account</Stepper.Title>
        </Stepper.Step>
        <Stepper.Step>
          <Stepper.Indicator />
          <Stepper.Title>Details</Stepper.Title>
        </Stepper.Step>
        <Stepper.Step>
          <Stepper.Indicator />
          <Stepper.Title>Confirm</Stepper.Title>
        </Stepper.Step>
      </Stepper>

      <Button onClick={goToPrevious} disabled={isFirst}>Back</Button>
      <Button onClick={goToNext} disabled={isLast}>Next</Button>
    </>
  );
}`,
  },
  {
    id: 'descriptions',
    name: 'Descriptions',
    description: 'Add descriptions below each step title. Click a step to navigate directly.',
    component: <DescriptionsExample />,
    code: `<Stepper active={active} onStepClick={setActive}>
  <Stepper.Step>
    <Stepper.Indicator />
    <Stepper.Title>Account</Stepper.Title>
    <Stepper.Description>Create your account</Stepper.Description>
  </Stepper.Step>
  <Stepper.Step>
    <Stepper.Indicator />
    <Stepper.Title>Verification</Stepper.Title>
    <Stepper.Description>Verify your email</Stepper.Description>
  </Stepper.Step>
  <Stepper.Step>
    <Stepper.Indicator />
    <Stepper.Title>Complete</Stepper.Title>
    <Stepper.Description>Get started</Stepper.Description>
  </Stepper.Step>
</Stepper>`,
  },
  {
    id: 'vertical',
    name: 'Vertical',
    description: 'Vertical layout for timeline-style flows.',
    component: <VerticalExample />,
    code: `<Stepper active={1} orientation="vertical" onStepClick={setActive}>
  <Stepper.Step>
    <Stepper.Indicator />
    <Stepper.Title>Order placed</Stepper.Title>
    <Stepper.Description>Your order has been confirmed</Stepper.Description>
  </Stepper.Step>
  <Stepper.Step>
    <Stepper.Indicator />
    <Stepper.Title>Shipped</Stepper.Title>
    <Stepper.Description>Your order is on its way</Stepper.Description>
  </Stepper.Step>
  <Stepper.Step>
    <Stepper.Indicator />
    <Stepper.Title>Delivered</Stepper.Title>
    <Stepper.Description>Package has arrived</Stepper.Description>
  </Stepper.Step>
</Stepper>`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'Three sizes to match different content densities.',
    component: <SizesExample />,
    code: `<Stepper active={1} size="sm">
  <Stepper.Step>
    <Stepper.Indicator />
    <Stepper.Title>First</Stepper.Title>
  </Stepper.Step>
  <Stepper.Step>
    <Stepper.Indicator />
    <Stepper.Title>Second</Stepper.Title>
  </Stepper.Step>
</Stepper>

<Stepper active={1} size="md">
  <Stepper.Step>
    <Stepper.Indicator />
    <Stepper.Title>First</Stepper.Title>
  </Stepper.Step>
  <Stepper.Step>
    <Stepper.Indicator />
    <Stepper.Title>Second</Stepper.Title>
  </Stepper.Step>
</Stepper>

<Stepper active={1} size="lg">
  <Stepper.Step>
    <Stepper.Indicator />
    <Stepper.Title>First</Stepper.Title>
  </Stepper.Step>
  <Stepper.Step>
    <Stepper.Indicator />
    <Stepper.Title>Second</Stepper.Title>
  </Stepper.Step>
</Stepper>`,
  },
  {
    id: 'error',
    name: 'Error',
    description: 'Override a step status to show an error state.',
    component: <ErrorExample />,
    code: `<Stepper active={1}>
  <Stepper.Step>
    <Stepper.Indicator />
    <Stepper.Title>Account</Stepper.Title>
  </Stepper.Step>
  <Stepper.Step status="error">
    <Stepper.Indicator />
    <Stepper.Title>Verification</Stepper.Title>
    <Stepper.Description>Email verification failed</Stepper.Description>
  </Stepper.Step>
  <Stepper.Step>
    <Stepper.Indicator />
    <Stepper.Title>Complete</Stepper.Title>
  </Stepper.Step>
</Stepper>`,
  },
];

export function StepperDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Stepper"
        description="A multi-step indicator that shows progress through a sequence of steps."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Stepper (Root)"
        properties={[
          { name: 'active', type: 'number', default: '0', description: 'Current active step index (zero-based).' },
          { name: 'onStepClick', type: '(index: number) => void', description: 'Called when a step is clicked. Enables step navigation.' },
          { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout direction.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Controls indicator size, font sizes, and spacing.' },
        ]}
      />

      <DocPage.ApiSection
        title="Stepper.Step"
        properties={[
          { name: 'status', type: "'wait' | 'active' | 'complete' | 'error'", description: 'Override the auto-derived step status.' },
        ]}
      />

      <DocPage.ApiSection
        title="Stepper.Indicator"
        properties={[
          { name: 'icon', type: 'ReactNode', description: 'Custom icon for the step indicator.' },
          { name: 'completedIcon', type: 'ReactNode', description: 'Custom icon shown when the step is complete.' },
        ]}
      />

      <DocPage.ApiSection
        title="useStepper"
        properties={[
          { name: 'count', type: 'number', description: 'Total number of steps.' },
          { name: 'initialStep', type: 'number', default: '0', description: 'Starting step index.' },
        ]}
      />
    </DocPage.Root>
  );
}
