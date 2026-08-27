import { Link as RouterLink } from 'react-router-dom';
import {
  Stack,
  Heading,
  Text,
  Breadcrumb,
  Icon,
  Badge,
  Code,
  FormField,
  InputText,
  Password,
  Checkbox,
  Button,
  Card,
} from 'move';
import { Section, TocRail, CodeBlock, Preview, type TocItem } from '../../components';
import FieldWidths from '../../content/systems/forms/samples/field-widths';
import fieldWidthsCode from '../../content/systems/forms/samples/field-widths?raw';

const FIELD_EXAMPLE = `<FormField.Root invalid={!!error}>
  <FormField.Label>Email</FormField.Label>
  <InputText type="email" value={email} onChange={onChange} />
  {error && <FormField.Description error>{error}</FormField.Description>}
</FormField.Root>`;

const NAMED_EXAMPLE = `// A control whose purpose is clear from context names itself directly:
<InputRange aria-label="Volume" min={0} max={100} value={v} onValueChange={setV} />`;

const FORM_CODE = `<form onSubmit={handleSubmit}>
  <Card.Root>
    <Card.Body>
      <Stack gap="md">
        <FormField.Root>
          <FormField.Label>Email</FormField.Label>
          <InputText type="email" name="email" placeholder="you@company.com" required />
          <FormField.Description>We'll send a confirmation link.</FormField.Description>
        </FormField.Root>

        <FormField.Root invalid>
          <FormField.Label>Password</FormField.Label>
          <Password name="password" defaultValue="short" required />
          <FormField.Description error>Use at least 8 characters.</FormField.Description>
        </FormField.Root>

        <Checkbox name="terms">I agree to the terms</Checkbox>
        <Button type="submit">Create account</Button>
      </Stack>
    </Card.Body>
  </Card.Root>
</form>`;

const TOC: TocItem[] = [
  { href: '#forms', label: 'Overview' },
  { href: '#example', label: 'A complete form' },
  { href: '#wired', label: 'What a field wires' },
  { href: '#named', label: 'Every field has a name' },
  { href: '#width', label: 'How wide a field is' },
];

export function FormsPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="forms">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/systems">Systems</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Forms</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Forms</Heading>
          <Text color="muted" size="lg">
            Every form control carries the same accessible obligations — a name, a way to say its
            value is wrong, and getting that to someone who can’t see the red border. Move settles
            them in one place, so you write the label and the control and the wiring comes with it.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            <Badge variant="soft"><Icon name="link" />Every field named</Badge>
            <Badge variant="soft"><Icon name="octagon-alert" />Errors announced</Badge>
          </Stack>
        </Stack>

        <Section
          id="example"
          title="A complete form"
          lede="Every field is a Label, a control, and an optional message wrapped in a FormField — including the one below that’s showing its error state."
        >
          <Preview code={FORM_CODE}>
            <form onSubmit={(e) => e.preventDefault()} style={{ maxWidth: 400 }}>
              <Card.Root>
                <Card.Body>
                  <Stack gap="md">
                    <FormField.Root>
                      <FormField.Label>Email</FormField.Label>
                      <InputText type="email" name="email" placeholder="you@company.com" required />
                      <FormField.Description>
                        We&apos;ll send a confirmation link.
                      </FormField.Description>
                    </FormField.Root>

                    <FormField.Root invalid>
                      <FormField.Label>Password</FormField.Label>
                      <Password name="password" defaultValue="short" required />
                      <FormField.Description error>Use at least 8 characters.</FormField.Description>
                    </FormField.Root>

                    <Checkbox name="terms">I agree to the terms</Checkbox>
                    <Button type="submit">Create account</Button>
                  </Stack>
                </Card.Body>
              </Card.Root>
            </form>
          </Preview>
        </Section>

        <Section
          id="wired"
          title="What a field wires"
          lede="Behind that one Password field, the connections you didn’t write are all there."
        >
          <Stack gap="md">
            <CodeBlock code={FIELD_EXAMPLE} language="tsx" />
            <Text>
              From that, <Code>FormField</Code> does four things you’d otherwise wire by hand: the{' '}
              <Code>Label</Code> becomes a real <Code>&lt;label&gt;</Code> tied to the control, so
              clicking it focuses the field and a screen reader reads the name; the control gets an{' '}
              <Code>id</Code> to match; <Code>invalid</Code> on the Root becomes <Code>aria-invalid</Code>{' '}
              on the control; and the error <Code>Description</Code> is linked as the control’s
              description and announced when it appears. You never touch an id.
            </Text>
            <Text size="sm" color="muted">
              A field is one control. Put the <Code>id</Code> on <Code>FormField.Root</Code> if you
              need a specific one — not on the control, where it can drift from the label.
            </Text>
          </Stack>
        </Section>

        <Section
          id="named"
          title="Every field has a name"
          lede="A control with no name is unusable to a screen reader — so nothing is allowed to have none."
        >
          <Stack gap="md">
            <Text>
              There are two ways to give one. A field with visible label text uses a{' '}
              <RouterLink to="/components/form-field">FormField</RouterLink> with a Label, as above. A
              control whose purpose is already clear from what’s around it — a search box, a slider —
              takes an <Code>aria-label</Code> directly:
            </Text>
            <CodeBlock code={NAMED_EXAMPLE} language="tsx" />
            <Text>
              To keep the rule from slipping, a control that mounts with no name at all{' '}
              <strong>warns in the console on a dev server</strong> — never in production, never in
              tests. You find out while you’re building it, not from an audit later.
            </Text>
            <Text size="sm" color="muted">
              This is the forms half of{' '}
              <RouterLink to="/accessibility">accessibility</RouterLink> — where Move takes on the
              labelling and error wiring, and you bring the words.
            </Text>
          </Stack>
        </Section>

        <Section
          id="width"
          title="How wide a field is"
          lede="Fields take a width from a scale, sized by the content each one expects."
        >
          <Stack gap="md">
            <Text>
              A field is as wide as what goes in it. The steps are measured in
              characters, so a box tracks the reader’s font size and its size tells
              them how much input is wanted — a short box asks for a year, a long one
              for an email. Every step stops at the width of its column, so a field
              narrows on a phone instead of running past the edge.
            </Text>
            <Preview title="The scale" code={fieldWidthsCode}>
              <FieldWidths />
            </Preview>
            <Text>
              <Code>full</Code> is the default and takes the column. <Code>auto</Code>{' '}
              hugs its content, for a control that sits in a row of its own rather than
              in a form. The same scale is on every control that takes one —{' '}
              <RouterLink to="/components/input-text">InputText</RouterLink>,{' '}
              <RouterLink to="/components/textarea">Textarea</RouterLink>,{' '}
              <RouterLink to="/components/select">Select</RouterLink>,{' '}
              <RouterLink to="/components/password">Password</RouterLink>,{' '}
              <RouterLink to="/components/number-input">NumberInput</RouterLink>,{' '}
              <RouterLink to="/components/autocomplete">Autocomplete</RouterLink>,{' '}
              <RouterLink to="/components/color-input">ColorInput</RouterLink> and{' '}
              <RouterLink to="/components/input-range">InputRange</RouterLink>.
            </Text>
            <Text size="sm" color="muted">
              A dropdown takes its width from the field it hangs off, so the two read as
              one control. Where the options are longer than a narrow field, set{' '}
              <Code>width="content"</Code> on the content and the list sizes to the
              widest option instead, within the room the field has.
            </Text>
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
