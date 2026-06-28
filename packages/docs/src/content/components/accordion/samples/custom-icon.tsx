import { Accordion, Icon, Stack } from 'move';

const items = [
  {
    value: 'plus-minus',
    indicator: 'plus' as const,
    label: 'Why is the plus sign okay?',
    body: 'It reads as "there is more here." Rotated 45 degrees on expand, it turns into an X, which reads as "close." Same glyph, two meanings, one rotation. Chef’s kiss.',
  },
  {
    value: 'any-node',
    indicator: 'shapes' as const,
    label: 'What can I pass as an icon?',
    body: 'Anything React will render. A Lucide icon, an inline SVG, an emoji, a tiny custom component with its own animation. The open-state rotation wraps whatever you ship — all 90 degrees of it.',
  },
  {
    value: 'no-icon',
    indicator: 'ban' as const,
    label: 'Can I drop the icon entirely?',
    body: 'Pass `icon={null}` and the chevron disappears. Leaves you with a bare clickable header — useful when the content is obviously expandable from layout alone, or you want to handle affordance yourself.',
  },
];

/**
 * The trigger's `icon` prop is the rotating indicator on the right.
 * Anything you put inside the trigger as children renders to the left
 * of that indicator — so Trigger composes freely: a leading icon, a
 * badge, a counter, a status dot. This sample pairs a leading Lucide
 * icon with each label to show the two slots working together.
 */
export default function CustomIconSample() {
  return (
    <Accordion.Root type="single" collapsible defaultValue="plus-minus">
      {items.map((it) => (
        <Accordion.Item key={it.value} value={it.value}>
          <Accordion.Header>
            <Accordion.Trigger icon={<Icon name="plus" />}>
              <Stack direction="row" gap="sm" align="center">
                <Icon name={it.indicator} />
                {it.label}
              </Stack>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>{it.body}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
