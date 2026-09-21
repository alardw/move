import { Badge, List } from 'move';

// `stagger` reveals the rows in sequence when the list mounts. It is off unless
// you ask for it: a list arrives with the page and so does everything else on
// it, and the call site is the only place that can see whether one more thing
// moving is welcome.
//
// Rows fade up, the same reveal Table and Timeline use — all three are things
// people filter, and they are built from one definition so they cannot drift
// apart. Enough rows here to see the sweep; at four it is over before it reads.
//
// `animateKey` replays it when the data changes, for a filter or a sort.
const releases = [
  ['0.1.67', 'Overlay scrims move to the light rung', 'green'],
  ['0.1.66', 'Truncation tooltips on Text and Heading', 'green'],
  ['0.1.65', 'Select rebuilt on Radix Select', 'gray'],
  ['0.1.64', 'Interactive border tokens for WCAG 1.4.11', 'gray'],
  ['0.1.63', 'Theme Builder reads the seed, not overrides', 'gray'],
  ['0.1.62', 'Sliding indicator shared by Tabs and ToggleGroup', 'gray'],
  ['0.1.61', 'Hooks registry and useInView', 'gray'],
  ['0.1.60', 'Link and accent-text tokens', 'gray'],
  ['0.1.59', 'Icon resolver on MoveRoot', 'gray'],
  ['0.1.58', 'Layout chain: fill and flex', 'gray'],
  ['0.1.57', 'Dialog surfaces and elevation', 'gray'],
  ['0.1.56', 'Chart adapters split from the renderer', 'gray'],
] as const;

export default function ItemRevealSample() {
  return (
    <List stagger>
      {releases.map(([version, summary, tone]) => (
        <List.Item key={version}>
          <List.Content>
            <List.Title>{version}</List.Title>
            <List.Description>{summary}</List.Description>
          </List.Content>
          <List.Trailing>
            <Badge color={tone}>{tone === 'green' ? 'current' : 'past'}</Badge>
          </List.Trailing>
        </List.Item>
      ))}
    </List>
  );
}
