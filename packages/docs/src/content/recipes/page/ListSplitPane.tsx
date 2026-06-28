import { useState } from 'react';
import { Stack, Heading, Text, Splitter, ScrollArea, List, Badge, Button, Divider, Icon, Avatar } from 'move';

const defaultLabels = {
  title: 'Inbox',
  compose: 'Compose',
  selectMessage: 'Select a message',
  selectMessageDescription: 'Choose a conversation from the list to view its contents.',
  reply: 'Reply',
  forward: 'Forward',
  archive: 'Archive',
};

type Labels = typeof defaultLabels;

type Message = {
  id: string;
  from: string;
  initials: string;
  color: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  body: string;
};

// Integration point: sample data — replace with the real values.
const SAMPLE_MESSAGES: Message[] = [
  { id: '1', from: 'Alice Johnson', initials: 'AJ', color: 'indigo', subject: 'Design review feedback', preview: 'Hey, I reviewed the latest mockups and have some thoughts...', time: '10:32 AM', unread: true, body: 'Hey, I reviewed the latest mockups and have some thoughts on the navigation layout. The sidebar looks great but I think we should consider adding a collapsible option for smaller screens. Can we discuss this in our next sync?' },
  { id: '2', from: 'Bob Smith', initials: 'BS', color: 'teal', subject: 'Sprint planning notes', preview: 'Here are the action items from today\'s planning...', time: '9:15 AM', unread: true, body: 'Here are the action items from today\'s planning session:\n\n1. Finalize component API for Drawer\n2. Write integration tests for auth flow\n3. Update documentation for new features\n\nLet me know if I missed anything.' },
  { id: '3', from: 'Carol White', initials: 'CW', color: 'orange', subject: 'Q1 metrics report', preview: 'Attached is the quarterly report with updated figures...', time: 'Yesterday', unread: false, body: 'Attached is the quarterly report with updated figures. Key highlights: user engagement up 23%, churn down 5%. The new onboarding flow is showing promising results. Full breakdown in the attached PDF.' },
  { id: '4', from: 'David Brown', initials: 'DB', color: 'violet', subject: 'Deployment schedule', preview: 'We\'re planning to deploy v2.4 on Friday at 2pm...', time: 'Yesterday', unread: false, body: 'We\'re planning to deploy v2.4 on Friday at 2pm PST. Please ensure all PRs are merged by Thursday EOD. Rollback plan is documented in the wiki. Ping me if you have any blockers.' },
  { id: '5', from: 'Eve Davis', initials: 'ED', color: 'pink', subject: 'Team offsite planning', preview: 'I\'ve booked the venue for our team offsite next month...', time: 'Mar 8', unread: false, body: 'I\'ve booked the venue for our team offsite next month. It\'s a retreat center about an hour outside the city. I\'ll send the full agenda next week, but plan for a mix of workshops and team building activities.' },
];

export default function ListSplitPane({ labels }: { labels?: Partial<Labels> }) {
  const t = { ...defaultLabels, ...labels };
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = SAMPLE_MESSAGES.find((m) => m.id === selectedId);

  return (
    <ScrollArea.Root fill="screen">
      <ScrollArea.Header>
        <Stack direction="row" align="center" justify="between" wrap gap="md">
          <Heading level={1} size="2xl">{t.title}</Heading>
          <Button>
            <Icon name="plus" size="sm" />
            {t.compose}
          </Button>
        </Stack>
      </ScrollArea.Header>

      <ScrollArea.Content>
        {/* recipe-purity-ignore: bordered frame that fills the available height for the splitter — no Move fill-height/box primitive */}
        <div style={{ height: '100%', border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-radius-md)', overflow: 'hidden' }}>
          <Splitter.Root layout="horizontal" collapseBelow={640}>
            <Splitter.Panel size={35} minSize={25}>
              <List hover>
                {SAMPLE_MESSAGES.map((msg) => (
                  <List.Item
                    key={msg.id}
                    active={msg.id === selectedId}
                    onClick={() => setSelectedId(msg.id)}
                  >
                    <List.Leading>
                      <Avatar.Root size="sm" color={msg.color}>
                        <Avatar.Fallback>{msg.initials}</Avatar.Fallback>
                      </Avatar.Root>
                    </List.Leading>
                    <List.Content>
                      <Stack direction="row" align="center" gap="xs">
                        <List.Title>{msg.from}</List.Title>
                        {msg.unread && <Badge variant="solid" size="sm" color="blue">new</Badge>}
                      </Stack>
                      <List.Description>{msg.subject}</List.Description>
                    </List.Content>
                    <List.Trailing>{msg.time}</List.Trailing>
                  </List.Item>
                ))}
              </List>
            </Splitter.Panel>

            <Splitter.Panel size={65}>
              {selected ? (
                <Stack gap="md" padding="md">
                  <Stack direction="row" align="center" justify="between">
                    <Stack direction="row" align="center" gap="sm">
                      <Avatar.Root size="md" color={selected.color}>
                        <Avatar.Fallback>{selected.initials}</Avatar.Fallback>
                      </Avatar.Root>
                      <Stack gap="xs">
                        <Heading level={2} size="lg">{selected.subject}</Heading>
                        <Text size="sm" color="muted">From: {selected.from} — {selected.time}</Text>
                      </Stack>
                    </Stack>
                  </Stack>
                  <Divider />
                  <Text>{selected.body}</Text>
                  <Divider />
                  <Stack direction="row" gap="sm">
                    <Button variant="secondary" size="sm">
                      <Icon name="reply" size="sm" />
                      {t.reply}
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Icon name="forward" size="sm" />
                      {t.forward}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Icon name="archive" size="sm" />
                      {t.archive}
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Stack align="center" justify="center" padding="xl" fill>
                  <Stack gap="sm" align="center">
                    <Icon name="mail" size="lg" color="muted" />
                    <Text weight="medium">{t.selectMessage}</Text>
                    <Text size="sm" color="muted">{t.selectMessageDescription}</Text>
                  </Stack>
                </Stack>
              )}
            </Splitter.Panel>
          </Splitter.Root>
        </div>
      </ScrollArea.Content>
    </ScrollArea.Root>
  );
}
