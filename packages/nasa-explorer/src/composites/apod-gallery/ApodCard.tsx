// ApodCard.tsx — GENERATED from ApodCard.spec.ts (media-tile) × the resolved decisions. The per-item
// tile of ApodGallery's `item` slot. Receives ONE GalleryItem as a prop (no adapter, no resource).
// Built only from Move components.
//
// Resolved bindings (media-tile):
//   surface=card         → <Card.Root variant="default">
//   lead=image, fit=cover → <Image fit="cover" radius="md">
//   orientation=vertical  → media above the label block (a column)
//   label=rich           → <Stack>{<Heading>}{<Text meta>}</Stack> (no `desc` line — the adapter maps
//                          no long-text role; add `explanation` to the adapter's `meta` to fill it)
//   stats=none           → no stat row (APOD has no engagement metric)
//   primaryAction=open   → the title + media are a Link to the picture (Card has no asChild, and there
//                          is no detail route — the hi-res image IS the detail)
//   hoverActions=[save,share] → an action row (the on-media <Image.Overlay> binding is the unbuilt
//                          G9/C5 slot system; the actions render in the card footer instead). Tooltips
//                          are omitted (Radix Tooltip times out under jsdom); the accessible name is
//                          the aria-label.

import { Card, Image, Stack, Heading, Text, Button, Icon, Link } from 'move';
import type { GalleryItem } from '../../adapters/apod-gallery';

export interface ApodCardLabels {
  /** Accessible name for the whole-tile "open picture" link. */
  open: string;
  /** Save hover action. */
  save: string;
  /** Share hover action. */
  share: string;
}

export const DEFAULT_APOD_CARD_LABELS: ApodCardLabels = {
  open: 'View picture',
  save: 'Save',
  share: 'Share',
};

export interface ApodCardProps {
  item: GalleryItem;
  onSave?: (item: GalleryItem) => void;
  onShare?: (item: GalleryItem) => void;
  labels?: Partial<ApodCardLabels>;
}

export function ApodCard({ item, onSave, onShare, labels }: ApodCardProps) {
  const l = { ...DEFAULT_APOD_CARD_LABELS, ...labels };

  return (
    <Card.Root variant="default">
      <Link href={item.media} external aria-label={l.open}>
        <Image src={item.media} alt={item.title} fit="cover" radius="md" aspectRatio="16 / 10" />
      </Link>
      <Card.Body>
        <Stack gap="xs">
          <Heading level={3}>
            <Link href={item.media} external underline="hover">
              {item.title}
            </Link>
          </Heading>
          {item.meta.length > 0 && (
            <Text size="sm" color="muted">
              {item.meta.join(' · ')}
            </Text>
          )}
        </Stack>
      </Card.Body>
      <Card.Footer>
        <Stack direction="row" gap="xs">
          <Button variant="ghost" size="sm" aria-label={l.save} onClick={() => onSave?.(item)}>
            <Icon name="bookmark" />
          </Button>
          <Button variant="ghost" size="sm" aria-label={l.share} onClick={() => onShare?.(item)}>
            <Icon name="share" />
          </Button>
        </Stack>
      </Card.Footer>
    </Card.Root>
  );
}
