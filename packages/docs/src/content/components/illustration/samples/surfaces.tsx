import { Card, Illustration, Stack, Text } from 'move';

/**
 * The same drawing, three grounds deep. Nothing in the artwork names a colour:
 * `illustration-ground`, `-panel` and `-panel-raised` are relative to whatever
 * the illustration is sitting on, so each level steps them along — and the
 * ground and the panel trade places as the surface alternates.
 */
function Chip() {
  return (
    <svg viewBox="0 0 220 92" width="220" height="92">
      <rect className="illustration-ground" x="0" y="0" width="220" height="92" rx="8" />
      <rect className="illustration-panel" x="12" y="12" width="196" height="68" rx="6" />
      <rect className="illustration-panel-raised" x="24" y="24" width="44" height="44" rx="5" />
      <rect className="illustration-text" x="80" y="32" width="86" height="9" rx="4" />
      <rect className="illustration-text-muted" x="80" y="50" width="60" height="7" rx="3" />
      <circle className="illustration-accent" cx="188" cy="46" r="10" />
    </svg>
  );
}

export default function SurfacesSample() {
  return (
    <Stack gap="md" align="stretch">
      <Stack gap="xs" align="stretch">
        <Text size="xs" color="subtle">
          On the page
        </Text>
        <Illustration title="A row on the page ground" size="full">
          <Chip />
        </Illustration>
      </Stack>

      <Card.Root>
        <Card.Body>
          <Stack gap="xs" align="stretch">
            <Text size="xs" color="subtle">
              Inside a Card — the ground and the panel have traded places
            </Text>
            <Illustration title="The same row, one ground deeper" size="full">
              <Chip />
            </Illustration>
          </Stack>
        </Card.Body>
      </Card.Root>

      <Card.Root>
        <Card.Body>
          <Card.Root>
            <Card.Body>
              <Stack gap="xs" align="stretch">
                <Text size="xs" color="subtle">
                  Inside a Card inside a Card — and back again
                </Text>
                <Illustration title="The same row, two grounds deep" size="full">
                  <Chip />
                </Illustration>
              </Stack>
            </Card.Body>
          </Card.Root>
        </Card.Body>
      </Card.Root>
    </Stack>
  );
}
