import { Stack, FormField, InputText } from "move";

const FIELDS = [
  { width: "xs", label: "Year", placeholder: "2026" },
  { width: "sm", label: "Postcode", placeholder: "1017 PW" },
  { width: "md", label: "Phone", placeholder: "+31 20 123 4567" },
  { width: "lg", label: "Email", placeholder: "you@company.com" },
  { width: "full", label: "Street address", placeholder: "Herengracht 1" },
] as const;

export default function FieldWidths() {
  return (
    <Stack gap="md">
      {FIELDS.map((f) => (
        <FormField.Root key={f.width}>
          <FormField.Label>{f.label}</FormField.Label>
          <InputText width={f.width} placeholder={f.placeholder} />
          <FormField.Description>width="{f.width}"</FormField.Description>
        </FormField.Root>
      ))}
    </Stack>
  );
}
