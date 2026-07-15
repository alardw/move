import { Badge, Card, Stack, Text } from "move";

/**
 * A few common pairings — Badge alongside titles, in list items,
 * and as inline status next to text. The size scales with the
 * surrounding type so it never looks bolted on.
 */
export default function InContextSample() {
  return (
    <Stack gap="md">
      <Card.Root>
        <Card.Header>
          <Stack direction="row" gap="sm" align="center">
            <Card.Title>Marketing site</Card.Title>
            <Badge variant="soft" color="green">
              Active
            </Badge>
          </Stack>
          <Card.Description>
            Last deploy 3 minutes ago by alex@acme.co
          </Card.Description>
        </Card.Header>
      </Card.Root>
      <Card.Root>
        <Card.Header>
          <Stack direction="row" gap="sm" align="center">
            <Card.Title>Legacy admin</Card.Title>
            <Badge variant="soft" color="yellow">
              Maintenance
            </Badge>
          </Stack>
          <Card.Description>
            Read-only until the v3 rewrite ships next quarter.
          </Card.Description>
        </Card.Header>
      </Card.Root>
      <Card.Root>
        <Card.Header>
          <Stack direction="row" gap="sm" align="center">
            <Card.Title>Analytics ETL</Card.Title>
            <Badge variant="dot" color="red">
              Failing
            </Badge>
          </Stack>
          <Card.Description>
            Job has been retrying for 2 hours — paged the data team.
          </Card.Description>
        </Card.Header>
      </Card.Root>
      <Stack direction="row" gap="sm" align="center">
        <Text>Tags:</Text>
        <Badge variant="surface" color="indigo">
          design
        </Badge>
        <Badge variant="surface" color="teal">
          accessibility
        </Badge>
        <Badge variant="surface" color="orange">
          performance
        </Badge>
      </Stack>
    </Stack>
  );
}
