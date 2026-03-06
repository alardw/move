import type { Recipe } from './types';
import { buttonRecipes } from './component/Button';

export const recipes: Recipe[] = [
  ...buttonRecipes,
];
