import { Stack, Splitter, ScrollArea, List, Text } from "move";

const rows = (n: number, label: string) =>
  Array.from({ length: n }, (_, i) => (
    <List.Item key={i}>
      <List.Content>
        <List.Title>{`${label} ${i + 1}`}</List.Title>
        <List.Description>Scrolls inside its own region</List.Description>
      </List.Content>
    </List.Item>
  ));

export default function ScrollChain() {
  return (
    // In an app this outermost box is <MoveRoot fullHeight>, which turns the
    // window height into a height the tree can use. Here it's a fixed-height
    // frame so the example sits inside the page.
    <Stack
      clip
      gap="none"
      style={{
        height: 360,
        border: "1px solid var(--move-border-base)",
        borderRadius: "var(--move-rounded-lg)",
      }}
    >
      <Stack fill="remaining" gap="none">
        <Splitter.Root fill="remaining">
          <Splitter.Panel defaultSize="38%">
            {/* Panel is a block with a height, so its child takes "parent". */}
            <Stack fill="parent" gap="none">
              <ScrollArea.Root fill="parent">
                <ScrollArea.Header padded>
                  <Text weight="medium" size="sm">
                    Files
                  </Text>
                </ScrollArea.Header>
                <ScrollArea.Content padded aria-label="Files">
                  <List>{rows(24, "File")}</List>
                </ScrollArea.Content>
              </ScrollArea.Root>
            </Stack>
          </Splitter.Panel>
          <Splitter.Panel>
            <Stack fill="parent" gap="none">
              <ScrollArea.Root fill="parent">
                <ScrollArea.Header padded>
                  <Text weight="medium" size="sm">
                    Detail
                  </Text>
                </ScrollArea.Header>
                <ScrollArea.Content padded aria-label="Detail">
                  <List>{rows(30, "Row")}</List>
                </ScrollArea.Content>
                <ScrollArea.Footer padded>
                  <Text size="xs" color="muted">
                    30 items — this footer stays put
                  </Text>
                </ScrollArea.Footer>
              </ScrollArea.Root>
            </Stack>
          </Splitter.Panel>
        </Splitter.Root>
      </Stack>
    </Stack>
  );
}
