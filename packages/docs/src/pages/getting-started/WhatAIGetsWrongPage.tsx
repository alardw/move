import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, Code } from 'move';
import {
  HighlightList,
  type HighlightItem,
  Section,
  TocRail,
  type TocItem,
} from '../../components';

/**
 * Getting started → What AI gets wrong. The rationale page for the whole
 * project: it names the concrete failure modes of AI-generated UI, then
 * shows where a structured system removes each one. Sits right under the
 * Overview so a reader meets the problem before the how-to.
 */

const TAGLINE =
  'AI can produce a screen that looks right and behaves wrong. The failures are predictable — and most of them are structural.';

const BADGES = [
  { icon: 'triangle-alert', label: 'The problem' },
  { icon: 'keyboard', label: 'Behavior, not pixels' },
  { icon: 'contrast', label: 'Accessibility' },
];

const WITHOUT_LIBRARY: HighlightItem[] = [
  {
    icon: 'chevron-down',
    text: 'A hand-rolled select looks like a select and stops there. No type-ahead, no arrow-key navigation, no focus trap, no escape-to-close, no active-descendant wiring. It works with a mouse on the happy path and fails every other way in.',
  },
  {
    icon: 'move-diagonal',
    text: 'Popovers, menus, and tooltips get fixed offsets instead of collision handling, so they clip off the edge of the screen near a viewport boundary instead of flipping to stay visible.',
  },
  {
    icon: 'text',
    text: 'Layouts assume short content. A long label, a long name, a long URL overflows its container or pushes the layout apart — nothing truncates, wraps, or reserves space.',
  },
  {
    icon: 'list',
    text: 'Long lists render every row into the page with no bounded scroll region, no virtualization, and no empty or loading state — fine with three items, janky with three thousand.',
  },
  {
    icon: 'square-dashed',
    text: 'The non-happy states simply do not get built: disabled, loading, error, empty, RTL, high-zoom. The model generates what a screenshot shows, and a screenshot only shows one state.',
  },
  {
    icon: 'keyboard',
    text: 'Focus order, focus return after a dialog closes, and keyboard operability are invisible in a mockup, so they are absent in the output. The result is unusable without a mouse.',
  },
];

const WITH_LIBRARY: HighlightItem[] = [
  {
    icon: 'contrast',
    text: 'Color choices routinely fail WCAG contrast. Muted gray on white, brand text on a brand fill, a placeholder that disappears — they read fine in a thumbnail preview and fail an actual contrast check.',
  },
  {
    icon: 'shuffle',
    text: 'Patterns drift from page to page. One screen confirms with a Dialog, the next hand-builds a modal; one form stacks labels, the next floats them. Each prompt re-decides instead of reusing.',
  },
  {
    icon: 'ruler',
    text: 'Spacing, radius, and type scale get re-picked per screen. Without a token vocabulary the assistant invents values, so two pages built an hour apart already feel like two products.',
  },
  {
    icon: 'paintbrush',
    text: 'Hard-coded hex and pixel values slip in beside the library’s components, so theming and dark mode break exactly where the generated code touched.',
  },
];

const HOW_MOVE: HighlightItem[] = [
  {
    icon: 'file-code',
    text: 'Behavior lives in the component contract, not the prompt. Focus management, keyboard interaction, collision flipping, and overflow handling come with Select, Dropdown, and Dialog — the assistant cannot forget to add what it never had to write.',
  },
  {
    icon: 'contrast',
    text: 'Contrast is a property of the palette, not a per-prompt guess. Each color ships legible foreground tokens, so the accessible choice is the default choice instead of something the model has to get right by eye.',
  },
  {
    icon: 'blocks',
    text: 'There is one Select, one Dialog, one Card, reached for through the same slots every time. Consistency stops depending on the assistant remembering what it did on the last page.',
  },
  {
    icon: 'file-json',
    text: 'Specs describe the slots, variants, and defaults in a form the assistant reads directly, so it composes inside the system instead of inventing raw HTML and CSS next to it.',
  },
];

const TOC: TocItem[] = [
  { href: '#what-ai-gets-wrong', label: 'Overview' },
  { href: '#without-a-system', label: 'Without a system' },
  { href: '#with-a-library', label: 'Even with a library' },
  { href: '#how-move-helps', label: 'How Move helps' },
  { href: '#next-steps', label: 'Next steps' },
];

export function WhatAIGetsWrongPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="what-ai-gets-wrong">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/getting-started">Getting started</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>What AI gets wrong</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1} weight="normal">What AI gets wrong</Heading>
          <Text color="muted" size="lg">{TAGLINE}</Text>
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
          id="without-a-system"
          title="Without a system, you’re doomed"
          lede="Ask a model to build UI from nothing and it writes div-and-onClick approximations of real components. They demo well and break the moment someone uses a keyboard, a long string, or the edge of the screen."
        >
          <HighlightList items={WITHOUT_LIBRARY} />
        </Section>

        <Section
          id="with-a-library"
          title="Even with a library, it’s not enough"
          lede="Reaching for components removes the worst of it. What’s left is everything a screenshot can’t convey: contrast, and consistency across screens."
        >
          <HighlightList items={WITH_LIBRARY} />
        </Section>

        <Section
          id="how-move-helps"
          title="How Move closes the gap"
          lede="Move moves these decisions out of the prompt and into the system, so the assistant can’t get them wrong by omission."
        >
          <HighlightList items={HOW_MOVE} />
        </Section>

        <Section id="next-steps" title="Next steps">
          <HighlightList
            items={[
              {
                icon: 'brain',
                text: (
                  <>
                    See how the contract makes this work in <RouterLink to="/core-concepts/how-move-works">How Move Works</RouterLink>.
                  </>
                ),
              },
              {
                icon: 'palette',
                text: (
                  <>
                    The <RouterLink to="/theming">Theming</RouterLink> model is where the contrast guarantees come from.
                  </>
                ),
              },
              {
                icon: 'download',
                text: (
                  <>
                    Or jump straight to <RouterLink to="/getting-started/installation">Installation</RouterLink> and <Code>npm install move</Code>.
                  </>
                ),
              },
            ]}
          />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
