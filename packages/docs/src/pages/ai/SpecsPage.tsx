import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, Code } from 'move';
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

const PIPELINE: HighlightItem[] = [
  {
    icon: 'file-code',
    text: (
      <>
        You write the spec. A typed <Code>.spec.ts</Code> (via{' '}
        <Code>/component-create-spec</Code>) defines the component’s shape,
        behaviour, tokens, and accessibility. Every field is documented in the{' '}
        <RouterLink to="/core-concepts/component-contract">Component Contract</RouterLink>.
      </>
    ),
  },
  {
    icon: 'wand-sparkles',
    text: (
      <>
        The AI generates from it. Source, metadata, and tests come out of the
        spec through the <Code>/component-generate-*</Code> skills. The spec is
        the input; the implementation is an output.
      </>
    ),
  },
  {
    icon: 'shield-check',
    text: (
      <>
        Source is checked back against the spec. <Code>/component-validate</Code>{' '}
        and the spec-drift checks compare what was built to what the spec
        promised, so the implementation can’t silently break the contract.
      </>
    ),
  },
  {
    icon: 'refresh-cw',
    text: 'Everything else derives from the same spec — docs, demos, recipes. One source of truth; nothing to keep in sync by hand.',
  },
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
            against it. This is the loop — and why it keeps source, docs, and
            tests honest. For what a spec actually contains, see the{' '}
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
          lede="Author a spec, generate from it, validate against it — then everything else falls out of the same file."
        >
          <HighlightList items={PIPELINE} />
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
