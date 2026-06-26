import * as React from 'react';
import { Stack, Heading, Text, Code, Table, valuesForTypeRef } from 'move';
import { AdvancedBadge } from '../AdvancedBadge';
import { InlineCode } from '../InlineCode';

interface Prop {
  name: string;
  /** Inline literal type, e.g. `"'sm' | 'md' | 'lg'"`. Optional —
   *  when `typeRef` is set, the literal is resolved from the registry. */
  type?: string;
  /** Reference to a canonical type in `move/shared/typeRegistry`,
   *  e.g. `'Size'`. Resolves to the same literal at render time. */
  typeRef?: string;
  default?: string;
  description: string;
  advanced?: boolean;
}

interface SubComponent {
  name: string;
  props: Prop[];
  description?: string;
}

const NARROW: React.CSSProperties = { width: 1, whiteSpace: 'nowrap' };

/**
 * Pulls allowed values out of a string-literal-union type like
 * `"'sm' | 'md' | 'lg'"` — returns the bare values (no quotes) so the
 * table can render them as separate chips. Returns null when the type
 * isn't a clean union of string literals (or is missing).
 */
function extractStringLiteralValues(type: string | undefined): string[] | null {
  if (!type) return null;
  const parts = type.trim().split(/ \| /);
  if (parts.length === 0) return null;
  const values: string[] = [];
  for (const p of parts) {
    const m = p.match(/^'([^']*)'$/) ?? p.match(/^"([^"]*)"$/);
    if (!m) return null;
    values.push(m[1]);
  }
  return values;
}

/** Resolve a prop's allowed values + display type. Prefers `typeRef`
 *  (canonical) over an inline `type` literal so cross-component drift
 *  is impossible: the spec just names the canonical type and the
 *  PropsTable looks up the values from the registry. */
function resolveProp(p: Prop): { displayType: string; values: string[] | null } {
  if (p.typeRef) {
    const canonical = valuesForTypeRef(p.typeRef);
    if (canonical) {
      return { displayType: p.typeRef, values: [...canonical] };
    }
    // Unknown typeRef — fall through to inline type (if any).
  }
  const literalValues = extractStringLiteralValues(p.type);
  return {
    displayType: literalValues ? 'string' : (p.type ?? '—'),
    values: literalValues,
  };
}

/**
 * Renders the props of a compound component, one section per sub-component.
 * Data is pulled straight from the .spec.ts so the tables never drift.
 *
 * Layout:
 *  - Type column shows either the canonical type name (when typeRef is
 *    set) or the inline literal. A chip row underneath shows the
 *    allowed values with the default highlighted via variant="subtle".
 */
export function PropsTable({ subComponents }: { subComponents: SubComponent[] }) {
  return (
    <Stack gap="lg">
      {subComponents.map((sub) => {
        if (sub.props.length === 0) return null;
        return (
          <Stack key={sub.name} gap="sm">
            <Heading level={3} weight="normal">
              {sub.name}
            </Heading>
            {sub.description && (
              <Text color="muted" size="sm">
                {sub.description}
              </Text>
            )}
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head style={NARROW}>Prop</Table.Head>
                  <Table.Head style={NARROW}>Type</Table.Head>
                  <Table.Head>Description</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sub.props.map((p) => {
                  const { displayType, values } = resolveProp(p);
                  const defaultBare = p.default?.replace(/^['"]|['"]$/g, '');
                  // Single consistent treatment for defaults: they
                  // always surface in the Type column as a chip. For
                  // enum types, the full set of allowed values
                  // renders and the default one is highlighted. For
                  // plain types with a default, a single highlighted
                  // chip stands in for the value.
                  const chips: { value: string; isDefault: boolean }[] | null = values
                    ? values.map((v) => ({ value: v, isDefault: v === defaultBare }))
                    : defaultBare
                    ? [{ value: defaultBare, isDefault: true }]
                    : null;
                  return (
                    <Table.Row key={p.name}>
                      <Table.Cell style={NARROW}>
                        <Stack direction="row" gap="xs" align="center">
                          <Code>{p.name}</Code>
                          {p.advanced && <AdvancedBadge />}
                        </Stack>
                      </Table.Cell>
                      <Table.Cell style={NARROW}>
                        <Stack gap="xs" align="start">
                          <InlineCode code={displayType} tintByType />
                          {chips && (
                            <Stack direction="row" gap="xs" wrap>
                              {chips.map((c) => (
                                <Code key={c.value} variant={c.isDefault ? 'subtle' : 'ghost'}>
                                  {c.value}
                                </Code>
                              ))}
                            </Stack>
                          )}
                        </Stack>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="sm">{p.description}</Text>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </Stack>
        );
      })}
    </Stack>
  );
}
