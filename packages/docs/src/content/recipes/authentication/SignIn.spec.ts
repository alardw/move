// SignIn.spec.ts — Recipe specification

import type { RecipeSpec } from '../spec-type';

export const spec = {
  schemaVersion: 1,
  name: 'SignIn',
  slug: 'sign-in',
  group: 'Authentication',
  groupSlug: 'authentication',
  title: 'Sign in',
  description:
    'Email + password login with a remember-me toggle and a forgot-password link.',
  synonyms: ['login', 'log in', 'signin', 'sign on', 'credentials', 'authentication'],
  composition: [
    'Stack',
    'Card',
    'Heading',
    'FormField',
    'InputText',
    'Password',
    'Checkbox',
    'Button',
    'Link',
  ],
  behaviors: [
    'Renders inside a single Card surface (max-width 400).',
    'Email and password are controlled text inputs, each wrapped in FormField.',
    'The remember-me checkbox toggles its checked state.',
    'Exposes a forgot-password link.',
    'All user-facing copy is supplied through the labels prop (i18n).',
  ],
  integrationPoints: [
    { id: 'onSubmit', kind: 'handler', description: 'Authenticate the email + password against the auth API.' },
    { id: 'remember', kind: 'handler', description: 'Persist the session when remember-me is checked.' },
    { id: 'forgotPassword', kind: 'navigation', description: 'Navigate to the forgot-password flow.' },
  ],
  labels: [
    { key: 'title', default: 'Sign in', description: 'Card heading.' },
    { key: 'emailLabel', default: 'Email', description: 'Email field label.' },
    { key: 'emailPlaceholder', default: 'you@example.com', description: 'Email field placeholder.' },
    { key: 'passwordLabel', default: 'Password', description: 'Password field label.' },
    { key: 'passwordPlaceholder', default: 'Enter your password', description: 'Password field placeholder.' },
    { key: 'rememberMe', default: 'Remember me', description: 'Remember-me checkbox label.' },
    { key: 'forgotPassword', default: 'Forgot password?', description: 'Forgot-password link text.' },
    { key: 'submit', default: 'Sign in', description: 'Submit button text.' },
  ],
  preview: { bare: true, width: 'md' },
  defaultReview: { status: 'approved', decisionSource: 'rule-based' },
} satisfies RecipeSpec;
