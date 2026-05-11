import { Text, Timeline } from 'move';

// Timeline.Root's `active` prop drives state per item:
//   index <  active → completed
//   index == active → active (highlighted)
//   index >  active → waiting (muted)
// This pattern fits any multi-step pipeline (deploys, onboarding, orders).
const steps = [
  { title: 'Build started', when: '3 min ago', body: 'Triggered by a merge to main.' },
  { title: 'Tests passing', when: '2 min ago', body: 'Unit + integration suites green.' },
  { title: 'Deploying to staging', when: 'now', body: 'Rolling out across the canary fleet.' },
  { title: 'Smoke tests', when: 'pending', body: 'Will run as soon as the staging deploy reports healthy.' },
  { title: 'Promote to production', when: 'pending', body: 'Manual gate — needs an approver after smoke tests pass.' },
];

export default function StepsSample() {
  return (
    <Timeline active={2}>
      {steps.map((s, i) => (
        <Timeline.Item key={i} title={s.title}>
          <Text size="sm" color="muted">{s.when}</Text>
          <Text size="sm">{s.body}</Text>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
