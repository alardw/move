// Generated from Code.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Code } from './Code';
import { CodeHighlighterProvider } from './CodeHighlighter';

describe('Code', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders as inline <code> element by default', () => {
      render(<Code data-testid="code">snippet</Code>);
      const el = screen.getByTestId('code');
      expect(el.tagName).toBe('CODE');
    });

    it('renders as <pre> wrapping <code> when block=true', () => {
      render(
        <Code block data-testid="code">
          snippet
        </Code>,
      );
      const el = screen.getByTestId('code');
      expect(el.tagName).toBe('PRE');
      expect(el.querySelector('code')).not.toBeNull();
    });

    it('renders children as text content', () => {
      render(<Code>const x = 42;</Code>);
      expect(screen.getByText('const x = 42;')).toBeInTheDocument();
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLElement>;
      render(<Code ref={ref}>code</Code>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe('CODE');
    });

    it('forwards className and style', () => {
      render(
        <Code className="custom-class" style={{ marginTop: '10px' }} data-testid="code">
          code
        </Code>,
      );
      const el = screen.getByTestId('code');
      expect(el).toHaveClass('custom-class');
      expect(el).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <Code data-testid="code" aria-label="code snippet">
          code
        </Code>,
      );
      expect(screen.getByTestId('code')).toHaveAttribute('aria-label', 'code snippet');
    });
  });

  // === Variants ===
  describe('variants', () => {
    it('defaults to variant=subtle', () => {
      render(<Code data-testid="code">code</Code>);
      expect(screen.getByTestId('code')).toHaveAttribute('data-variant', 'subtle');
    });

    it('applies variant via data-variant attribute', () => {
      render(
        <Code variant="outline" data-testid="code">
          code
        </Code>,
      );
      expect(screen.getByTestId('code')).toHaveAttribute('data-variant', 'outline');
    });

    it.each(['subtle', 'outline', 'ghost'] as const)('supports variant=%s', (variant) => {
      render(
        <Code variant={variant} data-testid="code">
          code
        </Code>,
      );
      expect(screen.getByTestId('code')).toHaveAttribute('data-variant', variant);
    });
  });

  // === Sizes ===
  describe('sizes', () => {
    it('defaults to size=sm', () => {
      render(<Code data-testid="code">code</Code>);
      expect(screen.getByTestId('code')).toHaveAttribute('data-size', 'sm');
    });

    it('applies size via data-size attribute', () => {
      render(
        <Code size="lg" data-testid="code">
          code
        </Code>,
      );
      expect(screen.getByTestId('code')).toHaveAttribute('data-size', 'lg');
    });

    it.each(['xs', 'sm', 'base', 'lg'] as const)('supports size=%s', (size) => {
      render(
        <Code size={size} data-testid="code">
          code
        </Code>,
      );
      expect(screen.getByTestId('code')).toHaveAttribute('data-size', size);
    });
  });

  // === Data attributes ===
  describe('data attributes', () => {
    it('sets data-block attribute when block=true', () => {
      render(
        <Code block data-testid="code">
          code
        </Code>,
      );
      expect(screen.getByTestId('code')).toHaveAttribute('data-block');
    });

    it('omits data-block when block=false', () => {
      render(<Code data-testid="code">code</Code>);
      expect(screen.getByTestId('code')).not.toHaveAttribute('data-block');
    });

    it('sets data-language attribute when language is provided', () => {
      render(
        <Code language="tsx" data-testid="code">
          code
        </Code>,
      );
      expect(screen.getByTestId('code')).toHaveAttribute('data-language', 'tsx');
    });

    it('omits data-language when language is not provided', () => {
      render(<Code data-testid="code">code</Code>);
      expect(screen.getByTestId('code')).not.toHaveAttribute('data-language');
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(
        <Code sp={{ root: { className: 'sp-root' } }} data-testid="code">
          code
        </Code>,
      );
      expect(screen.getByTestId('code')).toHaveClass('sp-root');
    });
  });

  // === Syntax highlighting ===
  describe('syntax highlighting', () => {
    it('renders plain text when no CodeHighlighterProvider is present', () => {
      render(
        <Code language="tsx" data-testid="code">
          const x = 1;
        </Code>,
      );
      expect(screen.getByTestId('code')).toHaveTextContent('const x = 1;');
    });

    it('highlights code when CodeHighlighterProvider and language are set', () => {
      const highlighter = vi.fn((code: string, _lang: string) => `<span class="hl">${code}</span>`);

      render(
        <CodeHighlighterProvider highlighter={highlighter}>
          <Code block language="tsx" data-testid="code">
            const x = 1;
          </Code>
        </CodeHighlighterProvider>,
      );

      expect(highlighter).toHaveBeenCalledWith('const x = 1;', 'tsx');
    });

    it('handles async highlighter functions', async () => {
      const highlighter = vi.fn(
        async (code: string, _lang: string) => `<span class="hl">${code}</span>`,
      );

      render(
        <CodeHighlighterProvider highlighter={highlighter}>
          <Code block language="tsx" data-testid="code">
            const x = 1;
          </Code>
        </CodeHighlighterProvider>,
      );

      expect(highlighter).toHaveBeenCalledWith('const x = 1;', 'tsx');

      await waitFor(() => {
        const codeEl = screen.getByTestId('code').querySelector('code');
        expect(codeEl).not.toBeNull();
      });
    });

    it('falls back to plain children when highlighter returns null', () => {
      const highlighter = vi.fn(() => null as unknown as string);

      render(
        <CodeHighlighterProvider highlighter={highlighter}>
          <Code language="tsx" data-testid="code">
            const x = 1;
          </Code>
        </CodeHighlighterProvider>,
      );

      expect(screen.getByTestId('code')).toHaveTextContent('const x = 1;');
    });
  });
});
