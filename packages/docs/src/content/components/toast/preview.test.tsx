import * as React from 'react';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MoveRoot, lightTheme, Toast, toast } from 'move';
import * as Lucide from 'lucide-react';
import ToastPreview from './preview';

// Drift guard for the hand-built Toast card preview. Toast can't be staged like
// the other overlays (singleton store + viewport portals to document.body), so
// the card shows a static replica (preview.tsx). This asserts the replica stays
// structurally identical to a really-rendered toast — same classes, data
// attributes, icon, and text. If the real ToastItem changes, this fails and the
// replica must be updated.

function toPascal(name: string) {
  return name.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
}
const iconResolver = (name: string) => {
  const icons = Lucide as Record<string, unknown>;
  return (icons[toPascal(name)] ?? null) as React.ComponentType | null;
};

// Strip inline styles: anime.js sets opacity/transform on the item and animates
// the progress bar's scaleX, none of which is part of the static structure.
const normalize = (el: Element) => el.outerHTML.replace(/ style="[^"]*"/g, '');

afterEach(cleanup);

test('toast card preview is structurally identical to a real toast', async () => {
  // A real toast, rendered through its store + viewport.
  render(
    <MoveRoot theme={lightTheme} iconResolver={iconResolver}>
      <Toast.Viewport />
    </MoveRoot>,
  );
  toast.success('Saved — your changes are live.');
  const realItem = await screen.findByRole('status');
  const realHtml = normalize(realItem);

  // The card replica.
  const mock = render(
    <MoveRoot theme={lightTheme} iconResolver={iconResolver}>
      <ToastPreview />
    </MoveRoot>,
  );
  const mockItem = mock.container.querySelector('[role="status"]')!;

  expect(normalize(mockItem)).toBe(realHtml);
});
