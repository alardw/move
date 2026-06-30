import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, Text, Badge, Icon } from 'move';
import type { ComponentContent } from '../../content/components/types';
import { PREVIEW_WIDTHS, type PreviewWidth } from '../../content/components/types';
import { TAXONOMY_BY_ID } from '../../content/components/taxonomies';
import styles from './ComponentCard.module.css';

export interface ComponentCardProps {
  content: ComponentContent;
  /** Override the preview image (otherwise `meta.preview.image` is used). */
  image?: string;
}

export function ComponentCard({ content, image }: ComponentCardProps) {
  const { meta, samples, preview: PreviewComponent } = content;
  const metaPreview = meta.preview ?? {};
  // Overlays declare preview behaviour in the spec (`preview.staged/bare/width`)
  // and ship a card-only `content.preview` render; everything else uses the
  // hand-authored docs `meta.preview`. Spec wins for bare/width.
  const specPreview = (content.spec?.preview ?? {}) as {
    staged?: boolean;
    bare?: boolean;
    width?: PreviewWidth;
  };
  const bare = specPreview.bare ?? metaPreview.bare;
  // Default to a contained width so every preview fits within the card boundary
  // (EmptyState's size); components opt into 'fit', a larger size, or 'full'.
  const width = specPreview.width ?? metaPreview.width ?? 'sm';
  const cat = TAXONOMY_BY_ID[meta.categories?.[0] ?? ''];
  const category = cat?.label ?? 'Component';
  const icon = cat?.icon ?? 'box';
  // "Bring your own X": the component declares typed integration points (adapters).
  const hasIntegration =
    ((content.spec?.integrationPoints as unknown[] | undefined)?.length ?? 0) > 0;
  const previewImage = image ?? metaPreview.image;
  const sample = metaPreview.sample
    ? samples?.find((s) => s.id === metaPreview.sample)
    : samples?.[0];
  const Sample = sample?.render;

  // Render flat first, then tilt on mount: the sliding indicators (Tabs,
  // Pagination, TableOfContents…) position via getBoundingClientRect, which is
  // wrong inside a CSS transform. Letting the sample measure untransformed, then
  // applying the iso transform (which doesn't re-trigger measurement), keeps the
  // highlight correct. Visible from page load — no scroll-triggered mount.
  const [tilted, setTilted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setTilted(true), 150);
    return () => clearTimeout(t);
  }, []);

  const tiltClass = [
    styles.tilt,
    tilted && styles.tiltActive,
    width === 'fit' && styles.tiltNarrow,
    bare && styles.tiltBare,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.card}>
      {/* The preview is decorative — hidden from a11y and non-interactive
          (pointer-events: none in CSS) so the card (a div with a stretched
          title link) never wraps the sample's own anchors. */}
      <div className={styles.frame} aria-hidden>
        {previewImage ? (
          <img src={previewImage} alt="" className={styles.image} />
        ) : PreviewComponent ? (
          <div
            className={tiltClass}
            style={width !== 'fit' && width !== 'full' ? { width: PREVIEW_WIDTHS[width] } : undefined}
          >
            <PreviewComponent />
          </div>
        ) : Sample ? (
          <div
            className={tiltClass}
            style={width !== 'fit' && width !== 'full' ? { width: PREVIEW_WIDTHS[width] } : undefined}
          >
            <Sample />
          </div>
        ) : (
          <span className={styles.iconTile}>
            <Icon name={icon} size={24} />
          </span>
        )}
      </div>
      <Stack gap="xs" className={styles.body}>
        <Stack direction="row" gap="sm" align="center" justify="between">
          {/* Stretched link — the ::after covers the whole card. */}
          <RouterLink to={`/components/${meta.slug}`} className={styles.titleLink}>
            <Text weight="medium">{meta.name}</Text>
          </RouterLink>
          <Stack direction="row" gap="xs" align="center">
            {hasIntegration && (
              <Badge variant="soft" size="sm" color="info">Integration</Badge>
            )}
            <Badge variant="soft" size="sm">{category}</Badge>
          </Stack>
        </Stack>
        <Text size="sm" color="muted">{meta.tagline}</Text>
      </Stack>
    </div>
  );
}
