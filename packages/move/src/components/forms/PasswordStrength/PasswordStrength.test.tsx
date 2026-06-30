// Generated from PasswordStrength.spec.ts (schemaVersion: 7, specHash: PLACEHOLDER)
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PasswordStrength, estimatePasswordStrength } from './PasswordStrength';

const getRoot = (container: HTMLElement) => container.firstChild as HTMLElement;
const getSegments = (container: HTMLElement) => container.querySelectorAll('[data-size] > div > div');

describe('PasswordStrength', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders a track with `levels` segments (default 4)', () => {
      const { container } = render(<PasswordStrength score={2} />);
      expect(getSegments(container)).toHaveLength(4);
    });

    it('levels prop changes the number of segments', () => {
      const { container } = render(<PasswordStrength levels={5} score={2} />);
      expect(getSegments(container)).toHaveLength(5);
    });

    it('fills segments up to the resolved level', () => {
      const { container } = render(<PasswordStrength score={2} />);
      const filled = container.querySelectorAll('[data-filled]');
      // indices 0,1,2 filled
      expect(filled).toHaveLength(3);
    });

    it('forwards className and style on root', () => {
      const { container } = render(<PasswordStrength score={1} className="custom" style={{ margin: 8 }} />);
      const root = getRoot(container);
      expect(root.className).toContain('custom');
      expect(root.style.margin).toBe('8px');
    });

    it('Defaults size=md, levels=4, showLabel=true', () => {
      const { container } = render(<PasswordStrength score={2} />);
      const root = getRoot(container);
      expect(root).toHaveAttribute('data-size', 'md');
      expect(root).toHaveAttribute('data-levels', '4');
      expect(getSegments(container)).toHaveLength(4);
      // label present by default
      expect(screen.getByText('Good')).toBeInTheDocument();
    });
  });

  // === Scoring precedence ===
  describe('scoring', () => {
    it('score prop takes precedence over value/estimate', () => {
      const { container } = render(
        <PasswordStrength score={0} value="Abcdef1!gh2X" estimate={() => 3} />,
      );
      expect(getRoot(container)).toHaveAttribute('data-level', '0');
    });

    it('estimate(value) is used when score is absent', () => {
      const { container } = render(<PasswordStrength value="anything" estimate={() => 3} />);
      expect(getRoot(container)).toHaveAttribute('data-level', '3');
    });

    it('falls back to the built-in heuristic when neither score nor estimate is given', () => {
      const { container } = render(<PasswordStrength value="Abcdef1!gh2X" />);
      const root = getRoot(container);
      // strong password → top level
      expect(root).toHaveAttribute('data-level', '3');
      expect(root).toHaveAttribute('data-strength', 'strong');
    });

    it('clamps a score above levels-1', () => {
      const { container } = render(<PasswordStrength levels={4} score={99} />);
      expect(getRoot(container)).toHaveAttribute('data-level', '3');
    });
  });

  // === Empty / too-short ===
  describe('empty state', () => {
    it('empty/too-short (level -1) fills no segments and shows labels.empty', () => {
      const { container } = render(<PasswordStrength value="abc" />);
      const root = getRoot(container);
      expect(root).toHaveAttribute('data-empty');
      expect(root).toHaveAttribute('data-level', '-1');
      expect(container.querySelectorAll('[data-filled]')).toHaveLength(0);
      expect(screen.getByText('Too short')).toBeInTheDocument();
    });

    it('no value at all is the empty state', () => {
      const { container } = render(<PasswordStrength />);
      expect(getRoot(container)).toHaveAttribute('data-empty');
    });
  });

  // === Color zones ===
  describe('color zones', () => {
    it('low level uses the weak (error) zone', () => {
      const { container } = render(<PasswordStrength score={0} />);
      expect(getRoot(container)).toHaveAttribute('data-strength', 'weak');
    });

    it('high level uses the strong (success) zone', () => {
      const { container } = render(<PasswordStrength score={3} />);
      expect(getRoot(container)).toHaveAttribute('data-strength', 'strong');
    });
  });

  // === Label ===
  describe('label', () => {
    it('showLabel=false hides the text label', () => {
      const { container } = render(<PasswordStrength score={2} showLabel={false} />);
      expect(container.querySelector('[aria-live]')).toBeNull();
    });

    it('uses custom labels.levels', () => {
      render(<PasswordStrength score={3} labels={{ levels: ['A', 'B', 'C', 'D'] }} />);
      expect(screen.getByText('D')).toBeInTheDocument();
    });
  });

  // === Data attributes ===
  describe('data attributes', () => {
    it('applies data-level, data-levels, data-size, data-empty', () => {
      const { container } = render(<PasswordStrength size="lg" levels={5} value="" />);
      const root = getRoot(container);
      expect(root).toHaveAttribute('data-level', '-1');
      expect(root).toHaveAttribute('data-levels', '5');
      expect(root).toHaveAttribute('data-size', 'lg');
      expect(root).toHaveAttribute('data-empty');
    });
  });

  // === Accessibility ===
  describe('accessibility', () => {
    it('label is an aria-live="polite" region', () => {
      const { container } = render(<PasswordStrength score={2} />);
      expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument();
    });

    it('announces "{labels.meter}: {level name}"', () => {
      const { container } = render(<PasswordStrength score={3} />);
      const live = container.querySelector('[aria-live="polite"]') as HTMLElement;
      expect(live.textContent).toBe('Password strength: Strong');
    });

    it('segments are decorative (aria-hidden track)', () => {
      const { container } = render(<PasswordStrength score={2} />);
      const track = container.querySelector('[aria-hidden="true"]');
      expect(track).toBeInTheDocument();
    });

    it('component id can be targeted by a field aria-describedby', () => {
      const { container } = render(<PasswordStrength id="pw-meter" score={2} />);
      expect(getRoot(container)).toHaveAttribute('id', 'pw-meter');
    });
  });

  // === Heuristic export ===
  describe('estimatePasswordStrength', () => {
    it('exports the helper', () => {
      expect(typeof estimatePasswordStrength).toBe('function');
    });

    it('returns -1 for empty or too-short', () => {
      expect(estimatePasswordStrength('')).toBe(-1);
      expect(estimatePasswordStrength('abc')).toBe(-1);
      expect(estimatePasswordStrength('abcde')).toBe(-1);
    });

    it('returns a top level for a strong password', () => {
      expect(estimatePasswordStrength('Abcdef1!gh2X', 4)).toBe(3);
    });

    it('returns a low level for a simple password', () => {
      expect(estimatePasswordStrength('abcdef', 4)).toBe(0);
    });

    it('maps onto a custom number of levels', () => {
      const result = estimatePasswordStrength('Abcdef1!gh2X', 5);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(4);
    });
  });

  // === Requirements ===
  describe('Requirements', () => {
    const reqs = [
      { label: 'At least 8 characters', met: true },
      { label: 'Contains a number', met: false },
    ];

    it('renders one row per requirement', () => {
      render(<PasswordStrength.Requirements requirements={reqs} />);
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });

    it('marks met / unmet via data-met', () => {
      render(<PasswordStrength.Requirements requirements={reqs} />);
      const items = screen.getAllByRole('listitem');
      expect(items[0]).toHaveAttribute('data-met', 'true');
      expect(items[1]).toHaveAttribute('data-met', 'false');
    });

    it('conveys met/unmet via accessible labels (not color alone)', () => {
      render(<PasswordStrength.Requirements requirements={reqs} />);
      expect(screen.getByText('Requirement met')).toBeInTheDocument();
      expect(screen.getByText('Requirement not met')).toBeInTheDocument();
    });

    it('renders the requirement label text', () => {
      render(<PasswordStrength.Requirements requirements={reqs} />);
      expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
    });

    it('forwards className and style', () => {
      const { container } = render(
        <PasswordStrength.Requirements requirements={reqs} className="custom" style={{ marginTop: 4 }} />,
      );
      const root = container.firstChild as HTMLElement;
      expect(root.className).toContain('custom');
      expect(root.style.marginTop).toBe('4px');
    });
  });
});
