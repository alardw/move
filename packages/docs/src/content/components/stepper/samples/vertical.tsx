import { Stepper } from 'move';

const steps = [
  { status: 'complete' as const, title: 'Started', description: '2 minutes ago' },
  { status: 'complete' as const, title: 'Validated', description: 'Format and integrity checks passed' },
  { status: 'active' as const, title: 'Importing', description: 'Pushing 4,210 rows into the warehouse' },
  { status: undefined, title: 'Reconciliation', description: 'Compare counts with source' },
  { status: undefined, title: 'Done', description: '' },
];

export default function VerticalSample() {
  return (
    <Stepper orientation="vertical">
      {steps.map((s, i) => (
        <Stepper.Step key={i} status={s.status}>
          <Stepper.Indicator>{i + 1}</Stepper.Indicator>
          <Stepper.Title>{s.title}</Stepper.Title>
          {s.description && <Stepper.Description>{s.description}</Stepper.Description>}
        </Stepper.Step>
      ))}
    </Stepper>
  );
}
