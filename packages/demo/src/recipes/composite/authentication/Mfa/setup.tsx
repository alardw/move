import MfaSetup from '@recipes/composite/authentication/MfaSetup';
import code from '@recipes/composite/authentication/MfaSetup.tsx?raw';
import type { Recipe } from '../../../types';

export const recipe: Recipe = {
  id: 'authentication/multi-factor:setup',
  title: 'Setup',
  description: 'Two-step MFA setup: scan QR code, then verify with PIN.',
  type: 'composite',
  component: 'Multi-factor auth',
  relatedComponents: ['Card', 'Stack', 'Heading', 'Text', 'Badge', 'PinInput', 'Button', 'Code', 'Image'],
  render: MfaSetup,
  code,
};
