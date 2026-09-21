import { Stack, Surface, Text } from 'move';

// A Surface takes the opposite shade of whatever it landed on, so each level
// stays visible against the one behind it. Nothing here sets a colour.
//
// It is a ground and nothing else — the spacing comes from the Stack inside it,
// which is why there is no padding prop to reach for.
export default function BasicSample() {
  return (
    <Surface>
      <Stack gap="sm" padding="md">
        <Text weight="medium">A panel on the page</Text>
        <Surface>
          <Stack gap="sm" padding="md">
            <Text weight="medium">One inside that</Text>
            <Surface>
              <Stack padding="md">
                <Text weight="medium">And one more</Text>
              </Stack>
            </Surface>
          </Stack>
        </Surface>
      </Stack>
    </Surface>
  );
}
