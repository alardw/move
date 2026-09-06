import { useState } from 'react';
import { ColorPicker, Stack, Text } from 'move';
import { PickerPanel } from './_panel';

/**
 * With no `format` prop, the picker opens in whatever notation the value is
 * written in — this one starts in HSL and the selector reads HSL. Switch it and
 * the value is rewritten, so the next time the picker mounts it opens where you
 * left it. That matters most inside `ColorInput`, whose popup unmounts on close.
 */
export default function FollowsValueSample() {
  const [value, setValue] = useState('hsl(217 91% 63%)');
  return (
    <Stack gap="sm" align="start">
      <PickerPanel>
        <ColorPicker value={value} onValueChange={setValue} />
      </PickerPanel>
      <Text size="sm" color="muted">value: {value}</Text>
    </Stack>
  );
}
