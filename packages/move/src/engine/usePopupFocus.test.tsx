import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as React from 'react';
import { usePopupFocus } from './usePopupFocus';
import type { PopupMechanism } from '../spec-type';

/**
 * The focus container in isolation — no Radix, no animation. Radix calls
 * `onOpenAutoFocus` / `onCloseAutoFocus` at mount and unmount of its content;
 * here the test calls them directly, so what is under test is the contract each
 * mechanism promises rather than Radix's plumbing.
 */
function Harness({
  mechanism,
  isOpen = true,
  onDismiss,
  getFocusTarget,
}: {
  mechanism: PopupMechanism;
  isOpen?: boolean;
  onDismiss?: () => void;
  getFocusTarget?: (content: HTMLElement) => HTMLElement | null;
}) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const returnRef = React.useRef<HTMLInputElement>(null);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const handlers = usePopupFocus({
    mechanism,
    contentRef,
    returnRef,
    anchorRef,
    isOpen,
    onDismiss,
    getFocusTarget,
  });

  return (
    <>
      <div ref={anchorRef}>
        <input ref={returnRef} data-testid="field" />
      </div>
      <div ref={contentRef} data-testid="content" tabIndex={-1}>
        <button data-testid="first">first</button>
        <button data-testid="second">second</button>
      </div>
      <button data-testid="outside">outside</button>
      <button data-testid="open" onClick={() => handlers.onOpenAutoFocus(new Event('x'))}>
        fire open
      </button>
      <button data-testid="close" onClick={() => handlers.onCloseAutoFocus(new Event('x'))}>
        fire close
      </button>
    </>
  );
}

const fire = async (which: 'open' | 'close') => {
  await act(async () => {
    screen.getByTestId(which).click();
  });
};

describe('usePopupFocus', () => {
  describe('focus-in on open', () => {
    it.each([['field-dialog'], ['trigger-surface']] as const)(
      '%s moves focus to the first control in the popup',
      async (mechanism) => {
        render(<Harness mechanism={mechanism} />);
        await fire('open');
        expect(document.activeElement).toBe(screen.getByTestId('first'));
      },
    );

    it.each([['field-listbox'], ['pointer-panel'], ['delegated']] as const)(
      '%s leaves focus where it is',
      async (mechanism) => {
        render(<Harness mechanism={mechanism} />);
        screen.getByTestId('field').focus();
        await fire('open');
        expect(document.activeElement).toBe(screen.getByTestId('field'));
      },
    );

    it('honours getFocusTarget over the first tabbable', async () => {
      render(
        <Harness
          mechanism="field-dialog"
          getFocusTarget={(content) => content.querySelector<HTMLElement>('[data-testid="second"]')}
        />,
      );
      await fire('open');
      expect(document.activeElement).toBe(screen.getByTestId('second'));
    });
  });

  describe('focus-back on close', () => {
    it('returns focus to the return target when the popup held it', async () => {
      render(<Harness mechanism="field-dialog" />);
      await fire('open');
      expect(screen.getByTestId('content').contains(document.activeElement)).toBe(true);

      await fire('close');
      expect(document.activeElement).toBe(screen.getByTestId('field'));
    });

    it('reclaims focus that was dropped on <body>', async () => {
      render(<Harness mechanism="field-dialog" />);
      (document.activeElement as HTMLElement | null)?.blur();
      expect(document.activeElement).toBe(document.body);

      await fire('close');
      expect(document.activeElement).toBe(screen.getByTestId('field'));
    });

    it('leaves focus alone when the user moved it elsewhere', async () => {
      // Closing by clicking elsewhere on the page must not yank focus back to
      // the field — that would fight the click that dismissed the popup.
      render(<Harness mechanism="field-dialog" />);
      screen.getByTestId('outside').focus();

      await fire('close');
      expect(document.activeElement).toBe(screen.getByTestId('outside'));
    });

    it.each([['pointer-panel'], ['delegated']] as const)(
      '%s never reclaims focus — it never took any',
      async (mechanism) => {
        render(<Harness mechanism={mechanism} />);
        screen.getByTestId('outside').focus();

        await fire('close');
        expect(document.activeElement).toBe(screen.getByTestId('outside'));
      },
    );
  });

  describe('focus-leave dismissal', () => {
    it('dismisses when focus reaches outside the popup and anchor', async () => {
      const onDismiss = vi.fn();
      render(<Harness mechanism="field-dialog" onDismiss={onDismiss} />);

      await act(async () => {
        screen.getByTestId('outside').focus();
      });
      expect(onDismiss).toHaveBeenCalled();
    });

    it.each([
      ['content', 'first'],
      ['anchor', 'field'],
    ] as const)('does not dismiss for focus inside the %s', async (_where, testId) => {
      const onDismiss = vi.fn();
      render(<Harness mechanism="field-dialog" onDismiss={onDismiss} />);

      await act(async () => {
        screen.getByTestId(testId).focus();
      });
      expect(onDismiss).not.toHaveBeenCalled();
    });

    // A popup opened FROM this one portals its surface to the end of <body>,
    // so by DOM containment its focus reads as focus leaving. It is not.
    it('does not dismiss for focus moving into a nested floating layer', async () => {
      const onDismiss = vi.fn();
      render(<Harness mechanism="field-dialog" onDismiss={onDismiss} />);

      const nested = document.createElement('div');
      nested.setAttribute('data-radix-popper-content-wrapper', '');
      const option = document.createElement('button');
      option.textContent = 'nested option';
      nested.appendChild(option);
      document.body.appendChild(nested);

      await act(async () => {
        option.focus();
      });
      expect(onDismiss).not.toHaveBeenCalled();
      nested.remove();
    });

    it('does not listen while closed', async () => {
      const onDismiss = vi.fn();
      render(<Harness mechanism="field-dialog" isOpen={false} onDismiss={onDismiss} />);

      await act(async () => {
        screen.getByTestId('outside').focus();
      });
      expect(onDismiss).not.toHaveBeenCalled();
    });

    it('is off for mechanisms that keep focus on the field', async () => {
      // The field never handed focus over, so "focus left the popup" is not a
      // signal that the user is done with it.
      const onDismiss = vi.fn();
      render(<Harness mechanism="field-listbox" onDismiss={onDismiss} />);

      await act(async () => {
        screen.getByTestId('outside').focus();
      });
      expect(onDismiss).not.toHaveBeenCalled();
    });
  });
});
