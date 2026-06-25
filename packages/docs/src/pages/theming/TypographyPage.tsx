import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, Code } from 'move';
import {
  CodeBlock,
  HighlightList,
  type HighlightItem,
  Section,
  TocRail,
  type TocItem,
} from '../../components';

const BADGES = [
  { icon: 'type', label: 'Token-driven' },
  { icon: 'replace', label: 'Swap the font in one line' },
];

const FONT_PRINCIPLE: HighlightItem[] = [
  {
    icon: 'type',
    text: (
      <>
        Two font tokens drive everything: <Code>--move-font-sans</Code> (UI and
        body text) and <Code>--move-font-mono</Code> (code).
      </>
    ),
  },
  {
    icon: 'git-merge',
    text: (
      <>
        The semantic tokens <Code>--move-font-body</Code> and{' '}
        <Code>--move-font-code</Code> derive from them, and components read those —
        so set the primitive once and it cascades everywhere.
      </>
    ),
  },
  {
    icon: 'replace',
    text: 'Overriding the font is setting a token. No component changes, no theme rebuild.',
  },
];

const SET_TOKENS = `/* Set once on :root — the semantic tokens (and every component) follow. */
:root {
  --move-font-sans: 'Inter', system-ui, sans-serif;  /* UI + body */
  --move-font-mono: 'JetBrains Mono', monospace;      /* code */
}`;

const LOAD_FONT = `/* Load a custom font, then point the token at it.
   (This is exactly what these docs do with Gottak.) */
@font-face {
  font-family: 'Gottak';
  font-weight: 400;
  font-display: swap;
  src: url('./fonts/Gottak-Regular.woff2') format('woff2'),
       url('./fonts/Gottak-Regular.woff') format('woff');
}

:root {
  --move-font-sans: 'Gottak', system-ui, sans-serif;
}`;

const SCOPE = `/* Tokens are plain CSS variables, so scope a different font to a subtree. */
.legal-prose {
  --move-font-sans: Georgia, 'Times New Roman', serif;
}`;

const SIZES = ['xs', 'sm', 'base', 'lg', 'xl'] as const;
const WEIGHTS = [
  { w: 'normal', label: 'normal' },
  { w: 'medium', label: 'medium' },
  { w: 'semibold', label: 'semibold' },
  { w: 'bold', label: 'bold' },
] as const;

const TOC: TocItem[] = [
  { href: '#typography', label: 'Overview' },
  { href: '#fonts', label: 'Fonts' },
  { href: '#load', label: 'Loading a font' },
  { href: '#scale', label: 'Sizes & weights' },
];

export function TypographyPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="typography">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/theming">Theming</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Typography</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1} weight="normal">Typography</Heading>
          <Text color="muted" size="lg">
            Type in Move is token-driven: one token sets the font for the whole
            app, and size and weight come from a fixed scale you reach through{' '}
            <Code>Text</Code> and <Code>Heading</Code>.
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
          id="fonts"
          title="Fonts"
          lede="One token controls the font everywhere. Set it on :root and the whole app follows."
        >
          <Stack gap="md">
            <HighlightList items={FONT_PRINCIPLE} />
            <CodeBlock language="css" code={SET_TOKENS} />
          </Stack>
        </Section>

        <Section
          id="load"
          title="Loading a custom font"
          lede="Declare the @font-face, then point the token at it. Scope it to a subtree if you only want it in one place."
        >
          <Stack gap="md">
            <CodeBlock language="css" code={LOAD_FONT} />
            <CodeBlock language="css" code={SCOPE} />
          </Stack>
        </Section>

        <Section
          id="scale"
          title="Sizes & weights"
          lede="Reach the scale through Text and Heading props — or the underlying tokens (--move-text-*, --move-weight-*) for custom CSS."
        >
          <Stack gap="lg">
            <Stack gap="xs">
              {SIZES.map((s) => (
                <Stack key={s} direction="row" gap="md" align="baseline">
                  <Code>size=&quot;{s}&quot;</Code>
                  <Text size={s}>The quick brown fox</Text>
                </Stack>
              ))}
            </Stack>
            <Stack gap="xs">
              {WEIGHTS.map(({ w, label }) => (
                <Stack key={w} direction="row" gap="md" align="baseline">
                  <Code>weight=&quot;{label}&quot;</Code>
                  <Text weight={w}>The quick brown fox</Text>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
