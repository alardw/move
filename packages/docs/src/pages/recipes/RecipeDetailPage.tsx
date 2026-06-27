import { useParams, Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Badge } from 'move';
import { Preview } from '../../components';
import { getRecipe } from '../../content/recipes/registry';

export function RecipeDetailPage() {
  const { group = '', slug = '' } = useParams();
  const recipe = getRecipe(group, slug);

  if (!recipe) {
    return (
      <Stack gap="md" id="recipe">
        <Heading level={1}>Recipe not found</Heading>
        <Text color="muted">There’s no recipe at /recipes/{group}/{slug}.</Text>
        <RouterLink to="/recipes">← Back to recipes</RouterLink>
      </Stack>
    );
  }

  const { Component } = recipe;

  return (
    <Stack gap="xl" id="recipe">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Breadcrumb.Link asChild>
            <RouterLink to="/">Docs</RouterLink>
          </Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Link asChild>
            <RouterLink to="/recipes">Recipes</RouterLink>
          </Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Page>{recipe.title}</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Stack gap="sm">
        <Stack direction="row" gap="xs" align="center">
          <Heading level={1}>{recipe.title}</Heading>
          <Badge variant="soft">{recipe.group}</Badge>
        </Stack>
        <Text color="muted" size="lg">{recipe.description}</Text>
      </Stack>

      <div id="preview">
        <Preview code={recipe.source}>
          <Component />
        </Preview>
      </div>
    </Stack>
  );
}
