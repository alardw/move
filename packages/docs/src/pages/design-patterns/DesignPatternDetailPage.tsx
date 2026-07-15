import { useParams, Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Badge, Code, Alert, Card, MarkerList } from 'move';
import type { SlotSpec, DesignPatternSpec, AxisSpec, Binding } from '@move-patterns/spec-type';
import { Section, TocRail, type TocItem } from '../../components';
import { getPattern, childPatternSlugs, parentPatternSlugs } from '@move-patterns/registry';

// A row of linked pattern references (child or parent patterns).
function PatternRefs({ slugs }: { slugs: string[] }) {
  return (
    <Stack direction="row" gap="xs" wrap>
      {slugs.map((s) => {
        const p = getPattern(s);
        const label = p?.title ?? s;
        return p?.status === 'available' ? (
          <RouterLink key={s} to={`/design-patterns/${s}`}>
            <Badge variant="soft" color="orange">
              {label}
            </Badge>
          </RouterLink>
        ) : (
          <Badge key={s} variant="soft" color="gray">
            {label}
          </Badge>
        );
      })}
    </Stack>
  );
}

const TOC: TocItem[] = [{ href: '#structure', label: 'Structure' }];

const DECIDED_COLOR = {
  'data-rule': 'blue',
  'use-case-preset': 'indigo',
  consumer: 'green',
  'ai-heuristic': 'orange',
} as const;
const AS_COLOR = {
  node: 'blue',
  prop: 'teal',
  behavior: 'grape',
  pattern: 'orange',
} as const;

// One axis, shown where it's decided: name · how it's decided · what it means.
function AxisHead({ axis }: { axis: AxisSpec }) {
  return (
    <Stack direction="row" gap="xs" align="center" wrap>
      <Code>{axis.axis}</Code>
      <Badge variant="soft" size="sm" color={DECIDED_COLOR[axis.decidedBy]}>
        {axis.decidedBy}
      </Badge>
      <Text size="xs" color="muted">
        {axis.gloss}
      </Text>
    </Stack>
  );
}

// One axis with its per-value bindings — the head, then each value and the Move node it
// resolves to (a bulleted list). Reused for a slot's own axes AND a delegated child's axes.
function AxisBlock({ axis, bindings }: { axis: AxisSpec; bindings: readonly Binding[] }) {
  return (
    <Stack gap="xs">
      <AxisHead axis={axis} />
      <MarkerList spacing="xs">
        {bindings.map((b, i) => {
          const wildcard = b.value === '*';
          const opts = axis.options ?? [];
          return (
            <MarkerList.Item key={`${b.value}-${i}`}>
              <Stack gap="xs">
                {/* the choice(s) this binding covers — a wildcard enumerates the real options */}
                {wildcard && opts.length > 0 && (
                  <Stack direction="row" gap="xs" wrap align="center">
                    <Text size="sm" color="muted">
                      any of:
                    </Text>
                    {opts.map((o) => (
                      <Code key={o}>{o}</Code>
                    ))}
                  </Stack>
                )}
                {/* what it resolves to */}
                <Stack direction="row" gap="xs" align="start" wrap>
                  {!wildcard && (
                    <Text size="sm" weight="medium">
                      {b.value}
                    </Text>
                  )}
                  {wildcard && opts.length === 0 && (
                    <Text size="sm" color="muted">
                      any value
                    </Text>
                  )}
                  <Badge variant="soft" size="sm" color={AS_COLOR[b.as]}>
                    {b.as}
                  </Badge>
                  {b.repr ? (
                    <Code>{b.repr}</Code>
                  ) : (
                    <Badge variant="soft" size="sm" color="red">
                      gap
                    </Badge>
                  )}
                  {b.note && (
                    <Text size="sm" color="muted">
                      · {b.note}
                    </Text>
                  )}
                </Stack>
              </Stack>
            </MarkerList.Item>
          );
        })}
      </MarkerList>
    </Stack>
  );
}

// Recursive nested layout — each slot is a box holding everything decided AT that slot:
// its axes (+ how each is decided) → each axis value and the Move node it resolves to →
// the rules that constrain those axes → its child slots. A delegated slot links to the
// child pattern and shows the child's axes inline (defined there, controlled here).
function SlotNode({ slot, spec }: { slot: SlotSpec; spec: DesignPatternSpec }) {
  const children = spec.skeleton.filter((s) => s.parent === slot.slot);
  const slotAxes = spec.axes.filter((a) => slot.drivenBy.includes(a.axis));
  const bindingsFor = (axis: string) =>
    spec.bindings.filter((b) => b.slot === slot.slot && b.axis === axis);
  // A rule (not a choice) is plotted directly on any slot whose axes it constrains.
  const slotRules = spec.heuristics.filter((h) => h.axes.some((ax) => slot.drivenBy.includes(ax)));
  const child = slot.designPattern ? getPattern(slot.designPattern) : undefined;
  const slotData = (spec.data ?? []).filter((d) => d.slot === slot.slot);
  const slotState = (spec.state ?? []).filter((s) => s.slot === slot.slot);
  const slotFeedback = (spec.feedback ?? []).filter((f) => f.slot === slot.slot);
  const hasDecisions =
    slotAxes.length > 0 || slotRules.length > 0 || !!(child?.spec && slotAxes.length === 0);

  return (
    <Card.Root variant="default">
      <Card.Body>
        <Stack gap="sm">
          <Stack direction="row" gap="sm" align="center" justify="between" wrap>
            <Stack direction="row" gap="sm" align="center" wrap>
              <Text weight="semibold">{slot.slot}</Text>
              {child &&
                (child.status === 'available' ? (
                  <RouterLink to={`/design-patterns/${child.slug}`}>
                    <Badge variant="soft" color="orange">
                      → {child.title}
                    </Badge>
                  </RouterLink>
                ) : (
                  <Badge variant="soft" color="orange">
                    → {child.title}
                  </Badge>
                ))}
            </Stack>
            {slot.optional && (
              <Badge variant="soft" color="gray">
                optional
              </Badge>
            )}
          </Stack>
          <Text size="sm" color="muted">
            {slot.role}
          </Text>

          {/* Lane 1 — Decisions: the axes (+ how each is decided) and the rules on them. */}
          {hasDecisions && (
            <Badge variant="soft" size="sm" color="indigo">
              Decisions
            </Badge>
          )}
          {slotAxes.map((a) => (
            <AxisBlock key={a.axis} axis={a} bindings={bindingsFor(a.axis)} />
          ))}

          {/* A fully-delegated slot: the child DEFINES these axes; the host CONTROLS them
              top-down (use-case-preset axes propagate from this pattern's useCase). */}
          {child?.spec && slotAxes.length === 0 && (
            <Stack gap="xs">
              <Text size="xs" color="muted">
                Defined in {child.title}; controlled here — the{' '}
                <Badge variant="soft" size="sm" color={DECIDED_COLOR['use-case-preset']}>
                  use-case-preset
                </Badge>{' '}
                axes propagate from this pattern’s useCase.
              </Text>
              <Stack gap="sm">
                {child.spec.axes.map((a) => (
                  <AxisBlock
                    key={a.axis}
                    axis={a}
                    bindings={child.spec!.bindings.filter((b) => b.axis === a.axis)}
                  />
                ))}
              </Stack>
            </Stack>
          )}

          {/* Rules constraining this slot's axes — a rule, not a choice. */}
          {slotRules.length > 0 && (
            <Stack gap="xs">
              {slotRules.map((h) => (
                <Stack key={h.id} direction="row" gap="xs" align="start" wrap>
                  <Badge variant="soft" size="sm" color={h.checkable ? 'green' : 'gray'}>
                    {h.checkable ? 'oracle' : 'rule'}
                  </Badge>
                  <Text size="sm">{h.law}</Text>
                </Stack>
              ))}
            </Stack>
          )}

          {/* Lane 2 — Data: content this slot reads (in) or produces (out). */}
          {slotData.length > 0 && (
            <>
              <Badge variant="soft" size="sm" color="cyan">
                Data
              </Badge>
              <MarkerList spacing="xs">
                {slotData.map((d, i) => (
                  <MarkerList.Item key={`${d.field}-${i}`}>
                    <Stack direction="row" gap="xs" align="start" wrap>
                      <Code>{d.field}</Code>
                      <Text size="xs" color="muted">
                        {d.type}
                      </Text>
                      <Badge variant="soft" size="sm" color={d.direction === 'in' ? 'blue' : 'orange'}>
                        {d.direction}
                      </Badge>
                      {d.drives && d.drives.length > 0 && (
                        <Text size="xs" color="muted">
                          → drives {d.drives.join(', ')}
                        </Text>
                      )}
                      {d.note && (
                        <Text size="xs" color="muted">
                          · {d.note}
                        </Text>
                      )}
                    </Stack>
                  </MarkerList.Item>
                ))}
              </MarkerList>
            </>
          )}

          {/* Lane 3 — State: mutable runtime state this slot owns (local / controllable). */}
          {slotState.length > 0 && (
            <>
              <Badge variant="soft" size="sm" color="grape">
                State
              </Badge>
              <MarkerList spacing="xs">
                {slotState.map((s, i) => (
                  <MarkerList.Item key={`${s.name}-${i}`}>
                    <Stack direction="row" gap="xs" align="start" wrap>
                      <Code>{s.name}</Code>
                      <Text size="xs" color="muted">
                        {s.of}
                      </Text>
                      <Badge
                        variant="soft"
                        size="sm"
                        color={s.control === 'controllable' ? 'teal' : 'gray'}
                      >
                        {s.control}
                      </Badge>
                      {s.note && (
                        <Text size="xs" color="muted">
                          · {s.note}
                        </Text>
                      )}
                    </Stack>
                  </MarkerList.Item>
                ))}
              </MarkerList>
            </>
          )}

          {/* Lane 4 — Feedback: the async resource status rendered (ready = the content). */}
          {slotFeedback.length > 0 && (
            <>
              <Badge variant="soft" size="sm" color="orange">
                Feedback
              </Badge>
              <MarkerList spacing="xs">
                {slotFeedback.map((f, i) => (
                  <MarkerList.Item key={`${f.status}-${i}`}>
                    <Stack direction="row" gap="xs" align="start" wrap>
                      <Text size="sm" weight="medium">
                        {f.status}
                      </Text>
                      {f.repr ? (
                        <Code>{f.repr}</Code>
                      ) : (
                        <Badge variant="soft" size="sm" color="red">
                          gap
                        </Badge>
                      )}
                      {f.note && (
                        <Text size="sm" color="muted">
                          · {f.note}
                        </Text>
                      )}
                    </Stack>
                  </MarkerList.Item>
                ))}
              </MarkerList>
            </>
          )}

          {children.length > 0 && (
            <Stack gap="sm">
              {children.map((c) => (
                <SlotNode key={c.slot} slot={c} spec={spec} />
              ))}
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}

export function DesignPatternDetailPage() {
  const { slug } = useParams();
  const pattern = slug ? getPattern(slug) : undefined;

  if (!pattern) {
    return (
      <Stack gap="md">
        <Heading level={1}>Pattern not found</Heading>
        <Text color="muted">
          <RouterLink to="/design-patterns">← Back to Design Patterns</RouterLink>
        </Text>
      </Stack>
    );
  }

  const spec = pattern.spec;
  const children = childPatternSlugs(pattern.slug);
  const parents = parentPatternSlugs(pattern.slug);

  return (
    <Stack direction="row" gap="xl" align="stretch" id="design-pattern-detail">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/design-patterns">Design Patterns</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>{pattern.title}</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Stack direction="row" gap="sm" align="center" wrap>
            <Heading level={1}>{pattern.title}</Heading>
            {pattern.status !== 'available' && <Badge variant="soft">planned</Badge>}
          </Stack>
          <Text color="muted" size="lg">
            {pattern.description}
          </Text>
          {spec?.appliesWhen && spec.appliesWhen.length > 0 && (
            <Stack gap="xs">
              <Text size="sm" weight="medium">
                Reach for this when
              </Text>
              <MarkerList spacing="xs">
                {spec.appliesWhen.map((w) => (
                  <MarkerList.Item key={w}>
                    <Text size="sm" color="muted">
                      {w}
                    </Text>
                  </MarkerList.Item>
                ))}
              </MarkerList>
            </Stack>
          )}
          {(children.length > 0 || parents.length > 0) && (
            <Stack direction="row" gap="xl" wrap>
              {children.length > 0 && (
                <Stack gap="xs">
                  <Text size="sm" weight="medium">
                    Composed of — child patterns
                  </Text>
                  <PatternRefs slugs={children} />
                </Stack>
              )}
              {parents.length > 0 && (
                <Stack gap="xs">
                  <Text size="sm" weight="medium">
                    Used by — parent patterns
                  </Text>
                  <PatternRefs slugs={parents} />
                </Stack>
              )}
            </Stack>
          )}
        </Stack>

        {!spec ? (
          <Alert variant="info" title="On the roadmap">
            This pattern isn’t authored yet — no <Code>DesignPatternSpec</Code> to render. It’s listed
            to show where the catalogue is heading.
          </Alert>
        ) : (
          <Section
            id="structure"
            title="Structure — what’s decided at each level"
            lede="The skeleton as a nested layout. Each slot box holds everything decided AT that slot: its axes (tagged by how each is decided — a data rule, a use-case preset, an explicit consumer choice, or the AI under a rule), each axis value and the Move node it resolves to (node / prop / behavior), and the rules that constrain those axes. A slot that delegates links to its child pattern and shows the child’s axes inline — defined there, controlled here."
          >
            <Stack gap="sm">
              {spec.skeleton
                .filter((s) => s.parent === null)
                .map((root) => (
                  <SlotNode key={root.slot} slot={root} spec={spec} />
                ))}
            </Stack>

            <Text color="muted" size="sm">
              The full conceptual treatment — presets, actions, propagation, a worked instance — lives
              on{' '}
              <RouterLink to="/contracts/design-pattern">
                Core Concepts → Design Patterns
              </RouterLink>
              .
            </Text>
          </Section>
        )}
      </Stack>
      {spec && <TocRail items={TOC} />}
    </Stack>
  );
}
