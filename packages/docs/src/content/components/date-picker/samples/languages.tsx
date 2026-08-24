import { useState } from 'react';
import { DatePicker, FormField, Label, Stack } from 'move';

const locales = [
  { tag: 'en-US', label: 'English (US)', placeholder: 'Pick a date', weekStartsOn: 0 as const },
  { tag: 'fr-FR', label: 'Français', placeholder: 'Choisir une date', weekStartsOn: 1 as const },
  { tag: 'de-DE', label: 'Deutsch', placeholder: 'Datum auswählen', weekStartsOn: 1 as const },
  { tag: 'ar-SA', label: 'العربية', placeholder: 'اختر تاريخًا', weekStartsOn: 6 as const },
];

/**
 * `locale` flips weekday names, month names, parsing, and formatting in
 * one prop. Pair with `weekStartsOn` (0=Sun, 1=Mon, 6=Sat) to match the
 * conventional first day of the week per region.
 */
export default function LanguagesSample() {
  const [values, setValues] = useState<Record<string, Date | undefined>>({});

  return (
    <Stack gap="md">
      {locales.map((l) => (
        <FormField.Root key={l.tag}>
          <FormField.Label>
            <Label>{l.label}</Label>
          </FormField.Label>
          <FormField.Field>
            <DatePicker.Root
              mode="single"
              locale={l.tag}
              weekStartsOn={l.weekStartsOn}
              value={values[l.tag]}
              onValueChange={(d) => setValues((v) => ({ ...v, [l.tag]: d as Date | undefined }))}
            >
              <DatePicker.Trigger>
                <DatePicker.Input placeholder={l.placeholder} />
              </DatePicker.Trigger>
              <DatePicker.Content />
            </DatePicker.Root>
          </FormField.Field>
          <FormField.Description>{l.tag}</FormField.Description>
        </FormField.Root>
      ))}
    </Stack>
  );
}
