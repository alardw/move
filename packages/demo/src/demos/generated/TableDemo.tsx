// Generated from Table.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Table } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'data:Table',
  name: 'Table',
  category: 'data',
  description: 'Data table with striped rows, sortable columns, sticky header, row selection, and staggered row entrance animation',
  controls: [
    {
      name: 'variant',
      kind: 'select',
      options: ['default', 'striped'],
      defaultValue: 'default',
    },
    {
      name: 'size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
    {
      name: 'bordered',
      kind: 'boolean',
      defaultValue: false,
    },
    {
      name: 'hoverable',
      kind: 'boolean',
      defaultValue: true,
    },
    {
      name: 'stickyHeader',
      kind: 'boolean',
      defaultValue: false,
    },
  ],
  initialProps: {
    variant: 'default',
    size: 'md',
    bordered: false,
    hoverable: true,
    stickyHeader: false,
  },
  render: (props) => (
    <Table
      variant={props.variant as string}
      size={props.size as string}
      bordered={props.bordered as boolean}
      hoverable={props.hoverable as boolean}
      stickyHeader={props.stickyHeader as boolean}
    >
      <Table.Caption>Sample data table</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head sortable sorted="asc">Name</Table.Head>
          <Table.Head sortable>Email</Table.Head>
          <Table.Head>Role</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Alice Johnson</Table.Cell>
          <Table.Cell>alice@example.com</Table.Cell>
          <Table.Cell>Admin</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Bob Smith</Table.Cell>
          <Table.Cell>bob@example.com</Table.Cell>
          <Table.Cell>Editor</Table.Cell>
        </Table.Row>
        <Table.Row selected>
          <Table.Cell>Carol Williams</Table.Cell>
          <Table.Cell>carol@example.com</Table.Cell>
          <Table.Cell>Viewer</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Dave Brown</Table.Cell>
          <Table.Cell>dave@example.com</Table.Cell>
          <Table.Cell>Editor</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell colSpan={3}>4 users total</Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table>
  ),
};
