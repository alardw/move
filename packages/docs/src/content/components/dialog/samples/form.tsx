import { Button, Dialog, FormField, InputText, Stack, Textarea } from 'move';

/**
 * Content auto-focuses the first form field in the body when the dialog
 * opens — type-in-immediately, no extra `autofocus` attribute. Escape and
 * the auto-rendered close button on Header both trigger the animated dismiss.
 */
export default function FormSample() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>Invite teammate</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content size="md">
          <Dialog.Header>
            <Dialog.Title>Invite a teammate</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Stack gap="md">
              <FormField.Root>
                <FormField.Label>Email</FormField.Label>
                <FormField.Field>
                  <InputText type="email" placeholder="hello@example.com" />
                </FormField.Field>
              </FormField.Root>
              <FormField.Root>
                <FormField.Label>Personal note</FormField.Label>
                <FormField.Field>
                  <Textarea rows={3} placeholder="Optional — say hi, set the vibe." />
                </FormField.Field>
              </FormField.Root>
            </Stack>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.FooterEnd>
              <Dialog.Close asChild>
                <Button variant="ghost">Cancel</Button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Button>Send invite</Button>
              </Dialog.Close>
            </Dialog.FooterEnd>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
