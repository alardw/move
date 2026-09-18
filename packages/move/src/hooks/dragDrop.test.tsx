import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useDraggable, useDropTarget } from './dragDrop';
import { Drag } from '../components/data-display/Drag';

/** Drag.Root is the provider; the hooks own everything below it. */
const DragProvider = Drag.Root;
import type { DropEvent, UseDraggableOptions, UseDropTargetOptions } from './dragDrop';

function Draggable(props: UseDraggableOptions & { label?: string }) {
  const { label = 'drag', ...options } = props;
  const { ref, handleProps, isDragging, delta } = useDraggable<HTMLDivElement>(options);
  return (
    <div ref={ref} data-testid={label}>
      <button {...handleProps} data-testid={`${label}-handle`}>
        handle
      </button>
      <span data-testid={`${label}-state`}>
        {String(isDragging)}:{delta.x},{delta.y}
      </span>
    </div>
  );
}

function Target(props: UseDropTargetOptions & { label?: string }) {
  const { label = 'target', ...options } = props;
  const { ref, isOver, isDragActive, canDrop } = useDropTarget<HTMLDivElement>(options);
  return (
    <div ref={ref} data-testid={label}>
      <span data-testid={`${label}-state`}>
        {String(isOver)}:{String(isDragActive)}:{String(canDrop)}
      </span>
    </div>
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

/** Puts the drop target at 0–100 on both axes; everything else is elsewhere. */
function placeTarget(testId: string) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    const mine = this.dataset.testid === testId;
    return mine
      ? ({ top: 0, left: 0, bottom: 100, right: 100, width: 100, height: 100 } as DOMRect)
      : ({ top: 500, left: 500, bottom: 600, right: 600, width: 100, height: 100 } as DOMRect);
  });
}

beforeEach(() => {
  Element.prototype.setPointerCapture = vi.fn();
});
afterEach(() => vi.restoreAllMocks());

describe('useDraggable', () => {
  it('drags with no provider above it', () => {
    render(<Draggable id="a" />);
    act(() => {
      screen.getByTestId('drag-handle').dispatchEvent(pointer('pointerdown', { clientY: 10 }));
    });
    act(() => void window.dispatchEvent(pointer('pointermove', { clientY: 40 })));
    expect(screen.getByTestId('drag-state')).toHaveTextContent('true:0,30');
    expect(screen.getByTestId('drag').style.translate).toBe('0px 30px');
  });

  it('constrains to the axis', () => {
    render(<Draggable id="a" axis="horizontal" />);
    act(() => {
      screen.getByTestId('drag-handle').dispatchEvent(pointer('pointerdown', { clientX: 0 }));
    });
    act(() => {
      window.dispatchEvent(pointer('pointermove', { clientX: 25, clientY: 99 }));
    });
    expect(screen.getByTestId('drag').style.translate).toBe('25px 0px');
  });

  it('refuses to start when disabled', () => {
    render(<Draggable id="a" disabled />);
    act(() => {
      screen.getByTestId('drag-handle').dispatchEvent(pointer('pointerdown'));
    });
    expect(screen.getByTestId('drag-state')).toHaveTextContent('false:0,0');
  });

  it('treats a press that never moves as a click, reporting no drop', () => {
    const onDragEnd = vi.fn();
    render(<Draggable id="a" onDragEnd={onDragEnd} />);
    act(() => {
      screen.getByTestId('drag-handle').dispatchEvent(pointer('pointerdown', { clientY: 0 }));
    });
    // Inside the 4px activation distance: still a click.
    act(() => void window.dispatchEvent(pointer('pointermove', { clientY: 2 })));
    act(() => void window.dispatchEvent(pointer('pointerup')));
    expect(onDragEnd).not.toHaveBeenCalled();
    expect(screen.getByTestId('drag-state')).toHaveTextContent('false:0,0');
  });

  it('reports the drop with no target when nothing catches it', () => {
    const onDragEnd = vi.fn();
    render(<Draggable id="a" group="left" onDragEnd={onDragEnd} />);
    act(() => {
      screen.getByTestId('drag-handle').dispatchEvent(pointer('pointerdown', { clientY: 0 }));
    });
    act(() => void window.dispatchEvent(pointer('pointermove', { clientY: 30 })));
    act(() => void window.dispatchEvent(pointer('pointerup')));
    expect(onDragEnd).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({ id: 'a', group: 'left' }),
        target: null,
      }),
    );
  });
});

describe('useDropTarget', () => {
  it('lights up only while the pointer is inside it', () => {
    placeTarget('target');
    render(
      <DragProvider>
        <Draggable id="a" axis="both" />
        <Target id="t" />
      </DragProvider>,
    );
    expect(screen.getByTestId('target-state')).toHaveTextContent('false:false:false');

    act(() => {
      screen.getByTestId('drag-handle').dispatchEvent(pointer('pointerdown'));
    });
    act(() => void window.dispatchEvent(pointer('pointermove', { clientX: 50, clientY: 50 })));
    expect(screen.getByTestId('target-state')).toHaveTextContent('true:true:true');

    act(() => void window.dispatchEvent(pointer('pointermove', { clientX: 400, clientY: 400 })));
    expect(screen.getByTestId('target-state')).toHaveTextContent('false:true:false');
  });

  it('hands the payload to the target it was dropped on', () => {
    placeTarget('target');
    const onDrop = vi.fn();
    render(
      <DragProvider>
        <Draggable id="a" group="left" data={{ title: 'Offerte' }} axis="both" />
        <Target id="t" group="right" onDrop={onDrop} />
      </DragProvider>,
    );
    act(() => {
      screen.getByTestId('drag-handle').dispatchEvent(pointer('pointerdown'));
    });
    act(() => void window.dispatchEvent(pointer('pointermove', { clientX: 50, clientY: 50 })));
    act(() => void window.dispatchEvent(pointer('pointerup')));
    expect(onDrop).toHaveBeenCalledWith({
      payload: { id: 'a', group: 'left', data: { title: 'Offerte' } },
      target: { id: 't', group: 'right' },
      cancelled: false,
    } satisfies DropEvent);
  });

  it('refuses a payload it does not accept', () => {
    placeTarget('target');
    const onDrop = vi.fn();
    render(
      <DragProvider>
        <Draggable id="a" axis="both" />
        <Target id="t" accepts={(p) => p.id === 'something-else'} onDrop={onDrop} />
      </DragProvider>,
    );
    act(() => {
      screen.getByTestId('drag-handle').dispatchEvent(pointer('pointerdown'));
    });
    act(() => void window.dispatchEvent(pointer('pointermove', { clientX: 50, clientY: 50 })));
    // Over it, but not droppable.
    expect(screen.getByTestId('target-state')).toHaveTextContent('true:true:false');
    act(() => void window.dispatchEvent(pointer('pointerup')));
    expect(onDrop).not.toHaveBeenCalled();
  });

  it('catches nothing after Escape', () => {
    placeTarget('target');
    const onDrop = vi.fn();
    render(
      <DragProvider>
        <Draggable id="a" axis="both" />
        <Target id="t" onDrop={onDrop} />
      </DragProvider>,
    );
    act(() => {
      screen.getByTestId('drag-handle').dispatchEvent(pointer('pointerdown'));
    });
    act(() => void window.dispatchEvent(pointer('pointermove', { clientX: 50, clientY: 50 })));
    act(() => void window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })));
    expect(onDrop).not.toHaveBeenCalled();
    expect(screen.getByTestId('drag').style.translate).toBe('');
  });

  it('stops being a target once it unmounts', () => {
    placeTarget('target');
    const onDrop = vi.fn();
    const { rerender } = render(
      <DragProvider>
        <Draggable id="a" axis="both" />
        <Target id="t" onDrop={onDrop} />
      </DragProvider>,
    );
    rerender(
      <DragProvider>
        <Draggable id="a" axis="both" />
      </DragProvider>,
    );
    act(() => {
      screen.getByTestId('drag-handle').dispatchEvent(pointer('pointerdown'));
    });
    act(() => void window.dispatchEvent(pointer('pointermove', { clientX: 50, clientY: 50 })));
    act(() => void window.dispatchEvent(pointer('pointerup')));
    expect(onDrop).not.toHaveBeenCalled();
  });
});

describe('DragProvider', () => {
  it('always has a live region in the DOM for a screen reader to watch', () => {
    render(<DragProvider />);
    const region = document.querySelector('[data-move-drag-announcer]');
    expect(region).not.toBeNull();
    expect(region).toHaveAttribute('aria-live', 'assertive');
  });
});

describe('dragProps — the element as its own handle', () => {
  function Whole({ id }: { id: string }) {
    const { dragProps, isDragging } = useDraggable<HTMLButtonElement>({ id, axis: 'both' });
    return (
      <button {...dragProps} data-testid="whole">
        {String(isDragging)}
      </button>
    );
  }

  it('lands both refs on one node, so the affordances survive', () => {
    render(<Whole id="a" />);
    const el = screen.getByTestId('whole');
    // The handle half: without this a trackpad scrolls instead of dragging, and
    // nothing shows the thing can be picked up.
    expect(el.style.touchAction).toBe('none');
    expect(el.style.cursor).toBe('grab');
  });

  it('drags the element it is spread on', () => {
    render(<Whole id="a" />);
    const el = screen.getByTestId('whole');
    act(() => {
      el.dispatchEvent(pointer('pointerdown', { clientX: 0, clientY: 0 }));
    });
    act(() => void window.dispatchEvent(pointer('pointermove', { clientX: 30, clientY: 40 })));
    // The item half: the offset is written onto the same node.
    expect(el.style.translate).toBe('30px 40px');
    expect(el).toHaveAttribute('data-dragging');
  });
});
