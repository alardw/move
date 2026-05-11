import * as React from 'react';
import { Text, Code, Table } from 'move';

const NARROW: React.CSSProperties = { width: 1, whiteSpace: 'nowrap' };

/** Keyboard shortcuts for a component — simple key + action table. */
export function KeyboardTable({ rows }: { rows: { key: string; action: string }[] }) {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head style={NARROW}>Key</Table.Head>
          <Table.Head>Action</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.key}>
            <Table.Cell style={NARROW}>
              <Code>{r.key}</Code>
            </Table.Cell>
            <Table.Cell>
              <Text size="sm">{r.action}</Text>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
