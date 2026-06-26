import { Link as RouterLink } from 'react-router-dom';
import { Stack, Text, Badge, Icon } from 'move';
import type { ComponentContent } from '../../content/components/types';
import styles from './ComponentCard.module.css';

export interface ComponentCardProps {
  content: ComponentContent;
  /**
   * Optional pre-rendered preview image. When present the card shows this on
   * top — the slot we'll fill once component thumbnails are automated. Until
   * then the card is icon-led to stay light on a ~65-item grid.
   */
  image?: string;
}

export function ComponentCard({ content, image }: ComponentCardProps) {
  const { meta } = content;
  const category = meta.badges[0]?.label ?? 'Component';
  const icon = meta.badges[0]?.icon ?? 'box';
  return (
    <RouterLink to={`/components/${meta.slug}`} className={styles.card}>
      {image && <img src={image} alt="" className={styles.image} />}
      <Stack gap="sm" className={styles.body}>
        <Stack direction="row" gap="sm" align="center" justify="between">
          <Stack direction="row" gap="sm" align="center">
            {!image && (
              <span className={styles.iconTile}>
                <Icon name={icon} />
              </span>
            )}
            <Text weight="medium">{meta.name}</Text>
          </Stack>
          <Badge variant="soft" size="sm">{category}</Badge>
        </Stack>
        <Text size="sm" color="muted">{meta.tagline}</Text>
      </Stack>
    </RouterLink>
  );
}
