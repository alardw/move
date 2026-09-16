import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Drag } from './Drag';
import { useDraggable } from '../../../hooks';
import type { DropEvent } from '../../../hooks';

/** A draggable probe — the hooks own dragging; this is only here to start one. */
function Handle({ id, group }: { id: string; group?: string }) {
  const { ref, handleProps } = useDraggable<HTMLDivElement>({ id, group, axis: 'both' });
  return (
    <div ref={ref} data-testid="item">
      <button {...handleProps} data-testid="handle">
        drag
      </button>
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

/** Puts the zone at 0–100 on both axes; everything else sits well away from it. */
function placeZone() {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    const mine = this.dataset.testid === 'zone';
    return mine
      ? ({ top: 0, left: 0, bottom: 100, right: 100, width: 100, height: 100 } as DOMRect)
      : ({ top: 500, left: 500, bottom: 600, right: 600, width: 100, height: 100 } as DOMRect);
  });
}

/** Lift, move to (x,y), and optionally release. */
function drag(to: { clientX: number; clientY: number }, release = true) {
  act(() => {
    screen.getByTestId('handle').dispatchEvent(pointer('pointerdown', { clientX: 0, clientY: 0 }));
  });
  act(() => void window.dispatchEvent(pointer('pointermove', to)));
  if (release) act(() => void window.dispatchEvent(pointer('pointerup')));
}

beforeEach(() => {
  Element.prototype.setPointerCapture = vi.fn();
});
afterEach(() => vi.restoreAllMocks());

describe('Drag.Root', () => {
  it('renders the live region on mount, before any drag', () => {
    render(<Drag.Root />);
    const region = document.querySelector('[data-move-drag-announcer]');
    expect(region).not.toBeNull();
    expect(region).toHaveAttribute('aria-live', 'assertive');
  });

  it('renders no wrapper element around its children', () => {
    const { container } = render(
      <Drag.Root>
        <p data-testid="child">hello</p>
      </Drag.Root>,
    );
    // The child and the announcer, and nothing wrapping them.
    expect(container.firstElementChild).toBe(screen.getByTestId('child'));
  });

  it('fires onDrop after the zone’s own handler', () => {
    placeZone();
    const order: string[] = [];
    render(
      <Drag.Root onDrop={() => order.push('root')}>
        <Handle id="a" />
        <Drag.Zone id="z" data-testid="zone" onDrop={() => order.push('zone')} />
      </Drag.Root>,
    );
    drag({ clientX: 50, clientY: 50 });
    expect(order).toEqual(['zone', 'root']);
  });
});

describe('Drag.Zone', () => {
  it('marks itself while a payload it accepts is over it', () => {
    placeZone();
    render(
      <Drag.Root>
        <Handle id="a" />
        <Drag.Zone id="z" data-testid="zone" />
      </Drag.Root>,
    );
    const zone = screen.getByTestId('zone');
    expect(zone).not.toHaveAttribute('data-over');

    drag({ clientX: 50, clientY: 50 }, false);
    expect(zone).toHaveAttribute('data-over');
    expect(zone).toHaveAttribute('data-can-drop');
    expect(zone).toHaveAttribute('data-drag-active');
  });

  it('shows a refusal while over, rather than only at the release', () => {
    placeZone();
    const onDrop = vi.fn();
    render(
      <Drag.Root>
        <Handle id="a" />
        <Drag.Zone id="z" data-testid="zone" accepts={() => false} onDrop={onDrop} />
      </Drag.Root>,
    );
    drag({ clientX: 50, clientY: 50 }, false);
    const zone = screen.getByTestId('zone');
    // Over it, and visibly not taking it.
    expect(zone).toHaveAttribute('data-over');
    expect(zone).not.toHaveAttribute('data-can-drop');

    act(() => void window.dispatchEvent(pointer('pointerup')));
    expect(onDrop).not.toHaveBeenCalled();
  });

  it('hands the payload to the zone it was dropped on', () => {
    placeZone();
    const onDrop = vi.fn();
    render(
      <Drag.Root>
        <Handle id="a" group="left" />
        <Drag.Zone id="z" group="right" data-testid="zone" onDrop={onDrop} />
      </Drag.Root>,
    );
    drag({ clientX: 50, clientY: 50 });
    expect(onDrop).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({ id: 'a', group: 'left' }),
        target: { id: 'z', group: 'right' },
        cancelled: false,
      }) satisfies Partial<DropEvent> | unknown,
    );
  });

  it('a disabled zone neither highlights nor catches', () => {
    placeZone();
    const onDrop = vi.fn();
    render(
      <Drag.Root>
        <Handle id="a" />
        <Drag.Zone id="z" data-testid="zone" disabled onDrop={onDrop} />
      </Drag.Root>,
    );
    drag({ clientX: 50, clientY: 50 }, false);
    expect(screen.getByTestId('zone')).not.toHaveAttribute('data-over');
    act(() => void window.dispatchEvent(pointer('pointerup')));
    expect(onDrop).not.toHaveBeenCalled();
  });

  it('catches nothing after a cancelled drag', () => {
    placeZone();
    const onDrop = vi.fn();
    render(
      <Drag.Root>
        <Handle id="a" />
        <Drag.Zone id="z" data-testid="zone" onDrop={onDrop} />
      </Drag.Root>,
    );
    drag({ clientX: 50, clientY: 50 }, false);
    act(() => void window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })));
    expect(onDrop).not.toHaveBeenCalled();
  });

  it('is inert outside a Root rather than throwing', () => {
    expect(() => render(<Drag.Zone id="z" data-testid="zone" />)).not.toThrow();
    expect(screen.getByTestId('zone')).not.toHaveAttribute('data-over');
  });

  it('stops catching once it unmounts', () => {
    placeZone();
    const onDrop = vi.fn();
    const { rerender } = render(
      <Drag.Root>
        <Handle id="a" />
        <Drag.Zone id="z" data-testid="zone" onDrop={onDrop} />
      </Drag.Root>,
    );
    rerender(
      <Drag.Root>
        <Handle id="a" />
      </Drag.Root>,
    );
    drag({ clientX: 50, clientY: 50 });
    expect(onDrop).not.toHaveBeenCalled();
  });

  it('forwards className, style and HTML attributes', () => {
    render(
      <Drag.Zone id="z" data-testid="zone" className="mine" style={{ margin: 4 }} title="t" />,
    );
    const zone = screen.getByTestId('zone');
    expect(zone.className).toContain('mine');
    expect(zone.style.margin).toBe('4px');
    expect(zone).toHaveAttribute('title', 't');
  });
});
