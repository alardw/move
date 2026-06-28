import { Avatar, Stack, Text } from 'move';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const descriptions: Record<typeof sizes[number], string> = {
  xs: 'Inline, tight rows — comment threads, mention chips, dense tables.',
  sm: 'Sidebar nav and member lists — the workhorse small size.',
  md: 'The default. Cards, headers, the row of attendees on an event.',
  lg: 'Profile previews and the "currently active" picture.',
  xl: 'Hero placement on a profile page or onboarding flow.',
};

export default function SizesSample() {
  return (
    <Stack gap="md">
      {sizes.map((size) => (
        <Stack key={size} direction="row" gap="md" align="center">
          <Text size="sm" weight="medium">{size}</Text>
          <Avatar.Root size={size}>
            <Avatar.Image src="https://i.pravatar.cc/96?img=15" alt="Sample user" />
            <Avatar.Fallback>SU</Avatar.Fallback>
          </Avatar.Root>
          <Text size="sm" color="muted">{descriptions[size]}</Text>
        </Stack>
      ))}
    </Stack>
  );
}
