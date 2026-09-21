import { Stack, Surface, Text } from 'move';

// `asChild` paints an element that already exists rather than adding one, so
// the ground lands on your element and no wrapper node appears in between.
//
// This is how Card, Dialog, Drawer, Popover, Sidebar, Select and Accordion take
// a ground onto their own root. The one rule that comes with it: whatever you
// wrap must not paint its own background, or two equal-weight rules end up on
// one element and stylesheet order decides which of them you see.
export default function AsChildSample() {
  return (
    <Surface asChild>
      <Stack gap="sm" padding="md">
        <Text weight="medium">The Stack is the surface</Text>
        <Text size="sm" color="muted">
          One element, painted and provided — no extra div wrapping it.
        </Text>
      </Stack>
    </Surface>
  );
}
