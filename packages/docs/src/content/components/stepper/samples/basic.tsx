import { Stepper } from 'move';

const steps = [
  { status: 'complete' as const, title: 'Account', description: 'Email & password' },
  { status: 'active' as const, title: 'Profile', description: 'Tell us about yourself' },
  { status: undefined, title: 'Plan', description: 'Pick a tier' },
  { status: undefined, title: 'Done', description: 'Welcome aboard' },
];

export default function BasicSample() {
  return (
    <Stepper>
      {steps.map((s, i) => (
        <Stepper.Step key={i} status={s.status}>
          <Stepper.Indicator>{i + 1}</Stepper.Indicator>
          <Stepper.Title>{s.title}</Stepper.Title>
          <Stepper.Description>{s.description}</Stepper.Description>
        </Stepper.Step>
      ))}
    </Stepper>
  );
}
