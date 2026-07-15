'use client';
// Generated from PasswordStrength.spec.ts
import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { useIcon } from '../../../infrastructure/Icon';
import type { Size } from '../../../shared/types';
import styles from './PasswordStrength.module.css';

// =============================================================================
// Types
// =============================================================================

/** Re-exported for backwards-compatible imports. Prefer `Size` from
 *  `'move'` directly going forward. */
export type PasswordStrengthSize = Size;

type PasswordStrengthSlots = 'root' | 'track' | 'segment' | 'label';
type RequirementsSlots = 'requirements' | 'requirement' | 'requirementIcon' | 'requirementLabel';

export interface PasswordStrengthLabels {
  /** Level names, one per level (indexed by score). */
  levels: string[];
  /** Shown when the resolved level is -1 (empty / too short). */
  empty: string;
  /** aria-live announcement prefix, e.g. "Password strength: Strong". */
  meter: string;
  /** Requirements: accessible label for a satisfied rule. */
  met: string;
  /** Requirements: accessible label for an unsatisfied rule. */
  unmet: string;
}

const DEFAULT_LABELS: PasswordStrengthLabels = {
  levels: ['Weak', 'Fair', 'Good', 'Strong'],
  empty: 'Too short',
  meter: 'Password strength',
  met: 'Requirement met',
  unmet: 'Requirement not met',
};

export interface PasswordRequirement {
  label: string;
  met: boolean;
}

export interface PasswordStrengthProps extends React.HTMLAttributes<HTMLElement> {
  /** Password to score via the built-in heuristic or `estimate`. Ignored when `score` is set. */
  value?: string;
  /** Controlled strength level index (0..levels-1; -1 = empty/too-short). Takes precedence. */
  score?: number;
  /** Custom scorer over `value` returning a level index. Falls back to the built-in heuristic. */
  estimate?: (value: string) => number;
  /** Number of strength levels/segments. */
  levels?: number;
  /** Meter size */
  size?: PasswordStrengthSize;
  /** Show the strength text label beneath the meter */
  showLabel?: boolean;
  /** Level names, empty-state text, and the aria-live announcement prefix */
  labels?: Partial<PasswordStrengthLabels>;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  /** Optional PasswordStrength.Requirements rendered beneath the meter */
  children?: React.ReactNode;
  sp?: SlotPropsMap<PasswordStrengthSlots>;
}

export interface PasswordStrengthRequirementsProps extends React.HTMLAttributes<HTMLElement> {
  /** Rules to display; the consumer computes `met` (keeps the component scoring-agnostic) */
  requirements: PasswordRequirement[];
  /** Accessible labels for the met / not-met states */
  labels?: Partial<PasswordStrengthLabels>;
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<RequirementsSlots>;
}

// =============================================================================
// Heuristic scorer (exported)
// =============================================================================

const MIN_LENGTH = 6;

/**
 * Built-in length + character-class strength heuristic.
 *
 * Returns a level index in `0..levels-1`, or `-1` for an empty password or one
 * shorter than the minimum length (6). Consumers can reuse this directly or
 * compose it (e.g. as a fallback behind zxcvbn).
 */
export function estimatePasswordStrength(value: string, levels = 4): number {
  if (!value || value.length < MIN_LENGTH) return -1;

  let raw = 0;
  if (value.length >= 8) raw += 1;
  if (value.length >= 12) raw += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) raw += 1;
  if (/\d/.test(value)) raw += 1;
  if (/[^A-Za-z0-9]/.test(value)) raw += 1;
  // raw is 0..5 — map onto the configured level range.

  const span = Math.max(1, levels - 1);
  const level = Math.round((raw / 5) * span);
  return Math.max(0, Math.min(span, level));
}

// =============================================================================
// Helpers
// =============================================================================

type StrengthZone = 'weak' | 'medium' | 'strong';

function zoneForLevel(level: number, levels: number): StrengthZone | undefined {
  if (level < 0) return undefined;
  const ratio = levels > 1 ? level / (levels - 1) : 1;
  if (ratio <= 0.34) return 'weak';
  if (ratio <= 0.67) return 'medium';
  return 'strong';
}

// =============================================================================
// Root
// =============================================================================

const PasswordStrengthRoot = withMoveComponent<
  PasswordStrengthSlots,
  PasswordStrengthProps,
  HTMLDivElement
>({
  name: 'PasswordStrength',
  styles,
  slots: ['root', 'track', 'segment', 'label'] as const,
  defaults: { levels: 4, size: 'md', showLabel: true },
  moveProps: ['value', 'score', 'estimate', 'levels', 'size', 'showLabel', 'labels'],

  setup({ props, ref, cx, sp, attrs }) {
    const levels = props.levels as number;
    const labels = {
      ...DEFAULT_LABELS,
      ...(props.labels as Partial<PasswordStrengthLabels> | undefined),
    };

    // Resolve strength: controlled score → estimate(value) → built-in heuristic.
    let level: number;
    if (props.score !== undefined) {
      level = props.score as number;
    } else if (typeof props.estimate === 'function') {
      level = (props.estimate as (v: string) => number)((props.value as string | undefined) ?? '');
    } else {
      level = estimatePasswordStrength((props.value as string | undefined) ?? '', levels);
    }
    if (!Number.isFinite(level)) level = -1;
    level = Math.max(-1, Math.min(levels - 1, Math.round(level)));

    const isEmpty = level < 0;
    const zone = zoneForLevel(level, levels);
    const levelName = isEmpty ? labels.empty : (labels.levels[level] ?? '');

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        const trackSp = sp('track');
        const {
          className: trackSpClass,
          style: trackSpStyle,
          ...trackSpRest
        } = trackSp as Record<string, unknown>;
        const segmentSp = sp('segment');
        const {
          className: segSpClass,
          style: segSpStyle,
          ...segSpRest
        } = segmentSp as Record<string, unknown>;
        const labelSp = sp('label');
        const {
          className: labelSpClass,
          style: labelSpStyle,
          ...labelSpRest
        } = labelSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
            data-level={level}
            data-levels={levels}
            data-size={props.size}
            {...(isEmpty ? { 'data-empty': '' } : {})}
            {...(zone ? { 'data-strength': zone } : {})}
          >
            <div
              {...trackSpRest}
              className={cx('track', trackSpClass as string | undefined)}
              style={trackSpStyle as React.CSSProperties}
              {...(zone ? { 'data-strength': zone } : {})}
              aria-hidden="true"
            >
              {Array.from({ length: levels }).map((_, i) => (
                <div
                  key={i}
                  {...segSpRest}
                  className={cx('segment', segSpClass as string | undefined)}
                  style={segSpStyle as React.CSSProperties}
                  {...(!isEmpty && i <= level ? { 'data-filled': '' } : {})}
                />
              ))}
            </div>
            {props.showLabel && (
              <span
                {...labelSpRest}
                className={cx('label', labelSpClass as string | undefined)}
                style={labelSpStyle as React.CSSProperties}
                aria-live="polite"
              >
                <span className={styles.srOnly}>{labels.meter}: </span>
                {levelName}
              </span>
            )}
            {props.children as React.ReactNode}
          </div>
        );
      },
    };
  },
});

// =============================================================================
// Requirements
// =============================================================================

const Requirements = withMoveComponent<
  RequirementsSlots,
  PasswordStrengthRequirementsProps,
  HTMLUListElement
>({
  name: 'PasswordStrengthRequirements',
  styles,
  slots: ['requirements', 'requirement', 'requirementIcon', 'requirementLabel'] as const,
  moveProps: ['requirements', 'labels'],

  setup({ props, ref, cx, sp, attrs }) {
    const labels = {
      ...DEFAULT_LABELS,
      ...(props.labels as Partial<PasswordStrengthLabels> | undefined),
    };
    const checkIcon = useIcon('valid', 16);
    const xIcon = useIcon('invalid', 16);

    return {
      render() {
        const listSp = sp('requirements');
        const {
          className: listSpClass,
          style: listSpStyle,
          ...listSpRest
        } = listSp as Record<string, unknown>;
        const reqSp = sp('requirement');
        const {
          className: reqSpClass,
          style: reqSpStyle,
          ...reqSpRest
        } = reqSp as Record<string, unknown>;
        const iconSp = sp('requirementIcon');
        const {
          className: iconSpClass,
          style: iconSpStyle,
          ...iconSpRest
        } = iconSp as Record<string, unknown>;
        const reqLabelSp = sp('requirementLabel');
        const {
          className: reqLabelSpClass,
          style: reqLabelSpStyle,
          ...reqLabelSpRest
        } = reqLabelSp as Record<string, unknown>;

        const requirements = (props.requirements as PasswordRequirement[] | undefined) ?? [];

        return (
          <ul
            {...attrs}
            {...listSpRest}
            ref={ref}
            className={cx('requirements', props.className, listSpClass as string | undefined)}
            style={{
              ...(props.style as React.CSSProperties),
              ...(listSpStyle as React.CSSProperties),
            }}
          >
            {requirements.map((req, i) => (
              <li
                key={i}
                {...reqSpRest}
                className={cx('requirement', reqSpClass as string | undefined)}
                style={reqSpStyle as React.CSSProperties}
                data-met={req.met ? 'true' : 'false'}
              >
                <span
                  {...iconSpRest}
                  className={cx('requirementIcon', iconSpClass as string | undefined)}
                  style={iconSpStyle as React.CSSProperties}
                  data-met={req.met ? 'true' : 'false'}
                >
                  <span className={styles.srOnly}>{req.met ? labels.met : labels.unmet}</span>
                  <span aria-hidden="true">{req.met ? checkIcon : xIcon}</span>
                </span>
                <span
                  {...reqLabelSpRest}
                  className={cx('requirementLabel', reqLabelSpClass as string | undefined)}
                  style={reqLabelSpStyle as React.CSSProperties}
                >
                  {req.label}
                </span>
              </li>
            ))}
          </ul>
        );
      },
    };
  },
});

// =============================================================================
// Compound export
// =============================================================================

export const PasswordStrength = Object.assign(PasswordStrengthRoot, {
  Root: PasswordStrengthRoot,
  Requirements,
});
