// MfaVerify.spec.ts — Recipe specification

import type { RecipeSpec } from '../spec-type';

export const spec = {
  schemaVersion: 1,
  name: 'MfaVerify',
  slug: 'mfa-verify',
  group: 'Authentication',
  groupSlug: 'authentication',
  title: 'MFA verify',
  description: 'Enter a six-digit one-time code to complete two-factor sign-in.',
  synonyms: ['two-factor', '2fa', 'mfa', 'otp', 'one-time code', 'verify', 'totp'],
  composition: ['Card', 'Stack', 'Heading', 'Text', 'PinInput', 'Button', 'Link'],
  behaviors: [
    'Renders inside a single Card surface (max-width 400).',
    'A 6-digit PinInput grouped 3 + 3.',
    'Validates the code on completion; an invalid code shows an error and clears the input.',
    'Submit is disabled until 6 digits are entered.',
    'Offers a "use a backup code instead" link.',
    'All user-facing copy is supplied through the labels prop (i18n).',
  ],
  integrationPoints: [
    { id: 'onVerify', kind: 'handler', description: 'Validate the entered TOTP code server-side (demo accepts "000000").' },
    { id: 'backupLink', kind: 'navigation', description: 'Switch to backup-code entry.' },
    { id: 'back', kind: 'navigation', description: 'Navigate back to the sign-in screen.' },
  ],
  labels: [
    { key: 'title', default: 'Two-factor authentication', description: 'Card heading.' },
    { key: 'description', default: 'Enter the 6-digit code from your authenticator app to continue.', description: 'Sub-heading.' },
    { key: 'invalidCode', default: 'Invalid verification code. Please try again.', description: 'Invalid-code error.' },
    { key: 'backupLink', default: 'Use a backup code instead', description: 'Backup-code link text.' },
    { key: 'back', default: 'Back to sign in', description: 'Back button text.' },
    { key: 'submit', default: 'Verify', description: 'Submit button text.' },
  ],
  preview: { bare: true, width: 'md' },
  defaultReview: { status: 'approved', decisionSource: 'rule-based' },
} satisfies RecipeSpec;
