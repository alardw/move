import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Badge, Code } from 'move';
import { CodeBlock, Section, TocRail, type TocItem } from '../../components';

const TOC: TocItem[] = [
  { href: '#tooling', label: 'Overview' },
  { href: '#running', label: 'One command' },
  { href: '#wire', label: 'Wire it in' },
  { href: '#config', label: 'Configuration' },
  { href: '#accessibility', label: 'Accessibility' },
];

const HOOK = `# .githooks/pre-commit
#!/usr/bin/env sh
npx move check || exit 1

# turn it on once (per clone):
#   git config core.hooksPath .githooks`;

const GH_CI = `# .github/workflows/conformance.yml
name: Conformance
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx move check`;

const GL_CI = `# .gitlab-ci.yml
conformance:
  image: node:20
  script:
    - npm ci
    - npx move check`;

const CONFIG = `// move.config.json
{
  "check": {
    "composites": "src/composites"
  }
}`;

export function ToolingPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="tooling">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild><RouterLink to="/">Docs</RouterLink></Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild><RouterLink to="/contracts">Conformance</RouterLink></Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Tooling</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Tooling</Heading>
          <Text color="muted" size="lg">
            One command runs every{' '}
            <RouterLink to="/conformance/validation">validation</RouterLink> over your project. Wire
            it into a pre-commit hook and CI, and conformance holds automatically — fast while you
            work, thorough on every push. Move runs it on itself and ships the same command to you.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            <Badge variant="soft"><Code>move check</Code></Badge>
            <Badge variant="soft">Pre-commit</Badge>
            <Badge variant="soft">CI</Badge>
          </Stack>
        </Stack>

        <Section id="running" title="One command" lede="One command checks your whole app.">
          <Text>
            <Code>move check</Code> runs every gate over your project and reports the result — every
            commit and every pull request stays true to the contract.
          </Text>
          <CodeBlock code={`npx move check`} />
        </Section>

        <Section
          id="wire"
          title="Wire it in"
          lede="Two hooks and it runs itself — fast locally, thorough in CI. Copy these in; a one-command scaffold is coming."
        >
          <Stack gap="lg">
            <Stack gap="sm">
              <Heading level={3}>Pre-commit — fast, local</Heading>
              <Text size="sm" color="muted">
                Blocks a bad commit before it lands, so problems never reach the branch.
              </Text>
              <CodeBlock code={HOOK} />
            </Stack>
            <Stack gap="sm">
              <Heading level={3}>CI — thorough, every push</Heading>
              <Text size="sm" color="muted">
                The full set on every push and pull request, so nothing merges out of conformance —
                GitHub Actions and GitLab CI:
              </Text>
              <CodeBlock code={GH_CI} />
              <CodeBlock code={GL_CI} />
            </Stack>
          </Stack>
        </Section>

        <Section id="config" title="Configuration" lede="Point the checks at the code you compose. Roots may be a string or a list; a path that isn't there is skipped.">
          <CodeBlock code={CONFIG} />
          <Text size="sm" color="muted">
            With no <Code>move.config.json</Code>, Move looks in <Code>src/composites</Code> — where{' '}
            <Code>/app-compose</Code> puts your pages, features, and composites. Author your own Move
            components too? Add a <Code>components</Code> root and the pipeline gates cover those as well.
          </Text>
        </Section>

        <Section
          id="accessibility"
          title="Accessibility conformance"
          lede="Accessibility is one axis of conformance, verified the same way."
        >
          <Text>
            The component roles, names, and structure that make Move accessible are held by these same
            gates, plus an accessibility sweep in CI. For the full WCAG 2.2 picture — every criterion,
            what Move handles, and what’s yours — see the{' '}
            <RouterLink to="/accessibility">Accessibility report</RouterLink>.
          </Text>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
