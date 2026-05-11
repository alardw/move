import { useState } from 'react';
import { ColorPicker, Stack, Text } from 'move';

/**
 * `ColorPicker` ships chromeless on purpose — it’s designed to live inside
 * a popover (`ColorInput` provides one), so the surrounding container is
 * yours to style. For the docs we wrap it in a bordered panel so it reads
 * as a self-contained widget.
 */
const panel: React.CSSProperties = {
  padding: 'var(--move-spacing-md)',
  border: '1px solid var(--move-border-base)',
  borderRadius: 'var(--move-rounded-lg)',
  background: 'var(--move-surface-bg)',
  display: 'inline-block',
};

export default function BasicSample() {
  const [value, setValue] = useState('#4c6ef5');
  return (
    <Stack gap="sm" align="start">
      <div style={panel}>
        <ColorPicker value={value} onValueChange={setValue} />
      </div>
      <Text size="sm" color="muted">value: {value}</Text>
    </Stack>
  );
}
