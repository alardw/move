import { useState } from 'react';
import { ColorPicker, Stack, Text } from 'move';
import { PickerPanel } from './_panel';

const brand = [
  '#4c6ef5', '#5c7cfa', '#7950f2', '#15aabf', '#12b886',
  '#fab005', '#fd7e14', '#fa5252', '#e64980', '#212529',
];

/**
 * `withPicker={false}` hides the saturation field and sliders, leaving
 * just the swatch grid and inputs — useful when the choice is curated
 * (brand colours, label tags) and free-form picking would be a footgun.
 */
export default function SwatchOnlySample() {
  const [value, setValue] = useState('#4c6ef5');
  return (
    <Stack gap="sm" align="start">
      <PickerPanel>
        <ColorPicker
          value={value}
          onValueChange={setValue}
          swatches={brand}
          swatchesPerRow={5}
          withPicker={false}
        />
      </PickerPanel>
      <Text size="sm" color="muted">value: {value}</Text>
    </Stack>
  );
}
