import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TableOfContents } from './TableOfContents';

describe('TableOfContents', () => {
  it('renders a nav landmark', () => {
    render(
      <TableOfContents.Root>
        <TableOfContents.Item href="#a">A</TableOfContents.Item>
      </TableOfContents.Root>,
    );
    const nav = screen.getByRole('navigation', { name: 'On this page' });
    expect(nav).toBeInTheDocument();
  });

  it('renders items as anchors with correct hrefs', () => {
    render(
      <TableOfContents.Root>
        <TableOfContents.Item href="#a">Item A</TableOfContents.Item>
        <TableOfContents.Item href="#b" depth={2}>
          Item B
        </TableOfContents.Item>
      </TableOfContents.Root>,
    );
    const a = screen.getByRole('link', { name: 'Item A' });
    const b = screen.getByRole('link', { name: 'Item B' });
    expect(a).toHaveAttribute('href', '#a');
    expect(b).toHaveAttribute('href', '#b');
    expect(b).toHaveAttribute('data-depth', '2');
  });

  it('throws when Item is used outside Root', () => {
    // The context guard throws synchronously during render, so render() rethrows
    // it — no error boundary needed (a try/catch in a component body wouldn't
    // catch a child's render error anyway).
    expect(() => {
      render(<TableOfContents.Item href="#x">X</TableOfContents.Item>);
    }).toThrow(/TableOfContents.Item must be used within TableOfContents.Root/);
  });
});
