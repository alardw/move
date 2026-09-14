import { useState } from 'react';
import { Button, Form, FormField, InputText, Text } from 'move';

export default function PendingSample() {
  const [pending, setPending] = useState(false);

  return (
    <Form
      pending={pending}
      onSubmit={async () => {
        setPending(true);
        await new Promise((r) => setTimeout(r, 1500));
        setPending(false);
      }}
    >
      <FormField.Root name="title">
        <FormField.Label>Title</FormField.Label>
        <FormField.Field>
          <InputText name="title" defaultValue="Quarterly report" />
        </FormField.Field>
      </FormField.Root>

      <Form.Actions>
        <Button type="button" variant="ghost">
          Cancel
        </Button>
        <Button type="submit">{pending ? 'Saving…' : 'Save'}</Button>
      </Form.Actions>

      <Text size="sm" color="muted">
        Both buttons disable while pending — Form.Actions is a fieldset, so the platform does it.
      </Text>
    </Form>
  );
}
