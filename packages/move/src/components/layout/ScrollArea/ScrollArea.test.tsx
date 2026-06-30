// Generated from ScrollArea.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ScrollArea } from './ScrollArea';
import { createRef } from 'react';

describe('ScrollArea', () => {
  // === ScrollArea.Root ===
  describe('ScrollArea.Root', () => {
    it('renders as a div element', () => {
      render(<ScrollArea.Root data-testid="root">Content</ScrollArea.Root>);
      const el = screen.getByTestId('root');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('DIV');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(<ScrollArea.Root ref={ref}>Content</ScrollArea.Root>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className', () => {
      render(
        <ScrollArea.Root data-testid="root" className="custom">
          Content
        </ScrollArea.Root>,
      );
      expect(screen.getByTestId('root').className).toContain('custom');
    });

    it('forwards style', () => {
      render(
        <ScrollArea.Root data-testid="root" style={{ marginTop: '10px' }}>
          Content
        </ScrollArea.Root>,
      );
      expect(screen.getByTestId('root')).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <ScrollArea.Root data-testid="root" aria-label="Scroll area">
          Content
        </ScrollArea.Root>,
      );
      expect(screen.getByTestId('root')).toHaveAttribute('aria-label', 'Scroll area');
    });

    it('renders children', () => {
      render(<ScrollArea.Root>Hello ScrollArea</ScrollArea.Root>);
      expect(screen.getByText('Hello ScrollArea')).toBeInTheDocument();
    });

    it('merges sp className on root', () => {
      render(
        <ScrollArea.Root data-testid="root" sp={{ root: { className: 'sp-root' } }}>
          Content
        </ScrollArea.Root>,
      );
      expect(screen.getByTestId('root').className).toContain('sp-root');
    });

    it('merges sp style on root', () => {
      render(
        <ScrollArea.Root data-testid="root" sp={{ root: { style: { marginTop: '5px' } } }}>
          Content
        </ScrollArea.Root>,
      );
      expect(screen.getByTestId('root')).toHaveStyle({ marginTop: '5px' });
    });
  });

  // === ScrollArea.Header ===
  describe('ScrollArea.Header', () => {
    it('renders as a div element', () => {
      render(<ScrollArea.Header data-testid="header">Header</ScrollArea.Header>);
      const el = screen.getByTestId('header');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('DIV');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(<ScrollArea.Header ref={ref}>Header</ScrollArea.Header>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('sets data-padded=true by default', () => {
      render(<ScrollArea.Header data-testid="header">Header</ScrollArea.Header>);
      expect(screen.getByTestId('header')).toHaveAttribute('data-padded', 'true');
    });

    it('sets data-padded=false when padded=false', () => {
      render(
        <ScrollArea.Header data-testid="header" padded={false}>
          Header
        </ScrollArea.Header>,
      );
      expect(screen.getByTestId('header')).toHaveAttribute('data-padded', 'false');
    });

    it('forwards className', () => {
      render(
        <ScrollArea.Header data-testid="header" className="custom">
          Header
        </ScrollArea.Header>,
      );
      expect(screen.getByTestId('header').className).toContain('custom');
    });

    it('forwards style', () => {
      render(
        <ScrollArea.Header data-testid="header" style={{ padding: '8px' }}>
          Header
        </ScrollArea.Header>,
      );
      expect(screen.getByTestId('header')).toHaveStyle({ padding: '8px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <ScrollArea.Header data-testid="header" aria-label="Header">
          Content
        </ScrollArea.Header>,
      );
      expect(screen.getByTestId('header')).toHaveAttribute('aria-label', 'Header');
    });
  });

  // === ScrollArea.Content ===
  describe('ScrollArea.Content', () => {
    it('renders as a div element', () => {
      render(<ScrollArea.Content data-testid="content">Content</ScrollArea.Content>);
      const el = screen.getByTestId('content');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('DIV');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(<ScrollArea.Content ref={ref}>Content</ScrollArea.Content>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('sets data-padded=false by default', () => {
      render(<ScrollArea.Content data-testid="content">Content</ScrollArea.Content>);
      expect(screen.getByTestId('content')).toHaveAttribute('data-padded', 'false');
    });

    it('sets data-padded=true when padded=true', () => {
      render(
        <ScrollArea.Content data-testid="content" padded>
          Content
        </ScrollArea.Content>,
      );
      expect(screen.getByTestId('content')).toHaveAttribute('data-padded', 'true');
    });

    it('forwards className', () => {
      render(
        <ScrollArea.Content data-testid="content" className="custom">
          Content
        </ScrollArea.Content>,
      );
      expect(screen.getByTestId('content').className).toContain('custom');
    });

    it('forwards style', () => {
      render(
        <ScrollArea.Content data-testid="content" style={{ padding: '16px' }}>
          Content
        </ScrollArea.Content>,
      );
      expect(screen.getByTestId('content')).toHaveStyle({ padding: '16px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <ScrollArea.Content data-testid="content" aria-label="Scrollable content">
          Content
        </ScrollArea.Content>,
      );
      expect(screen.getByTestId('content')).toHaveAttribute('aria-label', 'Scrollable content');
    });
  });

  // === ScrollArea.Footer ===
  describe('ScrollArea.Footer', () => {
    it('renders as a div element', () => {
      render(<ScrollArea.Footer data-testid="footer">Footer</ScrollArea.Footer>);
      const el = screen.getByTestId('footer');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('DIV');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(<ScrollArea.Footer ref={ref}>Footer</ScrollArea.Footer>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('sets data-padded=true by default', () => {
      render(<ScrollArea.Footer data-testid="footer">Footer</ScrollArea.Footer>);
      expect(screen.getByTestId('footer')).toHaveAttribute('data-padded', 'true');
    });

    it('sets data-padded=false when padded=false', () => {
      render(
        <ScrollArea.Footer data-testid="footer" padded={false}>
          Footer
        </ScrollArea.Footer>,
      );
      expect(screen.getByTestId('footer')).toHaveAttribute('data-padded', 'false');
    });

    it('forwards className', () => {
      render(
        <ScrollArea.Footer data-testid="footer" className="custom">
          Footer
        </ScrollArea.Footer>,
      );
      expect(screen.getByTestId('footer').className).toContain('custom');
    });

    it('forwards style', () => {
      render(
        <ScrollArea.Footer data-testid="footer" style={{ padding: '12px' }}>
          Footer
        </ScrollArea.Footer>,
      );
      expect(screen.getByTestId('footer')).toHaveStyle({ padding: '12px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <ScrollArea.Footer data-testid="footer" aria-label="Footer">
          Content
        </ScrollArea.Footer>,
      );
      expect(screen.getByTestId('footer')).toHaveAttribute('aria-label', 'Footer');
    });
  });

  // === Composition ===
  describe('composition', () => {
    it('renders full scroll area composition', () => {
      render(
        <ScrollArea.Root data-testid="root">
          <ScrollArea.Header data-testid="header">Header text</ScrollArea.Header>
          <ScrollArea.Content data-testid="content">Scrollable content</ScrollArea.Content>
          <ScrollArea.Footer data-testid="footer">Footer text</ScrollArea.Footer>
        </ScrollArea.Root>,
      );

      expect(screen.getByTestId('root')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByText('Header text')).toBeInTheDocument();
      expect(screen.getByText('Scrollable content')).toBeInTheDocument();
      expect(screen.getByText('Footer text')).toBeInTheDocument();
    });

    it('sub-components can be used individually', () => {
      render(<ScrollArea.Content data-testid="standalone-content">Standalone</ScrollArea.Content>);
      expect(screen.getByTestId('standalone-content')).toBeInTheDocument();
      expect(screen.getByText('Standalone')).toBeInTheDocument();
    });

    it('works without header and footer', () => {
      render(
        <ScrollArea.Root data-testid="root">
          <ScrollArea.Content data-testid="content">Only content</ScrollArea.Content>
        </ScrollArea.Root>,
      );

      expect(screen.getByTestId('root')).toBeInTheDocument();
      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByText('Only content')).toBeInTheDocument();
    });
  });
});
