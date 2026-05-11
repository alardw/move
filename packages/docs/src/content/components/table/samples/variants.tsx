import { Stack, Text, Table } from 'move';

const rows = [
  { city: 'Amsterdam', country: 'Netherlands', population: '873,000' },
  { city: 'Berlin', country: 'Germany', population: '3,769,000' },
  { city: 'Paris', country: 'France', population: '2,148,000' },
];

const variants = ['ghost', 'lines', 'surface', 'bordered'] as const;

export default function VariantsSample() {
  return (
    <Stack gap="lg">
      {variants.map((variant) => (
        <Stack key={variant} gap="xs">
          <Text size="sm" color="muted" weight="medium">variant="{variant}"</Text>
          <Table variant={variant}>
            <Table.Header>
              <Table.Row>
                <Table.Head>City</Table.Head>
                <Table.Head>Country</Table.Head>
                <Table.Head>Population</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rows.map((r) => (
                <Table.Row key={r.city}>
                  <Table.Cell>{r.city}</Table.Cell>
                  <Table.Cell>{r.country}</Table.Cell>
                  <Table.Cell>{r.population}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Stack>
      ))}
    </Stack>
  );
}
