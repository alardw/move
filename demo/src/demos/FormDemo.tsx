import { Form, Button } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  return (
    <Form.Root className="form-root" onSubmit={(e) => e.preventDefault()}>
      <Form.Field className="form-field" name="email">
        <Form.Label className="form-label">Email</Form.Label>
        <Form.Control asChild>
          <input className="form-control" type="email" placeholder="Enter your email" required />
        </Form.Control>
        <Form.Message className="form-message" match="valueMissing">
          Please enter your email
        </Form.Message>
        <Form.Message className="form-message" match="typeMismatch">
          Please enter a valid email
        </Form.Message>
      </Form.Field>

      <Form.Field className="form-field" name="password">
        <Form.Label className="form-label">Password</Form.Label>
        <Form.Control asChild>
          <input className="form-control" type="password" placeholder="Enter your password" required />
        </Form.Control>
        <Form.Message className="form-message" match="valueMissing">
          Please enter a password
        </Form.Message>
      </Form.Field>

      <Form.Submit asChild>
        <Button style={{ marginTop: 8 }}>Submit</Button>
      </Form.Submit>
    </Form.Root>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Form with validation messages.',
    component: <DefaultExample />,
    code: `<Form.Root onSubmit={(e) => e.preventDefault()}>
  <Form.Field name="email">
    <Form.Label>Email</Form.Label>
    <Form.Control asChild>
      <input type="email" required />
    </Form.Control>
    <Form.Message match="valueMissing">
      Please enter your email
    </Form.Message>
  </Form.Field>
  <Form.Submit asChild>
    <Button>Submit</Button>
  </Form.Submit>
</Form.Root>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function FormDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="Form"
        description="A form component with built-in validation."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
