import { useState, useMemo } from 'react';
import { Table, Button, Stack, Text, Icon } from 'move';

const defaultLabels = {
  name: 'Name',
  role: 'Role',
  email: 'Email',
  status: 'Status',
};

type Labels = typeof defaultLabels;

type SortKey = 'name' | 'role' | 'email' | 'status';
type SortDir = 'asc' | 'desc';

const DATA = [
  { name: 'Alice Johnson', role: 'Engineer', email: 'alice@example.com', status: 'Active' },
  { name: 'Bob Smith', role: 'Designer', email: 'bob@example.com', status: 'Active' },
  { name: 'Carol White', role: 'Manager', email: 'carol@example.com', status: 'Inactive' },
  { name: 'David Brown', role: 'Engineer', email: 'david@example.com', status: 'Active' },
  { name: 'Eve Davis', role: 'Designer', email: 'eve@example.com', status: 'Pending' },
];

export default function SortableTable({ labels }: { labels?: Partial<Labels> }) {
  const t = { ...defaultLabels, ...labels };
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const sorted = useMemo(() => {
    return [...DATA].sort((a, b) => {
      const cmp = a[sortKey].localeCompare(b[sortKey]);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortIcon = (key: SortKey) =>
    sortKey === key ? <Icon name={sortDir === 'asc' ? 'arrow-up' : 'arrow-down'} size="xs" /> : null;

  return (
    <Table hoverable>
      <Table.Header>
        <Table.Row>
          {(['name', 'role', 'email', 'status'] as SortKey[]).map((key) => (
            <Table.Head key={key}>
              <Button variant="ghost" size="sm" onClick={() => toggleSort(key)}>
                <Stack direction="row" gap="xs" align="center">
                  <Text size="sm" weight="semibold">{t[key]}</Text>
                  {sortIcon(key)}
                </Stack>
              </Button>
            </Table.Head>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sorted.map((row) => (
          <Table.Row key={row.email}>
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.role}</Table.Cell>
            <Table.Cell>{row.email}</Table.Cell>
            <Table.Cell>{row.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
