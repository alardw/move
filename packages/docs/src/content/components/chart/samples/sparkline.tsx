import { Card, Chart, Stack, Table, Text } from "move";

const rows = [
  { metric: "Visits", value: "12,480", delta: "+8.2%", color: "indigo" as const, series: [32, 41, 38, 46, 52, 49, 61] },
  { metric: "Signups", value: "1,204", delta: "+3.1%", color: "teal" as const, series: [12, 14, 13, 15, 14, 16, 17] },
  { metric: "Churn", value: "0.9%", delta: "−0.4%", color: "orange" as const, series: [9, 8, 8, 7, 6, 6, 5] },
];

const spark = (values: number[]) =>
  values.map((v, i) => ({ day: `d${i}`, v }));

/**
 * A sparkline is not a separate component — it is a Chart with everything
 * explanatory turned off, sized to sit inside something else.
 *
 * `axes={false}` is what makes it one: with no tick labels there is nothing to
 * leave room for, so the margins collapse and the drawing fills its box. At this
 * size the chart carries shape only; the number beside it carries the reading.
 * The caption is hidden rather than dropped, so each shape still has an
 * accessible name and its own data table.
 */
export default function SparklineSample() {
  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>This week</Card.Title>
        <Card.Description>Seven-day trend against the current figure.</Card.Description>
      </Card.Header>
      <Card.Body>
        <Table.Root variant="lines" size="sm">
          <Table.Body>
            {rows.map((row) => (
              <Table.Row key={row.metric}>
                <Table.Cell>
                  <Text weight="medium">{row.metric}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Stack direction="row" gap="sm" align="center">
                    <Text weight="medium">{row.value}</Text>
                    <Text size="sm">{row.delta}</Text>
                  </Stack>
                </Table.Cell>
                <Table.Cell>
                  <Chart
                    caption={`${row.metric}, seven-day trend`}
                    hideCaption
                    data={spark(row.series)}
                    x="day"
                    axes={false}
                    grid="none"
                    legend={false}
                    tooltip={false}
                    dataTable={false}
                    curve="monotone"
                    height={28}
                    series={[{ key: "v", type: "area", label: row.metric, color: row.color }]}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card.Body>
    </Card.Root>
  );
}
