import * as React from 'react';
import { Stack, Text, Code, Table } from 'move';
import { ColorSwatch, isColorValue } from '../ColorSwatch';

interface Token {
  name: string;
  value: string;
  description: string;
}

const NARROW: React.CSSProperties = { width: 1, whiteSpace: 'nowrap' };

/** Renders the design tokens exposed by a component. Pulled from
 *  spec.tokens. The default value rides along as the Token cell's
 *  description — saves a whole column and keeps long color-mix
 *  values from forcing the table past the viewport. */
export function TokensTable({ tokens }: { tokens: Token[] }) {
  if (tokens.length === 0) {
    return (
      <Text color="muted" size="sm">
        This component doesn’t expose any design tokens — it’s styled purely
        with layout primitives, so there’s nothing to override here.
      </Text>
    );
  }
  return (
    <Stack gap="sm">
      <Text color="muted" size="sm">
        Override these CSS custom properties on <Code>:root</Code>, a theme wrapper,
        or an individual instance via <Code>style</Code>.
      </Text>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head style={NARROW}>Token</Table.Head>
            <Table.Head>Description</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tokens.map((t) => (
            <Table.Row key={t.name}>
              <Table.Cell
                style={NARROW}
                description={
                  <Stack direction="row" gap="xs" align="center">
                    {isColorValue(t.value) && <ColorSwatch value={t.value} />}
                    <Code>{t.value}</Code>
                  </Stack>
                }
              >
                <Code>{t.name}</Code>
              </Table.Cell>
              <Table.Cell>
                <Text size="sm">{t.description}</Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
}
