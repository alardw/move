// Generated from Stepper.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { Stepper, useStepper } from './Stepper';

describe('Stepper', () => {
  // === Stepper.Root ===
  describe('Root', () => {
    it('renders as div with role="list"', () => {
      render(
        <Stepper active={0}>
          <Stepper.Step>
            <Stepper.Indicator />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      const root = screen.getByRole('list');
      expect(root).toBeInTheDocument();
      expect(root.tagName).toBe('DIV');
    });

    it('defaults to active=0, orientation=horizontal, size=md', () => {
      render(
        <Stepper data-testid="stepper">
          <Stepper.Step>
            <Stepper.Indicator />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      const root = screen.getByTestId('stepper');
      expect(root).toHaveAttribute('data-orientation', 'horizontal');
      expect(root).toHaveAttribute('data-size', 'md');
    });

    it('applies data-orientation and data-size attributes', () => {
      render(
        <Stepper data-testid="stepper" orientation="vertical" size="lg">
          <Stepper.Step>
            <Stepper.Indicator />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      const root = screen.getByTestId('stepper');
      expect(root).toHaveAttribute('data-orientation', 'vertical');
      expect(root).toHaveAttribute('data-size', 'lg');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Stepper ref={ref}>
          <Stepper.Step>
            <Stepper.Indicator />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className', () => {
      render(
        <Stepper data-testid="stepper" className="custom">
          <Stepper.Step>
            <Stepper.Indicator />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      expect(screen.getByTestId('stepper').className).toContain('custom');
    });

    it('forwards style', () => {
      render(
        <Stepper data-testid="stepper" style={{ marginTop: '10px' }}>
          <Stepper.Step>
            <Stepper.Indicator />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      expect(screen.getByTestId('stepper')).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <Stepper data-testid="stepper" id="my-stepper">
          <Stepper.Step>
            <Stepper.Indicator />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      expect(screen.getByTestId('stepper')).toHaveAttribute('id', 'my-stepper');
    });
  });

  // === Stepper.Step ===
  describe('Step', () => {
    it('renders as div with role="listitem"', () => {
      render(
        <Stepper active={0}>
          <Stepper.Step data-testid="step">
            <Stepper.Indicator />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      const step = screen.getByTestId('step');
      expect(step).toBeInTheDocument();
      expect(step).toHaveAttribute('role', 'listitem');
    });

    it('derives status=complete when index < active', () => {
      render(
        <Stepper active={2}>
          <Stepper.Step data-testid="step0">
            <Stepper.Indicator />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
          <Stepper.Step data-testid="step1">
            <Stepper.Indicator />
            <Stepper.Title>Step 2</Stepper.Title>
          </Stepper.Step>
          <Stepper.Step data-testid="step2">
            <Stepper.Indicator />
            <Stepper.Title>Step 3</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      expect(screen.getByTestId('step0')).toHaveAttribute('data-status', 'complete');
      expect(screen.getByTestId('step1')).toHaveAttribute('data-status', 'complete');
    });

    it('derives status=active when index === active', () => {
      render(
        <Stepper active={1}>
          <Stepper.Step data-testid="step0">
            <Stepper.Indicator />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
          <Stepper.Step data-testid="step1">
            <Stepper.Indicator />
            <Stepper.Title>Step 2</Stepper.Title>
          </Stepper.Step>
          <Stepper.Step data-testid="step2">
            <Stepper.Indicator />
            <Stepper.Title>Step 3</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      expect(screen.getByTestId('step1')).toHaveAttribute('data-status', 'active');
    });

    it('derives status=wait when index > active', () => {
      render(
        <Stepper active={0}>
          <Stepper.Step data-testid="step0">
            <Stepper.Indicator />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
          <Stepper.Step data-testid="step1">
            <Stepper.Indicator />
            <Stepper.Title>Step 2</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      expect(screen.getByTestId('step1')).toHaveAttribute('data-status', 'wait');
    });

    it('accepts explicit status prop that overrides auto-derivation', () => {
      render(
        <Stepper active={0}>
          <Stepper.Step data-testid="step0" status="error">
            <Stepper.Indicator />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
          <Stepper.Step data-testid="step1">
            <Stepper.Indicator />
            <Stepper.Title>Step 2</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      expect(screen.getByTestId('step0')).toHaveAttribute('data-status', 'error');
    });

    it('renders data-clickable="true" when onStepClick is provided', () => {
      const onStepClick = vi.fn();
      render(
        <Stepper active={0} onStepClick={onStepClick}>
          <Stepper.Step data-testid="step0">
            <Stepper.Indicator />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      expect(screen.getByTestId('step0')).toHaveAttribute('data-clickable', 'true');
    });

    it('becomes focusable (tabIndex=0) when clickable', () => {
      const onStepClick = vi.fn();
      render(
        <Stepper active={0} onStepClick={onStepClick}>
          <Stepper.Step data-testid="step0">
            <Stepper.Indicator />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      expect(screen.getByTestId('step0')).toHaveAttribute('tabindex', '0');
    });

    it('clicking a clickable step calls onStepClick with the step index', () => {
      const onStepClick = vi.fn();
      render(
        <Stepper active={0} onStepClick={onStepClick}>
          <Stepper.Step data-testid="step0">
            <Stepper.Indicator />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
          <Stepper.Step data-testid="step1">
            <Stepper.Indicator />
            <Stepper.Title>Step 2</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      fireEvent.click(screen.getByTestId('step1'));
      expect(onStepClick).toHaveBeenCalledWith(1);
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Stepper active={0}>
          <Stepper.Step ref={ref}>
            <Stepper.Indicator />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className and style', () => {
      render(
        <Stepper active={0}>
          <Stepper.Step data-testid="step" className="custom" style={{ padding: '4px' }}>
            <Stepper.Indicator />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      const step = screen.getByTestId('step');
      expect(step.className).toContain('custom');
      expect(step).toHaveStyle({ padding: '4px' });
    });
  });

  // === Stepper.Indicator ===
  describe('Indicator', () => {
    it('renders step number (1-based) by default', () => {
      render(
        <Stepper active={0}>
          <Stepper.Step>
            <Stepper.Indicator data-testid="ind" />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      expect(screen.getByTestId('ind')).toHaveTextContent('1');
    });

    it('has aria-hidden="true"', () => {
      render(
        <Stepper active={0}>
          <Stepper.Step>
            <Stepper.Indicator data-testid="ind" />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      expect(screen.getByTestId('ind')).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders check icon when status is complete', () => {
      render(
        <Stepper active={1}>
          <Stepper.Step data-testid="step0">
            <Stepper.Indicator data-testid="ind" />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
          <Stepper.Step>
            <Stepper.Indicator />
            <Stepper.Title>Step 2</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      // When complete, the indicator should not show number 1
      const ind = screen.getByTestId('ind');
      expect(ind).not.toHaveTextContent('1');
    });

    it('renders custom icon prop when provided', () => {
      render(
        <Stepper active={0}>
          <Stepper.Step>
            <Stepper.Indicator data-testid="ind" icon={<span data-testid="custom-icon">*</span>} />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('renders children when provided (overrides icon/number)', () => {
      render(
        <Stepper active={0}>
          <Stepper.Step>
            <Stepper.Indicator data-testid="ind">
              <span data-testid="child-content">A</span>
            </Stepper.Indicator>
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Stepper active={0}>
          <Stepper.Step>
            <Stepper.Indicator ref={ref} />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className and style', () => {
      render(
        <Stepper active={0}>
          <Stepper.Step>
            <Stepper.Indicator data-testid="ind" className="custom" style={{ padding: '2px' }} />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      const ind = screen.getByTestId('ind');
      expect(ind.className).toContain('custom');
      expect(ind).toHaveStyle({ padding: '2px' });
    });
  });

  // === Stepper.Title ===
  describe('Title', () => {
    it('renders step title text', () => {
      render(
        <Stepper active={0}>
          <Stepper.Step>
            <Stepper.Indicator />
            <Stepper.Title>My Title</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      expect(screen.getByText('My Title')).toBeInTheDocument();
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Stepper active={0}>
          <Stepper.Step>
            <Stepper.Indicator />
            <Stepper.Title ref={ref}>Title</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className and style', () => {
      render(
        <Stepper active={0}>
          <Stepper.Step>
            <Stepper.Indicator />
            <Stepper.Title data-testid="title" className="custom" style={{ color: 'rgb(255, 0, 0)' }}>Title</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      const title = screen.getByTestId('title');
      expect(title.className).toContain('custom');
      expect(title).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });
  });

  // === Stepper.Description ===
  describe('Description', () => {
    it('renders step description text', () => {
      render(
        <Stepper active={0}>
          <Stepper.Step>
            <Stepper.Indicator />
            <Stepper.Title>Title</Stepper.Title>
            <Stepper.Description>My description</Stepper.Description>
          </Stepper.Step>
        </Stepper>
      );
      expect(screen.getByText('My description')).toBeInTheDocument();
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Stepper active={0}>
          <Stepper.Step>
            <Stepper.Indicator />
            <Stepper.Title>Title</Stepper.Title>
            <Stepper.Description ref={ref}>Desc</Stepper.Description>
          </Stepper.Step>
        </Stepper>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className and style', () => {
      render(
        <Stepper active={0}>
          <Stepper.Step>
            <Stepper.Indicator />
            <Stepper.Title>Title</Stepper.Title>
            <Stepper.Description data-testid="desc" className="custom" style={{ fontSize: '12px' }}>Desc</Stepper.Description>
          </Stepper.Step>
        </Stepper>
      );
      const desc = screen.getByTestId('desc');
      expect(desc.className).toContain('custom');
      expect(desc).toHaveStyle({ fontSize: '12px' });
    });
  });

  // === Stepper.Completed ===
  describe('Completed', () => {
    it('renders children as-is', () => {
      render(
        <Stepper.Completed>
          <div data-testid="completed">All done!</div>
        </Stepper.Completed>
      );
      expect(screen.getByTestId('completed')).toBeInTheDocument();
      expect(screen.getByText('All done!')).toBeInTheDocument();
    });
  });

  // === Keyboard ===
  describe('keyboard', () => {
    it('clickable step triggers onStepClick on Enter key', () => {
      const onStepClick = vi.fn();
      render(
        <Stepper active={0} onStepClick={onStepClick}>
          <Stepper.Step data-testid="step0">
            <Stepper.Indicator />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      fireEvent.keyDown(screen.getByTestId('step0'), { key: 'Enter' });
      expect(onStepClick).toHaveBeenCalledWith(0);
    });

    it('clickable step triggers onStepClick on Space key', () => {
      const onStepClick = vi.fn();
      render(
        <Stepper active={0} onStepClick={onStepClick}>
          <Stepper.Step data-testid="step0">
            <Stepper.Indicator />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      fireEvent.keyDown(screen.getByTestId('step0'), { key: ' ' });
      expect(onStepClick).toHaveBeenCalledWith(0);
    });
  });

  // === Separators ===
  describe('separators', () => {
    it('renders separators between steps in horizontal mode', () => {
      render(
        <Stepper active={0}>
          <Stepper.Step data-testid="step0">
            <Stepper.Indicator />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
          <Stepper.Step data-testid="step1">
            <Stepper.Indicator />
            <Stepper.Title>Step 2</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      const root = screen.getByRole('list');
      const separators = root.querySelectorAll('[aria-hidden="true"][data-side]');
      expect(separators.length).toBeGreaterThan(0);
    });

    it('separator renders data-complete when step is complete', () => {
      render(
        <Stepper active={2}>
          <Stepper.Step data-testid="step0">
            <Stepper.Indicator />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
          <Stepper.Step data-testid="step1">
            <Stepper.Indicator />
            <Stepper.Title>Step 2</Stepper.Title>
          </Stepper.Step>
          <Stepper.Step data-testid="step2">
            <Stepper.Indicator />
            <Stepper.Title>Step 3</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      const root = screen.getByRole('list');
      const completeSeps = root.querySelectorAll('[data-complete="true"]');
      expect(completeSeps.length).toBeGreaterThan(0);
    });
  });

  // === Composition ===
  describe('composition', () => {
    it('renders full stepper composition', () => {
      render(
        <Stepper active={1}>
          <Stepper.Step>
            <Stepper.Indicator />
            <Stepper.Title>Personal Info</Stepper.Title>
            <Stepper.Description>Enter your details</Stepper.Description>
          </Stepper.Step>
          <Stepper.Step>
            <Stepper.Indicator />
            <Stepper.Title>Address</Stepper.Title>
            <Stepper.Description>Where you live</Stepper.Description>
          </Stepper.Step>
          <Stepper.Step>
            <Stepper.Indicator />
            <Stepper.Title>Review</Stepper.Title>
            <Stepper.Description>Confirm everything</Stepper.Description>
          </Stepper.Step>
        </Stepper>
      );

      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
      expect(screen.getByText('Address')).toBeInTheDocument();
      expect(screen.getByText('Review')).toBeInTheDocument();
      expect(screen.getByText('Enter your details')).toBeInTheDocument();
    });

    it('renders vertical orientation', () => {
      render(
        <Stepper active={0} orientation="vertical" data-testid="stepper">
          <Stepper.Step>
            <Stepper.Indicator />
            <Stepper.Title>Step 1</Stepper.Title>
          </Stepper.Step>
          <Stepper.Step>
            <Stepper.Indicator />
            <Stepper.Title>Step 2</Stepper.Title>
          </Stepper.Step>
        </Stepper>
      );
      expect(screen.getByTestId('stepper')).toHaveAttribute('data-orientation', 'vertical');
    });
  });
});

describe('useStepper', () => {
  it('goToNext clamps at the last step (count-1), never out of range', () => {
    const { result } = renderHook(() => useStepper({ count: 3 }));
    act(() => result.current.goToNext()); // 0 -> 1
    act(() => result.current.goToNext()); // 1 -> 2 (last)
    act(() => result.current.goToNext()); // stays 2 — must NOT advance to 3
    act(() => result.current.goToNext());
    expect(result.current.activeStep).toBe(2);
    expect(result.current.isLast).toBe(true);
  });
});
