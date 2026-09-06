'use client';

import * as React from 'react';
import { Button } from '../../actions/Button';
import { Tooltip } from '../../overlays/Tooltip';

/**
 * A transport control, named twice.
 *
 * Every control on a player is icon-only, so `aria-label` gives a screen reader
 * the name and a sighted pointer user gets nothing — they recognise the glyph or
 * they guess. Two glyphs people actually hesitate over are here: maximize
 * against minimize, and volume-2 against volume-x.
 *
 * The tooltip carries the SAME string as the label, so this adds no
 * translatable surface — the players already name every control through their
 * `labels` object. Sidebar set the precedent, showing a tooltip on a nav item
 * exactly while the item is collapsed and its text is hidden.
 *
 * Shared rather than written twice, because both players are the same
 * instrument: a control that behaves one way in the audio player and another in
 * the video player is a person relearning the same widget.
 */
export interface PlayerButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  /** Names the control, for assistive tech and in the tooltip. */
  label: string;
  /** The icon. */
  children: React.ReactNode;
  /** Which side the tooltip sits on. Controls in a bottom bar want `top`. */
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const PlayerButton = React.forwardRef<HTMLButtonElement, PlayerButtonProps>(
  function PlayerButton({ label, children, side = 'top', ...rest }, ref) {
    return (
      <Tooltip label={label} side={side}>
        <Button ref={ref} variant="ghost" size="sm" aria-label={label} {...rest}>
          {children}
        </Button>
      </Tooltip>
    );
  },
);
