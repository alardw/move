import { Button, Stack, Text } from 'move';

const sizes = ['sm', 'md', 'lg'] as const;
const descriptions: Record<typeof sizes[number], string> = {
  sm: 'Compact rows, dense toolbars, table actions — anywhere `md` would feel oversized.',
  md: 'The default. Forms, dialogs, page-level actions.',
  lg: 'Hero CTAs and onboarding flows, where the click is the whole point of the screen.',
};

export default function SizesSample() {
  return (
    <Stack gap="lg">
      {sizes.map((size) => (
        <Stack key={size} gap="xs">
          <Stack direction="row" gap="sm" align="baseline">
            <Text size="sm" weight="medium">size="{size}"</Text>
            <Text size="sm" color="muted">{descriptions[size]}</Text>
          </Stack>
          <Stack direction="row" gap="sm" align="center">
            <Button size={size} variant="primary">Primary</Button>
            <Button size={size} variant="secondary">Secondary</Button>
            <Button size={size} variant="ghost">Ghost</Button>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
