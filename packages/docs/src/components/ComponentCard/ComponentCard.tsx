import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, Text, Badge, Icon } from 'move';
import type { ComponentContent } from '../../content/components/types';
import { PREVIEW_WIDTHS } from '../../content/components/types';
import { TAXONOMY_BY_ID } from '../../content/components/taxonomies';
import styles from './ComponentCard.module.css';

export interface ComponentCardProps {
  content: ComponentContent;
  /** Override the preview image (otherwise `meta.preview.image` is used). */
  image?: string;
}

export function ComponentCard({ content, image }: ComponentCardProps) {
  const { meta, samples } = content;
  const preview = meta.preview ?? {};
  // Default to a contained width so every preview fits within the card boundary
  // (EmptyState's size); components opt into 'fit', a larger size, or 'full'.
  const width = preview.width ?? 'sm';
  const cat = TAXONOMY_BY_ID[meta.categories?.[0] ?? ''];
  const category = cat?.label ?? 'Component';
  const icon = cat?.icon ?? 'box';
  const previewImage = image ?? preview.image;
  const sample = preview.sample
    ? samples?.find((s) => s.id === preview.sample)
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
    preview.bare && styles.tiltBare,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <RouterLink to={`/components/${meta.slug}`} className={styles.card}>
      <div className={styles.frame}>
        {previewImage ? (
          <img src={previewImage} alt="" className={styles.image} />
        ) : Sample ? (
          <div
            className={tiltClass}
            style={width !== 'fit' && width !== 'full' ? { width: PREVIEW_WIDTHS[width] } : undefined}
            aria-hidden
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
          <Text weight="medium">{meta.name}</Text>
          <Badge variant="soft" size="sm">{category}</Badge>
        </Stack>
        <Text size="sm" color="muted">{meta.tagline}</Text>
      </Stack>
    </RouterLink>
  );
}
