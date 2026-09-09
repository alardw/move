// Generated from AudioPlayer.spec.ts
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AudioPlayer } from './AudioPlayer';
import type { MediaTransport } from '../_shared/types';

/** A transport with no media element behind it — the point of the seam. */
function fakeTransport(over: Partial<MediaTransport> = {}): MediaTransport {
  return {
    playing: false,
    currentTime: 30,
    duration: 120,
    buffered: 0,
    muted: false,
    volume: 1,
    playbackRate: 1,
    ready: true,
    seekable: true,
    togglePlay: vi.fn(),
    seek: vi.fn(),
    setVolume: vi.fn(),
    toggleMute: vi.fn(),
    setPlaybackRate: vi.fn(),
    ...over,
  };
}

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
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
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

  // === Transport seam ===
  describe('transport', () => {
    it('renders no audio element when a transport is supplied', () => {
      const { container } = render(<AudioPlayer transport={fakeTransport()} />);
      expect(container.querySelector('audio')).toBeNull();
    });

    it('reads position and duration from the supplied transport', () => {
      render(<AudioPlayer transport={fakeTransport()} />);
      expect(screen.getByText('0:30 / 2:00')).toBeInTheDocument();
    });

    it('routes the play button to the supplied transport', () => {
      const transport = fakeTransport();
      render(<AudioPlayer transport={transport} />);
      fireEvent.click(screen.getByLabelText('Play'));
      expect(transport.togglePlay).toHaveBeenCalled();
    });

    it('shows elapsed time alone when the source is unbounded', () => {
      render(<AudioPlayer transport={fakeTransport({ duration: Infinity, currentTime: 65 })} />);
      expect(screen.getByText('1:05')).toBeInTheDocument();
    });

    it('takes no seek from a source that cannot be moved', () => {
      const transport = fakeTransport({ seekable: false });
      const { container } = render(
        <AudioPlayer transport={transport} sp={{ progress: { className: 'test-progress' } }} />,
      );
      const progress = container.querySelector('.test-progress') as Element;
      expect(progress).toHaveAttribute('aria-disabled', 'true');
      fireEvent.mouseDown(progress, { clientX: 50 });
      expect(transport.seek).not.toHaveBeenCalled();
    });

    it('seeks when the source can be moved', () => {
      const transport = fakeTransport();
      const { container } = render(
        <AudioPlayer transport={transport} sp={{ progress: { className: 'test-progress' } }} />,
      );
      const progress = container.querySelector('.test-progress') as Element;
      expect(progress).not.toHaveAttribute('aria-disabled');
      fireEvent.mouseDown(progress, { clientX: 0 });
      expect(transport.seek).toHaveBeenCalled();
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
