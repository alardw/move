import { Table } from 'move';

// Wide content on purpose — this is the sample used to iterate on the
// responsive behavior of the table when columns carry long tokens or
// CSS values that won't wrap.
const rows = [
  {
    token: '--move-select-trigger-bg-hover',
    value: 'color-mix(in oklch, var(--move-indigo-5) 40%, transparent)',
    description: 'Background color applied when the user hovers the trigger.',
  },
  {
    token: '--move-select-content-shadow',
    value: '0 24px 48px -12px rgb(0 0 0 / 0.18), 0 4px 8px -4px rgb(0 0 0 / 0.08)',
    description: 'Drop shadow under the popover content surface.',
  },
  {
    token: '--move-select-item-fg-highlighted',
    value: 'var(--move-indigo-11)',
    description: 'Foreground color when an item is keyboard-focused or pointer-highlighted.',
  },
];

export default function WideResponsiveSample() {
  return (
    <Table responsive="stack" stackBelow={600}>
      <Table.Header>
        <Table.Row>
          <Table.Head>Token</Table.Head>
          <Table.Head>Default value</Table.Head>
          <Table.Head>Description</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.token}>
            <Table.Cell>{r.token}</Table.Cell>
            <Table.Cell>{r.value}</Table.Cell>
            <Table.Cell>{r.description}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
