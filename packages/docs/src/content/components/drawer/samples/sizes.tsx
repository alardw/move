import { Button, Drawer, Stack, Text } from 'move';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'full'] as const;
const descriptions: Record<typeof sizes[number], string> = {
  xs: 'Quick info side panels, snippet readers.',
  sm: 'Compact filter rails.',
  md: 'The default — single-purpose forms and detail panels.',
  lg: 'Multi-field forms with breathing room.',
  xl: 'Full-page editors and configuration flows.',
  full: 'Edge-to-edge — for image viewers and immersive experiences.',
};

export default function SizesSample() {
  return (
    <Stack direction="row" gap="sm" wrap>
      {sizes.map((size) => (
        <Drawer.Root key={size}>
          <Drawer.Trigger asChild>
            <Button variant="secondary" size="sm">size="{size}"</Button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay />
            <Drawer.Content size={size}>
              <Drawer.Header>
                <Drawer.Title>size="{size}"</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Text>{descriptions[size]}</Text>
                <Text size="sm" color="muted">
                  Width is set on Content via a CSS custom property — override per-instance via tokens.
                </Text>
              </Drawer.Body>
              <Drawer.Footer>
                <Drawer.Close asChild>
                  <Button>Close</Button>
                </Drawer.Close>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      ))}
    </Stack>
  );
}
