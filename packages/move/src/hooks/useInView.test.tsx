import { render, act, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useInView, type UseInViewOptions } from './useInView';
import { Deferred } from './Deferred';

// A controllable IntersectionObserver: capture each instance's callback so a
// test can drive intersection on demand (the global setup mock never fires).
let instances: MockIO[] = [];
class MockIO {
  cb: (entries: { isIntersecting: boolean }[]) => void;
  disconnected = false;
  observed: Element[] = [];
  constructor(cb: (entries: { isIntersecting: boolean }[]) => void) {
    this.cb = cb;
    instances.push(this);
  }
  observe(el: Element) {
    this.observed.push(el);
  }
  unobserve() {}
  disconnect() {
    this.disconnected = true;
  }
  takeRecords() {
    return [];
  }
  root = null;
  rootMargin = '';
  thresholds = [];
}

function fire(isIntersecting: boolean, which = instances[instances.length - 1]) {
  act(() => which.cb([{ isIntersecting }]));
}

const realIO = globalThis.IntersectionObserver;

beforeEach(() => {
  instances = [];
  globalThis.IntersectionObserver = MockIO as unknown as typeof IntersectionObserver;
});
afterEach(() => {
  globalThis.IntersectionObserver = realIO;
});

// Attaches the ref to a real node (so the observer observes it) and surfaces
// the boolean as text.
function InViewProbe(props: UseInViewOptions) {
  const { ref, inView } = useInView<HTMLDivElement>(props);
  return (
    <div ref={ref} data-testid="probe">
      {inView ? 'in' : 'out'}
    </div>
  );
}

describe('useInView', () => {
  it('observes the attached element and reports inView once it intersects', () => {
    render(<InViewProbe />);
    expect(instances.length).toBe(1);
    expect(instances[0].observed).toHaveLength(1);
    expect(screen.getByTestId('probe')).toHaveTextContent('out');
    fire(true);
    expect(screen.getByTestId('probe')).toHaveTextContent('in');
  });

  it('disconnects after the first hit when once=true (default)', () => {
    render(<InViewProbe />);
    const io = instances[0];
    fire(true, io);
    expect(io.disconnected).toBe(true);
  });

  it('toggles back to false on leave when once=false', () => {
    render(<InViewProbe once={false} />);
    fire(true);
    expect(screen.getByTestId('probe')).toHaveTextContent('in');
    fire(false);
    expect(screen.getByTestId('probe')).toHaveTextContent('out');
  });

  it('falls back to inView=true when IntersectionObserver is unavailable', () => {
    globalThis.IntersectionObserver = undefined as unknown as typeof IntersectionObserver;
    render(<InViewProbe />);
    expect(screen.getByTestId('probe')).toHaveTextContent('in');
    expect(instances.length).toBe(0);
  });
});

describe('Deferred', () => {
  it('renders the placeholder until in view, then the children', () => {
    render(
      <Deferred placeholder={<span>loading</span>}>
        <span>real content</span>
      </Deferred>,
    );
    expect(screen.getByText('loading')).toBeInTheDocument();
    expect(screen.queryByText('real content')).not.toBeInTheDocument();

    fire(true);

    expect(screen.getByText('real content')).toBeInTheDocument();
    expect(screen.queryByText('loading')).not.toBeInTheDocument();
  });

  it('forwards className and style to the wrapper', () => {
    const { container } = render(
      <Deferred className="wrap" style={{ position: 'absolute' }}>
        <span>x</span>
      </Deferred>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveClass('wrap');
    expect(wrapper.style.position).toBe('absolute');
  });
});
