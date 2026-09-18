import { render, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import { Text } from './Text';
import '../../../styles/system.css';

/**
 * Real-browser invariants for trimming. jsdom loads no stylesheet and computes
 * no layout, so the whole of this — which axis is clipped, whether the text
 * actually overflows — is invisible to it.
 *
 * The bug these hold the line on: `overflow: hidden` clips BOTH axes, and the
 * box it clips to is the line box, which is the line-height rather than the size
 * of the letters. A heading at `leading-none` is a 36px box holding a font that
 * draws 40px, so every p, g, j, q and y lost its tail. Reported from a consumer
 * app, on a page title.
 */

afterEach(cleanup);

const LONG = 'polisdetails gjpqy overzicht van de aanvraag';

describe('truncation — real browser', () => {
  it.each(['end', 'start'] as const)(
    'INVARIANT: %s trims sideways and leaves the block axis alone',
    (mode) => {
      const { container } = render(
        <Text truncate={mode} style={{ width: '120px', fontSize: '36px', lineHeight: 1 }}>
          {LONG}
        </Text>,
      );
      const el = container.firstElementChild as HTMLElement;
      const cs = getComputedStyle(el);

      // Trimming happens, or there is nothing to test.
      expect(el.scrollWidth).toBeGreaterThan(el.clientWidth);
      expect(cs.textOverflow).toBe('ellipsis');

      // Clipped on the inline axis only. `visible` beside `hidden` or `auto`
      // would be computed to `auto` and scroll; beside `clip` it stays visible,
      // which is what lets a descender finish being drawn.
      expect(cs.overflowX).toBe('clip');
      expect(cs.overflowY).toBe('visible');
    },
  );

  it('INVARIANT: middle trims its head sideways and leaves the block axis alone', () => {
    const { container } = render(
      <Text truncate="middle" style={{ width: '120px', fontSize: '36px', lineHeight: 1 }}>
        {LONG}
      </Text>,
    );
    const head = container.querySelector('[data-truncate-head]') as HTMLElement;
    const cs = getComputedStyle(head);
    expect(head.scrollWidth).toBeGreaterThan(head.clientWidth);
    expect(cs.overflowX).toBe('clip');
    expect(cs.overflowY).toBe('visible');
  });

  it('INVARIANT: clamp still clips the block axis — that is what it is for', () => {
    const { container } = render(
      <Text truncate="clamp" lines={2} style={{ width: '120px' }}>
        {LONG}
      </Text>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(getComputedStyle(el).overflowY).toBe('hidden');
    expect(el.scrollHeight).toBeGreaterThan(el.clientHeight);
  });
});
