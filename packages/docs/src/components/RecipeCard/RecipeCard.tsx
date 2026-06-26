import { Link as RouterLink } from 'react-router-dom';
import { Stack, Text, Badge } from 'move';
import type { RecipeMeta } from '../../content/recipes/registry';
import styles from './RecipeCard.module.css';

export interface RecipeCardProps {
  recipe: RecipeMeta;
}

/**
 * A recipe in the overview grid: a visual preview on top (a pre-rendered image
 * when one is supplied, otherwise the live recipe scaled into a clipped,
 * faded, non-interactive frame) and title + group + description below. The
 * whole card links to the recipe's detail page.
 */
export function RecipeCard({ recipe }: RecipeCardProps) {
  const { Component } = recipe;
  return (
    <RouterLink to={`/recipes/${recipe.groupSlug}/${recipe.slug}`} className={styles.card}>
      <div className={styles.frame}>
        {recipe.image ? (
          <img src={recipe.image} alt="" className={styles.image} />
        ) : (
          <>
            <div className={styles.scale} aria-hidden>
              <Component />
            </div>
            <div className={styles.fade} />
          </>
        )}
      </div>
      <Stack gap="xs" className={styles.body}>
        <Stack direction="row" gap="xs" align="center">
          <Text weight="medium">{recipe.title}</Text>
          <Badge variant="soft" size="sm">{recipe.group}</Badge>
        </Stack>
        <Text size="sm" color="muted">{recipe.description}</Text>
      </Stack>
    </RouterLink>
  );
}
