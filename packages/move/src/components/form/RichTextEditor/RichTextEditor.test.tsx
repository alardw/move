// Generated from RichTextEditor.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { RichTextEditor } from './RichTextEditor';

describe('RichTextEditor', () => {
  // === Root ===
  describe('Root', () => {
    it('renders root element', () => {
      const { container } = render(
        <RichTextEditor.Root>
          <RichTextEditor.Content>content</RichTextEditor.Content>
        </RichTextEditor.Root>
      );
      expect(container.firstElementChild).toBeInTheDocument();
    });

    it('defaults to data-variant=outline', () => {
      const { container } = render(
        <RichTextEditor.Root><div /></RichTextEditor.Root>
      );
      expect(container.firstElementChild).toHaveAttribute('data-variant', 'outline');
    });

    it('defaults to data-size=md', () => {
      const { container } = render(
        <RichTextEditor.Root><div /></RichTextEditor.Root>
      );
      expect(container.firstElementChild).toHaveAttribute('data-size', 'md');
    });

    it('applies custom variant', () => {
      const { container } = render(
        <RichTextEditor.Root variant="subtle"><div /></RichTextEditor.Root>
      );
      expect(container.firstElementChild).toHaveAttribute('data-variant', 'subtle');
    });

    it('applies custom size', () => {
      const { container } = render(
        <RichTextEditor.Root size="lg"><div /></RichTextEditor.Root>
      );
      expect(container.firstElementChild).toHaveAttribute('data-size', 'lg');
    });

    it('forwards className', () => {
      const { container } = render(
        <RichTextEditor.Root className="custom"><div /></RichTextEditor.Root>
      );
      expect(container.firstElementChild?.className).toContain('custom');
    });

    it('forwards style', () => {
      const { container } = render(
        <RichTextEditor.Root style={{ margin: '10px' }}><div /></RichTextEditor.Root>
      );
      expect(container.firstElementChild).toHaveStyle({ margin: '10px' });
    });
  });

  // === Toolbar ===
  describe('Toolbar', () => {
    it('renders with role=toolbar', () => {
      render(
        <RichTextEditor.Root>
          <RichTextEditor.Toolbar>
            <RichTextEditor.Control>B</RichTextEditor.Control>
          </RichTextEditor.Toolbar>
        </RichTextEditor.Root>
      );
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });

    it('has default aria-label "Text formatting"', () => {
      render(
        <RichTextEditor.Root>
          <RichTextEditor.Toolbar>
            <RichTextEditor.Control>B</RichTextEditor.Control>
          </RichTextEditor.Toolbar>
        </RichTextEditor.Root>
      );
      expect(screen.getByRole('toolbar')).toHaveAttribute('aria-label', 'Text formatting');
    });

    it('applies custom aria-label via labels.toolbar', () => {
      render(
        <RichTextEditor.Root>
          <RichTextEditor.Toolbar labels={{ toolbar: 'Custom label' }}>
            <RichTextEditor.Control>B</RichTextEditor.Control>
          </RichTextEditor.Toolbar>
        </RichTextEditor.Root>
      );
      expect(screen.getByRole('toolbar')).toHaveAttribute('aria-label', 'Custom label');
    });

    it('sets data-sticky when sticky=true', () => {
      render(
        <RichTextEditor.Root>
          <RichTextEditor.Toolbar sticky>
            <RichTextEditor.Control>B</RichTextEditor.Control>
          </RichTextEditor.Toolbar>
        </RichTextEditor.Root>
      );
      expect(screen.getByRole('toolbar')).toHaveAttribute('data-sticky');
    });

    it('forwards className', () => {
      render(
        <RichTextEditor.Root>
          <RichTextEditor.Toolbar className="tb-custom">
            <RichTextEditor.Control>B</RichTextEditor.Control>
          </RichTextEditor.Toolbar>
        </RichTextEditor.Root>
      );
      expect(screen.getByRole('toolbar').className).toContain('tb-custom');
    });
  });

  // === ControlGroup ===
  describe('ControlGroup', () => {
    it('renders with role=group', () => {
      render(
        <RichTextEditor.Root>
          <RichTextEditor.Toolbar>
            <RichTextEditor.ControlGroup>
              <RichTextEditor.Control>B</RichTextEditor.Control>
            </RichTextEditor.ControlGroup>
          </RichTextEditor.Toolbar>
        </RichTextEditor.Root>
      );
      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('forwards className', () => {
      render(
        <RichTextEditor.Root>
          <RichTextEditor.Toolbar>
            <RichTextEditor.ControlGroup className="cg-custom">
              <RichTextEditor.Control>B</RichTextEditor.Control>
            </RichTextEditor.ControlGroup>
          </RichTextEditor.Toolbar>
        </RichTextEditor.Root>
      );
      expect(screen.getByRole('group').className).toContain('cg-custom');
    });
  });

  // === Control ===
  describe('Control', () => {
    it('renders as button type=button', () => {
      render(
        <RichTextEditor.Root>
          <RichTextEditor.Toolbar>
            <RichTextEditor.Control>Bold</RichTextEditor.Control>
          </RichTextEditor.Toolbar>
        </RichTextEditor.Root>
      );
      const btn = screen.getByRole('button', { name: 'Bold' });
      expect(btn).toHaveAttribute('type', 'button');
    });

    it('toggles active state on click', async () => {
      const user = userEvent.setup();
      render(
        <RichTextEditor.Root>
          <RichTextEditor.Toolbar>
            <RichTextEditor.Control defaultActive={false}>B</RichTextEditor.Control>
          </RichTextEditor.Toolbar>
        </RichTextEditor.Root>
      );
      const btn = screen.getByRole('button', { name: 'B' });
      expect(btn).not.toHaveAttribute('data-active');
      await user.click(btn);
      expect(btn).toHaveAttribute('data-active');
    });

    it('respects controlled active prop', () => {
      render(
        <RichTextEditor.Root>
          <RichTextEditor.Toolbar>
            <RichTextEditor.Control active={true}>B</RichTextEditor.Control>
          </RichTextEditor.Toolbar>
        </RichTextEditor.Root>
      );
      expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('data-active');
    });

    it('fires onActiveChange when toggled', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <RichTextEditor.Root>
          <RichTextEditor.Toolbar>
            <RichTextEditor.Control defaultActive={false} onActiveChange={onChange}>B</RichTextEditor.Control>
          </RichTextEditor.Toolbar>
        </RichTextEditor.Root>
      );
      await user.click(screen.getByRole('button', { name: 'B' }));
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('does not toggle when disabled', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <RichTextEditor.Root>
          <RichTextEditor.Toolbar>
            <RichTextEditor.Control disabled onActiveChange={onChange}>B</RichTextEditor.Control>
          </RichTextEditor.Toolbar>
        </RichTextEditor.Root>
      );
      await user.click(screen.getByRole('button', { name: 'B' }));
      expect(onChange).not.toHaveBeenCalled();
    });

    it('forwards className', () => {
      render(
        <RichTextEditor.Root>
          <RichTextEditor.Toolbar>
            <RichTextEditor.Control className="ctrl-custom">B</RichTextEditor.Control>
          </RichTextEditor.Toolbar>
        </RichTextEditor.Root>
      );
      expect(screen.getByRole('button', { name: 'B' }).className).toContain('ctrl-custom');
    });
  });

  // === Separator ===
  describe('Separator', () => {
    it('renders with role=separator', () => {
      render(
        <RichTextEditor.Root>
          <RichTextEditor.Toolbar>
            <RichTextEditor.Separator />
          </RichTextEditor.Toolbar>
        </RichTextEditor.Root>
      );
      expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('has aria-orientation=vertical', () => {
      render(
        <RichTextEditor.Root>
          <RichTextEditor.Toolbar>
            <RichTextEditor.Separator />
          </RichTextEditor.Toolbar>
        </RichTextEditor.Root>
      );
      expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
    });
  });

  // === Content ===
  describe('Content', () => {
    it('renders children', () => {
      render(
        <RichTextEditor.Root>
          <RichTextEditor.Content>
            <p>Hello editor</p>
          </RichTextEditor.Content>
        </RichTextEditor.Root>
      );
      expect(screen.getByText('Hello editor')).toBeInTheDocument();
    });

    it('applies minHeight as inline style', () => {
      const { container } = render(
        <RichTextEditor.Root>
          <RichTextEditor.Content minHeight="300px">
            <p>content</p>
          </RichTextEditor.Content>
        </RichTextEditor.Root>
      );
      // Content is the second child of root (after potential toolbar)
      const contentEl = container.querySelector('[class*="content"]') as HTMLElement;
      expect(contentEl).toHaveStyle({ minHeight: '300px' });
    });

    it('forwards className', () => {
      const { container } = render(
        <RichTextEditor.Root>
          <RichTextEditor.Content className="cnt-custom">
            <p>content</p>
          </RichTextEditor.Content>
        </RichTextEditor.Root>
      );
      const contentEl = container.querySelector('[class*="content"]') as HTMLElement;
      expect(contentEl.className).toContain('cnt-custom');
    });
  });
});
