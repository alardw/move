import { Table } from 'move';

const defaultLabels = {
  name: 'Name',
  role: 'Role',
  email: 'Email',
  status: 'Status',
};

type Labels = typeof defaultLabels;

const DATA = [
  { name: 'Alice Johnson', role: 'Engineer', email: 'alice@example.com', status: 'Active' },
  { name: 'Bob Smith', role: 'Designer', email: 'bob@example.com', status: 'Active' },
  { name: 'Carol White', role: 'Manager', email: 'carol@example.com', status: 'Inactive' },
  { name: 'David Brown', role: 'Engineer', email: 'david@example.com', status: 'Active' },
  { name: 'Eve Davis', role: 'Designer', email: 'eve@example.com', status: 'Pending' },
];

export default function BasicTable({ labels }: { labels?: Partial<Labels> }) {
  const t = { ...defaultLabels, ...labels };

  return (
    <Table hoverable>
      <Table.Header>
        <Table.Row>
          <Table.Head>{t.name}</Table.Head>
          <Table.Head>{t.role}</Table.Head>
          <Table.Head>{t.email}</Table.Head>
          <Table.Head>{t.status}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {DATA.map((row) => (
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
