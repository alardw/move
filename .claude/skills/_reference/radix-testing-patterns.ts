/**
 * Radix Testing Patterns
 *
 * Known jsdom quirks and patterns for testing Radix UI primitives.
 * Read this reference when generating tests for Radix-wrapped components.
 */

// =============================================================================
// Duplicate role elements (Tooltip, Popover)
// =============================================================================

export const DUPLICATE_ROLE_ELEMENTS = {
  affected: ['Tooltip'],
  problem: 'Radix Tooltip renders multiple elements with role="tooltip" in jsdom. screen.getByRole("tooltip") fails with "found multiple elements".',
  solution: 'Use screen.getAllByRole("tooltip") and select the last element, or query by [data-state="open"].',
  pattern: `
// Helper to find tooltip content
function findTooltip() {
  const tooltips = screen.getAllByRole('tooltip');
  return tooltips[tooltips.length - 1];
}

// Usage
await waitFor(() => {
  const tooltip = findTooltip();
  expect(tooltip.textContent).toContain('Expected text');
});
`,
} as const;

// =============================================================================
// Nested interactive elements (Tooltip.Trigger, Popover.Trigger, Dropdown.Trigger)
// =============================================================================

export const NESTED_INTERACTIVE_ELEMENTS = {
  affected: ['Tooltip', 'Popover', 'Dropdown', 'Dialog'],
  problem: 'Radix Trigger sub-components render as <button> by default. Wrapping them around another <button> creates nested interactive elements, which is invalid HTML and causes jsdom warnings that prevent content from rendering.',
  solution: 'Always use asChild on Trigger sub-components when the child is an interactive element.',
  pattern: `
// BAD — nested <button> elements
<Tooltip.Trigger>
  <button>Hover me</button>
</Tooltip.Trigger>

// GOOD — asChild merges onto the child element
<Tooltip.Trigger asChild>
  <button>Hover me</button>
</Tooltip.Trigger>
`,
} as const;

// =============================================================================
// Positioning attributes unreliable in jsdom
// =============================================================================

export const POSITIONING_ATTRIBUTES = {
  affected: ['Tooltip', 'Popover', 'DatePicker', 'Dropdown', 'Select'],
  problem: 'data-side and data-align attributes depend on Radix positioning engine which requires a real layout engine. In jsdom, these may not be set or may have unexpected values.',
  solution: 'Only assert that the attribute EXISTS (toHaveAttribute("data-side")), never assert specific values (toHaveAttribute("data-side", "top")). For side/align props, just verify the prop is accepted without error.',
  pattern: `
// BAD — specific positioning values are unreliable in jsdom
expect(tooltip).toHaveAttribute('data-side', 'top');

// GOOD — just verify the attribute exists
expect(tooltip).toHaveAttribute('data-side');

// GOOD — just verify the prop is accepted without error
renderTooltip(<Tooltip label="Tip" side="bottom" open><button>T</button></Tooltip>);
expect(screen.getByText('T')).toBeInTheDocument();
`,
} as const;

// =============================================================================
// Provider wrapping requirements
// =============================================================================

export const PROVIDER_REQUIREMENTS = {
  affected: ['Tooltip'],
  problem: 'Radix Tooltip requires a Tooltip.Provider ancestor for proper behavior in tests. Without it, tooltips may not render or may have timing issues.',
  solution: 'Wrap test renders in the component Provider with delayDuration={0} for immediate rendering.',
  pattern: `
// Helper
function renderTooltip(ui: React.ReactElement) {
  return render(<Tooltip.Provider delayDuration={0}>{ui}</Tooltip.Provider>);
}
`,
} as const;

// =============================================================================
// Compound Content tests may timeout
// =============================================================================

export const CONTENT_TIMEOUT = {
  affected: ['Tooltip'],
  problem: 'Tooltip compound Content tests using <Tooltip.Root open> may timeout in jsdom. The content element may not appear in the DOM due to animation hooks (useLayoutEffect setting opacity: 0 and animation never completing without RAF).',
  solution: 'Use waitFor with generous timeout. If compound Content tests consistently timeout, focus tests on the Simple API (which works reliably) and test compound API structure only (not positioning/styling).',
  pattern: `
// For compound Content tests, use waitFor
await waitFor(() => {
  const tooltip = findTooltip();
  expect(tooltip).toHaveAttribute('data-side');
}, { timeout: 2000 });
`,
} as const;

// =============================================================================
// act() warnings for imperative APIs
// =============================================================================

export const ACT_WARNINGS = {
  affected: ['Toast'],
  problem: 'Imperative API components (Toast.show()) trigger React state updates that cause act() warnings in tests.',
  solution: 'Wrap imperative calls that trigger state updates in act().',
  pattern: `
import { act } from '@testing-library/react';

await act(async () => {
  Toast.show({ title: 'Test' });
});
`,
} as const;

// =============================================================================
// General Radix testing rules
// =============================================================================

export const GENERAL_RULES = [
  'Radix components with Portal render content outside the test container — use screen queries (not container queries) to find portaled content.',
  'Compound API tests should always use asChild on Trigger sub-components to avoid nested interactive elements.',
  'For overlay components (Dialog, Popover, Dropdown, Tooltip), test with open={true} or defaultOpen={true} to skip interaction-based opening in unit tests.',
  'Prefer testing the Simple API when both Simple and Compound APIs exist — Simple API is more reliable in jsdom.',
  'Animation-dependent assertions (opacity, transform) are unreliable in jsdom — test behavior, not animation state.',
] as const;
