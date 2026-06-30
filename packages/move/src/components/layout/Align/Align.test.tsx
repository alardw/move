// Generated from Align.spec.ts (schemaVersion: 6, specHash: 6cbf8097)
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Align } from './Align';

describe('Align', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders as grid container', () => {
      render(
        <Align data-testid="align">
          <Align.Start>Start</Align.Start>
          <Align.Center>Center</Align.Center>
          <Align.End>End</Align.End>
        </Align>,
      );
      expect(screen.getByTestId('align')).toBeInTheDocument();
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <Align ref={ref}>
          <Align.Start>Start</Align.Start>
        </Align>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className and style', () => {
      render(
        <Align className="custom" style={{ marginTop: '10px' }} data-testid="align">
          <Align.Start>Start</Align.Start>
        </Align>,
      );
      const el = screen.getByTestId('align');
      expect(el).toHaveClass('custom');
      expect(el).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <Align data-testid="align" aria-label="toolbar">
          <Align.Start>Start</Align.Start>
        </Align>,
      );
      expect(screen.getByTestId('align')).toHaveAttribute('aria-label', 'toolbar');
    });
  });

  // === Gap ===
  describe('gap', () => {
    it('defaults to gap=md', () => {
      render(
        <Align data-testid="align">
          <Align.Start>Start</Align.Start>
        </Align>,
      );
      expect(screen.getByTestId('align')).toHaveAttribute('data-gap', 'md');
    });

    it('applies gap via data-gap attribute', () => {
      render(
        <Align gap="lg" data-testid="align">
          <Align.Start>Start</Align.Start>
        </Align>,
      );
      expect(screen.getByTestId('align')).toHaveAttribute('data-gap', 'lg');
    });

    it('supports gap=none', () => {
      render(
        <Align gap="none" data-testid="align">
          <Align.Start>Start</Align.Start>
        </Align>,
      );
      expect(screen.getByTestId('align')).toHaveAttribute('data-gap', 'none');
    });
  });

  // === Align ===
  describe('align', () => {
    it('defaults to align=center', () => {
      render(
        <Align data-testid="align">
          <Align.Start>Start</Align.Start>
        </Align>,
      );
      expect(screen.getByTestId('align')).toHaveAttribute('data-align', 'center');
    });

    it('applies vertical alignment via data-align attribute', () => {
      render(
        <Align align="start" data-testid="align">
          <Align.Start>Start</Align.Start>
        </Align>,
      );
      expect(screen.getByTestId('align')).toHaveAttribute('data-align', 'start');
    });
  });

  // === Sections ===
  describe('sections', () => {
    it('renders Start section', () => {
      render(
        <Align>
          <Align.Start>Start content</Align.Start>
        </Align>,
      );
      expect(screen.getByText('Start content')).toBeInTheDocument();
    });

    it('renders Center section', () => {
      render(
        <Align>
          <Align.Center>Center content</Align.Center>
        </Align>,
      );
      expect(screen.getByText('Center content')).toBeInTheDocument();
    });

    it('renders End section', () => {
      render(
        <Align>
          <Align.End>End content</Align.End>
        </Align>,
      );
      expect(screen.getByText('End content')).toBeInTheDocument();
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(
        <Align sp={{ root: { className: 'sp-root' } }} data-testid="align">
          <Align.Start>Start</Align.Start>
        </Align>,
      );
      expect(screen.getByTestId('align')).toHaveClass('sp-root');
    });
  });
});
