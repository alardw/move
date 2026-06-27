import '@testing-library/jest-dom';

// jsdom has no matchMedia; the animation engine reads prefers-reduced-motion
// through it. Without this, mount-time animations throw and components render
// half-built.
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}
