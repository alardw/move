import { Form } from 'move';

export function FormDemo() {
  return (
    <div className="demo-section">
      <h3>Form</h3>
      <div className="demo-box">
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
            <button className="demo-button" style={{ marginTop: 8 }}>Submit</button>
          </Form.Submit>
        </Form.Root>
      </div>
    </div>
  );
}
