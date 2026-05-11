import { useMemo, useState } from 'react';
import { Checkbox, Stack } from 'move';

const items = [
  { id: 'unread', label: 'Unread' },
  { id: 'starred', label: 'Starred' },
  { id: 'archived', label: 'Archived' },
];

/**
 * The classic parent / child checkboxes. The "select all" sits in
 * `indeterminate` whenever some-but-not-all children are checked,
 * `checked` when they all are, `unchecked` otherwise. Toggling it
 * mirrors the all-or-nothing state down to the children.
 */
export default function IndeterminateSample() {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    unread: true,
    starred: false,
    archived: false,
  });

  const checkedCount = useMemo(() => Object.values(selected).filter(Boolean).length, [selected]);
  const allChecked = checkedCount === items.length;
  const indeterminate = checkedCount > 0 && !allChecked;

  const toggleAll = () => {
    const next = !allChecked;
    setSelected(items.reduce((acc, it) => ({ ...acc, [it.id]: next }), {}));
  };

  return (
    <Stack gap="sm">
      <Checkbox
        checked={allChecked}
        indeterminate={indeterminate}
        onCheckedChange={toggleAll}
      >
        Select all filters
      </Checkbox>
      <Stack gap="xs" style={{ paddingLeft: 'var(--move-spacing-lg)' }}>
        {items.map((it) => (
          <Checkbox
            key={it.id}
            checked={selected[it.id]}
            onCheckedChange={(c: boolean) => setSelected((s) => ({ ...s, [it.id]: c }))}
          >
            {it.label}
          </Checkbox>
        ))}
      </Stack>
    </Stack>
  );
}
