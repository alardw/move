import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Sortable } from './Sortable';
import type { SortableChange } from '../../../hooks';

const ROWS = [
  { id: 'a', title: 'Offerte' },
  { id: 'b', title: 'Contract' },
  { id: 'c', title: 'Demo' },
];

function List({
  onReorder,
  disabledId,
  handle,
}: {
  onReorder?: (c: SortableChange) => void;
  disabledId?: string;
  handle?: 'start' | 'end' | 'self' | 'custom';
}) {
  return (
    <Sortable.Root onReorder={onReorder} animate={false} data-testid="list">
      {ROWS.map((r, i) => (
        <Sortable.Item
          key={r.id}
          id={r.id}
          index={i}
          label={r.title}
          handle={handle}
          disabled={r.id === disabledId}
          data-testid={`row-${r.id}`}
        >
          {r.title}
        </Sortable.Item>
      ))}
    </Sortable.Root>
  );
}

function pointer(type: string, init: { clientX?: number; clientY?: number } = {}) {
  const e = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    button: 0,
    clientX: init.clientX ?? 0,
    clientY: init.clientY ?? 0,
  });
  Object.defineProperty(e, 'pointerId', { value: 1 });
  return e;
}

const handleFor = (id: string) =>
  screen.getByTestId(`row-${id}`).querySelector('button') as HTMLButtonElement;

beforeEach(() => {
  // Rows are zero-sized in jsdom, so every midpoint would collapse to 0 and any
  // drag would resolve to the same slot. Lay them out 100px apart, in order.
  let n = 0;
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => {
    const top = (n++ % 3) * 100;
    return { top, left: 0, height: 100, width: 100, bottom: top + 100, right: 100 } as DOMRect;
  });
  Element.prototype.setPointerCapture = vi.fn();
});
afterEach(() => vi.restoreAllMocks());

describe('Sortable.Root', () => {
  it('renders its rows in the given order', () => {
    render(<List />);
    const rows = screen.getAllByTestId(/^row-/);
    expect(rows.map((r) => r.dataset.testid)).toEqual(['row-a', 'row-b', 'row-c']);
  });

  it('brings its own drag context, so a single list needs no wrapper', () => {
    expect(() => render(<List />)).not.toThrow();
    expect(document.querySelector('[data-move-drag-announcer]')).not.toBeNull();
  });

  it('carries the axis for the indicator and the drag', () => {
    render(
      <Sortable.Root axis="horizontal" data-testid="list">
        <Sortable.Item id="a" index={0} data-testid="row-a">
          a
        </Sortable.Item>
      </Sortable.Root>,
    );
    expect(screen.getByTestId('list')).toHaveAttribute('data-axis', 'horizontal');
  });
});

describe('Sortable.Item', () => {
  it('renders its own handle at the start by default', () => {
    render(<List />);
    const row = screen.getByTestId('row-a');
    expect(row.firstElementChild?.tagName).toBe('BUTTON');
  });

  it('handle="end" puts the grab point last', () => {
    render(<List handle="end" />);
    const row = screen.getByTestId('row-a');
    expect(row.lastElementChild?.tagName).toBe('BUTTON');
  });

  it('handle="self" renders no button and makes the row itself draggable', () => {
    render(<List handle="self" />);
    const row = screen.getByTestId('row-a');
    expect(row.querySelector('button')).toBeNull();
    expect(row).toHaveAttribute('data-handle', 'self');
  });

  it('handle="custom" lets the call site place the handle where it likes', () => {
    render(
      <Sortable.Root data-testid="list">
        <Sortable.Item id="a" index={0} label="Row" handle="custom" data-testid="row-a">
          <span data-testid="before">avatar</span>
          <Sortable.Handle />
          <span>title</span>
        </Sortable.Item>
      </Sortable.Root>,
    );
    const row = screen.getByTestId('row-a');
    // Not first, not last — exactly where it was put.
    expect(row.children[0]).toBe(screen.getByTestId('before'));
    expect(row.children[1]?.tagName).toBe('BUTTON');
    expect(row.querySelector('button')).toHaveAttribute('aria-label', 'Reorder Row');
  });

  it('names the handle from the item label', () => {
    render(<List />);
    expect(handleFor('a')).toHaveAttribute('aria-label', 'Reorder Offerte');
  });

  it('a disabled row renders no handle and cannot be moved', () => {
    render(<List disabledId="b" />);
    expect(screen.getByTestId('row-b').querySelector('button')).toBeNull();
    expect(screen.getByTestId('row-b')).toHaveAttribute('data-disabled');
  });
});

describe('the keyboard path', () => {
  it('does not open the menu on a pointer press', () => {
    render(<List />);
    act(() => {
      handleFor('a').dispatchEvent(pointer('pointerdown'));
    });
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('opens the menu on Enter on a focused handle', () => {
    render(<List />);
    act(() => {
      handleFor('a').focus();
      handleFor('a').dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }),
      );
    });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('offers the four named moves, bounded at the ends', () => {
    render(<List />);
    act(() => {
      handleFor('a').dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }),
      );
    });
    const items = screen.getAllByRole('menuitem');
    expect(items.map((i) => i.textContent)).toEqual([
      'Move up',
      'Move down',
      'Move to top',
      'Move to bottom',
    ]);
    // First row: nothing above it.
    expect(items[0]).toHaveAttribute('data-disabled');
    expect(items[1]).not.toHaveAttribute('data-disabled');
  });

  it('announces the row by name and position, not by index', () => {
    render(<List onReorder={() => {}} />);
    act(() => {
      handleFor('a').dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }),
      );
    });
    act(() => {
      screen.getByText('Move down').click();
    });
    expect(document.querySelector('[data-move-drag-announcer]')).toHaveTextContent(
      'Dropped Offerte at position 2 of 3.',
    );
  });

  it('falls back to a bare position when a row has no label', () => {
    render(
      <Sortable.Root onReorder={() => {}} data-testid="list">
        <Sortable.Item id="a" index={0} data-testid="row-a">
          a
        </Sortable.Item>
        <Sortable.Item id="b" index={1} data-testid="row-b">
          b
        </Sortable.Item>
      </Sortable.Root>,
    );
    const handle = screen.getByTestId('row-a').querySelector('button') as HTMLButtonElement;
    act(() => {
      handle.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }),
      );
    });
    act(() => {
      screen.getByText('Move down').click();
    });
    expect(document.querySelector('[data-move-drag-announcer]')).toHaveTextContent(
      'Dropped at position 2 of 2.',
    );
  });

  it('a move reports onReorder and closes the menu', async () => {
    const onReorder = vi.fn();
    render(<List onReorder={onReorder} />);
    act(() => {
      handleFor('a').dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }),
      );
    });
    act(() => {
      screen.getByText('Move down').click();
    });
    expect(onReorder).toHaveBeenCalledWith({
      source: { list: undefined, index: 0 },
      destination: { list: undefined, index: 1 },
    } satisfies SortableChange);
  });
});

describe('dragging', () => {
  it('reports the move the pointer ended on', () => {
    const onReorder = vi.fn();
    render(<List onReorder={onReorder} />);
    act(() => {
      handleFor('a').dispatchEvent(pointer('pointerdown', { clientY: 0 }));
    });
    act(() => void window.dispatchEvent(pointer('pointermove', { clientY: 160 })));
    act(() => void window.dispatchEvent(pointer('pointerup')));
    expect(onReorder).toHaveBeenCalled();
    const change = onReorder.mock.calls[0][0] as SortableChange;
    expect(change.destination?.index).toBeGreaterThan(0);
  });

  it('draws the carried row on the drag layer, and quiets the one it left', () => {
    render(<List />);
    act(() => {
      handleFor('a').dispatchEvent(pointer('pointerdown', { clientY: 0 }));
    });
    act(() => void window.dispatchEvent(pointer('pointermove', { clientY: 40 })));

    // The row itself stays exactly where React put it, holding its place open.
    expect(screen.getByTestId('row-a')).toHaveAttribute('data-drag-source');
    expect(screen.getByTestId('row-a')).not.toHaveAttribute('data-dragging');

    // What follows the pointer is a copy, on a layer outside every clip.
    const layer = document.body.querySelector('[data-move-drag-layer]');
    const carried = layer?.querySelector('[data-drag-preview]');
    expect(carried).toHaveAttribute('data-dragging');
    // It is a picture of the row, so it answers to nothing that identifies one.
    expect(carried).toHaveAttribute('aria-hidden', 'true');
    expect(carried?.querySelector('[data-testid]')).toBeNull();
  });

  it('takes the copy away once the drop lands', () => {
    render(<List />);
    act(() => {
      handleFor('a').dispatchEvent(pointer('pointerdown', { clientY: 0 }));
    });
    act(() => void window.dispatchEvent(pointer('pointermove', { clientY: 160 })));
    expect(document.querySelector('[data-drag-preview]')).not.toBeNull();

    act(() => void window.dispatchEvent(pointer('pointerup', { clientY: 160 })));
    expect(document.querySelector('[data-drag-preview]')).toBeNull();
    expect(screen.getByTestId('row-a')).not.toHaveAttribute('data-drag-source');
  });

  it('no row steps aside until a drag is in progress', () => {
    render(<List />);
    expect(document.querySelector('[data-shifted]')).toBeNull();
  });

  it('opens a gap by stepping the rows between here and there aside', () => {
    render(<List />);
    act(() => {
      handleFor('a').dispatchEvent(pointer('pointerdown', { clientY: 0 }));
    });
    act(() => void window.dispatchEvent(pointer('pointermove', { clientY: 160 })));
    // The carried row never shifts — it is following the pointer.
    expect(screen.getByTestId('row-a')).not.toHaveAttribute('data-shifted');
    // At least one row below it has moved up to make the space.
    expect(document.querySelector('[data-shifted]')).not.toBeNull();
  });

  it('Escape abandons the drag and reports no destination', () => {
    const onReorder = vi.fn();
    render(<List onReorder={onReorder} />);
    act(() => {
      handleFor('a').dispatchEvent(pointer('pointerdown', { clientY: 0 }));
    });
    act(() => void window.dispatchEvent(pointer('pointermove', { clientY: 40 })));
    act(() => void window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })));
    expect(onReorder).toHaveBeenCalledWith(
      expect.objectContaining({ destination: null }) as unknown as SortableChange,
    );
    expect(screen.getByTestId('row-a')).not.toHaveAttribute('data-dragging');
  });
});

describe('passthrough', () => {
  it('forwards className, style and HTML attributes on both parts', () => {
    render(
      <Sortable.Root className="mine" style={{ margin: 4 }} data-testid="list">
        <Sortable.Item id="a" index={0} className="row" title="t" data-testid="row-a">
          a
        </Sortable.Item>
      </Sortable.Root>,
    );
    expect(screen.getByTestId('list').className).toContain('mine');
    expect(screen.getByTestId('list').style.margin).toBe('4px');
    expect(screen.getByTestId('row-a').className).toContain('row');
    expect(screen.getByTestId('row-a')).toHaveAttribute('title', 't');
  });
});
