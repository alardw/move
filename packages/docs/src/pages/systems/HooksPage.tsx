import { Link as RouterLink } from "react-router-dom";
import { Stack, Heading, Text, Breadcrumb, Icon, Badge } from "move";
import { Section, TocRail, type TocItem, CodeBlock } from "../../components";
import {
  HOOKS_REGISTRY,
  HOOK_CATEGORY_ORDER,
  type HookCategory,
} from "../../content/hooks";

const BADGES = [
  { icon: "puzzle", label: "Small surface" },
  { icon: "react", label: "React-native APIs" },
];

const catId = (c: string) =>
  c
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const CATEGORIES: HookCategory[] = HOOK_CATEGORY_ORDER.filter((c) =>
  HOOKS_REGISTRY.some((h) => h.category === c),
);

const TOC: TocItem[] = [
  { href: "#hooks", label: "Overview" },
  ...CATEGORIES.map((c) => ({ href: `#${catId(c)}`, label: c })),
];

const mono: React.CSSProperties = {
  fontFamily: "var(--move-font-code)",
  fontSize: "var(--move-text-sm)",
  color: "var(--move-fg-base)",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

export function HooksPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="hooks">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/systems">Systems</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Hooks</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Hooks</Heading>
          <Text color="muted" size="lg">
            A small set of React hooks Move ships for the cases that need to
            cross component lines. Same shape as React&apos;s built-ins, no
            extra ceremony.
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

        {CATEGORIES.map((cat) => (
          <Section key={cat} id={catId(cat)} title={cat}>
            <Stack gap="lg">
              {HOOKS_REGISTRY.filter((h) => h.category === cat).map((hook) => (
                <Stack key={hook.name} gap="xs">
                  <Stack direction="row" gap="sm" align="center" wrap>
                    <code style={mono}>{hook.signature}</code>
                    {hook.companion && (
                      <Badge variant="soft" size="sm">
                        + {hook.companion}
                      </Badge>
                    )}
                  </Stack>
                  <Text size="sm" color="muted">
                    {hook.summary}
                  </Text>
                  {hook.companionSummary && (
                    <Text size="sm" color="muted">
                      {hook.companionSummary}
                    </Text>
                  )}
                  {hook.example && (
                    <CodeBlock code={hook.example} language="tsx" />
                  )}
                </Stack>
              ))}
            </Stack>
          </Section>
        ))}
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
