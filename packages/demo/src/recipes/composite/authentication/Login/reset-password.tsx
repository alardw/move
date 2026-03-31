import ResetPassword from '@recipes/composite/authentication/ResetPassword';
import code from '@recipes/composite/authentication/ResetPassword.tsx?raw';
import type { Recipe } from '../../../types';

export const recipe: Recipe = {
  id: 'authentication/login:reset-password',
  title: 'Reset Password',
  description: 'New password and confirmation with validation.',
  type: 'composite',
  component: 'Sign in',
  relatedComponents: ['Card', 'Stack', 'Heading', 'Text', 'FormField', 'Password', 'Button', 'Alert'],
  render: ResetPassword,
  code,
};
