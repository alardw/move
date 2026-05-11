import { Align, Stack, Text } from 'move';

const aligns = ['start', 'center', 'end', 'baseline', 'stretch'] as const;

const Tall = () => (
  <div style={{ background: 'var(--move-bg-muted)', padding: 'var(--move-spacing-md)', borderRadius: 'var(--move-rounded-md)', height: 64 }}>Tall</div>
);
const Short = () => (
  <div style={{ background: 'var(--move-bg-muted)', padding: 'var(--move-spacing-xs)', borderRadius: 'var(--move-rounded-md)' }}>Short</div>
);

/**
 * `align` controls vertical alignment when the slots have different
 * intrinsic heights — useful when one side is a tall block (e.g. a
 * card) and the others are inline text or buttons.
 */
export default function VerticalAlignSample() {
  return (
    <Stack gap="md">
      {aligns.map((a) => (
        <Stack key={a} gap="xs">
          <Text size="sm" weight="medium">align="{a}"</Text>
          <Align align={a} gap="md" padding="md" style={{ border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-lg)' }}>
            <Align.Start><Tall /></Align.Start>
            <Align.Center><Short /></Align.Center>
            <Align.End><Short /></Align.End>
          </Align>
        </Stack>
      ))}
    </Stack>
  );
}
