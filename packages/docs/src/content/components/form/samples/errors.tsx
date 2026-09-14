import { useState } from 'react';
import { Button, Form, FormField, InputText } from 'move';

/** Stands in for a server that dislikes one particular address. */
async function save(
  values: Record<string, FormDataEntryValue>,
): Promise<{ errors: Record<string, string> }> {
  await new Promise((r) => setTimeout(r, 400));
  return values.email === 'taken@example.com'
    ? { errors: { email: 'That address is already registered.' } }
    : { errors: {} };
}

export default function ErrorsSample() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <Form
      errors={errors}
      onSubmit={async (values) => {
        const result = await save(values);
        setErrors(result.errors);
      }}
    >
      <FormField.Root name="email">
        <FormField.Label>Email</FormField.Label>
        <FormField.Field>
          <InputText type="email" name="email" defaultValue="taken@example.com" required />
        </FormField.Field>
      </FormField.Root>

      <Form.Actions>
        <Button type="submit">Register</Button>
      </Form.Actions>
    </Form>
  );
}
