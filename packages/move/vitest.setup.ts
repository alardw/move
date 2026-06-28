import '@testing-library/jest-dom/vitest';

// Fail any test that leaks a move-specific prop to the DOM. React only warns on
// a genuine leak (a prop spread onto a host element that it doesn't recognize),
// so this is a precise, zero-false-positive guard for the `Button.fullWidth`
// class of bug — a move prop missing from `moveProps`. Turning the warning into
// a thrown error makes the offending component's test fail loudly.
const DOM_LEAK_RE =
  /does not recognize the .* prop on a DOM element|Invalid DOM property|Unknown event handler property/;
const originalConsoleError = console.error.bind(console);
console.error = (...args: unknown[]) => {
  const msg = typeof args[0] === 'string' ? args[0] : '';
  if (DOM_LEAK_RE.test(msg)) {
    throw new Error(`DOM prop leak (add the prop to moveProps): ${args.map(String).join(' ')}`);
  }
  originalConsoleError(...args);
};

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
