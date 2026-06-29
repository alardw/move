import React, { useState, useMemo } from 'react';
import { Stack, Heading, Text, Card, Table, Badge, Button, InputText, Pagination, EmptyState, Icon, Avatar } from 'move';
import { usePagination } from 'move';
import type { Color } from 'move';

const defaultLabels = {
  title: 'Users',
  description: 'Manage your team members and their roles.',
  addUser: 'Add User',
  searchPlaceholder: 'Search users...',
  name: 'Name',
  email: 'Email',
  role: 'Role',
  status: 'Status',
  project: 'Project',
  emptyTitle: 'No users found',
  emptyDescription: 'Try adjusting your search or add a new user.',
};

type Labels = typeof defaultLabels;

type User = {
  name: string;
  initials: string;
  color: Color;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  project: string;
};

// Integration point: sample data — replace with the real values.
const SAMPLE_USERS: User[] = [
  { name: 'Alice Johnson', initials: 'AJ', color: 'indigo', email: 'alice@example.com', role: 'Admin', status: 'active', project: 'Design System' },
  { name: 'Bob Smith', initials: 'BS', color: 'teal', email: 'bob@example.com', role: 'Editor', status: 'active', project: 'Mobile App' },
  { name: 'Carol White', initials: 'CW', color: 'orange', email: 'carol@example.com', role: 'Viewer', status: 'inactive', project: 'Design System' },
  { name: 'David Brown', initials: 'DB', color: 'violet', email: 'david@example.com', role: 'Editor', status: 'active', project: 'API Platform' },
  { name: 'Eve Davis', initials: 'ED', color: 'pink', email: 'eve@example.com', role: 'Admin', status: 'pending', project: 'Mobile App' },
  { name: 'Frank Miller', initials: 'FM', color: 'cyan', email: 'frank@example.com', role: 'Viewer', status: 'active', project: 'API Platform' },
  { name: 'Grace Lee', initials: 'GL', color: 'green', email: 'grace@example.com', role: 'Editor', status: 'active', project: 'Design System' },
  { name: 'Henry Wilson', initials: 'HW', color: 'blue', email: 'henry@example.com', role: 'Viewer', status: 'inactive', project: 'Mobile App' },
  { name: 'Iris Chen', initials: 'IC', color: 'grape', email: 'iris@example.com', role: 'Admin', status: 'active', project: 'API Platform' },
  { name: 'Jack Taylor', initials: 'JT', color: 'red', email: 'jack@example.com', role: 'Editor', status: 'pending', project: 'Design System' },
  { name: 'Kate Moore', initials: 'KM', color: 'lime', email: 'kate@example.com', role: 'Viewer', status: 'active', project: 'Mobile App' },
  { name: 'Leo Garcia', initials: 'LG', color: 'yellow', email: 'leo@example.com', role: 'Editor', status: 'active', project: 'API Platform' },
];

const STATUS_COLOR: Record<string, Color> = { active: 'green', inactive: 'gray', pending: 'yellow' };
const PROJECT_COLOR: Record<string, Color> = { 'Design System': 'indigo', 'Mobile App': 'teal', 'API Platform': 'violet' };

const PAGE_SIZE = 5;

export default function ListBasic({ labels }: { labels?: Partial<Labels> }) {
  const t = { ...defaultLabels, ...labels };
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return SAMPLE_USERS;
    const q = search.toLowerCase();
    return SAMPLE_USERS.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pagination = usePagination({ total: totalPages });
  const paged = filtered.slice((pagination.page - 1) * PAGE_SIZE, pagination.page * PAGE_SIZE);

  return (
    <Stack gap="lg" padding="lg">
      <Stack direction="row" align="center" justify="between" wrap gap="md">
        <Stack gap="xs">
          <Heading level={1}>{t.title}</Heading>
          <Text color="muted">{t.description}</Text>
        </Stack>
        <Button>
          <Icon name="plus" size="sm" />
          {t.addUser}
        </Button>
      </Stack>

      <Card.Root>
        <Card.Header>
          <InputText
            placeholder={t.searchPlaceholder}
            iconLeft={<Icon name="search" size="sm" />}
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); pagination.setPage(1); }}
          />
        </Card.Header>
        <Card.Body>
          {paged.length === 0 ? (
            <EmptyState
              icon="search"
              title={t.emptyTitle}
              description={t.emptyDescription}
            />
          ) : (
            <Table hoverable>
              <Table.Header>
                <Table.Row>
                  <Table.Head>{t.name}</Table.Head>
                  <Table.Head>{t.role}</Table.Head>
                  <Table.Head>{t.project}</Table.Head>
                  <Table.Head>{t.status}</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {paged.map((user) => (
                  <Table.Row key={user.email}>
                    <Table.Cell>
                      <Stack direction="row" align="center" gap="sm">
                        <Avatar.Root size="sm" color={user.color}>
                          <Avatar.Fallback>{user.initials}</Avatar.Fallback>
                        </Avatar.Root>
                        <Stack gap="none">
                          <Text weight="medium">{user.name}</Text>
                          <Text size="xs" color="muted">{user.email}</Text>
                        </Stack>
                      </Stack>
                    </Table.Cell>
                    <Table.Cell>{user.role}</Table.Cell>
                    <Table.Cell>
                      <Badge variant="soft" size="sm" color={PROJECT_COLOR[user.project]}>
                        {user.project}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant="dot" size="sm" color={STATUS_COLOR[user.status]}>
                        {user.status}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </Card.Body>
        {filtered.length > PAGE_SIZE && (
          <Card.Footer>
            <Stack direction="row" align="center" justify="between" flex={1}>
              <Text size="sm" color="muted">
                {filtered.length} total
              </Text>
              <Pagination.Root
                page={pagination.page}
                total={pagination.totalPages}
                onChange={pagination.setPage}
              >
                <Pagination.PrevTrigger />
                <Pagination.Items />
                <Pagination.NextTrigger />
              </Pagination.Root>
            </Stack>
          </Card.Footer>
        )}
      </Card.Root>
    </Stack>
  );
}
