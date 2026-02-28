import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table } from './Table';

const invoices = [
  { id: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
  { id: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
  { id: 'INV003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
  { id: 'INV004', status: 'Paid', method: 'Credit Card', amount: '$450.00' },
  { id: 'INV005', status: 'Paid', method: 'PayPal', amount: '$550.00' },
];

const meta: Meta<typeof Table> = {
  title: 'Data/Table',
  component: Table,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'striped'],
      table: { defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
    bordered: {
      control: 'boolean',
    },
    hoverable: {
      control: 'boolean',
    },
    stickyHeader: {
      control: 'boolean',
    },
  },
  render: (args) => (
    <Table {...args}>
      <Table.Caption>A list of recent invoices.</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Invoice</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Method</Table.Head>
          <Table.Head style={{ textAlign: 'right' }}>Amount</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {invoices.map((inv) => (
          <Table.Row key={inv.id}>
            <Table.Cell style={{ fontWeight: 'var(--move-weight-medium)' }}>{inv.id}</Table.Cell>
            <Table.Cell>{inv.status}</Table.Cell>
            <Table.Cell>{inv.method}</Table.Cell>
            <Table.Cell style={{ textAlign: 'right' }}>{inv.amount}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell colSpan={3}>Total</Table.Cell>
          <Table.Cell style={{ textAlign: 'right' }}>$1,750.00</Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table>
  ),
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Default: Story = {};
