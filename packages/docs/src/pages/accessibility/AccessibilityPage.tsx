import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, Table, Code, type Color } from 'move';
import { Section, TocRail, type TocItem } from '../../components';
import { GROUPS, TOTAL_CRITERIA, type Support, type Criterion } from './criteria';

const SUPPORT: Record<Support, { label: string; color: Color }> = {
  supports: { label: 'Supports', color: 'green' },
  enables: { label: 'Enables', color: 'teal' },
  partial: { label: 'Partial', color: 'yellow' },
  none: { label: 'Does not', color: 'red' },
  na: { label: 'N/A', color: 'gray' },
  consumer: { label: 'Yours', color: 'blue' },
};

// Each cell is split into up to three labelled parts so the reader can scan
const TOC: TocItem[] = [
  { href: '#perceivable', label: '1. Perceivable' },
  { href: '#operable', label: '2. Operable' },
  { href: '#understandable', label: '3. Understandable' },
  { href: '#robust', label: '4. Robust' },
];

function SupportBadge({ support }: { support: Support }) {
  const s = SUPPORT[support];
  return (
    <Badge variant="soft" color={s.color}>
      {s.label}
    </Badge>
  );
}

// A claim and the thing that would catch it breaking are different facts, so they read
// as different rows. Move only claims Supports for itself — the other levels put the
// work on the consumer, so a Move-side gate would be answering the wrong question.
function Evidence({ c }: { c: Criterion }) {
  if (c.support !== 'supports') return null;
  return (
    <Stack direction="row" gap="xs" wrap align="center">
      <Text size="sm" as="span" weight="bold" color="muted">
        Evidence:
      </Text>
      {c.evidence.length ? (
        c.evidence.map((e) => (
          // Into the hub, not across to /ai/coverage: the check is what both pages
          // share, so it's the only link that can't drift.
          <RouterLink key={e} to={`/conformance/validation#check-${e}`}>
            <Code size="sm">{e}</Code>
          </RouterLink>
        ))
      ) : (
        <Text size="sm" as="span" color="muted">
          verified by hand — no automated gate.
        </Text>
      )}
    </Stack>
  );
}

function CriteriaTable({ rows }: { rows: Criterion[] }) {
  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head>Criterion</Table.Head>
          <Table.Head>Level</Table.Head>
          <Table.Head>Support</Table.Head>
          <Table.Head>How Move addresses it</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((c) => (
          <Table.Row key={c.sc}>
            <Table.Cell>
              <Text weight="medium">{c.sc}</Text>
              <Text size="sm" color="muted">
                {c.name}
              </Text>
            </Table.Cell>
            <Table.Cell>{c.level}</Table.Cell>
            <Table.Cell>
              <SupportBadge support={c.support} />
            </Table.Cell>
            <Table.Cell>
              <Stack gap="xs">
                {c.note.included && (
                  <Text size="sm">
                    <strong>Included:</strong> {c.note.included}
                  </Text>
                )}
                {c.note.yours && (
                  <Text size="sm">
                    <strong>Yours:</strong> {c.note.yours}
                  </Text>
                )}
                {c.note.gap && (
                  <Text size="sm" color="muted">
                    <strong>Gap:</strong> {c.note.gap}
                  </Text>
                )}
                <Evidence c={c} />
              </Stack>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

export function AccessibilityPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="accessibility">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Accessibility</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Accessibility</Heading>
          <Text color="muted" size="lg">
            What Move handles, and what’s yours to add.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            <Badge variant="soft">
              <Icon name="git-commit-horizontal" />
              WCAG 2.2 · A · AA · AAA
            </Badge>
          </Stack>
        </Stack>

        <Stack id="stand" gap="md">
          <Text>
            WCAG 2.2 is how that fabric gets measured — a shared standard of specific, testable
            criteria, so “accessible” is something you can check rather than just claim.
          </Text>
          <Text>
            Move guarantees one thing outright — colour contrast: every{' '}
            <RouterLink to="/customize/theme">theme</RouterLink> clamps its colours to WCAG 2.2 AA.
            Beyond that, each criterion lands in one of four buckets. The table below says which,
            for all {TOTAL_CRITERIA} (A, AA, and the AAA rules that apply).
          </Text>
          <Stack direction="row" gap="md" wrap>
            <Text size="sm" color="muted">
              <SupportBadge support="supports" /> Move handles it
            </Text>
            <Text size="sm" color="muted">
              <SupportBadge support="enables" /> mechanism ready, you wire it
            </Text>
            <Text size="sm" color="muted">
              <SupportBadge support="consumer" /> your responsibility
            </Text>
            <Text size="sm" color="muted">
              <SupportBadge support="na" /> not applicable
            </Text>
          </Stack>
        </Stack>

        {GROUPS.map((g) => (
          <Section key={g.key} id={g.key} title={g.title} lede={g.lede}>
            <CriteriaTable rows={g.rows} />
          </Section>
        ))}
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
