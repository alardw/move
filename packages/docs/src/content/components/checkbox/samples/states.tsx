import { Checkbox, Stack, Text } from 'move';

/**
 * The full state matrix — checked / unchecked / indeterminate, each
 * crossed with default / disabled / invalid. Useful as a quick visual
 * spec when restyling tokens.
 */
export default function StatesSample() {
  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text size="sm" weight="medium">Default</Text>
        <Stack direction="row" gap="lg" wrap>
          <Checkbox>Unchecked</Checkbox>
          <Checkbox defaultChecked>Checked</Checkbox>
          <Checkbox indeterminate>Indeterminate</Checkbox>
        </Stack>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Disabled</Text>
        <Stack direction="row" gap="lg" wrap>
          <Checkbox disabled>Unchecked</Checkbox>
          <Checkbox disabled defaultChecked>Checked</Checkbox>
          <Checkbox disabled indeterminate>Indeterminate</Checkbox>
        </Stack>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">Invalid</Text>
        <Stack direction="row" gap="lg" wrap>
          <Checkbox invalid>Unchecked</Checkbox>
          <Checkbox invalid defaultChecked>Checked</Checkbox>
          <Checkbox invalid indeterminate>Indeterminate</Checkbox>
        </Stack>
      </Stack>
    </Stack>
  );
}
