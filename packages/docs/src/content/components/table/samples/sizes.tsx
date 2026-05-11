import { Stack, Table } from 'move';

const sizes = ['sm', 'md', 'lg'] as const;
const rows = [
  { id: '001', user: 'Ada Lovelace', role: 'Admin' },
  { id: '002', user: 'Alan Turing', role: 'Engineer' },
];

export default function SizesSample() {
  return (
    <Stack gap="lg">
      {sizes.map((size) => (
        <Table key={size} size={size}>
          <Table.Header>
            <Table.Row>
              <Table.Head>ID</Table.Head>
              <Table.Head>User</Table.Head>
              <Table.Head>Role</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((r) => (
              <Table.Row key={r.id}>
                <Table.Cell>{r.id}</Table.Cell>
                <Table.Cell>{r.user}</Table.Cell>
                <Table.Cell>{r.role}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ))}
    </Stack>
  );
}
