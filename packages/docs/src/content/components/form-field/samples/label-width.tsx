import { FormField, InputText, Label, Stack } from 'move';

export default function LabelWidthSample() {
  return (
    <Stack gap="md">
      <FormField.Root labelWidth="14rem">
        <FormField.Label><Label>Project name</Label></FormField.Label>
        <FormField.Field><InputText defaultValue="Move design system" /></FormField.Field>
      </FormField.Root>
      <FormField.Root labelWidth="14rem">
        <FormField.Label><Label>Slug</Label></FormField.Label>
        <FormField.Field><InputText defaultValue="move-design-system" /></FormField.Field>
      </FormField.Root>
      <FormField.Root labelWidth="14rem">
        <FormField.Label><Label>Owner</Label></FormField.Label>
        <FormField.Field><InputText defaultValue="alex@acme.co" /></FormField.Field>
      </FormField.Root>
    </Stack>
  );
}
