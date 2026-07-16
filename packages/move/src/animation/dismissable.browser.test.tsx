import { render, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import { Select } from '../components/forms/Select/Select';
import { Dropdown } from '../components/overlays/Dropdown/Dropdown';
import { Popover } from '../components/overlays/Popover/Popover';
import { Dialog } from '../components/overlays/Dialog/Dialog';
import { Drawer } from '../components/overlays/Drawer/Drawer';

// Real-browser dismissable invariant, shared across every popup migrated onto
// useDismissable. jsdom resolves the exit instantly and can't catch the
// "opens once, then nothing happens" lock — this runs the real exit animation.

afterEach(cleanup);

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
async function waitFor(fn: () => boolean, timeout = 2000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (fn()) return true;
    await sleep(40);
  }
  return fn();
}
// Radix Select/DropdownMenu open on pointerdown, Dialog/Popover on click — fire
// the full sequence so one helper opens them all.
const press = (el: HTMLElement) => {
  el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
  el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0 }));
  el.click();
};
const escape = () =>
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
const byText = (t: string) =>
  [...document.querySelectorAll('button')].find((b) => b.textContent?.trim() === t) as HTMLElement;

interface Case {
  name: string;
  node: React.ReactNode;
  trigger: () => HTMLElement | null | undefined;
  open: () => boolean;
}

const CASES: Case[] = [
  {
    name: 'Select',
    node: (
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="Pick" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content>
          <Select.Viewport>
            <Select.Item value="a">Apple</Select.Item>
            <Select.Item value="b">Banana</Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Root>
    ),
    // Move's Select is built on Radix Select: button trigger, role="option" items.
    trigger: () =>
      ([...document.querySelectorAll('button')].find((b) => b.textContent?.includes('Pick')) ??
        document.querySelector('button')) as HTMLElement,
    open: () => !!document.querySelector('[role="option"]'),
  },
  {
    name: 'Dropdown',
    node: (
      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <button>Open</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>One</Dropdown.Item>
          <Dropdown.Item>Two</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    ),
    trigger: () => byText('Open'),
    open: () => !!document.querySelector('[role="menuitem"]'),
  },
  {
    name: 'Popover',
    node: (
      <Popover.Root>
        <Popover.Trigger asChild>
          <button>Open</button>
        </Popover.Trigger>
        <Popover.Content>Popover body</Popover.Content>
      </Popover.Root>
    ),
    trigger: () => byText('Open'),
    open: () =>
      !![...document.querySelectorAll('*')].find(
        (e) => e.textContent === 'Popover body' && e.children.length === 0,
      ),
  },
  {
    name: 'Dialog',
    node: (
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Title</Dialog.Title>
            </Dialog.Header>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    ),
    trigger: () => byText('Open'),
    open: () => !!document.querySelector('[role="dialog"]'),
  },
  {
    name: 'Drawer',
    node: (
      <Drawer.Root>
        <Drawer.Trigger asChild>
          <button>Open</button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Settings</Drawer.Title>
          </Drawer.Header>
        </Drawer.Content>
      </Drawer.Root>
    ),
    trigger: () => byText('Open'),
    open: () => !!document.querySelector('[role="dialog"]'),
  },
];

describe.each(CASES)('$name — dismissable (real browser)', (c) => {
  it('INVARIANT: reopens after a full close (no lock)', async () => {
    render(c.node as React.ReactElement);
    press(c.trigger()!);
    expect(await waitFor(c.open)).toBe(true);

    escape();
    expect(await waitFor(() => !c.open())).toBe(true);

    press(c.trigger()!);
    expect(await waitFor(c.open)).toBe(true);
  });
});
