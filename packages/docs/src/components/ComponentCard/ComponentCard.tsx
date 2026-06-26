import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, Text, Badge, Icon } from 'move';
import type { ComponentContent } from '../../content/components/types';
import styles from './ComponentCard.module.css';

export interface ComponentCardProps {
  content: ComponentContent;
  /** Override the preview image (otherwise `meta.preview.image` is used). */
  image?: string;
}

/** Mounts its preview only once the card scrolls near the viewport, so a
 *  ~65-card grid never renders every live sample at once. */
function useInView(rootMargin = '300px') {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [inView, rootMargin]);
  return { ref, inView };
}

export function ComponentCard({ content, image }: ComponentCardProps) {
  const { meta, samples } = content;
  const preview = meta.preview ?? {};
  const category = meta.badges[0]?.label ?? 'Component';
  const icon = meta.badges[0]?.icon ?? 'box';
  const previewImage = image ?? preview.image;
  const sample = preview.sample
    ? samples?.find((s) => s.id === preview.sample)
    : samples?.[0];
  const Sample = sample?.render;
  const { ref, inView } = useInView();

  // Measure flat, then tilt. The sliding indicators (Tabs, Pagination,
  // TableOfContents…) position via getBoundingClientRect, which is wrong inside
  // a CSS transform. We let the sample mount + measure UNtransformed, then apply
  // the iso transform (a transform doesn't re-trigger the measurement), so the
  // highlight stays correct and just tilts along — all in the docs, no
  // component change.
  const [tilted, setTilted] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setTilted(true), 150);
    return () => clearTimeout(t);
  }, [inView]);

  const tiltClass = [
    styles.tilt,
    tilted && styles.tiltActive,
    preview.layout === 'fit' && styles.tiltNarrow,
    preview.bare && styles.tiltBare,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <RouterLink to={`/components/${meta.slug}`} className={styles.card}>
      <div className={styles.frame} ref={ref}>
        {previewImage ? (
          <img src={previewImage} alt="" className={styles.image} />
        ) : Sample ? (
          <div
            className={tiltClass}
            style={preview.maxWidth ? { maxWidth: preview.maxWidth } : undefined}
            aria-hidden
          >
            {inView ? <Sample /> : null}
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
