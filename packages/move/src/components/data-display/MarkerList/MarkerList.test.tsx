import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MarkerList } from './MarkerList';

describe('MarkerList', () => {
  it('renders a ul with role=list by default', () => {
    const { container } = render(
      <MarkerList>
        <MarkerList.Item>a</MarkerList.Item>
      </MarkerList>,
    );
    const root = container.querySelector('ul');
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute('role', 'list');
    expect(root).toHaveAttribute('data-marker', 'disc');
    expect(root).toHaveAttribute('data-depth', '0');
  });

  it('renders an ol with the decimal default when ordered', () => {
    const { container } = render(
      <MarkerList ordered>
        <MarkerList.Item>a</MarkerList.Item>
      </MarkerList>,
    );
    const root = container.querySelector('ol');
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute('data-ordered', '');
    expect(root).toHaveAttribute('data-marker', 'decimal');
  });

  it('renders items as li with a marker cell + content cell', () => {
    const { container } = render(
      <MarkerList>
        <MarkerList.Item>hello</MarkerList.Item>
      </MarkerList>,
    );
    const li = container.querySelector('li');
    expect(li).toHaveAttribute('data-marker', 'disc');
    const marker = li!.querySelector('[aria-hidden]');
    expect(marker).toHaveTextContent('•');
  });

  it('renders the correct bullet glyph for circle and square', () => {
    const { container } = render(
      <MarkerList marker="square">
        <MarkerList.Item>a</MarkerList.Item>
      </MarkerList>,
    );
    expect(container.querySelector('li [aria-hidden]')).toHaveTextContent('▪');
  });

  it('ordered markers set data-marker (number comes from the CSS counter, not JS)', () => {
    const { container } = render(
      <MarkerList ordered marker="roman">
        <MarkerList.Item>a</MarkerList.Item>
      </MarkerList>,
    );
    const marker = container.querySelector('li [aria-hidden]');
    expect(marker).toHaveAttribute('data-marker', 'roman');
    expect(marker).toHaveTextContent('');
  });

  it('Item.marker overrides the list marker for that item', () => {
    const { container } = render(
      <MarkerList marker="disc">
        <MarkerList.Item marker="square">a</MarkerList.Item>
      </MarkerList>,
    );
    expect(container.querySelector('li')).toHaveAttribute('data-marker', 'square');
  });

  it('markers[] gives per-level markers, and nested lists inherit the map', () => {
    const { container } = render(
      <MarkerList markers={['disc', 'circle', 'square']}>
        <MarkerList.Item>
          level 0
          <MarkerList>
            <MarkerList.Item>level 1</MarkerList.Item>
          </MarkerList>
        </MarkerList.Item>
      </MarkerList>,
    );
    const lists = container.querySelectorAll('ul');
    expect(lists[0]).toHaveAttribute('data-marker', 'disc'); // depth 0
    expect(lists[1]).toHaveAttribute('data-depth', '1');
    expect(lists[1]).toHaveAttribute('data-marker', 'circle'); // markers[1], inherited
  });

  it('an icon marker flags the marker cell with data-icon', () => {
    const { container } = render(
      <MarkerList icon="check">
        <MarkerList.Item>a</MarkerList.Item>
      </MarkerList>,
    );
    expect(container.querySelector('li [aria-hidden]')).toHaveAttribute('data-icon', '');
  });

  it('forwards className and ref on Root', () => {
    const ref = { current: null as HTMLElement | null };
    const { container } = render(
      <MarkerList ref={ref} className="custom">
        <MarkerList.Item>a</MarkerList.Item>
      </MarkerList>,
    );
    expect(container.querySelector('ul')).toHaveClass('custom');
    expect(ref.current).not.toBeNull();
  });

  it('applies spacing and center data attributes', () => {
    const { container } = render(
      <MarkerList spacing="lg" center>
        <MarkerList.Item>a</MarkerList.Item>
      </MarkerList>,
    );
    const root = container.querySelector('ul');
    expect(root).toHaveAttribute('data-spacing', 'lg');
    expect(root).toHaveAttribute('data-center', '');
  });
});
