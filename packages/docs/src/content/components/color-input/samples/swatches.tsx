import { useState } from 'react';
import { ColorInput, FormField, Label } from 'move';

const brand = [
  '#4c6ef5',
  '#5c7cfa',
  '#7950f2',
  '#9775fa',
  '#15aabf',
  '#22b8cf',
  '#12b886',
  '#40c057',
  '#fab005',
  '#fd7e14',
  '#fa5252',
  '#e64980',
];

/**
 * Drop a `swatches` array and the picker shows them as a preset
 * palette — useful for brand colours, theme tokens, or a curated set
 * for marketing pages.
 */
export default function SwatchesSample() {
  const [value, setValue] = useState('#4c6ef5');
  return (
    <FormField.Root>
      <FormField.Label>
        <Label>Colour</Label>
      </FormField.Label>
      <FormField.Field>
        <ColorInput
          value={value}
          onValueChange={setValue}
          swatches={brand}
          swatchesPerRow={6}
          width="20rem"
        />
      </FormField.Field>
      <FormField.Description>value: {value}</FormField.Description>
    </FormField.Root>
  );
}
