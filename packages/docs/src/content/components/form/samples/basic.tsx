import { useState } from 'react';
import { Button, Form, FormField, InputText, Text } from 'move';

export default function BasicSample() {
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null);

  return (
    <Form onSubmit={(values) => setSubmitted(values)}>
      <FormField.Root name="name">
        <FormField.Label>Name</FormField.Label>
        <FormField.Field>
          <InputText name="name" placeholder="Ada Lovelace" required />
        </FormField.Field>
      </FormField.Root>

      <FormField.Root name="email">
        <FormField.Label>Email</FormField.Label>
        <FormField.Field>
          <InputText type="email" name="email" placeholder="ada@example.com" required />
        </FormField.Field>
        <FormField.Description>We only use this to reply.</FormField.Description>
      </FormField.Root>

      <Form.Actions>
        <Button type="reset" variant="ghost">
          Reset
        </Button>
        <Button type="submit">Save</Button>
      </Form.Actions>

      {submitted && (
        <Text size="sm" color="muted">
          Submitted: {JSON.stringify(submitted)}
        </Text>
      )}
    </Form>
  );
}
