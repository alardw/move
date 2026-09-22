import { Password, Stack } from 'move';

/**
 * `autoComplete` says which password this is, so a password manager fills the
 * right one and offers to generate a new one only where that makes sense:
 * `current-password` on a sign-in, `new-password` on a sign-up or a change.
 * Browsers warn in the console when a password field leaves it out.
 */
export default function BasicSample() {
  return (
    <Stack gap="md">
      <Password
        aria-label="Enter your password"
        placeholder="Enter your password"
        autoComplete="current-password"
      />
      <Password aria-label="Password" defaultValue="prefilled-secret" autoComplete="new-password" />
    </Stack>
  );
}
