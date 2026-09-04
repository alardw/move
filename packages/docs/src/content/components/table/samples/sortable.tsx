import { useMemo, useState } from 'react';
import { Table } from 'move';

type Row = { name: string; category: string; harvest: number };

const rows: Row[] = [
  { name: 'Apple', category: 'Pome', harvest: 9 },
  { name: 'Banana', category: 'Berry', harvest: 1 },
  { name: 'Cherry', category: 'Stone fruit', harvest: 6 },
  { name: 'Date', category: 'Drupe', harvest: 10 },
  { name: 'Elderberry', category: 'Berry', harvest: 8 },
  { name: 'Fig', category: 'Multiple fruit', harvest: 7 },
];

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'harvest', label: 'Harvest month' },
] as const;

type Key = (typeof COLUMNS)[number]['key'];

/**
 * Set `sortable` on a `Table.Head` and it becomes a real column header: focusable,
 * activated by Enter or Space, and carrying `aria-sort` so the direction is
 * announced rather than only drawn. Which column is sorted and in what direction
 * is yours — `sorted` and `onSort` are the whole API.
 *
 * The indicator is a Move icon, so it follows your `iconResolver` along with
 * everything else: `chevron-up` when ascending, `chevron-down` when descending,
 * and `chevrons-up-down` while a column is sortable but not the one in use.
 */
export default function SortableSample() {
  const [sort, setSort] = useState<{ key: Key; dir: 'asc' | 'desc' }>({
    key: 'name',
    dir: 'asc',
  });

  const sorted = useMemo(() => {
    const factor = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const x = a[sort.key];
      const y = b[sort.key];
      if (typeof x === 'number' && typeof y === 'number') return (x - y) * factor;
      return String(x).localeCompare(String(y)) * factor;
    });
  }, [sort]);

  // Clicking the sorted column reverses it; clicking another starts it ascending.
  const toggle = (key: Key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          {COLUMNS.map((c) => (
            <Table.Head
              key={c.key}
              sortable
              sorted={sort.key === c.key ? sort.dir : false}
              onSort={() => toggle(c.key)}
            >
              {c.label}
            </Table.Head>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sorted.map((r) => (
          <Table.Row key={r.name}>
            <Table.Cell>{r.name}</Table.Cell>
            <Table.Cell>{r.category}</Table.Cell>
            <Table.Cell>{r.harvest}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
