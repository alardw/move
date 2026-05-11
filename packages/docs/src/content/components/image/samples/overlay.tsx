import { Button, Icon, Image, Stack } from 'move';

const photos = [
  { id: 1015, alt: 'Mountain river' },
  { id: 1018, alt: 'Bridge over canyon' },
  { id: 1043, alt: 'Sunlit cliffs' },
];

/**
 * Pass an `action` node and Image renders it as a translucent overlay
 * that fades in on hover or keyboard focus. Combine with `interactive`
 * for a clickable tile whose hover state surfaces the actions.
 */
export default function OverlaySample() {
  return (
    <Stack direction="row" gap="md" wrap>
      {photos.map((p) => (
        <Image
          key={p.id}
          src={`https://picsum.photos/id/${p.id}/400/300`}
          alt={p.alt}
          width={220}
          aspectRatio="4/3"
          radius="md"
          interactive
          onClick={() => undefined}
          action={
            <Stack direction="row" gap="sm">
              <Button variant="secondary" size="sm" aria-label="Favourite">
                <Icon name="heart" />
              </Button>
              <Button variant="secondary" size="sm" aria-label="Share">
                <Icon name="share-2" />
              </Button>
              <Button variant="danger" size="sm" aria-label="Delete">
                <Icon name="trash-2" />
              </Button>
            </Stack>
          }
        />
      ))}
    </Stack>
  );
}
