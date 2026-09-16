import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useSortable } from './useSortable';
import { Drag } from '../components/data-display/Drag';

const DragProvider = Drag.Root;
import type { SortableChange, UseSortableOptions } from './useSortable';

/**
 * A probe that attaches the ref to a real node — `renderHook` never does, so the
 * transform would have nothing to write to and the sibling measurement nothing
 * to measure.
 */
function Item(props: UseSortableOptions & { label?: string }) {
  const { label = 'item', ...options } = props;
  const { ref, handleProps, isDragging, dropIndex, moveActions } =
    useSortable<HTMLDivElement>(options);
  return (
    <div ref={ref} data-testid={label}>
      <button {...handleProps} data-testid={`${label}-handle`}>
        drag
      </button>
      <span data-testid={`${label}-state`}>
        {String(isDragging)}:{dropIndex === null ? 'none' : dropIndex}
      </span>
      {moveActions.map((a) => (
        <button
          key={a.id}
          data-testid={`${label}-${a.id}`}
          disabled={a.disabled}
          onClick={a.perform}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}

const announcer = () => document.querySelector('[data-move-drag-announcer]')?.textContent;

/**
 * jsdom has no PointerEvent; the hook reads button/clientX/clientY/pointerId.
 * clientX/clientY are read-only getters, so they go through the constructor —
 * only pointerId, which MouseEventInit does not carry, is assigned after.
 */
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

beforeEach(() => {
  // Elements are all zero-sized in jsdom, so every midpoint would collapse to 0
  // and every drag would resolve to the same slot. Give each row 100px, in order.
  let n = 0;
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => {
    const top = n++ * 100;
    return { top, left: 0, height: 100, width: 100, bottom: top + 100, right: 100 } as DOMRect;
  });
  Element.prototype.setPointerCapture = vi.fn();
});

afterEach(() => vi.restoreAllMocks());

describe('useSortable', () => {
  it('offers the four named moves, bounded at the ends of the list', () => {
    render(<Item id="a" index={0} count={3} />);
    expect(screen.getByTestId('item-up')).toBeDisabled();
    expect(screen.getByTestId('item-top')).toBeDisabled();
    expect(screen.getByTestId('item-down')).toBeEnabled();
    expect(screen.getByTestId('item-bottom')).toBeEnabled();
  });

  it('reports a move through onReorder with source and destination', () => {
    const onReorder = vi.fn();
    render(<Item id="a" index={1} count={4} list="offerte" onReorder={onReorder} />);
    act(() => screen.getByTestId('item-bottom').click());
    expect(onReorder).toHaveBeenCalledWith({
      source: { list: 'offerte', index: 1 },
      destination: { list: 'offerte', index: 3 },
    } satisfies SortableChange);
  });

  it('announces positions rather than indices, through the provider region', () => {
    render(
      <DragProvider>
        <Item id="a" index={0} count={5} onReorder={() => {}} />
      </DragProvider>,
    );
    act(() => screen.getByTestId('item-down').click());
    expect(announcer()).toBe('Dropped at position 2 of 5.');
  });

  it('gives an immovable item no moves and refuses the drag', () => {
    render(<Item id="a" index={1} count={3} disabled onReorder={() => {}} />);
    expect(screen.queryByTestId('item-up')).toBeNull();
    expect(screen.getByTestId('item-handle')).toHaveAttribute('aria-disabled', 'true');
    act(() => {
      screen.getByTestId('item-handle').dispatchEvent(pointer('pointerdown', { clientY: 0 }));
    });
    expect(screen.getByTestId('item-state')).toHaveTextContent('false:none');
  });

  it('writes the offset onto the element itself, never a returned style', () => {
    render(<Item id="a" index={0} count={3} onReorder={() => {}} />);
    act(() => {
      screen.getByTestId('item-handle').dispatchEvent(pointer('pointerdown', { clientY: 10 }));
    });
    act(() => void window.dispatchEvent(pointer('pointermove', { clientY: 60 })));
    const el = screen.getByTestId('item');
    expect(el.style.translate).toBe('0px 50px');
    expect(el).toHaveAttribute('data-dragging');
  });

  it('clears the transform on drop', () => {
    render(<Item id="a" index={0} count={3} onReorder={() => {}} />);
    act(() => {
      screen.getByTestId('item-handle').dispatchEvent(pointer('pointerdown', { clientY: 10 }));
    });
    act(() => void window.dispatchEvent(pointer('pointermove', { clientY: 60 })));
    act(() => void window.dispatchEvent(pointer('pointerup')));
    expect(screen.getByTestId('item').style.translate).toBe('');
    expect(screen.getByTestId('item')).not.toHaveAttribute('data-dragging');
  });

  it('cancels on Escape, reporting no destination', () => {
    const onReorder = vi.fn();
    render(
      <DragProvider>
        <Item id="a" index={0} count={3} onReorder={onReorder} />
      </DragProvider>,
    );
    act(() => {
      screen.getByTestId('item-handle').dispatchEvent(pointer('pointerdown', { clientY: 10 }));
    });
    // Past the activation distance, so it is a real drag to cancel.
    act(() => void window.dispatchEvent(pointer('pointermove', { clientY: 20 })));
    act(() => void window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })));
    expect(onReorder).toHaveBeenCalledWith({
      source: { list: undefined, index: 0 },
      destination: null,
    });
    expect(announcer()).toBe('Cancelled. Returned to the original position.');
  });

  it('drops the window listeners when the drag ends', () => {
    const remove = vi.spyOn(window, 'removeEventListener');
    render(<Item id="a" index={0} count={3} onReorder={() => {}} />);
    act(() => {
      screen.getByTestId('item-handle').dispatchEvent(pointer('pointerdown', { clientY: 10 }));
    });
    act(() => void window.dispatchEvent(pointer('pointerup')));
    expect(remove.mock.calls.map((c) => c[0])).toEqual(
      expect.arrayContaining(['pointermove', 'pointerup', 'keydown']),
    );
  });

  it('takes the handle out of the browser scroll gesture', () => {
    render(<Item id="a" index={0} count={3} />);
    expect(screen.getByTestId('item-handle').style.touchAction).toBe('none');
  });

  it('honours overridden labels', () => {
    render(<Item id="a" index={1} count={3} labels={{ moveUp: 'Omhoog' }} />);
    expect(screen.getByTestId('item-up')).toHaveTextContent('Omhoog');
  });

  it('works with no provider above it — the single-list case', () => {
    const onReorder = vi.fn();
    render(<Item id="a" index={0} count={3} onReorder={onReorder} />);
    act(() => screen.getByTestId('item-down').click());
    expect(onReorder).toHaveBeenCalled();
  });
});
