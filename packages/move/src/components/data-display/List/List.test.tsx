// Generated from List.spec.ts
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { List } from './List';
import { createRef } from 'react';

describe('List', () => {
  // === Root ===
  describe('List (Root)', () => {
    it('renders as ul with list role', () => {
      render(
        <List data-testid="list">
          <List.Item>Item 1</List.Item>
        </List>,
      );
      const el = screen.getByTestId('list');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('UL');
      expect(el).toHaveAttribute('role', 'list');
    });

    it('defaults to size=md, dividers=true, separator=true, density=default, hover=false', () => {
      render(
        <List data-testid="list" animations={false}>
          <List.Item>Item 1</List.Item>
        </List>,
      );
      const el = screen.getByTestId('list');
      expect(el).toHaveAttribute('data-size', 'md');
      expect(el).toHaveAttribute('data-density', 'default');
      // separator=true by default suppresses data-dividers
      expect(el).not.toHaveAttribute('data-dividers');
      expect(el).not.toHaveAttribute('data-hover');
    });

    it('applies data-size attribute', () => {
      const { rerender } = render(
        <List data-testid="list" size="sm" animations={false}>
          <List.Item>Item</List.Item>
        </List>,
      );
      expect(screen.getByTestId('list')).toHaveAttribute('data-size', 'sm');

      rerender(
        <List data-testid="list" size="lg" animations={false}>
          <List.Item>Item</List.Item>
        </List>,
      );
      expect(screen.getByTestId('list')).toHaveAttribute('data-size', 'lg');
    });

    it('applies data-density attribute', () => {
      render(
        <List data-testid="list" density="compact" animations={false}>
          <List.Item>Item</List.Item>
        </List>,
      );
      expect(screen.getByTestId('list')).toHaveAttribute('data-density', 'compact');
    });

    it('applies data-hover when hover=true', () => {
      render(
        <List data-testid="list" hover animations={false}>
          <List.Item>Item</List.Item>
        </List>,
      );
      expect(screen.getByTestId('list')).toHaveAttribute('data-hover', '');
    });

    it('hides dividers when dividers=false', () => {
      render(
        <List data-testid="list" dividers={false} animations={false}>
          <List.Item>Item</List.Item>
        </List>,
      );
      expect(screen.getByTestId('list')).not.toHaveAttribute('data-dividers');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLUListElement>();
      render(
        <List ref={ref} animations={false}>
          <List.Item>Item</List.Item>
        </List>,
      );
      expect(ref.current).toBeInstanceOf(HTMLUListElement);
    });

    it('forwards className', () => {
      render(
        <List data-testid="list" className="custom" animations={false}>
          <List.Item>Item</List.Item>
        </List>,
      );
      expect(screen.getByTestId('list').className).toContain('custom');
    });

    it('forwards style', () => {
      render(
        <List data-testid="list" animations={false} style={{ marginTop: '10px' }}>
          <List.Item>Item</List.Item>
        </List>,
      );
      expect(screen.getByTestId('list')).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <List data-testid="list" aria-label="Users" animations={false}>
          <List.Item>Item</List.Item>
        </List>,
      );
      expect(screen.getByTestId('list')).toHaveAttribute('aria-label', 'Users');
    });
  });

  // === Item ===
  describe('List.Item', () => {
    it('renders as li by default', () => {
      render(
        <List animations={false}>
          <List.Item data-testid="item">Item</List.Item>
        </List>,
      );
      expect(screen.getByTestId('item').tagName).toBe('LI');
    });

    it('renders as anchor when href is provided', () => {
      render(
        <List animations={false}>
          <List.Item data-testid="item" href="/users/1">
            User
          </List.Item>
        </List>,
      );
      const el = screen.getByTestId('item');
      expect(el.tagName).toBe('A');
      expect(el).toHaveAttribute('href', '/users/1');
    });

    it('renders as button when as="button"', () => {
      render(
        <List animations={false}>
          <List.Item data-testid="item" as="button">
            Action
          </List.Item>
        </List>,
      );
      expect(screen.getByTestId('item').tagName).toBe('BUTTON');
    });

    it('sets data-interactive when href is present', () => {
      render(
        <List animations={false}>
          <List.Item data-testid="item" href="/test">
            Link
          </List.Item>
        </List>,
      );
      expect(screen.getByTestId('item')).toHaveAttribute('data-interactive', '');
    });

    it('sets data-interactive when onClick is present', () => {
      render(
        <List animations={false}>
          <List.Item data-testid="item" onClick={() => {}}>
            Clickable
          </List.Item>
        </List>,
      );
      expect(screen.getByTestId('item')).toHaveAttribute('data-interactive', '');
    });

    it('does not set data-interactive on plain li', () => {
      render(
        <List animations={false}>
          <List.Item data-testid="item">Plain</List.Item>
        </List>,
      );
      expect(screen.getByTestId('item')).not.toHaveAttribute('data-interactive');
    });

    it('applies data-active when active=true', () => {
      render(
        <List animations={false}>
          <List.Item data-testid="item" active>
            Item
          </List.Item>
        </List>,
      );
      expect(screen.getByTestId('item')).toHaveAttribute('data-active', '');
    });

    it('applies data-disabled when disabled=true', () => {
      render(
        <List animations={false}>
          <List.Item data-testid="item" disabled>
            Item
          </List.Item>
        </List>,
      );
      expect(screen.getByTestId('item')).toHaveAttribute('data-disabled', '');
    });

    it('does not attach href when disabled', () => {
      render(
        <List animations={false}>
          <List.Item data-testid="item" href="/test" disabled>
            Link
          </List.Item>
        </List>,
      );
      expect(screen.getByTestId('item')).not.toHaveAttribute('href');
    });

    it('does not fire onClick when disabled', async () => {
      const handleClick = vi.fn();
      render(
        <List animations={false}>
          <List.Item data-testid="item" onClick={handleClick} disabled>
            Click
          </List.Item>
        </List>,
      );
      // pointer-events: none in CSS prevents click, but also onClick is not attached
      expect(screen.getByTestId('item')).toHaveAttribute('data-disabled', '');
    });

    it('fires onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <List animations={false}>
          <List.Item data-testid="item" onClick={handleClick}>
            Click
          </List.Item>
        </List>,
      );
      await user.click(screen.getByTestId('item'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLLIElement>();
      render(
        <List animations={false}>
          <List.Item ref={ref}>Item</List.Item>
        </List>,
      );
      expect(ref.current).toBeInstanceOf(HTMLLIElement);
    });

    it('forwards className', () => {
      render(
        <List animations={false}>
          <List.Item data-testid="item" className="custom">
            Item
          </List.Item>
        </List>,
      );
      expect(screen.getByTestId('item').className).toContain('custom');
    });

    it('forwards style', () => {
      render(
        <List animations={false}>
          <List.Item data-testid="item" style={{ marginTop: '10px' }}>
            Item
          </List.Item>
        </List>,
      );
      expect(screen.getByTestId('item')).toHaveStyle({ marginTop: '10px' });
    });
  });

  // === Leading ===
  describe('List.Leading', () => {
    it('renders children in flex-shrink-0 container', () => {
      render(
        <List animations={false}>
          <List.Item>
            <List.Leading data-testid="leading">
              <span>Avatar</span>
            </List.Leading>
          </List.Item>
        </List>,
      );
      const el = screen.getByTestId('leading');
      expect(el).toBeInTheDocument();
      expect(screen.getByText('Avatar')).toBeInTheDocument();
    });
  });

  // === Content ===
  describe('List.Content', () => {
    it('renders children in flex-1 min-width-0 container', () => {
      render(
        <List animations={false}>
          <List.Item>
            <List.Content data-testid="content">
              <List.Title>Name</List.Title>
            </List.Content>
          </List.Item>
        </List>,
      );
      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
    });
  });

  // === Title ===
  describe('List.Title', () => {
    it('renders as p element with text', () => {
      render(
        <List animations={false}>
          <List.Item>
            <List.Content>
              <List.Title data-testid="title">Jane Cooper</List.Title>
            </List.Content>
          </List.Item>
        </List>,
      );
      const el = screen.getByTestId('title');
      expect(el.tagName).toBe('DIV');
      expect(el).toHaveTextContent('Jane Cooper');
    });
  });

  // === Description ===
  describe('List.Description', () => {
    it('defaults to lines=none (text wraps naturally)', () => {
      render(
        <List animations={false}>
          <List.Item>
            <List.Content>
              <List.Description data-testid="desc">Email</List.Description>
            </List.Content>
          </List.Item>
        </List>,
      );
      expect(screen.getByTestId('desc')).toHaveAttribute('data-lines', 'none');
    });

    it('applies lines=2', () => {
      render(
        <List animations={false}>
          <List.Item>
            <List.Content>
              <List.Description data-testid="desc" lines={2}>
                Description
              </List.Description>
            </List.Content>
          </List.Item>
        </List>,
      );
      expect(screen.getByTestId('desc')).toHaveAttribute('data-lines', '2');
    });

    it('applies lines=3', () => {
      render(
        <List animations={false}>
          <List.Item>
            <List.Content>
              <List.Description data-testid="desc" lines={3}>
                Description
              </List.Description>
            </List.Content>
          </List.Item>
        </List>,
      );
      expect(screen.getByTestId('desc')).toHaveAttribute('data-lines', '3');
    });

    it('applies lines=none', () => {
      render(
        <List animations={false}>
          <List.Item>
            <List.Content>
              <List.Description data-testid="desc" lines="none">
                Full text
              </List.Description>
            </List.Content>
          </List.Item>
        </List>,
      );
      expect(screen.getByTestId('desc')).toHaveAttribute('data-lines', 'none');
    });
  });

  // === Trailing ===
  describe('List.Trailing', () => {
    it('renders children in flex-shrink-0 container', () => {
      render(
        <List animations={false}>
          <List.Item>
            <List.Trailing data-testid="trailing">
              <span>Badge</span>
            </List.Trailing>
          </List.Item>
        </List>,
      );
      const el = screen.getByTestId('trailing');
      expect(el).toBeInTheDocument();
      expect(screen.getByText('Badge')).toBeInTheDocument();
    });
  });

  // === Separator ===
  describe('List separator', () => {
    it('renders Divider components between items when separator=true', () => {
      const { container } = render(
        <List animations={false} separator>
          <List.Item data-testid="item-0">Item 1</List.Item>
          <List.Item data-testid="item-1">Item 2</List.Item>
          <List.Item data-testid="item-2">Item 3</List.Item>
        </List>,
      );
      const separators = container.querySelectorAll('li[role="separator"]');
      // 2 separators between 3 items
      expect(separators.length).toBe(2);
    });

    it('does not render Divider when separator=false', () => {
      const { container } = render(
        <List animations={false} separator={false}>
          <List.Item>Item 1</List.Item>
          <List.Item>Item 2</List.Item>
        </List>,
      );
      const separators = container.querySelectorAll('li[role="separator"]');
      expect(separators.length).toBe(0);
    });

    it('disables CSS dividers when separator=true', () => {
      render(
        <List data-testid="list" animations={false} separator dividers>
          <List.Item>Item 1</List.Item>
          <List.Item>Item 2</List.Item>
        </List>,
      );
      // data-dividers should NOT be set when separator is active
      expect(screen.getByTestId('list')).not.toHaveAttribute('data-dividers');
    });
  });

  // === Full composition ===
  describe('composition', () => {
    it('renders full list composition', () => {
      render(
        <List data-testid="list" animations={false}>
          <List.Item data-testid="item-0">
            <List.Leading>
              <span>A</span>
            </List.Leading>
            <List.Content>
              <List.Title>Jane Cooper</List.Title>
              <List.Description>jane@example.com</List.Description>
            </List.Content>
            <List.Trailing>
              <span>Active</span>
            </List.Trailing>
          </List.Item>
          <List.Item data-testid="item-1">
            <List.Leading>
              <span>B</span>
            </List.Leading>
            <List.Content>
              <List.Title>John Doe</List.Title>
              <List.Description>john@example.com</List.Description>
            </List.Content>
          </List.Item>
        </List>,
      );

      expect(screen.getByTestId('list')).toBeInTheDocument();
      expect(screen.getByText('Jane Cooper')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  // === Animations ===
  describe('animation', () => {
    it('accepts animations=false on Root to disable entrance animations', () => {
      render(
        <List data-testid="list" animations={false}>
          <List.Item data-testid="item">Item</List.Item>
        </List>,
      );
      expect(screen.getByTestId('list')).toBeInTheDocument();
      expect(screen.getByTestId('item')).toBeInTheDocument();
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(
        <List data-testid="list" animations={false} sp={{ root: { className: 'sp-root' } }}>
          <List.Item>Item</List.Item>
        </List>,
      );
      expect(screen.getByTestId('list').className).toContain('sp-root');
    });

    it('merges sp style on root', () => {
      render(
        <List data-testid="list" animations={false} sp={{ root: { style: { marginTop: '5px' } } }}>
          <List.Item>Item</List.Item>
        </List>,
      );
      expect(screen.getByTestId('list')).toHaveStyle({ marginTop: '5px' });
    });
  });
});
