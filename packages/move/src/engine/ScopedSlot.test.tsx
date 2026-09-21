import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Tooltip } from '../components/overlays/Tooltip/Tooltip';
import { Dropdown } from '../components/overlays/Dropdown/Dropdown';
import { Popover } from '../components/overlays/Popover/Popover';
import { ToggleGroup } from '../components/actions/ToggleGroup/ToggleGroup';
import { Collapsible } from '../components/disclosure/Collapsible/Collapsible';

/**
 * A guest arriving on a host's element keeps its hands off `data-state`.
 *
 * `asChild` merges two components onto one DOM node, and every Radix primitive
 * writes that same key. Whoever wrote last used to win, which meant wrapping a
 * ToggleGroup item in a tooltip left the selected segment reading 'closed' —
 * so the eight CSS rules keyed on 'on' matched nothing and it rendered as if
 * nothing was chosen. Silent: aria-checked stayed correct the whole time.
 */
const selected = () => screen.getByRole('radio', { name: 'A' });

describe('ScopedSlot', () => {
  it('leaves the host its data-state — tooltip', () => {
    render(
      <ToggleGroup.Root defaultValue="a">
        <Tooltip label="Large thumbnails">
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        </Tooltip>
      </ToggleGroup.Root>,
    );
    expect(selected()).toHaveAttribute('data-state', 'on');
  });

  it('keeps its own state under its own name', () => {
    render(
      <ToggleGroup.Root defaultValue="a">
        <Tooltip label="Large thumbnails">
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        </Tooltip>
      </ToggleGroup.Root>,
    );
    expect(selected()).toHaveAttribute('data-move-tooltip-state', 'closed');
  });

  it('leaves the host its data-state — dropdown', () => {
    render(
      <ToggleGroup.Root defaultValue="a">
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <ToggleGroup.Item value="a">A</ToggleGroup.Item>
          </Dropdown.Trigger>
        </Dropdown.Root>
      </ToggleGroup.Root>,
    );
    expect(selected()).toHaveAttribute('data-state', 'on');
  });

  it('leaves the host its data-state — popover', () => {
    render(
      <ToggleGroup.Root defaultValue="a">
        <Popover.Root>
          <Popover.Trigger asChild>
            <ToggleGroup.Item value="a">A</ToggleGroup.Item>
          </Popover.Trigger>
        </Popover.Root>
      </ToggleGroup.Root>,
    );
    expect(selected()).toHaveAttribute('data-state', 'on');
  });

  it('stacks two guests on one host without either losing its state', () => {
    render(
      <ToggleGroup.Root defaultValue="a">
        <Popover.Root>
          <Popover.Trigger asChild>
            <Tooltip label="Large thumbnails">
              <ToggleGroup.Item value="a">A</ToggleGroup.Item>
            </Tooltip>
          </Popover.Trigger>
        </Popover.Root>
      </ToggleGroup.Root>,
    );
    const el = selected();
    expect(el).toHaveAttribute('data-state', 'on');
    expect(el).toHaveAttribute('data-move-tooltip-state', 'closed');
    expect(el).toHaveAttribute('data-move-popover-state', 'closed');
  });

  it('names every component that built the element, innermost first', () => {
    render(
      <ToggleGroup.Root defaultValue="a">
        <Popover.Root>
          <Popover.Trigger asChild>
            <Tooltip label="Large thumbnails">
              <ToggleGroup.Item value="a">A</ToggleGroup.Item>
            </Tooltip>
          </Popover.Trigger>
        </Popover.Root>
      </ToggleGroup.Root>,
    );
    expect(selected().getAttribute('data-move')).toBe(
      'ToggleGroupItem TooltipTrigger PopoverTrigger',
    );
  });

  it('keeps the plain key when the trigger owns its own element', () => {
    render(
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger>Details</Collapsible.Trigger>
        <Collapsible.Content>Body</Collapsible.Content>
      </Collapsible.Root>,
    );
    expect(screen.getByRole('button', { name: 'Details' })).toHaveAttribute('data-state', 'open');
  });

  it('scopes it when the same trigger is a guest', () => {
    render(
      <ToggleGroup.Root defaultValue="a">
        <Collapsible.Root defaultOpen>
          <Collapsible.Trigger asChild>
            <ToggleGroup.Item value="a">A</ToggleGroup.Item>
          </Collapsible.Trigger>
        </Collapsible.Root>
      </ToggleGroup.Root>,
    );
    const el = selected();
    expect(el).toHaveAttribute('data-state', 'on');
    expect(el).toHaveAttribute('data-move-collapsible-state', 'open');
  });
});
