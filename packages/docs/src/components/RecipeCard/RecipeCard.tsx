import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, Text, Badge } from 'move';
import type { RecipeMeta } from '@move-recipes/registry';
import { PREVIEW_WIDTHS } from '../../content/components/types';
import styles from './RecipeCard.module.css';

export interface RecipeCardProps {
  recipe: RecipeMeta;
}

/**
 * A recipe in the overview grid — same treatment as ComponentCard: a live
 * preview floating on a brand-tinted backdrop, tilted into an isometric-ish
 * projection, with title + group + description below. The preview is decorative
 * (aria-hidden, non-interactive); a stretched title link makes the whole card
 * clickable WITHOUT wrapping the live recipe — which itself contains anchors —
 * in an outer <a>. Width/bare come from the recipe's `preview`, the same model
 * components use.
 */
export function RecipeCard({ recipe }: RecipeCardProps) {
  const { Component } = recipe;
  const preview = recipe.preview ?? {};
  const hasIntegration = (recipe.spec?.integrationPoints?.length ?? 0) > 0;
  // Recipes are mostly full flows/layouts → default to the widest panel.
  const width = preview.width ?? 'full';
  const bare = preview.bare ?? false;
  const image = preview.image;

  // Render flat first, then tilt on mount — mirrors ComponentCard: any
  // sliding/measured indicators inside a recipe position via
  // getBoundingClientRect, which is wrong inside a CSS transform. Let the
  // recipe measure untransformed, then apply the iso transform.
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
      {/* Decorative preview — hidden from a11y and non-interactive so the card's
          stretched title link never wraps the recipe's own anchors. */}
      <div className={styles.frame} aria-hidden>
        {image ? (
          <img src={image} alt="" className={styles.image} />
        ) : (
          <div
            className={tiltClass}
            style={width !== 'fit' && width !== 'full' ? { width: PREVIEW_WIDTHS[width] } : undefined}
          >
            <Component />
          </div>
        )}
      </div>
      <Stack gap="xs" className={styles.body}>
        <Stack direction="row" gap="sm" align="center" justify="between">
          {/* Stretched link — the ::after covers the whole card. */}
          <RouterLink
            to={`/recipes/${recipe.groupSlug}/${recipe.slug}`}
            className={styles.titleLink}
          >
            <Text weight="medium">{recipe.title}</Text>
          </RouterLink>
          <Stack direction="row" gap="xs" align="center">
            {hasIntegration && (
              <Badge variant="soft" size="sm" color="info">Integration</Badge>
            )}
            <Badge variant="soft" size="sm">{recipe.group}</Badge>
          </Stack>
        </Stack>
        <Text size="sm" color="muted">{recipe.description}</Text>
      </Stack>
    </div>
  );
}
