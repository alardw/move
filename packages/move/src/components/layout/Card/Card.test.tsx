// Generated from Card.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from './Card';
import { createRef } from 'react';

describe('Card', () => {
  // === Card.Root ===
  describe('Card.Root', () => {
    it('renders as a div element', () => {
      render(<Card.Root data-testid="card">Content</Card.Root>);
      const el = screen.getByTestId('card');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('DIV');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Card.Root ref={ref}>Content</Card.Root>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('defaults to variant=default', () => {
      render(<Card.Root data-testid="card">Content</Card.Root>);
      expect(screen.getByTestId('card')).toHaveAttribute('data-variant', 'default');
    });

    it('applies variant via data-variant attribute', () => {
      const { rerender } = render(
        <Card.Root data-testid="card" variant="elevated">
          Content
        </Card.Root>,
      );
      expect(screen.getByTestId('card')).toHaveAttribute('data-variant', 'elevated');

      rerender(
        <Card.Root data-testid="card" variant="ghost">
          Content
        </Card.Root>,
      );
      expect(screen.getByTestId('card')).toHaveAttribute('data-variant', 'ghost');
    });

    it('defaults to size=md', () => {
      render(<Card.Root data-testid="card">Content</Card.Root>);
      expect(screen.getByTestId('card')).toHaveAttribute('data-size', 'md');
    });

    it('applies size via data-size attribute', () => {
      const { rerender } = render(
        <Card.Root data-testid="card" size="sm">
          Content
        </Card.Root>,
      );
      expect(screen.getByTestId('card')).toHaveAttribute('data-size', 'sm');

      rerender(
        <Card.Root data-testid="card" size="lg">
          Content
        </Card.Root>,
      );
      expect(screen.getByTestId('card')).toHaveAttribute('data-size', 'lg');
    });

    it('sets data-surface="subtle" for surface wiring', () => {
      render(<Card.Root data-testid="card">Content</Card.Root>);
      expect(screen.getByTestId('card')).toHaveAttribute('data-surface', 'subtle');
    });

    it('forwards className', () => {
      render(
        <Card.Root data-testid="card" className="custom">
          Content
        </Card.Root>,
      );
      expect(screen.getByTestId('card').className).toContain('custom');
    });

    it('forwards style', () => {
      render(
        <Card.Root data-testid="card" style={{ marginTop: '10px' }}>
          Content
        </Card.Root>,
      );
      expect(screen.getByTestId('card')).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <Card.Root data-testid="my-card" aria-label="My Card">
          Content
        </Card.Root>,
      );
      expect(screen.getByTestId('my-card')).toHaveAttribute('aria-label', 'My Card');
    });

    it('renders children', () => {
      render(<Card.Root>Hello Card</Card.Root>);
      expect(screen.getByText('Hello Card')).toBeInTheDocument();
    });

    it('merges sp className on root', () => {
      render(
        <Card.Root data-testid="card" sp={{ root: { className: 'sp-root' } }}>
          Content
        </Card.Root>,
      );
      expect(screen.getByTestId('card').className).toContain('sp-root');
    });

    it('merges sp style on root', () => {
      render(
        <Card.Root data-testid="card" sp={{ root: { style: { marginTop: '5px' } } }}>
          Content
        </Card.Root>,
      );
      expect(screen.getByTestId('card')).toHaveStyle({ marginTop: '5px' });
    });
  });

  // === Card.Header ===
  describe('Card.Header', () => {
    it('renders as a div element', () => {
      render(<Card.Header data-testid="header">Content</Card.Header>);
      const el = screen.getByTestId('header');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('DIV');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Card.Header ref={ref}>Content</Card.Header>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className and style', () => {
      render(
        <Card.Header data-testid="header" className="custom" style={{ padding: '8px' }}>
          Content
        </Card.Header>,
      );
      const el = screen.getByTestId('header');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ padding: '8px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <Card.Header data-testid="header" aria-label="Header">
          Content
        </Card.Header>,
      );
      expect(screen.getByTestId('header')).toHaveAttribute('aria-label', 'Header');
    });
  });

  // === Card.Title ===
  describe('Card.Title', () => {
    it('renders as an h3 element', () => {
      render(<Card.Title data-testid="title">Title</Card.Title>);
      const el = screen.getByTestId('title');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('H3');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLHeadingElement>();
      render(<Card.Title ref={ref}>Title</Card.Title>);
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    });

    it('forwards className and style', () => {
      render(
        <Card.Title data-testid="title" className="custom" style={{ color: 'rgb(255, 0, 0)' }}>
          Title
        </Card.Title>,
      );
      const el = screen.getByTestId('title');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });

    it('spreads HTML attributes', () => {
      render(
        <Card.Title data-testid="title" id="card-title">
          Title
        </Card.Title>,
      );
      expect(screen.getByTestId('title')).toHaveAttribute('id', 'card-title');
    });
  });

  // === Card.Description ===
  describe('Card.Description', () => {
    it('renders as a p element', () => {
      render(<Card.Description data-testid="desc">Description</Card.Description>);
      const el = screen.getByTestId('desc');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('DIV');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Card.Description ref={ref}>Description</Card.Description>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className and style', () => {
      render(
        <Card.Description data-testid="desc" className="custom" style={{ fontSize: '12px' }}>
          Description
        </Card.Description>,
      );
      const el = screen.getByTestId('desc');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ fontSize: '12px' });
    });
  });

  // === Card.Body ===
  describe('Card.Body', () => {
    it('renders as a div element', () => {
      render(<Card.Body data-testid="body">Body</Card.Body>);
      const el = screen.getByTestId('body');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('DIV');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Card.Body ref={ref}>Body</Card.Body>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className and style', () => {
      render(
        <Card.Body data-testid="body" className="custom" style={{ padding: '16px' }}>
          Body
        </Card.Body>,
      );
      const el = screen.getByTestId('body');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ padding: '16px' });
    });
  });

  // === Card.Footer ===
  describe('Card.Footer', () => {
    it('renders as a div element', () => {
      render(<Card.Footer data-testid="footer">Footer</Card.Footer>);
      const el = screen.getByTestId('footer');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('DIV');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Card.Footer ref={ref}>Footer</Card.Footer>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className and style', () => {
      render(
        <Card.Footer data-testid="footer" className="custom" style={{ padding: '20px' }}>
          Footer
        </Card.Footer>,
      );
      const el = screen.getByTestId('footer');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ padding: '20px' });
    });
  });

  // === Card.FooterStart ===
  describe('Card.FooterStart', () => {
    it('renders as a div element', () => {
      render(<Card.FooterStart data-testid="footer-start">Start</Card.FooterStart>);
      const el = screen.getByTestId('footer-start');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('DIV');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Card.FooterStart ref={ref}>Start</Card.FooterStart>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className and style', () => {
      render(
        <Card.FooterStart data-testid="fs" className="custom" style={{ gap: '4px' }}>
          Start
        </Card.FooterStart>,
      );
      const el = screen.getByTestId('fs');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ gap: '4px' });
    });
  });

  // === Card.FooterEnd ===
  describe('Card.FooterEnd', () => {
    it('renders as a div element', () => {
      render(<Card.FooterEnd data-testid="footer-end">End</Card.FooterEnd>);
      const el = screen.getByTestId('footer-end');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('DIV');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Card.FooterEnd ref={ref}>End</Card.FooterEnd>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className and style', () => {
      render(
        <Card.FooterEnd data-testid="fe" className="custom" style={{ marginLeft: 'auto' }}>
          End
        </Card.FooterEnd>,
      );
      const el = screen.getByTestId('fe');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ marginLeft: 'auto' });
    });
  });

  // === Composition ===
  describe('composition', () => {
    it('renders full card composition', () => {
      render(
        <Card.Root data-testid="card">
          <Card.Header data-testid="header">
            <Card.Title data-testid="title">My Card</Card.Title>
            <Card.Description data-testid="desc">A description</Card.Description>
          </Card.Header>
          <Card.Body data-testid="body">Body content</Card.Body>
          <Card.Footer data-testid="footer">
            <Card.FooterStart data-testid="fs">Left</Card.FooterStart>
            <Card.FooterEnd data-testid="fe">Right</Card.FooterEnd>
          </Card.Footer>
        </Card.Root>,
      );

      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByText('My Card')).toBeInTheDocument();
      expect(screen.getByText('A description')).toBeInTheDocument();
      expect(screen.getByText('Body content')).toBeInTheDocument();
      expect(screen.getByText('Left')).toBeInTheDocument();
      expect(screen.getByText('Right')).toBeInTheDocument();
    });

    it('sub-components can be used individually', () => {
      render(<Card.Body data-testid="standalone-body">Standalone</Card.Body>);
      expect(screen.getByTestId('standalone-body')).toBeInTheDocument();
      expect(screen.getByText('Standalone')).toBeInTheDocument();
    });
  });
});
