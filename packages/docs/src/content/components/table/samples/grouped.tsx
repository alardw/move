import { Table } from 'move';

const quarters = [
  {
    label: '2025 Q3',
    rows: [
      { region: 'EU', sales: '$420,300', deals: 34 },
      { region: 'US', sales: '$612,900', deals: 41 },
      { region: 'APAC', sales: '$178,500', deals: 12 },
    ],
  },
  {
    label: '2025 Q4',
    rows: [
      { region: 'EU', sales: '$498,100', deals: 37 },
      { region: 'US', sales: '$701,200', deals: 48 },
      { region: 'APAC', sales: '$204,800', deals: 15 },
    ],
  },
];

export default function GroupedSample() {
  return (
    <Table variant="lines" hoverable>
      <Table.Header>
        <Table.Row>
          <Table.Head>Region</Table.Head>
          <Table.Head>Sales</Table.Head>
          <Table.Head>Deals</Table.Head>
        </Table.Row>
      </Table.Header>
      {quarters.map((q, i) => (
        <Table.Group key={q.label} defaultOpen={i === 0}>
          <Table.GroupHeader>{q.label}</Table.GroupHeader>
          {q.rows.map((r) => (
            <Table.Row key={r.region}>
              <Table.Cell>{r.region}</Table.Cell>
              <Table.Cell>{r.sales}</Table.Cell>
              <Table.Cell>{r.deals}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Group>
      ))}
    </Table>
  );
}
