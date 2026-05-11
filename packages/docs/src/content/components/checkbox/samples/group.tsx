import { Checkbox, FormField, Stack } from 'move';

/**
 * `Checkbox.Group` is a vertical layout container with a shared
 * `role="group"` — combine it with `FormField` for a real form-like
 * label and helper text.
 */
export default function GroupSample() {
  return (
    <Stack gap="lg">
      <FormField.Root>
        <FormField.Label>Notifications</FormField.Label>
        <FormField.Field>
          <Checkbox.Group>
            <Checkbox defaultChecked>Product announcements</Checkbox>
            <Checkbox>Weekly digest</Checkbox>
            <Checkbox>Replies to my comments</Checkbox>
            <Checkbox>Account security alerts</Checkbox>
          </Checkbox.Group>
        </FormField.Field>
        <FormField.Description>
          Pick what we’re allowed to email you about. You can change these later from your account settings.
        </FormField.Description>
      </FormField.Root>
      <FormField.Root>
        <FormField.Label>Channels</FormField.Label>
        <FormField.Field>
          <Checkbox.Group>
            <Checkbox defaultChecked>Email</Checkbox>
            <Checkbox>SMS</Checkbox>
            <Checkbox disabled>Push (mobile app required)</Checkbox>
          </Checkbox.Group>
        </FormField.Field>
      </FormField.Root>
    </Stack>
  );
}
