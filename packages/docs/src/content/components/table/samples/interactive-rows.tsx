import { useState } from 'react';
import { Badge, Stack, Table, Text } from 'move';

interface Order {
  id: string;
  customer: string;
  total: number;
  status: 'Paid' | 'Refunded' | 'Pending';
}

const orders: Order[] = [
  { id: 'A-10384', customer: 'Ada Lovelace', total: 248.0, status: 'Paid' },
  { id: 'A-10385', customer: 'Alan Turing', total: 96.5, status: 'Pending' },
  { id: 'A-10386', customer: 'Grace Hopper', total: 412.75, status: 'Paid' },
  { id: 'A-10387', customer: 'Donald Knuth', total: 58.0, status: 'Refunded' },
];

export default function InteractiveRowsSample() {
  const [opened, setOpened] = useState<string | null>(null);

  return (
    <Stack gap="sm">
      {opened && (
        <Text size="sm" color="muted">
          Opened order {opened} (kbd: Enter/Space on a focused row also works)
        </Text>
      )}
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Order</Table.Head>
            <Table.Head>Customer</Table.Head>
            <Table.Head align="end">Total</Table.Head>
            <Table.Head>Status</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {orders.map((o) => (
            <Table.Row
              key={o.id}
              interactive
              onClick={() => setOpened(o.id)}
              aria-label={`Open order ${o.id}`}
            >
              <Table.Cell>{o.id}</Table.Cell>
              <Table.Cell>{o.customer}</Table.Cell>
              <Table.Cell align="end">${o.total.toFixed(2)}</Table.Cell>
              <Table.Cell>
                <Badge
                  variant="soft"
                  color={o.status === 'Paid' ? 'green' : o.status === 'Pending' ? 'blue' : 'gray'}
                >
                  {o.status}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
}
