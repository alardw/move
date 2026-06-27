import { useState, useMemo, type ChangeEvent } from 'react';
import { Table, Stack, InputText, Button, Text, Badge, Pagination, Icon, Dialog, Checkbox, FormField } from 'move';

const defaultLabels = {
  searchPlaceholder: 'Search...',
  filtersButton: 'Filters',
  clearAll: 'Clear all',
  cancel: 'Cancel',
  apply: 'Apply',
  filtersTitle: 'Filters',
  statusGroup: 'Status',
  roleGroup: 'Role',
  name: 'Name',
  role: 'Role',
  email: 'Email',
  status: 'Status',
  noResults: 'No results found.',
  showing: (from: number, to: number, total: number) => `Showing ${from}\u2013${to} of ${total}`,
};

type Labels = typeof defaultLabels;
type SortKey = 'name' | 'role' | 'email' | 'status';
type SortDir = 'asc' | 'desc';

type FilterOption = { label: string; value: string; group: string };

const filterOptions: FilterOption[] = [
  { label: 'Active', value: 'Active', group: 'Status' },
  { label: 'Inactive', value: 'Inactive', group: 'Status' },
  { label: 'Pending', value: 'Pending', group: 'Status' },
  { label: 'Engineer', value: 'Engineer', group: 'Role' },
  { label: 'Designer', value: 'Designer', group: 'Role' },
  { label: 'Manager', value: 'Manager', group: 'Role' },
];

const DATA = [
  { name: 'Alice Johnson', role: 'Engineer', email: 'alice@example.com', status: 'Active' },
  { name: 'Bob Smith', role: 'Designer', email: 'bob@example.com', status: 'Active' },
  { name: 'Carol White', role: 'Manager', email: 'carol@example.com', status: 'Inactive' },
  { name: 'David Brown', role: 'Engineer', email: 'david@example.com', status: 'Active' },
  { name: 'Eve Davis', role: 'Designer', email: 'eve@example.com', status: 'Pending' },
  { name: 'Frank Miller', role: 'Manager', email: 'frank@example.com', status: 'Active' },
  { name: 'Grace Lee', role: 'Engineer', email: 'grace@example.com', status: 'Inactive' },
  { name: 'Henry Wilson', role: 'Designer', email: 'henry@example.com', status: 'Active' },
  { name: 'Iris Chen', role: 'Engineer', email: 'iris@example.com', status: 'Active' },
  { name: 'Jack Taylor', role: 'Manager', email: 'jack@example.com', status: 'Pending' },
  { name: 'Karen Adams', role: 'Designer', email: 'karen@example.com', status: 'Active' },
  { name: 'Leo Garcia', role: 'Engineer', email: 'leo@example.com', status: 'Inactive' },
];

const PAGE_SIZE = 5;

const statusColor: Record<string, 'green' | 'red' | 'yellow'> = {
  Active: 'green',
  Inactive: 'red',
  Pending: 'yellow',
};

export default function FilterableDataTable({ labels }: { labels?: Partial<Labels> }) {
  const t = { ...defaultLabels, ...labels };
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [pendingFilters, setPendingFilters] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);

  const groups = useMemo(() => {
    const map = new Map<string, FilterOption[]>();
    for (const opt of filterOptions) {
      const list = map.get(opt.group) ?? [];
      list.push(opt);
      map.set(opt.group, list);
    }
    return [...map.entries()];
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return DATA
      .filter(row => {
        const matchesSearch = !q || row.name.toLowerCase().includes(q) || row.email.toLowerCase().includes(q);
        const matchesFilters = activeFilters.length === 0 ||
          activeFilters.includes(row.status) ||
          activeFilters.includes(row.role);
        return matchesSearch && matchesFilters;
      })
      .sort((a, b) => {
        const cmp = a[sortKey].localeCompare(b[sortKey]);
        return sortDir === 'asc' ? cmp : -cmp;
      });
  }, [search, activeFilters, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const to = Math.min(safePage * PAGE_SIZE, filtered.length);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const sortIcon = (key: SortKey) =>
    sortKey === key ? <Icon name={sortDir === 'asc' ? 'arrow-up' : 'arrow-down'} size="xs" /> : null;

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const removeFilter = (value: string) => {
    setActiveFilters(prev => prev.filter(f => f !== value));
    setPage(1);
  };

  const openDialog = () => {
    setPendingFilters([...activeFilters]);
    setDialogOpen(true);
  };

  const applyFilters = () => {
    setActiveFilters(pendingFilters);
    setDialogOpen(false);
    setPage(1);
  };

  const togglePending = (value: string, checked: boolean) => {
    setPendingFilters(prev =>
      checked ? [...prev, value] : prev.filter(f => f !== value),
    );
  };

  return (
    <Stack gap="md">
      <Stack direction="row" gap="sm" align="center">
        <InputText
          placeholder={t.searchPlaceholder}
          iconLeft={<Icon name="search" size="sm" />}
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
        />
        <Button variant="secondary" onClick={openDialog}>
          <Icon name="sliders-horizontal" size="sm" />
          {t.filtersButton}
          {activeFilters.length > 0 && (
            <Badge size="sm" color="primary" variant="solid">
              {activeFilters.length}
            </Badge>
          )}
        </Button>
      </Stack>

      {activeFilters.length > 0 && (
        <Stack direction="row" gap="xs" wrap>
          {activeFilters.map((value) => (
            <Button key={value} variant="secondary" size="sm" onClick={() => removeFilter(value)}>
              {value}
              <Icon name="x" size="xs" />
            </Button>
          ))}
          <Button variant="ghost" size="sm" onClick={() => { setActiveFilters([]); setPage(1); }}>
            {t.clearAll}
          </Button>
        </Stack>
      )}

      <Table hoverable>
        <Table.Header>
          <Table.Row>
            {(['name', 'role', 'email', 'status'] as SortKey[]).map((key) => (
              <Table.Head key={key}>
                <Button variant="ghost" size="sm" onClick={() => toggleSort(key)}>
                  <Stack direction="row" gap="xs" align="center">
                    <Text size="sm" weight="semibold">{t[key]}</Text>
                    {sortIcon(key)}
                  </Stack>
                </Button>
              </Table.Head>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {paged.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={4}>
                <Text color="muted" align="center">{t.noResults}</Text>
              </Table.Cell>
            </Table.Row>
          ) : paged.map((row) => (
            <Table.Row key={row.email}>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.role}</Table.Cell>
              <Table.Cell>{row.email}</Table.Cell>
              <Table.Cell>
                <Badge size="sm" variant="soft" color={statusColor[row.status]}>{row.status}</Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Stack direction="row" justify="between" align="center">
        <Text size="sm" color="muted">{t.showing(from, to, filtered.length)}</Text>
        <Pagination.Root total={totalPages} page={safePage} onChange={setPage} size="sm">
          <Pagination.PrevTrigger />
          <Pagination.Items />
          <Pagination.NextTrigger />
        </Pagination.Root>
      </Stack>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content size="sm">
            <Dialog.Header>
              <Dialog.Title>{t.filtersTitle}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap="md">
                {groups.map(([groupName, options]) => (
                  <FormField.Root key={groupName}>
                    <FormField.Label>{groupName}</FormField.Label>
                    <FormField.Field>
                      <Stack gap="xs">
                        {options.map((opt) => (
                          <Checkbox
                            key={opt.value}
                            checked={pendingFilters.includes(opt.value)}
                            onCheckedChange={(checked: boolean | 'indeterminate') => togglePending(opt.value, !!checked)}
                          >
                            {opt.label}
                          </Checkbox>
                        ))}
                      </Stack>
                    </FormField.Field>
                  </FormField.Root>
                ))}
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.FooterStart>
                <Button variant="ghost" size="sm" onClick={() => setPendingFilters([])}>
                  {t.clearAll}
                </Button>
              </Dialog.FooterStart>
              <Dialog.FooterEnd>
                <Stack direction="row" gap="sm">
                  <Dialog.Close asChild>
                    <Button variant="secondary">{t.cancel}</Button>
                  </Dialog.Close>
                  <Button onClick={applyFilters}>
                    {t.apply} {pendingFilters.length > 0 && `(${pendingFilters.length})`}
                  </Button>
                </Stack>
              </Dialog.FooterEnd>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Stack>
  );
}
