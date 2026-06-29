import { useState, useMemo, type ChangeEvent } from 'react';
import { Stack, InputText, Button, Badge, Dialog, Checkbox, FormField, Icon, List } from 'move';

const defaultLabels = {
  searchPlaceholder: 'Search...',
  filtersButton: 'Filters',
  clearAll: 'Clear all',
  filtersTitle: 'Filters',
  cancel: 'Cancel',
  apply: 'Apply',
  noResultsTitle: 'No results',
  noResultsDescription: 'Try adjusting your search or filters.',
};

type Labels = typeof defaultLabels;

type FilterOption = { label: string; value: string; group: string };

// Integration point: SAMPLE_FILTER_OPTIONS — the available filter facets.
const SAMPLE_FILTER_OPTIONS: FilterOption[] = [
  { label: 'Active', value: 'active', group: 'Status' },
  { label: 'Inactive', value: 'inactive', group: 'Status' },
  { label: 'Pending', value: 'pending', group: 'Status' },
  { label: 'Engineering', value: 'engineering', group: 'Department' },
  { label: 'Design', value: 'design', group: 'Department' },
  { label: 'Marketing', value: 'marketing', group: 'Department' },
  { label: 'Sales', value: 'sales', group: 'Department' },
];

// Integration point: data — replace with the real records to search/filter.
const SAMPLE_DATA = [
  { name: 'Leslie Alexander', email: 'leslie@example.com', status: 'active', department: 'engineering' },
  { name: 'Michael Foster', email: 'michael@example.com', status: 'active', department: 'design' },
  { name: 'Dries Vincent', email: 'dries@example.com', status: 'inactive', department: 'marketing' },
  { name: 'Lindsay Walton', email: 'lindsay@example.com', status: 'pending', department: 'engineering' },
  { name: 'Courtney Henry', email: 'courtney@example.com', status: 'active', department: 'sales' },
  { name: 'Tom Cook', email: 'tom@example.com', status: 'inactive', department: 'design' },
];

export default function SearchFilter({ labels }: { labels?: Partial<Labels> }) {
  const t = { ...defaultLabels, ...labels };
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [pendingFilters, setPendingFilters] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const groups = useMemo(() => {
    const map = new Map<string, FilterOption[]>();
    for (const opt of SAMPLE_FILTER_OPTIONS) {
      const list = map.get(opt.group) ?? [];
      list.push(opt);
      map.set(opt.group, list);
    }
    return [...map.entries()];
  }, []);

  const filtered = useMemo(() => {
    // Group active filter values by facet group → AND across groups, OR within a group.
    const activeByGroup = new Map<string, string[]>();
    for (const value of activeFilters) {
      const opt = SAMPLE_FILTER_OPTIONS.find((o) => o.value === value);
      if (!opt) continue;
      const list = activeByGroup.get(opt.group) ?? [];
      list.push(value);
      activeByGroup.set(opt.group, list);
    }
    const fieldForGroup: Record<string, (item: typeof SAMPLE_DATA[number]) => string> = {
      Status: (item) => item.status,
      Department: (item) => item.department,
    };
    return SAMPLE_DATA.filter((item) => {
      const matchesSearch = !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase());
      const matchesFilters = [...activeByGroup.entries()].every(([group, values]) => {
        const get = fieldForGroup[group];
        return get ? values.includes(get(item)) : true;
      });
      return matchesSearch && matchesFilters;
    });
  }, [search, activeFilters]);

  const removeFilter = (value: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== value));
  };

  const openDialog = () => {
    setPendingFilters([...activeFilters]);
    setDialogOpen(true);
  };

  const applyFilters = () => {
    setActiveFilters(pendingFilters);
    setDialogOpen(false);
  };

  const clearFilters = () => {
    setPendingFilters([]);
  };

  const togglePending = (value: string, checked: boolean) => {
    setPendingFilters((prev) =>
      checked ? [...prev, value] : prev.filter((f) => f !== value),
    );
  };

  const getLabel = (value: string) =>
    SAMPLE_FILTER_OPTIONS.find((o) => o.value === value)?.label ?? value;

  return (
    <Stack gap="md">
      <Stack direction="row" gap="sm" align="center">
        <InputText
          placeholder={t.searchPlaceholder}
          iconLeft={<Icon name="search" size="sm" />}
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          width="100%"
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
              {getLabel(value)}
              <Icon name="x" size="xs" />
            </Button>
          ))}
          <Button variant="ghost" size="sm" onClick={() => setActiveFilters([])}>
            {t.clearAll}
          </Button>
        </Stack>
      )}

      <List hover dividers={false} animateKey={`${search}|${activeFilters.join(',')}`}>
        {filtered.length === 0 ? (
          <List.Item>
            <List.Content>
              <List.Title>{t.noResultsTitle}</List.Title>
              <List.Description>{t.noResultsDescription}</List.Description>
            </List.Content>
          </List.Item>
        ) : (
          filtered.map((item) => (
            <List.Item key={item.email}>
              <List.Content>
                <List.Title>{item.name}</List.Title>
                <List.Description>{item.email}</List.Description>
              </List.Content>
              <List.Trailing>
                <Badge
                  size="sm"
                  variant="soft"
                  color={item.status === 'active' ? 'green' : item.status === 'pending' ? 'yellow' : 'gray'}
                >
                  {item.status}
                </Badge>
              </List.Trailing>
            </List.Item>
          ))
        )}
      </List>

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
                <Button variant="ghost" size="sm" onClick={clearFilters}>
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
