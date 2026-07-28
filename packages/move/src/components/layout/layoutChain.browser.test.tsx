import { render, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, it, expect } from 'vitest';
import { Stack } from './Stack';
import { Splitter } from './Splitter';
import { ScrollArea } from './ScrollArea';

// The layout constraint chain (see /systems/layout).
//
// A scroll region needs an unbroken chain of definite height from the ceiling
// down. Each level converts "my parent has a definite height" into "so do I";
// `fill="remaining"` is what stops that conversion running backwards, by waiving
// the automatic minimum size that would otherwise floor a flex item at its
// content height and hand the WRONG height to everything below.
//
// jsdom has no layout, so this is the only place the chain is observable. The
// failure it guards is silent: no error, no scrollbar, just content clipped
// somewhere off-screen and unreachable.

const FRAME = 400;
const CONTENT = 2000;

let host: HTMLDivElement;

beforeEach(() => {
  // Stands in for a sized mount node (#root) under a fullHeight MoveRoot.
  host = document.createElement('div');
  host.style.cssText = `height:${FRAME}px;overflow:clip;display:flex;flex-direction:column`;
  document.body.appendChild(host);
});

afterEach(() => {
  cleanup();
  host.remove();
});

const h = (el: Element) => Math.round(el.getBoundingClientRect().height);
const scrolls = (el: Element) => el.scrollHeight > el.clientHeight + 1;
const tall = <div style={{ height: CONTENT }} />;

describe('layout chain — deep nesting (real browser)', () => {
  it('INVARIANT: height reaches a ScrollArea nested under Splitter and Stacks', () => {
    const { container } = render(
      <Stack fill="remaining" gap="none">
        <Stack fill="remaining" gap="none">
          <Splitter.Root fill="remaining">
            <Splitter.Panel>
              {/* Splitter.Panel is display:block with a definite height, so its
                  child uses fill="parent" — `remaining` has no flex parent to act
                  on here. This is exactly why both values exist. */}
              <Stack fill="parent" gap="none">
                <ScrollArea.Root fill="remaining">
                  <ScrollArea.Content>{tall}</ScrollArea.Content>
                </ScrollArea.Root>
              </Stack>
            </Splitter.Panel>
          </Splitter.Root>
        </Stack>
      </Stack>,
      { container: host },
    );

    const content = container.querySelector('[class*="content"]')!;

    // Every level OF THE CHAIN fits the frame. Move's own boxes carry a generated
    // class; the unclassed 2000px child is the scrolled content and is meant to
    // exceed it — that's the point of a scrollport.
    const chain = [...container.querySelectorAll('div')].filter((el) => el.className);
    expect(chain.length).toBeGreaterThanOrEqual(5); // Stack, Stack, Splitter, Panel, ScrollArea…
    // Named in the failure message, because "which level broke" is the whole
    // diagnostic — the symptom is identical wherever the chain snaps.
    const tooTall = chain.filter((el) => h(el) > FRAME).map((el) => `${el.className}=${h(el)}`);
    expect(tooTall, `levels exceeding the frame: ${tooTall.join(', ') || 'none'}`).toEqual([]);
    // …and the innermost region is the one that scrolls.
    expect(h(content)).toBe(FRAME);
    expect(scrolls(content)).toBe(true);
  });

  it('INVARIANT: flex={1} alone does NOT carry the chain — fill="remaining" is load-bearing', () => {
    const { container } = render(
      <Stack flex={1} gap="none">
        <ScrollArea.Root>
          <ScrollArea.Content>{tall}</ScrollArea.Content>
        </ScrollArea.Root>
      </Stack>,
      { container: host },
    );
    const content = container.querySelector('[class*="content"]')!;
    // flex:1 without the minimum waiver is floored at its content height, so the
    // scroll region never becomes a scrollport. This is the bug, pinned.
    expect(h(content)).toBeGreaterThan(FRAME);
    expect(scrolls(content)).toBe(false);
  });

  it('INVARIANT: a ScrollArea header and footer keep their height; only Content scrolls', () => {
    const { container } = render(
      <Stack fill="remaining" gap="none">
        <ScrollArea.Root fill="remaining">
          <ScrollArea.Header>
            <div style={{ height: 40 }} />
          </ScrollArea.Header>
          <ScrollArea.Content>{tall}</ScrollArea.Content>
          <ScrollArea.Footer>
            <div style={{ height: 30 }} />
          </ScrollArea.Footer>
        </ScrollArea.Root>
      </Stack>,
      { container: host },
    );

    const header = container.querySelector('[class*="header"]')!;
    const footer = container.querySelector('[class*="footer"]')!;
    const content = container.querySelector('[class*="content"]')!;

    // flex-shrink:0 on both — a squeezed chain must not eat the chrome.
    expect(h(header)).toBeGreaterThanOrEqual(40);
    expect(h(footer)).toBeGreaterThanOrEqual(30);
    expect(scrolls(header)).toBe(false);
    expect(scrolls(footer)).toBe(false);
    // Content takes exactly what's left, and is the only scrollport.
    expect(h(content)).toBe(FRAME - h(header) - h(footer));
    expect(scrolls(content)).toBe(true);
  });

  it('INVARIANT: clip is a boundary, not a scroller — it cannot be scrolled', () => {
    const { container } = render(
      <Stack clip gap="none" style={{ height: 100 }}>
        {tall}
      </Stack>,
      { container: host },
    );
    const clipped = container.firstElementChild as HTMLElement;
    clipped.scrollTop = 200;
    // overflow:clip is not a scroll container, so this stays put — where
    // overflow:hidden would have scrolled and stranded the user with no scrollbar.
    expect(clipped.scrollTop).toBe(0);
  });
});
