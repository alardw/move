import type React from 'react';

export type RecipeType = 'component' | 'composite';

export type Recipe = {
  id: string;
  title: string;
  description?: string;
  type: RecipeType;
  component: string;
  relatedComponents?: string[];
  tags?: string[];
  dependencies?: string[];
  assets?: string[];
  render: React.FC;
  code: string;
};
