import { Badge, Table } from 'move';

const people = [
  { name: 'Ada Lovelace', email: 'ada@lovelace.dev', role: 'Admin', status: 'Active' },
  { name: 'Alan Turing', email: 'alan@turing.dev', role: 'Engineer', status: 'Active' },
  { name: 'Grace Hopper', email: 'grace@hopper.dev', role: 'Engineer', status: 'Invited' },
  { name: 'Donald Knuth', email: 'donald@knuth.dev', role: 'Admin', status: 'Inactive' },
];

export default function TwoLineCellsSample() {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Member</Table.Head>
          <Table.Head>Role</Table.Head>
          <Table.Head>Status</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {people.map((p) => (
          <Table.Row key={p.email}>
            <Table.Cell description={p.email}>{p.name}</Table.Cell>
            <Table.Cell>{p.role}</Table.Cell>
            <Table.Cell>
              <Badge
                variant="soft"
                color={p.status === 'Active' ? 'green' : p.status === 'Invited' ? 'blue' : 'gray'}
              >
                {p.status}
              </Badge>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
