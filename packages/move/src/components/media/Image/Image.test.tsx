// Generated from Image.spec.ts
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Image } from './Image';

describe('Image', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<Image src="test.jpg" alt="Test" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders img element with provided src', () => {
      render(<Image src="test.jpg" alt="Test image" />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', 'test.jpg');
    });

    it('renders img element with alt text', () => {
      render(<Image src="test.jpg" alt="Alt text" />);
      expect(screen.getByAltText('Alt text')).toBeInTheDocument();
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(<Image ref={ref} src="test.jpg" alt="Test" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className to root', () => {
      const { container } = render(<Image src="test.jpg" alt="Test" className="custom" />);
      expect(container.firstChild).toHaveClass('custom');
    });

    it('forwards style to root', () => {
      const { container } = render(
        <Image src="test.jpg" alt="Test" style={{ marginTop: '10px' }} />,
      );
      expect(container.firstChild).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(<Image src="test.jpg" alt="Test" data-testid="my-image" />);
      expect(screen.getByTestId('my-image')).toBeInTheDocument();
    });
  });

  // === Variants ===
  describe('variants', () => {
    it('applies data-fit attribute on root (defaults to cover)', () => {
      const { container } = render(<Image src="test.jpg" alt="Test" />);
      expect(container.firstChild).toHaveAttribute('data-fit', 'cover');
    });

    it('applies data-radius attribute on root (defaults to none)', () => {
      const { container } = render(<Image src="test.jpg" alt="Test" />);
      expect(container.firstChild).toHaveAttribute('data-radius', 'none');
    });

    it('applies data-position attribute on root (defaults to center)', () => {
      const { container } = render(<Image src="test.jpg" alt="Test" />);
      expect(container.firstChild).toHaveAttribute('data-position', 'center');
    });

    it('applies custom fit variant', () => {
      const { container } = render(<Image src="test.jpg" alt="Test" fit="contain" />);
      expect(container.firstChild).toHaveAttribute('data-fit', 'contain');
    });

    it('applies custom radius variant', () => {
      const { container } = render(<Image src="test.jpg" alt="Test" radius="lg" />);
      expect(container.firstChild).toHaveAttribute('data-radius', 'lg');
    });

    it('applies custom position variant', () => {
      const { container } = render(<Image src="test.jpg" alt="Test" position="top left" />);
      expect(container.firstChild).toHaveAttribute('data-position', 'top left');
    });
  });

  // === Sizing ===
  describe('sizing', () => {
    it('sets width as inline style on root', () => {
      const { container } = render(<Image src="test.jpg" alt="Test" width="200px" />);
      expect(container.firstChild).toHaveStyle({ width: '200px' });
    });

    it('converts numeric width to px string', () => {
      const { container } = render(<Image src="test.jpg" alt="Test" width={200} />);
      expect(container.firstChild).toHaveStyle({ width: '200px' });
    });

    it('sets height as inline style on root', () => {
      const { container } = render(<Image src="test.jpg" alt="Test" height="150px" />);
      expect(container.firstChild).toHaveStyle({ height: '150px' });
    });

    it('converts numeric height to px string', () => {
      const { container } = render(<Image src="test.jpg" alt="Test" height={150} />);
      expect(container.firstChild).toHaveStyle({ height: '150px' });
    });

    it('sets aspectRatio as inline style on root', () => {
      const { container } = render(<Image src="test.jpg" alt="Test" aspectRatio="16/9" />);
      expect(container.firstChild).toHaveStyle({ aspectRatio: '16/9' });
    });
  });

  // === Loading ===
  describe('loading', () => {
    it('passes loading attribute to img element', () => {
      render(<Image src="test.jpg" alt="Test" loading="lazy" />);
      expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy');
    });
  });

  // === Error and fallback ===
  describe('error and fallback', () => {
    it('shows fallback slot when image errors and no fallbackSrc is set', () => {
      const { container } = render(<Image src="bad.jpg" alt="Test" />);
      const img = screen.getByRole('img');
      fireEvent.error(img);
      // After error, img should be gone and fallback shown
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(container.querySelector('[class*="fallback"]')).toBeInTheDocument();
    });

    it('shows fallbackSrc image when image errors and fallbackSrc is provided', () => {
      render(<Image src="bad.jpg" alt="Test" fallbackSrc="fallback.jpg" />);
      const img = screen.getByRole('img');
      fireEvent.error(img);
      expect(screen.getByRole('img')).toHaveAttribute('src', 'fallback.jpg');
    });

    it('renders children as custom fallback content when image errors', () => {
      render(
        <Image src="bad.jpg" alt="Test">
          <span>Custom fallback</span>
        </Image>,
      );
      const img = screen.getByRole('img');
      fireEvent.error(img);
      expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    });

    it('calls onError when image fails', () => {
      const onError = vi.fn();
      render(<Image src="bad.jpg" alt="Test" onError={onError} />);
      fireEvent.error(screen.getByRole('img'));
      expect(onError).toHaveBeenCalledTimes(1);
    });

    it('calls onLoad when image loads', () => {
      const onLoad = vi.fn();
      render(<Image src="test.jpg" alt="Test" onLoad={onLoad} />);
      fireEvent.load(screen.getByRole('img'));
      expect(onLoad).toHaveBeenCalledTimes(1);
    });
  });

  // === Action overlay ===
  describe('action overlay', () => {
    it('shows action overlay when action prop is provided', () => {
      const { container } = render(
        <Image src="test.jpg" alt="Test" action={<button>Download</button>} />,
      );
      expect(container.querySelector('[class*="action"]')).toBeInTheDocument();
    });

    it('hides action overlay when image is in fallback state', () => {
      const { container } = render(
        <Image src="bad.jpg" alt="Test" action={<button>Download</button>} />,
      );
      fireEvent.error(screen.getByRole('img'));
      expect(container.querySelector('[class*="action"]')).not.toBeInTheDocument();
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      const { container } = render(
        <Image src="test.jpg" alt="Test" sp={{ root: { className: 'sp-root' } }} />,
      );
      expect(container.firstChild).toHaveClass('sp-root');
    });

    it('merges sp style on root', () => {
      const { container } = render(
        <Image src="test.jpg" alt="Test" sp={{ root: { style: { marginTop: '5px' } } }} />,
      );
      expect(container.firstChild).toHaveStyle({ marginTop: '5px' });
    });
  });

  // === Accessibility ===
  describe('accessibility', () => {
    it('img element has alt attribute for accessibility', () => {
      render(<Image src="test.jpg" alt="Accessible image" />);
      expect(screen.getByAltText('Accessible image')).toBeInTheDocument();
    });
  });
});
