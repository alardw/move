import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, Text, Badge, Icon } from 'move';
import type { ComponentContent } from '../../content/components/types';
import styles from './ComponentCard.module.css';

/** Components with a container query that collapses below a breakpoint — their
 *  preview must stay at the full desktop width, not hug content. */
const WIDE_PREVIEW = new Set(['list', 'form-field', 'image-group']);

export interface ComponentCardProps {
  content: ComponentContent;
  /**
   * Optional pre-rendered preview image. When present the card shows this
   * instead of the live sample — the slot we'll fill once component
   * thumbnails are automated.
   */
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
  const category = meta.badges[0]?.label ?? 'Component';
  const icon = meta.badges[0]?.icon ?? 'box';
  const Sample = samples?.[0]?.render;
  const { ref, inView } = useInView();

  return (
    <RouterLink to={`/components/${meta.slug}`} className={styles.card}>
      <div className={styles.frame} ref={ref}>
        {image ? (
          <img src={image} alt="" className={styles.image} />
        ) : Sample ? (
          <div
            className={WIDE_PREVIEW.has(meta.slug) ? `${styles.tilt} ${styles.tiltWide}` : styles.tilt}
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
