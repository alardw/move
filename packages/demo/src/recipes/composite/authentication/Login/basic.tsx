import SignIn from '@recipes/composite/authentication/SignIn';
import code from '@recipes/composite/authentication/SignIn.tsx?raw';
import type { Recipe } from '../../../types';

export const recipe: Recipe = {
  id: 'authentication/login:basic',
  title: 'Basic',
  description: 'A simple login form with email, password, remember me, and forgot password link.',
  type: 'composite',
  component: 'Sign in',
  relatedComponents: ['Card', 'Stack', 'Heading', 'FormField', 'InputText', 'Password', 'Checkbox', 'Button', 'Link'],
  render: SignIn,
  code,
};
