import { Collapsible, Stack, Text } from 'move';

/**
 * The classic "show more" pattern — a long block of text with the
 * first paragraph always visible and the rest tucked behind a
 * trigger.
 */
export default function ShowMoreSample() {
  return (
    <Stack gap="sm">
      <Text>
        Move ships a small, sharp set of components — buttons, inputs, modals, the usual scaffolding — built on top of
        Radix primitives where they exist and from scratch where they don’t. The system stays opinionated about layout
        and spacing tokens, and quiet about colour: themes are a single CSS variable map.
      </Text>
      <Collapsible.Root>
        <Stack gap="sm">
          <Collapsible.Trigger>
            {/* recipe-purity-ignore: the trigger resets to inline (all:unset); width:100% lets the row fill it so justify spreads — no Move width prop */}
            <Stack direction="row" gap="sm" align="center" justify="between" style={{ width: '100%' }}>
              <Text weight="medium">Read more about the philosophy</Text>
              <Collapsible.Icon />
            </Stack>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <Stack gap="sm">
              <Text>
                The animation system is a single trigger-and-sequence model. Every component composes with the same
                `useAnimations` hook — there’s no second life-cycle hook for "press" effects and another for "open/close."
                Once you’ve learned the shape of an animation config, it lands the same on a Tooltip and a Drawer.
              </Text>
              <Text>
                The token surface is two-tier: primitives (raw colours, sizes, durations) and semantic tokens that point at
                them. Components only read semantic tokens, so re-skinning at the brand level is a flat key-value override
                and never a migration.
              </Text>
            </Stack>
          </Collapsible.Content>
        </Stack>
      </Collapsible.Root>
    </Stack>
  );
}
