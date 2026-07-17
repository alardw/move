import '@testing-library/jest-dom/vitest';

// Fail any test that writes to console.error/warn. The suite runs at zero console
// output, so anything new is a regression — and this class of bug is otherwise
// invisible: React's controlled/uncontrolled flip and act() warnings, Radix's a11y
// warnings, and Move's own dev warnings all only ever printed while the suite stayed
// green. The Select uncontrolled→controlled bug was a genuine consumer-facing defect
// whose sole symptom was one of these lines scrolling past.
//
// A test that deliberately asserts a warning should silence it locally, which also
// bypasses this guard:
//   const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
//
// Known trade-off: when a component genuinely throws, React reports it via
// console.error, so this guard throws too. The test fails either way, but the
// message below may arrive alongside the original — read the original first.
const DOM_LEAK_RE =
  /does not recognize the .* prop on a DOM element|Invalid DOM property|Unknown event handler property/;

function failOnConsole(kind: 'error' | 'warn', args: unknown[]): never {
  const msg = args.map(String).join(' ');
  // Keep the specific hint for the `Button.fullWidth` class of bug — a move prop
  // missing from `moveProps` and spread onto a host element.
  if (DOM_LEAK_RE.test(msg)) {
    throw new Error(`DOM prop leak (add the prop to moveProps): ${msg}`);
  }
  throw new Error(
    `console.${kind} during test — fix it, or silence it locally with vi.spyOn(console, '${kind}'):\n${msg}`,
  );
}

console.error = (...args: unknown[]) => failOnConsole('error', args);
console.warn = (...args: unknown[]) => failOnConsole('warn', args);

// jsdom does not implement ResizeObserver (needed by Radix)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// jsdom does not implement IntersectionObserver (needed by useSplitText inView trigger)
global.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
  root = null;
  rootMargin = '';
  thresholds = [];
} as unknown as typeof IntersectionObserver;

// jsdom does not implement the FontFaceSet API (document.fonts), which anime.js
// splitText reads (`doc.fonts.status`).
if (!document.fonts) {
  Object.defineProperty(document, 'fonts', {
    writable: true,
    value: {
      status: 'loaded',
      ready: Promise.resolve(),
      addEventListener: () => {},
      removeEventListener: () => {},
    },
  });
}

// jsdom does not implement window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// jsdom lacks pointer-capture + scrollIntoView, which Radix Select relies on to
// open and to scroll the highlighted option into view. Without these it never
// opens under test.
const el = window.HTMLElement.prototype as unknown as Record<string, unknown>;
el.hasPointerCapture = el.hasPointerCapture ?? (() => false);
el.setPointerCapture = el.setPointerCapture ?? (() => {});
el.releasePointerCapture = el.releasePointerCapture ?? (() => {});
el.scrollIntoView = el.scrollIntoView ?? (() => {});
