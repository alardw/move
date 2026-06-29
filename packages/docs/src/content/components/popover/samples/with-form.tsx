import { Button, FormField, InputText, Label, Popover, Stack } from 'move';

export default function WithFormSample() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button>Quick reply</Button>
      </Popover.Trigger>
      <Popover.Content sideOffset={8}>
        <Stack gap="md">
          <FormField.Root>
            <FormField.Label><Label htmlFor="reply-subject">Subject</Label></FormField.Label>
            <FormField.Field><InputText id="reply-subject" defaultValue="Re: design review" /></FormField.Field>
          </FormField.Root>
          <FormField.Root>
            <FormField.Label><Label htmlFor="reply-body">Message</Label></FormField.Label>
            <FormField.Field><InputText id="reply-body" placeholder="Type your reply…" /></FormField.Field>
          </FormField.Root>
          <Stack direction="row" gap="sm" justify="end">
            <Button variant="ghost" size="sm">Cancel</Button>
            <Button size="sm">Send</Button>
          </Stack>
        </Stack>
      </Popover.Content>
    </Popover.Root>
  );
}
