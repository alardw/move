import { Fragment } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, Code, Card } from 'move';
import {
  HighlightList,
  type HighlightItem,
  Section,
  TocRail,
  type TocItem,
} from '../../components';

const BADGES = [
  { icon: 'workflow', label: 'Spec → generate → validate' },
  { icon: 'shield-check', label: 'Drift-checked' },
];

const STEPS = [
  { icon: 'search', label: 'Analyze', hint: 'Research the shape', skill: '/component-analyze' },
  { icon: 'file-code', label: 'Spec', hint: 'Author the .spec.ts', skill: '/component-create-spec' },
  { icon: 'wand-sparkles', label: 'Generate', hint: 'Source, meta, tests', skill: '/component-generate-*' },
  { icon: 'shield-check', label: 'Validate', hint: 'Check against the spec', skill: '/component-validate' },
];

const WHY_IT_HOLDS: HighlightItem[] = [
  {
    icon: 'wand-sparkles',
    text: 'The spec is machine-readable. The assistant reads an exact description of the component, not your source or a screenshot — so it builds from structure, not guesswork.',
  },
  {
    icon: 'lock',
    text: 'The spec is a contract, not a suggestion. It is enforced — generated code that drifts from it fails validation before it ships, so the description and the implementation stay honest with each other.',
  },
];

const TOC: TocItem[] = [
  { href: '#specs', label: 'Overview' },
  { href: '#loop', label: 'The loop' },
  { href: '#why-it-holds', label: 'Why it holds' },
  { href: '#next-steps', label: 'Next steps' },
];

export function SpecsPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="specs">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/ai">AI</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Spec pipeline</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1} weight="normal">Spec pipeline</Heading>
          <Text color="muted" size="lg">
            Every Move component is generated from a spec and checked back
            against it. This is the loop — and why source, metadata, and tests
            never drift from the description. For what a spec actually contains, see the{' '}
            <RouterLink to="/core-concepts/component-contract">Component Contract</RouterLink>.
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
          id="loop"
          title="The loop"
          lede="Research the shape, write the spec, generate source/meta/tests from it, and validate the result back against it."
        >
          <Stack direction="row" align="stretch" gap="sm" wrap>
            {STEPS.map((s, i) => (
              <Fragment key={s.label}>
                <Card.Root variant="elevated">
                  <Card.Body>
                    <Stack gap="xs" align="center">
                      <Icon name={s.icon} size={22} />
                      <Text weight="semibold" size="sm">{s.label}</Text>
                      <Text color="muted" size="xs">{s.hint}</Text>
                      <Code size="xs">{s.skill}</Code>
                    </Stack>
                  </Card.Body>
                </Card.Root>
                {i < STEPS.length - 1 && (
                  <Stack justify="center">
                    <Icon name="arrow-right" />
                  </Stack>
                )}
              </Fragment>
            ))}
          </Stack>
        </Section>

        <Section
          id="why-it-holds"
          title="Why it holds"
          lede="The spec is the artifact; the contract is the promise that it’s enforced."
        >
          <HighlightList items={WHY_IT_HOLDS} />
        </Section>

        <Section id="next-steps" title="Next steps">
          <HighlightList
            items={[
              {
                icon: 'file-code',
                text: (
                  <>
                    Read the <RouterLink to="/core-concepts/component-contract">Component Contract</RouterLink> for the spec field by field, and how it’s enforced.
                  </>
                ),
              },
              {
                icon: 'wand-sparkles',
                text: (
                  <>
                    See <RouterLink to="/ai/skills">Skills</RouterLink> for the commands that run each step of the loop.
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
