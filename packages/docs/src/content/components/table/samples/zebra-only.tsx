import { Table } from 'move';

// variant="ghost" is a blank canvas — no frame, no rules, no header
// underline. Combined with `striped`, the zebra is the only visual
// structure the table carries.
const rows = [
  { album: 'Kind of Blue', artist: 'Miles Davis', year: 1959 },
  { album: 'A Love Supreme', artist: 'John Coltrane', year: 1965 },
  { album: 'Giant Steps', artist: 'John Coltrane', year: 1960 },
  { album: 'Mingus Ah Um', artist: 'Charles Mingus', year: 1959 },
  { album: 'Time Out', artist: 'Dave Brubeck Quartet', year: 1959 },
];

export default function ZebraOnlySample() {
  return (
    <Table variant="ghost" striped>
      <Table.Header>
        <Table.Row>
          <Table.Head>Album</Table.Head>
          <Table.Head>Artist</Table.Head>
          <Table.Head>Year</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.album}>
            <Table.Cell>{r.album}</Table.Cell>
            <Table.Cell>{r.artist}</Table.Cell>
            <Table.Cell>{r.year}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
