import { Text, Timeline } from 'move';

const events = [
  { title: 'Pushed v2.4.3 to staging', when: '2 minutes ago', color: 'green' as const, body: 'Tagged from main, ran the regression suite, deployed to the staging cluster.' },
  { title: 'Merged PR #2210', when: '20 minutes ago', color: 'indigo' as const, body: 'Refresh of Move’s colour primitives — adds 13 Open Color palettes plus our gray.' },
  { title: 'Customer interview · Sami', when: '1 hour ago', color: 'teal' as const, body: 'Walk-through of the new file-upload flow. Sami liked the per-file progress.' },
  { title: 'Triage bug from #ingest', when: '3 hours ago', color: 'orange' as const, body: 'Webhook timing out on staging when the queue is hot. Repro in progress.' },
];

export default function BasicSample() {
  return (
    <Timeline>
      {events.map((e, i) => (
        <Timeline.Item key={i} color={e.color} title={e.title}>
          <Text size="sm" color="muted">{e.when}</Text>
          <Text size="sm">{e.body}</Text>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
