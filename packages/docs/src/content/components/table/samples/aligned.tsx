import { Button, Icon, Table, Text } from 'move';

const rows = [
  { sku: 'TS-001', item: 'Heavyweight T-shirt', qty: 120, revenue: 3598.4 },
  { sku: 'MG-072', item: 'Enamel camp mug', qty: 84, revenue: 1259.16 },
  { sku: 'NB-014', item: 'Dot-grid notebook', qty: 212, revenue: 2967.0 },
];

export default function AlignedSample() {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>SKU</Table.Head>
          <Table.Head>Item</Table.Head>
          <Table.Head align="end">Qty</Table.Head>
          <Table.Head align="end">Revenue</Table.Head>
          <Table.Head align="end">
            <Text as="span" className="sr-only">Actions</Text>
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.sku}>
            <Table.Cell>{r.sku}</Table.Cell>
            <Table.Cell>{r.item}</Table.Cell>
            <Table.Cell align="end">{r.qty}</Table.Cell>
            <Table.Cell align="end">${r.revenue.toFixed(2)}</Table.Cell>
            <Table.Cell align="end">
              <Button variant="ghost" size="sm" aria-label="Edit">
                <Icon name="pencil" />
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
