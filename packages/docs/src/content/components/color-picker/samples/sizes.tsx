import { ColorPicker, Stack, Text } from 'move';
import { PickerPanel } from './_panel';

const sizes = ['sm', 'md', 'lg'] as const;

export default function SizesSample() {
  return (
    <Stack direction="row" gap="lg" wrap>
      {sizes.map((size) => (
        <Stack key={size} gap="xs" align="start">
          <Text size="sm" weight="medium">size="{size}"</Text>
          <PickerPanel>
            <ColorPicker size={size} defaultValue="#7950f2" />
          </PickerPanel>
        </Stack>
      ))}
    </Stack>
  );
}
