import { Button, Card } from 'move';

export default function BasicSample() {
  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>Quarterly review</Card.Title>
        <Card.Description>The quick summary of how the last 90 days went, before the all-hands tomorrow.</Card.Description>
      </Card.Header>
      <Card.Body>
        Revenue is up 14% on the prior quarter, customer satisfaction is steady, and we shipped twice
        as many releases as last quarter without bumping the on-call burden. Slides are linked in the
        agenda — they’re short, and there’s a hidden joke on slide 9.
      </Card.Body>
      <Card.Footer>
        <Card.FooterEnd>
          <Button variant="ghost">Skip</Button>
          <Button>Open slides</Button>
        </Card.FooterEnd>
      </Card.Footer>
    </Card.Root>
  );
}
