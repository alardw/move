// ResetPassword.spec.ts — Recipe specification

import type { RecipeSpec } from '../spec-type';

export const spec = {
  schemaVersion: 1,
  name: 'ResetPassword',
  slug: 'reset-password',
  group: 'Authentication',
  groupSlug: 'authentication',
  title: 'Reset password',
  description: 'Choose a new password with a confirmation field.',
  synonyms: ['new password', 'change password', 'set password', 'reset'],
  composition: ['Card', 'Stack', 'Heading', 'Text', 'FormField', 'Password', 'Button', 'Link'],
  behaviors: [
    'Renders inside a single Card surface (max-width 400).',
    'Two controlled Password fields (new + confirm), each wrapped in FormField.',
    'Shows a mismatch error on the confirm field when it differs from the new password.',
    'Submit is disabled until the password is at least 8 characters and both fields match.',
    'On submit, shows a success view.',
    'All user-facing copy is supplied through the labels prop (i18n).',
  ],
  integrationPoints: [
    { id: 'onSubmit', kind: 'handler', description: 'Set the new password using the reset token.' },
    { id: 'backToSignIn', kind: 'navigation', description: 'Navigate back to the sign-in screen.' },
  ],
  labels: [
    { key: 'title', default: 'Reset password', description: 'Card heading.' },
    { key: 'description', default: 'Enter your new password below.', description: 'Sub-heading.' },
    { key: 'newPasswordLabel', default: 'New password', description: 'New-password field label.' },
    {
      key: 'newPasswordPlaceholder',
      default: 'At least 8 characters',
      description: 'New-password placeholder.',
    },
    {
      key: 'newPasswordHint',
      default: 'Must be at least 8 characters',
      description: 'New-password hint.',
    },
    { key: 'confirmLabel', default: 'Confirm password', description: 'Confirm field label.' },
    {
      key: 'confirmPlaceholder',
      default: 'Repeat your password',
      description: 'Confirm field placeholder.',
    },
    {
      key: 'mismatchError',
      default: 'Passwords do not match',
      description: 'Confirm mismatch error.',
    },
    { key: 'submit', default: 'Reset password', description: 'Submit button text.' },
    { key: 'backToSignIn', default: 'Back to sign in', description: 'Footer link text.' },
    { key: 'successTitle', default: 'Password reset', description: 'Success heading.' },
    {
      key: 'successDescription',
      default:
        'Your password has been successfully reset. You can now sign in with your new password.',
      description: 'Success body.',
    },
    {
      key: 'successAction',
      default: 'Back to sign in',
      description: 'Success action button text.',
    },
  ],
  preview: { bare: true, width: 'md' },
} satisfies RecipeSpec;
