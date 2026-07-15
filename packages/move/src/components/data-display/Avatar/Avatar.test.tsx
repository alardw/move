// Generated from Avatar.spec.ts
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  // === Avatar.Root rendering ===
  describe('Avatar.Root', () => {
    it('renders Radix Avatar.Root', () => {
      render(
        <Avatar.Root data-testid="avatar">
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>,
      );
      expect(screen.getByTestId('avatar')).toBeInTheDocument();
    });

    it('forwards ref to root element', () => {
      const ref = createRef<HTMLSpanElement>();
      render(
        <Avatar.Root ref={ref}>
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>,
      );
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it('defaults to size=md', () => {
      render(
        <Avatar.Root data-testid="avatar">
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>,
      );
      expect(screen.getByTestId('avatar')).toHaveAttribute('data-size', 'md');
    });

    it('applies size via data-size attribute', () => {
      render(
        <Avatar.Root size="lg" data-testid="avatar">
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>,
      );
      expect(screen.getByTestId('avatar')).toHaveAttribute('data-size', 'lg');
    });

    it('applies size xs via data-size attribute', () => {
      render(
        <Avatar.Root size="xs" data-testid="avatar">
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>,
      );
      expect(screen.getByTestId('avatar')).toHaveAttribute('data-size', 'xs');
    });

    it('applies size xl via data-size attribute', () => {
      render(
        <Avatar.Root size="xl" data-testid="avatar">
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>,
      );
      expect(screen.getByTestId('avatar')).toHaveAttribute('data-size', 'xl');
    });
  });

  // === Avatar.Image ===
  describe('Avatar.Image', () => {
    it('renders without crashing', () => {
      // Radix Avatar.Image only renders <img> after successful load,
      // which doesn't occur in jsdom. Verify it doesn't throw.
      const { container } = render(
        <Avatar.Root>
          <Avatar.Image src="https://example.com/img.jpg" alt="Test avatar" />
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>,
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // === Avatar.Fallback ===
  describe('Avatar.Fallback', () => {
    it('renders fallback content when image is unavailable', () => {
      render(
        <Avatar.Root>
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>,
      );
      expect(screen.getByText('AB')).toBeInTheDocument();
    });
  });

  // === Avatar.Group ===
  describe('Avatar.Group', () => {
    it('renders inline-flex container', () => {
      render(
        <Avatar.Group data-testid="group">
          <Avatar.Root>
            <Avatar.Fallback>A</Avatar.Fallback>
          </Avatar.Root>
          <Avatar.Root>
            <Avatar.Fallback>B</Avatar.Fallback>
          </Avatar.Root>
        </Avatar.Group>,
      );
      expect(screen.getByTestId('group')).toBeInTheDocument();
    });

    it('renders multiple avatars', () => {
      render(
        <Avatar.Group>
          <Avatar.Root>
            <Avatar.Fallback>A</Avatar.Fallback>
          </Avatar.Root>
          <Avatar.Root>
            <Avatar.Fallback>B</Avatar.Fallback>
          </Avatar.Root>
          <Avatar.Root>
            <Avatar.Fallback>C</Avatar.Fallback>
          </Avatar.Root>
        </Avatar.Group>,
      );
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
      expect(screen.getByText('C')).toBeInTheDocument();
    });
  });

  // === Passthrough ===
  describe('passthrough', () => {
    it('merges className on Root', () => {
      render(
        <Avatar.Root className="custom" data-testid="avatar">
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>,
      );
      expect(screen.getByTestId('avatar').className).toContain('custom');
    });

    it('merges style on Root', () => {
      render(
        <Avatar.Root style={{ color: 'red' }} data-testid="avatar">
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>,
      );
      const el = screen.getByTestId('avatar');
      expect(el.style.color).toBe('red');
    });

    it('spreads HTML attributes on Root', () => {
      render(
        <Avatar.Root data-testid="avatar" data-custom="value">
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>,
      );
      expect(screen.getByTestId('avatar')).toHaveAttribute('data-custom', 'value');
    });

    it('merges className on Group', () => {
      render(
        <Avatar.Group className="group-custom" data-testid="group">
          <Avatar.Root>
            <Avatar.Fallback>A</Avatar.Fallback>
          </Avatar.Root>
        </Avatar.Group>,
      );
      expect(screen.getByTestId('group').className).toContain('group-custom');
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on Root', () => {
      render(
        <Avatar.Root sp={{ root: { className: 'sp-class' } }} data-testid="avatar">
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>,
      );
      expect(screen.getByTestId('avatar').className).toContain('sp-class');
    });

    it('merges sp className on Group', () => {
      render(
        <Avatar.Group sp={{ group: { className: 'sp-group' } }} data-testid="group">
          <Avatar.Root>
            <Avatar.Fallback>A</Avatar.Fallback>
          </Avatar.Root>
        </Avatar.Group>,
      );
      expect(screen.getByTestId('group').className).toContain('sp-group');
    });
  });

  // === Animation ===
  describe('animation', () => {
    it('accepts animations=false to disable entrance animation', () => {
      // Should render without crashing when animation is disabled
      render(
        <Avatar.Root animations={false} data-testid="avatar">
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>,
      );
      expect(screen.getByTestId('avatar')).toBeInTheDocument();
    });

    it('accepts custom animations config', () => {
      render(
        <Avatar.Root
          animations={[
            {
              trigger: 'Root.enter',
              sequence: [{ animation: { opacity: { from: 0, to: 1, ease: 'outQuart' } } }],
            },
          ]}
          data-testid="avatar"
        >
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>,
      );
      expect(screen.getByTestId('avatar')).toBeInTheDocument();
    });
  });
});
