import { useState } from 'react';
import { ColorPicker, Stack, Text } from 'move';
import { PickerPanel } from './_panel';

/**
 * `formatOptions` limits the format selector to a subset, and `format`
 * chooses the active one. Switching format re-formats the value in
 * place — drag through saturation in HSL, drop into RGB, paste a hex.
 */
export default function FormatsSample() {
  const [value, setValue] = useState('rgba(76, 110, 245, 0.85)');
  return (
    <Stack gap="sm" align="start">
      <PickerPanel>
        <ColorPicker
          value={value}
          onValueChange={setValue}
          format="rgba"
          formatOptions={['hex', 'rgb', 'hsl']}
        />
      </PickerPanel>
      <Text size="sm" color="muted">value: {value}</Text>
    </Stack>
  );
}
