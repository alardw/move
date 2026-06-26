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
      <VideoPlayer labels={{ play: t('player.play'), mute: t('player.mute') }} />
    </>
  );
}`;

// Verified against component source — every component that renders built-in
// strings, with its labels keys and default (English) values.
const LABELS: { component: string; key: string; def: string }[] = [
  { component: 'Alert', key: 'close', def: 'Close alert' },
  { component: 'Autocomplete', key: 'clearAll', def: 'Clear all' },
  { component: 'Autocomplete', key: 'removeTag', def: 'Remove {value}' },
  { component: 'AudioPlayer', key: 'play', def: 'Play' },
  { component: 'AudioPlayer', key: 'pause', def: 'Pause' },
  { component: 'AudioPlayer', key: 'mute', def: 'Mute' },
  { component: 'AudioPlayer', key: 'unmute', def: 'Unmute' },
  { component: 'AudioPlayer', key: 'settings', def: 'Settings' },
  { component: 'AudioPlayer', key: 'subtitles', def: 'Subtitles' },
  { component: 'Breadcrumb', key: 'label', def: 'Breadcrumb' },
  { component: 'Calendar', key: 'previousMonth', def: 'Previous month' },
  { component: 'Calendar', key: 'nextMonth', def: 'Next month' },
  { component: 'Calendar', key: 'selectMonth', def: 'Select month' },
  { component: 'Calendar', key: 'selectYear', def: 'Select year' },
  { component: 'CalendarView', key: 'today', def: 'Today' },
  { component: 'CalendarView', key: 'previous', def: 'Previous' },
  { component: 'CalendarView', key: 'next', def: 'Next' },
  { component: 'CalendarView', key: 'day / week / month / agenda', def: 'Day / Week / Month / Agenda' },
  { component: 'CalendarView', key: 'allDay', def: 'All day' },
  { component: 'CalendarView', key: 'noEvents', def: 'No events in this period' },
  { component: 'CalendarView', key: 'more', def: '(count) ⇒ "+{count} more"' },
  { component: 'ColorInput', key: 'swatch', def: 'Open color picker' },
  { component: 'ColorInput', key: 'eyeDropper', def: 'Pick color from screen' },
  { component: 'ColorPicker', key: 'saturation / hue / alpha / format / hex', def: 'Color saturation…, Hue, Opacity, Color format, Hex color value' },
  { component: 'ColorPicker', key: 'red / green / blue / lightness', def: 'channel aria-labels' },
  { component: 'DatePicker', key: 'selectDate', def: 'Select date' },
  { component: 'DatePicker', key: 'datesSelected', def: '(count) ⇒ "{count} dates selected"' },
  { component: 'DatePicker', key: 'openCalendar', def: 'Open calendar' },
  { component: 'DatePicker', key: 'startDate / endDate', def: 'Start date / End date' },
  { component: 'DatePicker', key: 'selectStartDate / selectEndDate', def: 'Select start/end date' },
  { component: 'FileUpload', key: 'removeFile', def: 'Remove {filename}' },
  { component: 'FileUpload', key: 'uploadComplete', def: 'Upload complete' },
  { component: 'Loader', key: 'loading', def: 'Loading' },
  { component: 'NumberInput', key: 'increment / decrement', def: 'Increment / Decrement' },
  { component: 'Pagination', key: 'label', def: 'Pagination' },
  { component: 'Pagination', key: 'previous / next', def: 'Go to previous / next page' },
  { component: 'Pagination', key: 'page', def: 'Go to page {page}' },
  { component: 'Password', key: 'showPassword', def: 'Show password' },
  { component: 'Password', key: 'hidePassword', def: 'Hide password' },
  { component: 'PinInput', key: 'pinInput', def: 'PIN input' },
  { component: 'Popover', key: 'close', def: 'Close' },
  { component: 'ProgressBar', key: 'label', def: 'Progress' },
  { component: 'RichTextEditor', key: 'toolbar', def: 'Text formatting' },
  { component: 'Sidebar', key: 'close', def: 'Close sidebar' },
  { component: 'TableOfContents', key: 'label', def: 'On this page' },
  { component: 'TimeField', key: 'hour / minute / second / period', def: 'hour / minute / second / period' },
  { component: 'VideoPlayer', key: 'play / pause / mute / unmute', def: 'Play / Pause / Mute / Unmute' },
  { component: 'VideoPlayer', key: 'fullscreen / exitFullscreen', def: 'Fullscreen / Exit fullscreen' },
  { component: 'VideoPlayer', key: 'settings / subtitles / subtitlesOff', def: 'Settings / Subtitles / Off' },
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
          <Heading level={1}>Internationalization</Heading>
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
            Every component with built-in strings exposes them through one <Code>labels</Code>{' '}
            object — validate rule E1 enforces it, so localization works the same way everywhere.
          </Text>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
