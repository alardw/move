import type { Recipe } from './types';
import { buttonRecipes } from './component/ButtonRecipes';

export const recipes: Recipe[] = [
  ...buttonRecipes,
];
