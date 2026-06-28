// ForgotPassword.spec.ts — Recipe specification

import type { RecipeSpec } from '../spec-type';

export const spec = {
  schemaVersion: 1,
  name: 'ForgotPassword',
  slug: 'forgot-password',
  group: 'Authentication',
  groupSlug: 'authentication',
  title: 'Forgot password',
  description: 'Request a password-reset link by email, with a back-to-sign-in link.',
  synonyms: ['reset', 'recover', 'password recovery', 'forgot', 'email reset'],
  composition: ['Card', 'Stack', 'Heading', 'Text', 'FormField', 'InputText', 'Button', 'Link'],
  behaviors: [
    'Renders inside a single Card surface (max-width 400).',
    'Email is a controlled text input wrapped in FormField.',
    'Submit is disabled until an email is entered.',
    'On submit, shows a confirmation view that echoes the entered email.',
    'The confirmation view offers a "try another email" action that returns to the form.',
    'All user-facing copy is supplied through the labels prop (i18n).',
  ],
  integrationPoints: [
    { id: 'onSubmit', kind: 'handler', description: 'Request a password-reset link for the entered email.' },
    { id: 'backToSignIn', kind: 'navigation', description: 'Navigate back to the sign-in screen.' },
  ],
  labels: [
    { key: 'title', default: 'Forgot password?', description: 'Card heading.' },
    { key: 'description', default: "Enter your email and we'll send you a link to reset your password.", description: 'Sub-heading.' },
    { key: 'emailLabel', default: 'Email', description: 'Email field label.' },
    { key: 'emailPlaceholder', default: 'you@example.com', description: 'Email field placeholder.' },
    { key: 'submit', default: 'Send reset link', description: 'Submit button text.' },
    { key: 'backToSignIn', default: 'Back to sign in', description: 'Footer link text.' },
    { key: 'confirmTitle', default: 'Check your email', description: 'Confirmation heading.' },
    { key: 'confirmSentTo', default: 'We sent a password reset link to', description: 'Confirmation lead-in (followed by the email).' },
    { key: 'confirmHint', default: "Didn't receive the email? Check your spam folder or try another email address.", description: 'Confirmation hint.' },
    { key: 'tryAnother', default: 'Try another email', description: 'Return-to-form button text.' },
  ],
  preview: { bare: true, width: 'md' },
  defaultReview: { status: 'approved', decisionSource: 'rule-based' },
} satisfies RecipeSpec;
