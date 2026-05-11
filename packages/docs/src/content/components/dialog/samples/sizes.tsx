import { Button, Dialog, Stack, Text } from 'move';

const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const;
const descriptions: Record<typeof sizes[number], string> = {
  sm: 'Confirmations and short prompts. ~24rem wide.',
  md: 'The default. Single-purpose forms and announcements.',
  lg: 'Multi-field forms or content with more breathing room.',
  xl: 'Detail views, settings pages, anything edging toward a full screen.',
  full: 'Almost edge-to-edge — for image viewers, editors, immersive flows.',
};

export default function SizesSample() {
  return (
    <Stack direction="row" gap="sm" wrap>
      {sizes.map((size) => (
        <Dialog.Root key={size}>
          <Dialog.Trigger asChild>
            <Button variant="secondary" size="sm">size="{size}"</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content size={size}>
              <Dialog.Header>
                <Dialog.Title>size="{size}"</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap="sm">
                  <Text>{descriptions[size]}</Text>
                  <Text color="muted" size="sm">
                    Width is set on Content via a CSS custom property — override
                    --move-dialog-content-width to dial in something between presets.
                  </Text>
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.FooterEnd>
                  <Dialog.Close asChild>
                    <Button>Close</Button>
                  </Dialog.Close>
                </Dialog.FooterEnd>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ))}
    </Stack>
  );
}
