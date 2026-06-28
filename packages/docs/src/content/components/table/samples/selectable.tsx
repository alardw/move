import { Button, Checkbox, Stack, Table, Text, useTableSelection } from 'move';

interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

const invoices: Invoice[] = [
  { id: '1', number: 'INV-0241', client: 'Ada Lovelace', amount: 1200, status: 'Paid' },
  { id: '2', number: 'INV-0242', client: 'Alan Turing', amount: 980, status: 'Pending' },
  { id: '3', number: 'INV-0243', client: 'Grace Hopper', amount: 2450, status: 'Paid' },
  { id: '4', number: 'INV-0244', client: 'Donald Knuth', amount: 640, status: 'Overdue' },
  { id: '5', number: 'INV-0245', client: 'Linus Torvalds', amount: 3120, status: 'Paid' },
];

// Small width hint so the checkbox column stays tight.
const CHECK_CELL: React.CSSProperties = { width: 1 };

export default function SelectableSample() {
  const selection = useTableSelection({
    items: invoices,
    getKey: (i) => i.id,
  });

  return (
    <Stack gap="sm">
      {selection.count > 0 && (
        // Simple bulk-action bar — consumers compose this themselves.
        <Stack direction="row" gap="sm" align="center">
          <Text size="sm" color="muted">
            {selection.count} selected
          </Text>
          <Button size="sm" variant="secondary">Export</Button>
          <Button size="sm" variant="danger">Delete</Button>
          <Button size="sm" variant="ghost" onClick={selection.clear}>Clear</Button>
        </Stack>
      )}

      <Table hoverable>
        <Table.Header>
          <Table.Row>
            {/* recipe-purity-ignore: tight checkbox column width hint; no Move column-width prop on Table cells */}
            <Table.Head style={CHECK_CELL}>
              <Checkbox
                checked={selection.isAllSelected}
                indeterminate={selection.isSomeSelected}
                onCheckedChange={selection.toggleAll}
                aria-label="Select all rows"
              />
            </Table.Head>
            <Table.Head>Invoice</Table.Head>
            <Table.Head>Client</Table.Head>
            <Table.Head align="end">Amount</Table.Head>
            <Table.Head>Status</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {invoices.map((inv) => {
            const checked = selection.isSelected(inv.id);
            return (
              <Table.Row key={inv.id} selected={checked}>
                {/* recipe-purity-ignore: tight checkbox column width hint; no Move column-width prop on Table cells */}
                <Table.Cell style={CHECK_CELL}>
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => selection.toggle(inv.id)}
                    aria-label={`Select ${inv.number}`}
                  />
                </Table.Cell>
                <Table.Cell>{inv.number}</Table.Cell>
                <Table.Cell>{inv.client}</Table.Cell>
                <Table.Cell align="end">${inv.amount.toFixed(2)}</Table.Cell>
                <Table.Cell>{inv.status}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Stack>
  );
}
