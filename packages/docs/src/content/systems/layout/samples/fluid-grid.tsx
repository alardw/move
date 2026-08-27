import { Grid, Card, Stack, Text, Heading } from "move";

const panels = ["Revenue", "Sessions", "Signups", "Churn", "Latency", "Errors"];

export default function FluidGrid() {
  return (
    // Each child would like at least 220px. The container fits as many of those
    // as it can and shares out the rest, so the same markup is six across on a
    // wide page and one across in a narrow panel.
    <Grid minChildWidth="220px" gap="md">
      {panels.map((name) => (
        <Card.Root key={name}>
          <Card.Body>
            <Stack gap="xs">
              <Text size="sm" color="muted">
                {name}
              </Text>
              <Heading level={3}>—</Heading>
            </Stack>
          </Card.Body>
        </Card.Root>
      ))}
    </Grid>
  );
}
