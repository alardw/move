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

const HOOKS_INSTALL = `npx move hooks`;

const HOOKS_WHAT = `.githooks/pre-commit   move check --staged
.githooks/pre-push     move check + typecheck + a11y`;

const HOOKS_EXISTING = `npx move hooks --print

# pre-commit:  npx move check --staged
# pre-push:    npx move check`;

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

const CONFIG_SELECT = `// move.config.json
{
  "check": {
    "composites": "src/composites",
    "enable": ["creation"],
    "disable": ["purity"]
  }
}`;

export function ToolingPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="tooling">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/contracts">Conformance</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Tooling</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Tooling</Heading>
          <Text color="muted" size="lg">
            One command runs every <RouterLink to="/conformance/validation">validation</RouterLink>{' '}
            over your project. Wire it into a pre-commit hook and CI, and conformance holds
            automatically — fast while you work, thorough on every push. Move runs it on itself and
            ships the same command to you.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            <Badge variant="soft">
              <Code>move check</Code>
            </Badge>
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
          lede="One command installs the hooks, so the checks run themselves — on the files you stage, and again over everything before a push."
        >
          <Stack gap="lg">
            <Stack gap="sm">
              <Heading level={3}>Install the hooks</Heading>
              <CodeBlock code={HOOKS_INSTALL} />
              <CodeBlock code={HOOKS_WHAT} />
              <Text size="sm" color="muted">
                Commit-time reads only what you staged, so it stays quick enough to leave on.
                Push-time reads the whole project and adds your typecheck and accessibility scripts.
                Both take <Code>--no-verify</Code> when you want the work in progress to go anyway.
              </Text>
              <Text size="sm" color="muted">
                The hooks are shell files in <Code>.githooks/</Code>. Commit them so your team has
                them, and edit them to add your own steps — formatting and linting are the usual
                two. Run <Code>npx move hooks</Code> once per clone, since git keeps{' '}
                <Code>core.hooksPath</Code> locally.
              </Text>
            </Stack>
            <Stack gap="sm">
              <Heading level={3}>Already have a hook runner</Heading>
              <Text size="sm" color="muted">
                husky, lefthook and simple-git-hooks call the same two commands — Move works through
                whichever one you already have.
              </Text>
              <CodeBlock code={HOOKS_EXISTING} />
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

        <Section
          id="config"
          title="Configuration"
          lede="Point the checks at the code you compose. Roots may be a string or a list; a path that isn't there is skipped."
        >
          <CodeBlock code={CONFIG} />
          <Text size="sm" color="muted">
            With no <Code>move.config.json</Code>, Move looks in <Code>src/composites</Code> — where{' '}
            <Code>/app-compose</Code> puts your pages, features, and composites. Author your own
            Move components too? Add a <Code>components</Code> root and the pipeline gates cover
            those as well.
          </Text>
          <Stack gap="sm">
            <Heading level={3}>Choosing what runs</Heading>
            <Text size="sm" color="muted">
              Your roots answer most of this already: a project with no composites gives that check
              nothing to read. Name the exceptions — a check you want beyond the defaults, or one
              you would rather leave out.
            </Text>
            <CodeBlock code={CONFIG_SELECT} />
            <Text size="sm" color="muted">
              Listing exceptions keeps you current: a check added to Move later arrives on its own.
              Naming one on the command line runs it either way, which is how you look into what a
              disabled check would say.
            </Text>
          </Stack>
        </Section>

        <Section
          id="accessibility"
          title="Accessibility conformance"
          lede="Accessibility is one axis of conformance, verified the same way."
        >
          <Text>
            The component roles, names, and structure that make Move accessible are held by these
            same gates, plus an accessibility sweep in CI. For the full WCAG 2.2 picture — every
            criterion, what Move handles, and what’s yours — see the{' '}
            <RouterLink to="/accessibility">Accessibility report</RouterLink>.
          </Text>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
