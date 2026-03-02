// Generated from Toast.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Mock animejs before any imports that use it
vi.mock('animejs', () => ({
  animate: vi.fn(() => {
    const p = Promise.resolve();
    return Object.assign(p, { pause: vi.fn(), play: vi.fn() });
  }),
}));

// Mock the Presence system to render children directly with presence context
vi.mock('../../../animation', async () => {
  const actualReact = await import('react');

  // Simplified Presence: renders children directly
  function Presence({ children }: { children: React.ReactNode }) {
    return actualReact.createElement(actualReact.Fragment, null, children);
  }

  // usePresence returns [isPresent=true, safeToRemove=noop]
  function usePresence(): [boolean, () => void] {
    return [true, () => {}];
  }

  function useIsPresent(): boolean {
    return true;
  }

  return {
    Presence,
    usePresence,
    useIsPresent,
    prefersReducedMotion: vi.fn(() => true), // Skip animations in tests
    toAnimeParams: vi.fn((anim: unknown) => anim),
    toInstantParams: vi.fn((anim: unknown) => anim),
    springs: {},
    easings: {},
    getEase: vi.fn(),
    isSpring: vi.fn(() => false),
    DEFAULT_DURATION: 300,
    resolveEasing: vi.fn(),
    mergeAnimateConfig: vi.fn(),
    getInitialStyles: vi.fn(),
    defaultAnimations: {},
  };
});

// Mock createPortal to render inline instead of into document.body
// This avoids the NotFoundError during cleanup
vi.mock('react-dom', async () => {
  const actual = await vi.importActual<typeof ReactDOM>('react-dom');
  return {
    ...actual,
    createPortal: (children: React.ReactNode, _container: Element) => children,
  };
});

import { Toast, toast } from './Toast';
import { resetStore } from './store';

beforeEach(() => {
  resetStore();
});

afterEach(() => {
  resetStore();
});

describe('Toast', () => {
  // === Store / Imperative API ===
  describe('imperative API', () => {
    it('toast() creates a new toast with default variant and position', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast('Hello world');
      });
      expect(screen.getByText('Hello world')).toBeInTheDocument();
    });

    it('toast.info() creates an info variant toast', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast.info('Info message');
      });
      const item = screen.getByText('Info message').closest('[data-variant]');
      expect(item).toHaveAttribute('data-variant', 'info');
    });

    it('toast.success() creates a success variant toast', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast.success('Success message');
      });
      const item = screen.getByText('Success message').closest('[data-variant]');
      expect(item).toHaveAttribute('data-variant', 'success');
    });

    it('toast.warning() creates a warning variant toast', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast.warning('Warning message');
      });
      const item = screen.getByText('Warning message').closest('[data-variant]');
      expect(item).toHaveAttribute('data-variant', 'warning');
    });

    it('toast.error() creates an error variant toast', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast.error('Error message');
      });
      const item = screen.getByText('Error message').closest('[data-variant]');
      expect(item).toHaveAttribute('data-variant', 'error');
    });

    it('toast.dismiss(id) removes a specific toast', async () => {
      render(<Toast.Viewport />);
      let id: string;
      await act(async () => {
        id = toast('Dismissable');
      });
      expect(screen.getByText('Dismissable')).toBeInTheDocument();
      await act(async () => {
        toast.dismiss(id!);
      });
      expect(screen.queryByText('Dismissable')).not.toBeInTheDocument();
    });

    it('toast.configure({ max }) sets max toasts per position', async () => {
      render(<Toast.Viewport />);
      toast.configure({ max: 2 });
      await act(async () => {
        toast('First');
        toast('Second');
        toast('Third');
      });
      // Only the 2 most recent should remain
      expect(screen.queryByText('First')).not.toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
    });
  });

  // === Viewport rendering ===
  describe('viewport', () => {
    it('renders 6 position containers', () => {
      const { container } = render(<Toast.Viewport />);
      const positions = ['top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center'];
      for (const pos of positions) {
        const el = container.querySelector(`[data-position="${pos}"]`);
        expect(el).toBeInTheDocument();
      }
    });

    it('groups toasts by position', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast('Top right', { position: 'top-right' });
        toast('Bottom left', { position: 'bottom-left' });
      });
      const topRightItem = screen.getByText('Top right').closest('[data-position]');
      expect(topRightItem).toHaveAttribute('data-position', 'top-right');
      const bottomLeftItem = screen.getByText('Bottom left').closest('[data-position]');
      expect(bottomLeftItem).toHaveAttribute('data-position', 'bottom-left');
    });

    it('provides closeLabel via context (default)', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast('Test');
      });
      const closeBtn = screen.getByRole('button', { name: 'Close notification' });
      expect(closeBtn).toBeInTheDocument();
    });

    it('provides custom closeLabel via context', async () => {
      render(<Toast.Viewport closeLabel="Dismiss" />);
      await act(async () => {
        toast('Test');
      });
      const closeBtn = screen.getByRole('button', { name: 'Dismiss' });
      expect(closeBtn).toBeInTheDocument();
    });
  });

  // === ToastItem rendering ===
  describe('toast item', () => {
    it('renders message text', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast('Hello there');
      });
      expect(screen.getByText('Hello there')).toBeInTheDocument();
    });

    it('renders optional description text', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast('Title', { description: 'Some description' });
      });
      expect(screen.getByText('Some description')).toBeInTheDocument();
    });

    it('does not render description when not provided', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast('Title only');
      });
      const item = screen.getByText('Title only').closest('[role="status"]');
      const descEl = item?.querySelector('[class*="description"]');
      expect(descEl).toBeNull();
    });

    it('does not render icon for default variant', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast('Default toast');
      });
      const item = screen.getByText('Default toast').closest('[role="status"]');
      const icon = item?.querySelector('[class*="icon"]');
      expect(icon).toBeNull();
    });

    it('renders variant icon for info variant', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast.info('Info toast');
      });
      const item = screen.getByText('Info toast').closest('[role="status"]');
      const icon = item?.querySelector('[class*="icon"]');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-variant', 'info');
    });

    it('renders variant icon for success variant', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast.success('Success toast');
      });
      const item = screen.getByText('Success toast').closest('[role="status"]');
      const icon = item?.querySelector('[class*="icon"]');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-variant', 'success');
    });

    it('renders variant icon for warning variant', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast.warning('Warning toast');
      });
      const item = screen.getByText('Warning toast').closest('[role="status"]');
      const icon = item?.querySelector('[class*="icon"]');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-variant', 'warning');
    });

    it('renders variant icon for error variant', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast.error('Error toast');
      });
      const item = screen.getByText('Error toast').closest('[role="status"]');
      const icon = item?.querySelector('[class*="icon"]');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-variant', 'error');
    });
  });

  // === Close button ===
  describe('close button', () => {
    it('removes toast from store when clicked', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast('Closeable');
      });
      expect(screen.getByText('Closeable')).toBeInTheDocument();
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Close notification' }));
      });
      expect(screen.queryByText('Closeable')).not.toBeInTheDocument();
    });

    it('has accessible aria-label from context', async () => {
      render(<Toast.Viewport closeLabel="Close it" />);
      await act(async () => {
        toast('Test');
      });
      expect(screen.getByRole('button', { name: 'Close it' })).toHaveAttribute('aria-label', 'Close it');
    });
  });

  // === Accessibility ===
  describe('accessibility', () => {
    it('toast item has role=status', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast('Accessible');
      });
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('toast item has aria-live=polite', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast('Live region');
      });
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });

    it('close button has aria-label from closeLabel context', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast('Test');
      });
      const btn = screen.getByRole('button', { name: 'Close notification' });
      expect(btn).toHaveAttribute('aria-label', 'Close notification');
    });
  });

  // === Progress bar ===
  describe('progress bar', () => {
    it('is visible when duration > 0', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast('With progress', { duration: 3000 });
      });
      const item = screen.getByRole('status');
      const bar = item.querySelector('[class*="progressBar"]');
      expect(bar).toBeInTheDocument();
      expect(bar).toHaveStyle({ visibility: 'visible' });
    });

    it('is hidden when duration <= 0', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast('No progress', { duration: 0 });
      });
      const item = screen.getByRole('status');
      const bar = item.querySelector('[class*="progressBar"]');
      expect(bar).toBeInTheDocument();
      expect(bar).toHaveStyle({ visibility: 'hidden' });
    });
  });

  // === Store max enforcement ===
  describe('store max enforcement', () => {
    it('enforces max per position (default 5), removing oldest', async () => {
      render(<Toast.Viewport />);
      toast.configure({ max: 5 });
      await act(async () => {
        for (let i = 1; i <= 6; i++) {
          toast(`Toast ${i}`);
        }
      });
      // Toast 1 should be removed (oldest), 2-6 remain
      expect(screen.queryByText('Toast 1')).not.toBeInTheDocument();
      expect(screen.getByText('Toast 2')).toBeInTheDocument();
      expect(screen.getByText('Toast 6')).toBeInTheDocument();
    });
  });

  // === Data attributes ===
  describe('data attributes', () => {
    it('item has data-variant attribute', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast.error('Err');
      });
      expect(screen.getByRole('status')).toHaveAttribute('data-variant', 'error');
    });

    it('item has data-position attribute', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast('Positioned', { position: 'top-left' });
      });
      expect(screen.getByRole('status')).toHaveAttribute('data-position', 'top-left');
    });
  });

  // === Multiple toasts ===
  describe('multiple toasts', () => {
    it('renders multiple toasts simultaneously', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast('First');
        toast('Second');
        toast('Third');
      });
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
    });

    it('each toast has independent close button', async () => {
      render(<Toast.Viewport />);
      await act(async () => {
        toast('One');
        toast('Two');
      });
      const buttons = screen.getAllByRole('button', { name: 'Close notification' });
      expect(buttons).toHaveLength(2);

      // Close first toast
      await act(async () => {
        fireEvent.click(buttons[0]);
      });
      expect(screen.queryByText('One')).not.toBeInTheDocument();
      expect(screen.getByText('Two')).toBeInTheDocument();
    });
  });
});
