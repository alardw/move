// Generated from AudioPlayer.spec.ts
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AudioPlayer } from './AudioPlayer';

describe('AudioPlayer', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<AudioPlayer src="test.mp3" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders a hidden audio element inside the player', () => {
      const { container } = render(<AudioPlayer src="test.mp3" />);
      const audio = container.querySelector('audio');
      expect(audio).toBeInTheDocument();
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(<AudioPlayer ref={ref} src="test.mp3" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className to root', () => {
      const { container } = render(<AudioPlayer src="test.mp3" className="custom" />);
      expect(container.firstChild).toHaveClass('custom');
    });

    it('forwards style to root', () => {
      const { container } = render(<AudioPlayer src="test.mp3" style={{ marginTop: '10px' }} />);
      expect(container.firstChild).toHaveStyle({ marginTop: '10px' });
    });
  });

  // === Variants ===
  describe('variants', () => {
    it('applies data-radius attribute on root (defaults to none)', () => {
      const { container } = render(<AudioPlayer src="test.mp3" />);
      expect(container.firstChild).toHaveAttribute('data-radius', 'none');
    });

    it('applies data-size attribute on root (defaults to md)', () => {
      const { container } = render(<AudioPlayer src="test.mp3" />);
      expect(container.firstChild).toHaveAttribute('data-size', 'md');
    });

    it('applies custom radius', () => {
      const { container } = render(<AudioPlayer src="test.mp3" radius="lg" />);
      expect(container.firstChild).toHaveAttribute('data-radius', 'lg');
    });

    it('applies custom size', () => {
      const { container } = render(<AudioPlayer src="test.mp3" size="sm" />);
      expect(container.firstChild).toHaveAttribute('data-size', 'sm');
    });
  });

  // === Controls ===
  describe('controls', () => {
    it('renders play button', () => {
      render(<AudioPlayer src="test.mp3" />);
      expect(screen.getByLabelText('Play')).toBeInTheDocument();
    });

    it('renders time display by default', () => {
      const { container } = render(<AudioPlayer src="test.mp3" />);
      const time = container.querySelector('[class*="time"]');
      expect(time).toBeInTheDocument();
      expect(time?.textContent).toContain('0:00');
    });

    it('hides time display when showTime is false', () => {
      const { container } = render(<AudioPlayer src="test.mp3" showTime={false} />);
      const time = container.querySelector('[class*="time"]');
      expect(time).not.toBeInTheDocument();
    });

    it('renders volume button by default', () => {
      render(<AudioPlayer src="test.mp3" />);
      expect(screen.getByLabelText('Mute')).toBeInTheDocument();
    });

    it('hides volume controls when showVolume is false', () => {
      render(<AudioPlayer src="test.mp3" showVolume={false} />);
      expect(screen.queryByLabelText('Mute')).not.toBeInTheDocument();
    });

    it('renders settings button by default', () => {
      render(<AudioPlayer src="test.mp3" />);
      expect(screen.getByLabelText('Settings')).toBeInTheDocument();
    });

    it('hides settings button when showSettings is false', () => {
      render(<AudioPlayer src="test.mp3" showSettings={false} />);
      expect(screen.queryByLabelText('Settings')).not.toBeInTheDocument();
    });
  });

  // === Accessibility ===
  describe('accessibility', () => {
    it('play button has aria-label', () => {
      render(<AudioPlayer src="test.mp3" />);
      expect(screen.getByLabelText('Play')).toBeInTheDocument();
    });

    it('volume button has aria-label', () => {
      render(<AudioPlayer src="test.mp3" />);
      expect(screen.getByLabelText('Mute')).toBeInTheDocument();
    });

    it('settings button has aria-label', () => {
      render(<AudioPlayer src="test.mp3" />);
      expect(screen.getByLabelText('Settings')).toBeInTheDocument();
    });

    it('root has tabIndex=0 for keyboard focus', () => {
      const { container } = render(<AudioPlayer src="test.mp3" />);
      expect(container.firstChild).toHaveAttribute('tabindex', '0');
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      const { container } = render(
        <AudioPlayer src="test.mp3" sp={{ root: { className: 'sp-root' } }} />,
      );
      expect(container.firstChild).toHaveClass('sp-root');
    });

    it('merges sp style on root', () => {
      const { container } = render(
        <AudioPlayer src="test.mp3" sp={{ root: { style: { marginTop: '5px' } } }} />,
      );
      expect(container.firstChild).toHaveStyle({ marginTop: '5px' });
    });
  });
});
