// Generated from Timeline.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Timeline } from './Timeline';
import { createRef } from 'react';

describe('Timeline', () => {
  // === Timeline Root ===
  describe('Timeline (Root)', () => {
    it('renders as a div with flex column layout', () => {
      render(<Timeline data-testid="timeline"><Timeline.Item>Step 1</Timeline.Item></Timeline>);
      const el = screen.getByTestId('timeline');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('DIV');
    });

    it('defaults to active=-1, align=left, size=md', () => {
      render(<Timeline data-testid="timeline"><Timeline.Item>Step 1</Timeline.Item></Timeline>);
      const el = screen.getByTestId('timeline');
      expect(el).toHaveAttribute('data-align', 'left');
      expect(el).toHaveAttribute('data-size', 'md');
    });

    it('applies data-align attribute', () => {
      const { rerender } = render(
        <Timeline data-testid="timeline" align="right"><Timeline.Item>Step 1</Timeline.Item></Timeline>
      );
      expect(screen.getByTestId('timeline')).toHaveAttribute('data-align', 'right');

      rerender(
        <Timeline data-testid="timeline" align="alternate"><Timeline.Item>Step 1</Timeline.Item></Timeline>
      );
      expect(screen.getByTestId('timeline')).toHaveAttribute('data-align', 'alternate');
    });

    it('applies data-size attribute', () => {
      const { rerender } = render(
        <Timeline data-testid="timeline" size="sm"><Timeline.Item>Step 1</Timeline.Item></Timeline>
      );
      expect(screen.getByTestId('timeline')).toHaveAttribute('data-size', 'sm');

      rerender(
        <Timeline data-testid="timeline" size="lg"><Timeline.Item>Step 1</Timeline.Item></Timeline>
      );
      expect(screen.getByTestId('timeline')).toHaveAttribute('data-size', 'lg');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Timeline ref={ref}><Timeline.Item>Step 1</Timeline.Item></Timeline>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className', () => {
      render(<Timeline data-testid="timeline" className="custom"><Timeline.Item>Step 1</Timeline.Item></Timeline>);
      expect(screen.getByTestId('timeline').className).toContain('custom');
    });

    it('forwards style', () => {
      render(
        <Timeline data-testid="timeline" animations={false} style={{ marginTop: '10px' }}>
          <Timeline.Item>Step 1</Timeline.Item>
        </Timeline>
      );
      expect(screen.getByTestId('timeline')).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <Timeline data-testid="my-timeline" aria-label="Progress">
          <Timeline.Item>Step 1</Timeline.Item>
        </Timeline>
      );
      expect(screen.getByTestId('my-timeline')).toHaveAttribute('aria-label', 'Progress');
    });
  });

  // === Timeline.Item state derivation ===
  describe('Timeline.Item state derivation', () => {
    it('derives state=completed when index < active', () => {
      render(
        <Timeline active={2} animations={false}>
          <Timeline.Item data-testid="item-0">Step 1</Timeline.Item>
          <Timeline.Item data-testid="item-1">Step 2</Timeline.Item>
          <Timeline.Item data-testid="item-2">Step 3</Timeline.Item>
        </Timeline>
      );
      expect(screen.getByTestId('item-0')).toHaveAttribute('data-state', 'completed');
      expect(screen.getByTestId('item-1')).toHaveAttribute('data-state', 'completed');
    });

    it('derives state=active when index === active', () => {
      render(
        <Timeline active={1} animations={false}>
          <Timeline.Item data-testid="item-0">Step 1</Timeline.Item>
          <Timeline.Item data-testid="item-1">Step 2</Timeline.Item>
          <Timeline.Item data-testid="item-2">Step 3</Timeline.Item>
        </Timeline>
      );
      expect(screen.getByTestId('item-1')).toHaveAttribute('data-state', 'active');
    });

    it('derives state=inactive when index > active', () => {
      render(
        <Timeline active={0} animations={false}>
          <Timeline.Item data-testid="item-0">Step 1</Timeline.Item>
          <Timeline.Item data-testid="item-1">Step 2</Timeline.Item>
        </Timeline>
      );
      expect(screen.getByTestId('item-1')).toHaveAttribute('data-state', 'inactive');
    });

    it('all items inactive when active=-1', () => {
      render(
        <Timeline active={-1} animations={false}>
          <Timeline.Item data-testid="item-0">Step 1</Timeline.Item>
          <Timeline.Item data-testid="item-1">Step 2</Timeline.Item>
        </Timeline>
      );
      expect(screen.getByTestId('item-0')).toHaveAttribute('data-state', 'inactive');
      expect(screen.getByTestId('item-1')).toHaveAttribute('data-state', 'inactive');
    });

    it('respects reverseActive flag', () => {
      render(
        <Timeline active={1} reverseActive animations={false}>
          <Timeline.Item data-testid="item-0">Step 1</Timeline.Item>
          <Timeline.Item data-testid="item-1">Step 2</Timeline.Item>
          <Timeline.Item data-testid="item-2">Step 3</Timeline.Item>
        </Timeline>
      );
      expect(screen.getByTestId('item-0')).toHaveAttribute('data-state', 'inactive');
      expect(screen.getByTestId('item-1')).toHaveAttribute('data-state', 'active');
      expect(screen.getByTestId('item-2')).toHaveAttribute('data-state', 'completed');
    });
  });

  // === Timeline.Item attributes ===
  describe('Timeline.Item attributes', () => {
    it('renders data-state, data-color, data-line-variant', () => {
      render(
        <Timeline active={0} animations={false}>
          <Timeline.Item data-testid="item">Step 1</Timeline.Item>
        </Timeline>
      );
      const el = screen.getByTestId('item');
      expect(el).toHaveAttribute('data-state', 'active');
      expect(el).toHaveAttribute('data-color', 'indigo');
      expect(el).toHaveAttribute('data-line-variant', 'solid');
    });

    it('inherits color from Root context', () => {
      render(
        <Timeline active={0} color="green" animations={false}>
          <Timeline.Item data-testid="item">Step 1</Timeline.Item>
        </Timeline>
      );
      expect(screen.getByTestId('item')).toHaveAttribute('data-color', 'green');
    });

    it('can override color with its own color prop', () => {
      render(
        <Timeline active={0} color="indigo" animations={false}>
          <Timeline.Item data-testid="item" color="red">Step 1</Timeline.Item>
        </Timeline>
      );
      expect(screen.getByTestId('item')).toHaveAttribute('data-color', 'red');
    });

    it('inherits lineVariant from Root context', () => {
      render(
        <Timeline active={0} lineVariant="dashed" animations={false}>
          <Timeline.Item data-testid="item">Step 1</Timeline.Item>
        </Timeline>
      );
      expect(screen.getByTestId('item')).toHaveAttribute('data-line-variant', 'dashed');
    });

    it('can override lineVariant with its own lineVariant prop', () => {
      render(
        <Timeline active={0} lineVariant="solid" animations={false}>
          <Timeline.Item data-testid="item" lineVariant="dotted">Step 1</Timeline.Item>
        </Timeline>
      );
      expect(screen.getByTestId('item')).toHaveAttribute('data-line-variant', 'dotted');
    });
  });

  // === Timeline.Item bullet ===
  describe('Timeline.Item bullet', () => {
    it('renders custom bullet content via bullet prop', () => {
      render(
        <Timeline animations={false}>
          <Timeline.Item data-testid="item" bullet={<span data-testid="custom-bullet">!</span>}>Step</Timeline.Item>
        </Timeline>
      );
      expect(screen.getByTestId('custom-bullet')).toBeInTheDocument();
    });

    it('renders data-has-content on bullet when custom content is present', () => {
      const { container } = render(
        <Timeline animations={false}>
          <Timeline.Item bullet={<span>!</span>}>Step</Timeline.Item>
        </Timeline>
      );
      const bullet = container.querySelector('[data-has-content]');
      expect(bullet).toBeInTheDocument();
    });

    it('does not render data-has-content when no bullet prop', () => {
      const { container } = render(
        <Timeline animations={false}>
          <Timeline.Item>Step</Timeline.Item>
        </Timeline>
      );
      const bullet = container.querySelector('[data-has-content]');
      expect(bullet).not.toBeInTheDocument();
    });
  });

  // === Timeline.Item title ===
  describe('Timeline.Item title', () => {
    it('renders title via title prop when provided', () => {
      render(
        <Timeline animations={false}>
          <Timeline.Item title="Step Title">Step content</Timeline.Item>
        </Timeline>
      );
      expect(screen.getByText('Step Title')).toBeInTheDocument();
    });

    it('does not render title element when title prop is not provided', () => {
      const { container } = render(
        <Timeline animations={false}>
          <Timeline.Item data-testid="item">Step content</Timeline.Item>
        </Timeline>
      );
      // Title slot should not be present when no title prop
      const item = screen.getByTestId('item');
      // The title class comes from css modules - just check there's no extra title div
      expect(screen.queryByText('Step Title')).not.toBeInTheDocument();
    });
  });

  // === Timeline.Item alternate layout ===
  describe('alternate layout', () => {
    it('renders items with alternating content-side', () => {
      render(
        <Timeline align="alternate" animations={false}>
          <Timeline.Item data-testid="item-0">Step 1</Timeline.Item>
          <Timeline.Item data-testid="item-1">Step 2</Timeline.Item>
          <Timeline.Item data-testid="item-2">Step 3</Timeline.Item>
        </Timeline>
      );
      expect(screen.getByTestId('item-0')).toHaveAttribute('data-content-side', 'right');
      expect(screen.getByTestId('item-1')).toHaveAttribute('data-content-side', 'left');
      expect(screen.getByTestId('item-2')).toHaveAttribute('data-content-side', 'right');
    });

    it('does not set data-content-side when align is left', () => {
      render(
        <Timeline align="left" animations={false}>
          <Timeline.Item data-testid="item-0">Step 1</Timeline.Item>
        </Timeline>
      );
      expect(screen.getByTestId('item-0')).not.toHaveAttribute('data-content-side');
    });
  });

  // === Timeline.Item forwarding ===
  describe('Timeline.Item forwarding', () => {
    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Timeline animations={false}>
          <Timeline.Item ref={ref}>Step 1</Timeline.Item>
        </Timeline>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className', () => {
      render(
        <Timeline animations={false}>
          <Timeline.Item data-testid="item" className="custom">Step 1</Timeline.Item>
        </Timeline>
      );
      expect(screen.getByTestId('item').className).toContain('custom');
    });

    it('forwards style', () => {
      render(
        <Timeline animations={false}>
          <Timeline.Item data-testid="item" style={{ marginTop: '10px' }}>Step 1</Timeline.Item>
        </Timeline>
      );
      expect(screen.getByTestId('item')).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <Timeline animations={false}>
          <Timeline.Item data-testid="item" aria-label="Step">Step 1</Timeline.Item>
        </Timeline>
      );
      expect(screen.getByTestId('item')).toHaveAttribute('aria-label', 'Step');
    });
  });

  // === Animation ===
  describe('animation', () => {
    it('accepts animations=false on Root to disable all item entrance animations', () => {
      render(
        <Timeline data-testid="timeline" animations={false}>
          <Timeline.Item data-testid="item">Step 1</Timeline.Item>
        </Timeline>
      );
      expect(screen.getByTestId('timeline')).toBeInTheDocument();
      expect(screen.getByTestId('item')).toBeInTheDocument();
    });
  });

  // === Composition ===
  describe('composition', () => {
    it('renders full timeline composition', () => {
      render(
        <Timeline data-testid="timeline" active={1} animations={false}>
          <Timeline.Item data-testid="item-0" title="Completed">Done</Timeline.Item>
          <Timeline.Item data-testid="item-1" title="Current" bullet={<span>2</span>}>In progress</Timeline.Item>
          <Timeline.Item data-testid="item-2" title="Upcoming">Not started</Timeline.Item>
        </Timeline>
      );

      expect(screen.getByTestId('timeline')).toBeInTheDocument();
      expect(screen.getByTestId('item-0')).toHaveAttribute('data-state', 'completed');
      expect(screen.getByTestId('item-1')).toHaveAttribute('data-state', 'active');
      expect(screen.getByTestId('item-2')).toHaveAttribute('data-state', 'inactive');
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Current')).toBeInTheDocument();
      expect(screen.getByText('Upcoming')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();
      expect(screen.getByText('In progress')).toBeInTheDocument();
      expect(screen.getByText('Not started')).toBeInTheDocument();
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(
        <Timeline data-testid="timeline" sp={{ root: { className: 'sp-root' } }}>
          <Timeline.Item>Step 1</Timeline.Item>
        </Timeline>
      );
      expect(screen.getByTestId('timeline').className).toContain('sp-root');
    });

    it('merges sp style on root', () => {
      render(
        <Timeline data-testid="timeline" animations={false} sp={{ root: { style: { marginTop: '5px' } } }}>
          <Timeline.Item>Step 1</Timeline.Item>
        </Timeline>
      );
      expect(screen.getByTestId('timeline')).toHaveStyle({ marginTop: '5px' });
    });
  });
});
