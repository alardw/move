// Generated from FormField.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { FormField, Label, InputText } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'form:FormField',
  name: 'FormField',
  category: 'form',
  description: 'Compound form layout wrapper that arranges label, field input, and description/error in a responsive grid',
  controls: [
    {
      name: 'playground.labelWidth',
      kind: 'text',
      defaultValue: '8rem',
    },
    {
      name: 'playground.showError',
      kind: 'boolean',
      defaultValue: false,
    },
  ],
  initialProps: {
    'playground.labelWidth': '8rem',
    'playground.showError': false,
  },
  sections: [
    {
      id: 'consumer',
      label: 'Consumer Samples',
      code: `<FormField.Root>
  <FormField.Label>
    <Label htmlFor="name" required>Full name</Label>
  </FormField.Label>
  <FormField.Field>
    <InputText id="name" placeholder="Enter your name" />
  </FormField.Field>
  <FormField.Description>
    Your full legal name
  </FormField.Description>
</FormField.Root>`,
      render: () => (
        <div style={{ maxWidth: 480 }}>
          <FormField.Root>
            <FormField.Label>
              <Label htmlFor="name" required>Full name</Label>
            </FormField.Label>
            <FormField.Field>
              <InputText id="name" placeholder="Enter your name" />
            </FormField.Field>
            <FormField.Description>
              Your full legal name
            </FormField.Description>
          </FormField.Root>
        </div>
      ),
    },
    {
      id: 'playground',
      label: 'Props Playground',
      code: (props) => {
        const showError = Boolean(props['playground.showError']);
        return `<FormField.Root labelWidth="${String(props['playground.labelWidth'] ?? '8rem')}">
  <FormField.Label>
    <Label htmlFor="email">Email</Label>
  </FormField.Label>
  <FormField.Field>
    <InputText id="email" placeholder="you@example.com" />
  </FormField.Field>
  <FormField.Description${showError ? ' error' : ''}>
    ${showError ? 'Please enter a valid email' : 'We will never share your email'}
  </FormField.Description>
</FormField.Root>`;
      },
      render: (props) => (
        <div style={{ maxWidth: 480 }}>
          <FormField.Root labelWidth={props['playground.labelWidth'] as string}>
            <FormField.Label>
              <Label htmlFor="email">Email</Label>
            </FormField.Label>
            <FormField.Field>
              <InputText id="email" placeholder="you@example.com" invalid={props['playground.showError'] as boolean} />
            </FormField.Field>
            <FormField.Description error={props['playground.showError'] as boolean}>
              {props['playground.showError'] ? 'Please enter a valid email' : 'We will never share your email'}
            </FormField.Description>
          </FormField.Root>
        </div>
      ),
    },
  ],
  render: (props) => (
    <div style={{ maxWidth: 480 }}>
      <FormField.Root labelWidth={props['playground.labelWidth'] as string}>
        <FormField.Label>
          <Label htmlFor="email">Email</Label>
        </FormField.Label>
        <FormField.Field>
          <InputText id="email" placeholder="you@example.com" />
        </FormField.Field>
        <FormField.Description error={props['playground.showError'] as boolean}>
          {props['playground.showError'] ? 'Please enter a valid email' : 'We will never share your email'}
        </FormField.Description>
      </FormField.Root>
    </div>
  ),
};
