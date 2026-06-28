import { ScrollArea, Stack, Text } from 'move';

const lines = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

export default function BasicSample() {
  return (
    // recipe-purity-ignore: fixed-height framed scroll viewport so there is something to scroll; no Move height prop
    <ScrollArea.Root style={{ height: 200, border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-md)' }}>
      <ScrollArea.Content>
        <Stack gap="xs" padding="md">
          {lines.map((line) => <Text key={line} size="sm">{line}</Text>)}
        </Stack>
      </ScrollArea.Content>
    </ScrollArea.Root>
  );
}
