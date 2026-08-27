import { ColorInput, FormField, Label, Stack } from 'move';

const sizes = ['sm', 'md', 'lg'] as const;
const variants = [
  { variant: undefined, defaultValue: '#7950f2', name: 'outlined' },
  { variant: 'filled' as const, defaultValue: '#12b886', name: 'filled' },
];

export default function SizesSample() {
  return (
    <Stack gap="md">
      {sizes.map((size) =>
        variants.map((v) => (
          <FormField.Root key={`${size}-${v.name}`} labelWidth="8rem">
            <FormField.Label>
              <Label>
                {size} · {v.name}
              </Label>
            </FormField.Label>
            <FormField.Field>
              <ColorInput
                size={size}
                variant={v.variant}
                defaultValue={v.defaultValue}
                width="md"
              />
            </FormField.Field>
          </FormField.Root>
        )),
      )}
    </Stack>
  );
}
