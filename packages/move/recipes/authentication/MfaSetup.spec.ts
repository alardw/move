// MfaSetup.spec.ts — Recipe specification

import type { RecipeSpec } from '../spec-type';

export const spec = {
  schemaVersion: 1,
  name: 'MfaSetup',
  slug: 'mfa-setup',
  group: 'Authentication',
  groupSlug: 'authentication',
  title: 'MFA setup',
  description: 'Enroll in two-factor auth: scan a QR code and confirm with a one-time code.',
  synonyms: ['two-factor', '2fa', 'mfa', 'totp', 'authenticator', 'qr code', 'enroll'],
  composition: ['Card', 'Stack', 'Heading', 'Text', 'PinInput', 'Button', 'Code', 'Badge', 'Image'],
  behaviors: [
    'Renders inside a single Card surface (max-width 440) with a step badge.',
    'Two-step flow: scan (QR code + backup codes) then verify (6-digit code).',
    'Continue advances scan → verify; Back returns verify → scan.',
    'The verify step validates a 6-digit code; an invalid code shows an error and clears the input.',
    'The verify submit is disabled until 6 digits are entered.',
    'All user-facing copy is supplied through the labels prop (i18n).',
  ],
  integrationPoints: [
    { id: 'qrCode', kind: 'asset', description: 'Provide the real TOTP provisioning QR image (replaces the demo /qr-demo.svg).' },
    { id: 'backupCodes', kind: 'data', description: 'Generate and supply real one-time backup codes (replaces the demo set).' },
    { id: 'onVerify', kind: 'handler', description: 'Validate the entered TOTP code server-side and activate MFA (demo accepts any 6 digits).' },
    { id: 'onCancel', kind: 'handler', description: 'Dismiss setup without enrolling.' },
  ],
  labels: [
    { key: 'title', default: 'Set up two-factor authentication', description: 'Card heading.' },
    { key: 'stepLabel', default: 'Step {n} of {total}', description: 'Step indicator badge.', params: ['n', 'total'] },
    { key: 'scanDescription', default: 'Scan the QR code below with your authenticator app (Google Authenticator, Authy, etc.).', description: 'Scan-step instruction.' },
    { key: 'qrAlt', default: 'Scan this QR code with your authenticator app', description: 'QR image alt text.' },
    { key: 'backupTitle', default: 'Backup codes', description: 'Backup-codes heading.' },
    { key: 'backupDescription', default: 'Save these codes in a safe place. You can use them to sign in if you lose access to your authenticator app.', description: 'Backup-codes hint.' },
    { key: 'verifyDescription', default: 'Enter the 6-digit code shown in your authenticator app to verify setup.', description: 'Verify-step instruction.' },
    { key: 'invalidCode', default: 'Invalid code. Please try again.', description: 'Invalid-code error.' },
    { key: 'cancel', default: 'Cancel', description: 'Cancel button text.' },
    { key: 'continue', default: 'Continue', description: 'Advance-to-verify button text.' },
    { key: 'back', default: 'Back', description: 'Return-to-scan button text.' },
    { key: 'submit', default: 'Verify & activate', description: 'Verify submit button text.' },
  ],
  preview: { bare: true, width: 'md' },
  defaultReview: { status: 'approved', decisionSource: 'rule-based' },
} satisfies RecipeSpec;
