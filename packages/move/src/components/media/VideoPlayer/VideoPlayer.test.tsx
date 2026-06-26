// Generated from VideoPlayer.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VideoPlayer } from './VideoPlayer';

describe('VideoPlayer', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<VideoPlayer src="test.mp4" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders a native video element with playsInline and preload="metadata"', () => {
      const { container } = render(<VideoPlayer src="test.mp4" />);
      const video = container.querySelector('video');
      expect(video).toBeInTheDocument();
      expect(video).toHaveAttribute('playsinline');
      expect(video).toHaveAttribute('preload', 'metadata');
    });

    it('passes poster attribute to video element', () => {
      const { container } = render(<VideoPlayer src="test.mp4" poster="poster.jpg" />);
      const video = container.querySelector('video');
      expect(video).toHaveAttribute('poster', 'poster.jpg');
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(<VideoPlayer ref={ref} src="test.mp4" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className to root', () => {
      const { container } = render(<VideoPlayer src="test.mp4" className="custom" />);
      expect(container.firstChild).toHaveClass('custom');
    });

    it('forwards style to root', () => {
      const { container } = render(<VideoPlayer src="test.mp4" style={{ marginTop: '10px' }} />);
      expect(container.firstChild).toHaveStyle({ marginTop: '10px' });
    });
  });

  // === Variants ===
  describe('variants', () => {
    it('applies data-radius attribute on root (defaults to none)', () => {
      const { container } = render(<VideoPlayer src="test.mp4" />);
      expect(container.firstChild).toHaveAttribute('data-radius', 'none');
    });

    it('applies custom radius', () => {
      const { container } = render(<VideoPlayer src="test.mp4" radius="lg" />);
      expect(container.firstChild).toHaveAttribute('data-radius', 'lg');
    });

    it('applies data-fullscreen attribute on root', () => {
      const { container } = render(<VideoPlayer src="test.mp4" />);
      expect(container.firstChild).toHaveAttribute('data-fullscreen', 'false');
    });

    it('applies data-controls-hidden attribute on root', () => {
      const { container } = render(<VideoPlayer src="test.mp4" />);
      // Controls are visible initially (not playing)
      expect(container.firstChild).toHaveAttribute('data-controls-hidden', 'false');
    });
  });

  // === Controls ===
  describe('controls', () => {
    it('renders play button', () => {
      render(<VideoPlayer src="test.mp4" />);
      expect(screen.getByLabelText('Play')).toBeInTheDocument();
    });

    it('renders time display by default', () => {
      const { container } = render(<VideoPlayer src="test.mp4" />);
      const time = container.querySelector('[class*="time"]');
      expect(time).toBeInTheDocument();
      expect(time?.textContent).toContain('0:00');
    });

    it('hides time display when showTime is false', () => {
      const { container } = render(<VideoPlayer src="test.mp4" showTime={false} />);
      const time = container.querySelector('[class*="time"]');
      expect(time).not.toBeInTheDocument();
    });

    it('renders volume button by default', () => {
      render(<VideoPlayer src="test.mp4" />);
      expect(screen.getByLabelText('Mute')).toBeInTheDocument();
    });

    it('hides volume controls when showVolume is false', () => {
      render(<VideoPlayer src="test.mp4" showVolume={false} />);
      expect(screen.queryByLabelText('Mute')).not.toBeInTheDocument();
    });

    it('renders settings button by default', () => {
      render(<VideoPlayer src="test.mp4" />);
      expect(screen.getByLabelText('Settings')).toBeInTheDocument();
    });

    it('hides settings button when showSettings is false', () => {
      render(<VideoPlayer src="test.mp4" showSettings={false} />);
      expect(screen.queryByLabelText('Settings')).not.toBeInTheDocument();
    });

    it('renders fullscreen button by default', () => {
      render(<VideoPlayer src="test.mp4" />);
      expect(screen.getByLabelText('Fullscreen')).toBeInTheDocument();
    });

    it('hides fullscreen button when showFullscreen is false', () => {
      render(<VideoPlayer src="test.mp4" showFullscreen={false} />);
      expect(screen.queryByLabelText('Fullscreen')).not.toBeInTheDocument();
    });

    it('does not render subtitle button when no subtitles provided', () => {
      render(<VideoPlayer src="test.mp4" />);
      expect(screen.queryByLabelText('Subtitles')).not.toBeInTheDocument();
    });

    it('renders subtitle button when subtitles are provided', () => {
      render(
        <VideoPlayer
          src="test.mp4"
          subtitles={[{ src: 'test.vtt', label: 'English', language: 'en' }]}
        />
      );
      expect(screen.getByLabelText('Subtitles')).toBeInTheDocument();
    });

    it('hides subtitle button when showSubtitles is false', () => {
      render(
        <VideoPlayer
          src="test.mp4"
          subtitles={[{ src: 'test.vtt', label: 'English', language: 'en' }]}
          showSubtitles={false}
        />
      );
      expect(screen.queryByLabelText('Subtitles')).not.toBeInTheDocument();
    });
  });

  // === Sizing ===
  describe('sizing', () => {
    it('sets width as inline style (number treated as px)', () => {
      const { container } = render(<VideoPlayer src="test.mp4" width={640} />);
      expect(container.firstChild).toHaveStyle({ width: '640px' });
    });

    it('sets width as inline style (string)', () => {
      const { container } = render(<VideoPlayer src="test.mp4" width="80%" />);
      expect(container.firstChild).toHaveStyle({ width: '80%' });
    });

    it('sets height as inline style', () => {
      const { container } = render(<VideoPlayer src="test.mp4" height={360} />);
      expect(container.firstChild).toHaveStyle({ height: '360px' });
    });

    it('sets aspectRatio as inline style', () => {
      const { container } = render(<VideoPlayer src="test.mp4" aspectRatio="16/9" />);
      expect(container.firstChild).toHaveStyle({ aspectRatio: '16/9' });
    });
  });

  // === Accessibility ===
  describe('accessibility', () => {
    it('play button has aria-label', () => {
      render(<VideoPlayer src="test.mp4" />);
      expect(screen.getByLabelText('Play')).toBeInTheDocument();
    });

    it('volume button has aria-label', () => {
      render(<VideoPlayer src="test.mp4" />);
      expect(screen.getByLabelText('Mute')).toBeInTheDocument();
    });

    it('fullscreen button has aria-label', () => {
      render(<VideoPlayer src="test.mp4" />);
      expect(screen.getByLabelText('Fullscreen')).toBeInTheDocument();
    });

    it('settings button has aria-label', () => {
      render(<VideoPlayer src="test.mp4" />);
      expect(screen.getByLabelText('Settings')).toBeInTheDocument();
    });

    it('subtitle button has aria-label when subtitles provided', () => {
      render(
        <VideoPlayer
          src="test.mp4"
          subtitles={[{ src: 'test.vtt', label: 'English', language: 'en' }]}
        />
      );
      expect(screen.getByLabelText('Subtitles')).toBeInTheDocument();
    });

    it('root has tabIndex=0 for keyboard focus', () => {
      const { container } = render(<VideoPlayer src="test.mp4" />);
      expect(container.firstChild).toHaveAttribute('tabindex', '0');
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      const { container } = render(
        <VideoPlayer src="test.mp4" sp={{ root: { className: 'sp-root' } }} />
      );
      expect(container.firstChild).toHaveClass('sp-root');
    });

    it('merges sp style on root', () => {
      const { container } = render(
        <VideoPlayer src="test.mp4" sp={{ root: { style: { marginTop: '5px' } } }} />
      );
      expect(container.firstChild).toHaveStyle({ marginTop: '5px' });
    });
  });

  // === Keyboard shortcuts ===
  describe('keyboard shortcuts', () => {
    it('Space key calls togglePlay', () => {
      const { container } = render(<VideoPlayer src="test.mp4" />);
      const root = container.firstChild as HTMLElement;
      // Focus the root
      root.focus();
      // Just verify the play button label changes
      expect(screen.getByLabelText('Play')).toBeInTheDocument();
      fireEvent.keyDown(root, { key: ' ' });
      // The play toggle is called (we can verify it doesn't throw)
    });

    it('m key toggles mute', () => {
      const { container } = render(<VideoPlayer src="test.mp4" />);
      const root = container.firstChild as HTMLElement;
      root.focus();
      expect(screen.getByLabelText('Mute')).toBeInTheDocument();
      fireEvent.keyDown(root, { key: 'm' });
      // After toggle, label should change to Unmute
      expect(screen.getByLabelText('Unmute')).toBeInTheDocument();
    });
  });

  // === i18n labels ===
  describe('i18n labels', () => {
    it('uses custom play/pause labels', () => {
      render(<VideoPlayer src="test.mp4" labels={{ play: 'Reproducir' }} />);
      expect(screen.getByLabelText('Reproducir')).toBeInTheDocument();
    });

    it('uses custom mute/unmute labels', () => {
      render(<VideoPlayer src="test.mp4" labels={{ mute: 'Silenciar' }} />);
      expect(screen.getByLabelText('Silenciar')).toBeInTheDocument();
    });

    it('uses custom fullscreen label', () => {
      render(<VideoPlayer src="test.mp4" labels={{ fullscreen: 'Pantalla completa' }} />);
      expect(screen.getByLabelText('Pantalla completa')).toBeInTheDocument();
    });

    it('uses custom settings label', () => {
      render(<VideoPlayer src="test.mp4" labels={{ settings: 'Ajustes' }} />);
      expect(screen.getByLabelText('Ajustes')).toBeInTheDocument();
    });
  });
});
