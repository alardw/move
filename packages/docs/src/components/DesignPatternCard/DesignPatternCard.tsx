import { Link as RouterLink } from 'react-router-dom';
import { Stack, Text, Badge } from 'move';
import type { PatternMeta } from '@move-patterns/registry';
import styles from './DesignPatternCard.module.css';

export interface DesignPatternCardProps {
  pattern: PatternMeta;
}

const SCALE_COLOR = {
  composite: 'blue',
  page: 'teal',
  feature: 'orange',
  shell: 'cyan',
} as const;

/**
 * A design pattern in the overview grid. Patterns are specs, not live components,
 * so the card is text-only — title, scale, description. `available` patterns link
 * to their detail page (stretched title link covers the whole card); `planned` ones
 * are dimmed and inert, showing the roadmap.
 */
export function DesignPatternCard({ pattern }: DesignPatternCardProps) {
  const available = pattern.status === 'available';
  return (
    <div className={styles.card} data-planned={available ? undefined : true}>
      <Stack gap="sm" className={styles.body}>
        <Stack direction="row" gap="sm" align="center" justify="between">
          {available ? (
            <RouterLink to={`/design-patterns/${pattern.slug}`} className={styles.titleLink}>
              <Text weight="medium">{pattern.title}</Text>
            </RouterLink>
          ) : (
            <Text weight="medium" color="muted">
              {pattern.title}
            </Text>
          )}
          <Stack direction="row" gap="xs" align="center">
            <Badge variant="soft" size="sm" color={SCALE_COLOR[pattern.scale]}>
              {pattern.scale}
            </Badge>
            {!available && (
              <Badge variant="soft" size="sm">
                planned
              </Badge>
            )}
          </Stack>
        </Stack>
        <Text size="sm" color="muted">
          {pattern.description}
        </Text>
        <Badge variant="soft" size="sm">
          {pattern.group}
        </Badge>
      </Stack>
    </div>
  );
}
