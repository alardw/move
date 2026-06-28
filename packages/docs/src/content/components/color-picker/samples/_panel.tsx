import type { ReactNode } from 'react';
import { Card } from 'move';

/**
 * Tiny wrapper used by the ColorPicker docs samples — gives the chromeless
 * picker a visible frame so each sample reads as a self-contained widget.
 */
export function PickerPanel({ children }: { children: ReactNode }) {
  return (
    <Card.Root>
      <Card.Body>{children}</Card.Body>
    </Card.Root>
  );
}
