import MfaVerify from '@recipes/composite/authentication/MfaVerify';
import code from '@recipes/composite/authentication/MfaVerify.tsx?raw';
import type { Recipe } from '../../../types';

export const recipe: Recipe = {
  id: 'authentication/multi-factor:verify',
  title: 'Verify',
  description: '6-digit PIN input for multi-factor authentication verification.',
  type: 'composite',
  component: 'Multi-factor auth',
  relatedComponents: ['Card', 'Stack', 'Heading', 'Text', 'PinInput', 'Button', 'Link', 'Alert'],
  render: MfaVerify,
  code,
};
