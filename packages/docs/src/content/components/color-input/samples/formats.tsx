import { useState } from 'react';
import { ColorInput, Stack, Text } from 'move';

/**
 * The picker’s format selector lists every format passed in
 * `formatOptions`. Switching format re-formats the value in place,
 * preserving colour and alpha where possible.
 */
export default function FormatsSample() {
  const [value, setValue] = useState('rgba(76, 110, 245, 0.85)');
  return (
    <Stack gap="sm" align="start">
      <ColorInput
        value={value}
        onValueChange={setValue}
        format="rgba"
        formatOptions={['hex', 'rgb', 'hsl']}
        width="20rem"
      />
      <Text size="sm" color="muted">
        Limited to hex / rgb / hsl in the picker’s format toggle. The current value carries alpha because we initialised in rgba.
      </Text>
      <Text size="sm">value: {value}</Text>
    </Stack>
  );
}
