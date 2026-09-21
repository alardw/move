import { Text, Timeline } from 'move';

// `stagger` reveals the events in sequence when the timeline mounts. It is off
// unless you ask for it: a timeline arrives with the page and so does
// everything else on it, and the call site is the only place that can see
// whether one more thing moving is welcome.
//
// The spacing here is the widest in the library (80ms). A timeline IS a
// sequence, so the reveal is allowed to say so — where a table settles, this
// one counts. The rise itself is the shared one Table and List use.
//
// `animateKey` replays it when the data changes, for a filter or a sort.
const events = [
  ['09:02', 'Queue drained', 'green'],
  ['08:47', 'Webhook retried and succeeded', 'teal'],
  ['08:46', 'Webhook timed out', 'orange'],
  ['08:31', 'Ingest worker scaled to 4', 'indigo'],
  ['08:12', 'Batch 3129 accepted', 'green'],
  ['07:58', 'Batch 3128 accepted', 'green'],
  ['07:40', 'Schema migration applied', 'violet'],
  ['07:22', 'Nightly export finished', 'teal'],
  ['06:05', 'Nightly export started', 'gray'],
] as const;

export default function ItemRevealSample() {
  return (
    <Timeline stagger>
      {events.map(([when, what, color]) => (
        <Timeline.Item key={when} color={color} title={what}>
          <Text size="sm" color="muted">
            {when}
          </Text>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
