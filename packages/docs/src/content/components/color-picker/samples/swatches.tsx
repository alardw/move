import { useState } from 'react';
import { ColorPicker, Stack, Text } from 'move';
import { PickerPanel } from './_panel';

const palette = [
  '#4c6ef5', '#5c7cfa', '#7950f2', '#9775fa', '#15aabf', '#22b8cf',
  '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14', '#fa5252',
  '#e64980', '#000000',
];

export default function SwatchesSample() {
  const [value, setValue] = useState('#4c6ef5');
  return (
    <Stack gap="sm" align="start">
      <PickerPanel>
        <ColorPicker
          value={value}
          onValueChange={setValue}
          swatches={palette}
          swatchesPerRow={7}
        />
      </PickerPanel>
      <Text size="sm" color="muted">value: {value}</Text>
    </Stack>
  );
}
