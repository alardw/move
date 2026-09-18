import { useState } from 'react';
import { Drag, Button, Text, Stack, Icon, Badge, useDraggable } from 'move';

interface Item {
  id: string;
  title: string;
  kind: 'report' | 'tool';
}

const START: Item[] = [
  { id: 'p1', title: 'Quotes', kind: 'report' },
  { id: 'p2', title: 'Revenue', kind: 'report' },
  { id: 'p3', title: 'CRM', kind: 'tool' },
  { id: 'p4', title: 'Support', kind: 'tool' },
];

/**
 * The token IS the control. A draggable chip has one job and one affordance, so
 * it is a Button carrying a grip — not a Card wrapped around a smaller button,
 * which nests two interactive boxes and sizes to neither.
 */
function Chip({ item }: { item: Item }) {
  // `dragProps`, not `handleProps` + `ref`: the chip IS its own handle, so both
  // refs belong on one node. Spreading handleProps alongside ref drops one of
  // them silently.
  const { dragProps } = useDraggable<HTMLButtonElement>({
    id: item.id,
    data: item,
    axis: 'both',
  });
  return (
    <Button {...dragProps} variant="secondary" size="sm">
      <Icon name="grip-vertical" />
      {item.title}
      <Badge size="sm" variant="soft">
        {item.kind}
      </Badge>
    </Button>
  );
}

/** The third position takes reports, and says so on approach rather than on release. */
const REPORTS_ONLY = 2;

/**
 * Three positions that stay visible while empty, each a destination in its own
 * right.
 *
 * An item MOVES: it leaves the pool and lives in the slot. One thing, one place.
 * A slot that already held something hands its old occupant back, so nothing is
 * ever quietly destroyed and the count on screen never changes.
 */
export default function SlotsSample() {
  const [pool, setPool] = useState<Item[]>(START);
  const [slots, setSlots] = useState<(Item | undefined)[]>([undefined, undefined, undefined]);

  function place(index: number, item: Item) {
    // Dropped back where it already was: nothing moved, and the occupant it
    // would otherwise hand back to the pool is itself.
    if (slots[index]?.id === item.id) return;
    const displaced = slots[index];
    setSlots((prev) =>
      prev.map((s, i) => (i === index ? item : s?.id === item.id ? undefined : s)),
    );
    setPool((prev) => [...prev.filter((p) => p.id !== item.id), ...(displaced ? [displaced] : [])]);
  }

  return (
    <Drag.Root>
      <Stack gap="lg">
        <Stack direction="row" gap="sm" wrap>
          {pool.length === 0 ? (
            <Text size="sm" color="muted">
              Everything placed.
            </Text>
          ) : (
            pool.map((item) => <Chip key={item.id} item={item} />)
          )}
        </Stack>
        <Stack gap="sm">
          {slots.map((item, i) => (
            <Drag.Zone
              key={i}
              id={`slot-${i}`}
              accepts={(payload) => i !== REPORTS_ONLY || (payload.data as Item).kind === 'report'}
              onDrop={(event) => place(i, event.payload.data as Item)}
            >
              <Stack direction="row" justify="center" align="center" gap="sm">
                {/* The placed item is the same chip it was in the pool, so it
                    can be picked up again and moved on — to another position,
                    or back. A thing that arrives somewhere is still a thing. */}
                {item ? (
                  <Chip item={item} />
                ) : (
                  <Text size="sm" color="muted">{`Position ${i + 1}`}</Text>
                )}
                {i === REPORTS_ONLY && (
                  <Badge size="sm" variant="soft">
                    Reports only
                  </Badge>
                )}
              </Stack>
            </Drag.Zone>
          ))}
        </Stack>
      </Stack>
    </Drag.Root>
  );
}
