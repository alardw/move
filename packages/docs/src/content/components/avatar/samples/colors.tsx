import { Avatar, Icon, Stack } from 'move';

const colors = ['blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange', 'red', 'pink', 'grape', 'violet', 'indigo', 'gray'] as const;

/**
 * `color` tints the Fallback background and text. Hash a user’s
 * stable id (email, username) to one of these colours and the same
 * person ends up the same shade everywhere they appear.
 */
export default function ColorsSample() {
  return (
    <Stack direction="row" gap="sm" wrap>
      {colors.map((c) => (
        <Avatar.Root key={c} color={c}>
          <Avatar.Fallback>{c[0].toUpperCase()}</Avatar.Fallback>
        </Avatar.Root>
      ))}
      <Avatar.Root color="indigo">
        <Avatar.Fallback>
          <Icon name="user" />
        </Avatar.Fallback>
      </Avatar.Root>
    </Stack>
  );
}
