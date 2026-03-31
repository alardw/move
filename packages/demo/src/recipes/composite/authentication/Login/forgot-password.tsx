import ForgotPassword from '@recipes/composite/authentication/ForgotPassword';
import code from '@recipes/composite/authentication/ForgotPassword.tsx?raw';
import type { Recipe } from '../../../types';

export const recipe: Recipe = {
  id: 'authentication/login:forgot-password',
  title: 'Forgot Password',
  description: 'Email input with confirmation state for password reset requests.',
  type: 'composite',
  component: 'Sign in',
  relatedComponents: ['Card', 'Stack', 'Heading', 'Text', 'FormField', 'InputText', 'Button', 'Link', 'Alert'],
  render: ForgotPassword,
  code,
};
