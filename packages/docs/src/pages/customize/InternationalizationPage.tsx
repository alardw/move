import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, Code, Table } from 'move';
import {
  CodeBlock,
  HighlightList,
  type HighlightItem,
  Section,
  TocRail,
  type TocItem,
} from '../../components';

const BADGES = [
  { icon: 'languages', label: 'Per-component labels' },
  { icon: 'replace', label: 'Your i18n library' },
];

const PRINCIPLE: HighlightItem[] = [
  {
    icon: 'languages',
    text: (
      <>
        Every string a component renders itself — aria-labels, control text —
        comes from a <Code>labels</Code> prop with English defaults. Override it
        to localize.
      </>
    ),
  },
  {
    icon: 'replace',
    text: (
      <>
        There’s no global i18n provider. You feed each component’s{' '}
        <Code>labels</Code> prop from whatever i18n library you already use —
        Move stays library-agnostic.
      </>
    ),
  },
  {
    icon: 'box',
    text: (
      <>
        Content you pass is yours to translate; <Code>labels</Code> only covers
        the strings the component emits on its own (not your <Code>children</Code>).
      </>
    ),
  },
];

const OVERRIDE = `import { Password, DatePicker, VideoPlayer } from 'move';
import { useTranslation } from 'react-i18next'; // or any i18n library

function Form() {
  const { t } = useTranslation();
  return (
    <>
      <Password
        labels={{ showPassword: t('a11y.showPassword'), hidePassword: t('a11y.hidePassword') }}
      />
      <DatePicker labels={{ selectDate: t('date.select'), openCalendar: t('date.open') }} />

      {/* Media players use individual *Label props (not a labels object — yet) */}
      <VideoPlayer playLabel={t('player.play')} muteLabel={t('player.mute')} />
    </>
  );
}`;

// Verified against component source — these are the components that expose an
// overridable labels prop, with their default (English) values.
const LABELS: { component: string; key: string; def: string }[] = [
  { component: 'Alert', key: 'close', def: 'Close alert' },
  { component: 'Calendar', key: 'previousMonth', def: 'Previous month' },
  { component: 'Calendar', key: 'nextMonth', def: 'Next month' },
  { component: 'Calendar', key: 'selectMonth', def: 'Select month' },
  { component: 'Calendar', key: 'selectYear', def: 'Select year' },
  { component: 'DatePicker', key: 'selectDate', def: 'Select date' },
  { component: 'DatePicker', key: 'datesSelected', def: '(count) ⇒ "{count} dates selected"' },
  { component: 'DatePicker', key: 'openCalendar', def: 'Open calendar' },
  { component: 'DatePicker', key: 'startDate', def: 'Start date' },
  { component: 'DatePicker', key: 'endDate', def: 'End date' },
  { component: 'DatePicker', key: 'selectStartDate', def: 'Select start date' },
  { component: 'DatePicker', key: 'selectEndDate', def: 'Select end date' },
  { component: 'Password', key: 'showPassword', def: 'Show password' },
  { component: 'Password', key: 'hidePassword', def: 'Hide password' },
];

const TOC: TocItem[] = [
  { href: '#i18n', label: 'Overview' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#overriding', label: 'Overriding labels' },
  { href: '#all-labels', label: 'All built-in labels' },
];

export function InternationalizationPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="i18n">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/customize">Make it your own</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Internationalization</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1} weight="normal">Internationalization</Heading>
          <Text color="muted" size="lg">
            The strings Move’s components render themselves are exposed as
            overridable labels with English defaults. Localize by passing your
            translations to each component’s <Code>labels</Code> prop — there’s
            no global provider to configure.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            {BADGES.map((b) => (
              <Badge key={b.label} variant="soft">
                <Icon name={b.icon} />
                {b.label}
              </Badge>
            ))}
          </Stack>
        </Stack>

        <Section
          id="how-it-works"
          title="How it works"
          lede="Strings live on the component, not in a global store — so you wire in your own i18n library."
        >
          <HighlightList items={PRINCIPLE} />
        </Section>

        <Section
          id="overriding"
          title="Overriding labels"
          lede="Pass a labels object; only the keys you set are overridden, the rest keep their defaults."
        >
          <CodeBlock language="tsx" code={OVERRIDE} />
        </Section>

        <Section
          id="all-labels"
          title="All built-in labels"
          lede="Every label each component exposes, with its English default. Pass any subset via labels."
        >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Component</Table.Head>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Label key</Table.Head>
                <Table.Head>Default</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {LABELS.map((row, i) => {
                const firstOfGroup = i === 0 || LABELS[i - 1].component !== row.component;
                return (
                  <Table.Row key={`${row.component}-${row.key}`}>
                    <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}>
                      {firstOfGroup ? <Code>{row.component}</Code> : null}
                    </Table.Cell>
                    <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}>
                      <Code>{row.key}</Code>
                    </Table.Cell>
                    <Table.Cell>{row.def}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
          <Text color="muted" size="sm">
            These also supply the accessible name for icon-only buttons (the toggle on
            Password, the controls on the media players), so screen readers announce them.
            Move’s contract requires user-facing strings to flow through <Code>labels</Code>{' '}
            (validate rule E1). One known gap: <Code>AudioPlayer</Code>/<Code>VideoPlayer</Code>{' '}
            expose individual <Code>playLabel</Code>/<Code>muteLabel</Code>/… props rather than a
            <Code>labels</Code> object — being unified.
          </Text>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
