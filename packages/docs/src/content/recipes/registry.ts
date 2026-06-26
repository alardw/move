import type { ComponentType } from 'react';
import SignIn from './authentication/SignIn';
import SignInSrc from './authentication/SignIn.tsx?raw';
import ForgotPassword from './authentication/ForgotPassword';
import ForgotPasswordSrc from './authentication/ForgotPassword.tsx?raw';
import ResetPassword from './authentication/ResetPassword';
import ResetPasswordSrc from './authentication/ResetPassword.tsx?raw';
import MfaSetup from './authentication/MfaSetup';
import MfaSetupSrc from './authentication/MfaSetup.tsx?raw';
import MfaVerify from './authentication/MfaVerify';
import MfaVerifySrc from './authentication/MfaVerify.tsx?raw';

export interface RecipeMeta {
  /** URL slug within its group, e.g. 'sign-in'. */
  slug: string;
  /** Display name of the group, e.g. 'Authentication'. */
  group: string;
  /** URL slug of the group, e.g. 'authentication'. */
  groupSlug: string;
  title: string;
  description: string;
  /** The live recipe component (rendered in the card preview and on the detail page). */
  Component: ComponentType<{ labels?: Record<string, string> }>;
  /** Recipe source, for the detail page's code view. */
  source: string;
  /**
   * Optional pre-rendered preview image. When present the card shows this
   * instead of rendering the live component — the path we'll switch to once
   * recipe screenshots are automated.
   */
  image?: string;
}

export const RECIPES: RecipeMeta[] = [
  {
    slug: 'sign-in',
    group: 'Authentication',
    groupSlug: 'authentication',
    title: 'Sign in',
    description: 'Email + password login with a remember-me toggle and a forgot-password link.',
    Component: SignIn,
    source: SignInSrc,
  },
  {
    slug: 'forgot-password',
    group: 'Authentication',
    groupSlug: 'authentication',
    title: 'Forgot password',
    description: 'Request a password-reset link by email, with a back-to-sign-in link.',
    Component: ForgotPassword,
    source: ForgotPasswordSrc,
  },
  {
    slug: 'reset-password',
    group: 'Authentication',
    groupSlug: 'authentication',
    title: 'Reset password',
    description: 'Choose a new password with a confirmation field.',
    Component: ResetPassword,
    source: ResetPasswordSrc,
  },
  {
    slug: 'mfa-setup',
    group: 'Authentication',
    groupSlug: 'authentication',
    title: 'MFA setup',
    description: 'Enroll in two-factor auth: scan a QR code and confirm with a one-time code.',
    Component: MfaSetup,
    source: MfaSetupSrc,
  },
  {
    slug: 'mfa-verify',
    group: 'Authentication',
    groupSlug: 'authentication',
    title: 'MFA verify',
    description: 'Enter a six-digit one-time code to complete two-factor sign-in.',
    Component: MfaVerify,
    source: MfaVerifySrc,
  },
];

/** Group display names in display order. */
export const RECIPE_GROUPS: string[] = RECIPES.reduce<string[]>((acc, r) => {
  if (!acc.includes(r.group)) acc.push(r.group);
  return acc;
}, []);

export function getRecipe(groupSlug: string, slug: string): RecipeMeta | undefined {
  return RECIPES.find((r) => r.groupSlug === groupSlug && r.slug === slug);
}
