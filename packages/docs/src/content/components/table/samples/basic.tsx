import { Table } from 'move';

const rows = [
  { name: 'Apple', category: 'Pome', origin: 'Central Asia' },
  { name: 'Banana', category: 'Berry', origin: 'Southeast Asia' },
  { name: 'Cherry', category: 'Stone fruit', origin: 'Europe' },
  { name: 'Date', category: 'Drupe', origin: 'Middle East' },
  { name: 'Elderberry', category: 'Berry', origin: 'Europe' },
  { name: 'Fig', category: 'Multiple fruit', origin: 'Mediterranean' },
  { name: 'Grape', category: 'Berry', origin: 'Near East' },
  { name: 'Honeydew', category: 'Pepo', origin: 'Africa' },
];

export default function BasicSample() {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Category</Table.Head>
          <Table.Head>Origin</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.name}>
            <Table.Cell>{r.name}</Table.Cell>
            <Table.Cell>{r.category}</Table.Cell>
            <Table.Cell>{r.origin}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
