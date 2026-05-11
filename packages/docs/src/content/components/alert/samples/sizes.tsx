import { Alert, Stack, Text } from 'move';

const sizes = ['sm', 'md', 'lg'] as const;
const descriptions: Record<typeof sizes[number], string> = {
  sm: 'Tight spacing for inline form errors and contextual hints — good when the alert sits next to a field rather than spanning a section.',
  md: 'The default. Page-level status banners and post-action confirmations.',
  lg: 'More breathing room for upgrade nudges, end-of-trial notices, and announcements you actually want people to read.',
};

export default function SizesSample() {
  return (
    <Stack gap="lg">
      {sizes.map((size) => (
        <Stack key={size} gap="xs">
          <Text size="sm" weight="medium">size="{size}"</Text>
          <Alert size={size} variant="info" title={`size="${size}"`}>
            {descriptions[size]}
          </Alert>
        </Stack>
      ))}
    </Stack>
  );
}
