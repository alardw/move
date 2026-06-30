'use client';
// Generated from Stepper.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { useResolvedIcon } from '../../../infrastructure/Icon';
import type { Color, Size } from '../../../shared/types';
import styles from './Stepper.module.css';

// ============================================================================
// Types
// ============================================================================

/** Re-exported for backwards-compatible imports. Prefer `Size` from
 *  `'move'` directly going forward. */
export type StepperSize = Size;
export type StepperOrientation = 'horizontal' | 'vertical';
export type StepStatus = 'wait' | 'active' | 'complete' | 'error';
/** Re-exported for backwards-compatible imports. Prefer `Color` from
 *  `'move'` directly going forward. */
export type StepperColor = Color;

// ============================================================================
// Context
// ============================================================================

interface StepperContextValue {
  active: number;
  orientation: StepperOrientation;
  onStepClick?: (index: number) => void;
}

const StepperContext = React.createContext<StepperContextValue | null>(null);

function useStepperContext() {
  const context = React.useContext(StepperContext);
  if (!context) throw new Error('Stepper components must be used within Stepper.Root');
  return context;
}

interface StepItemContextValue {
  index: number;
  status: StepStatus;
  isLast: boolean;
}

const StepItemContext = React.createContext<StepItemContextValue | null>(null);

function useStepItemContext() {
  const context = React.useContext(StepItemContext);
  if (!context) throw new Error('Stepper sub-components must be used within Stepper.Step');
  return context;
}

// ============================================================================
// Root
// ============================================================================

export interface StepperRootProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  active?: number;
  onStepClick?: (index: number) => void;
  orientation?: StepperOrientation;
  size?: StepperSize;
  color?: StepperColor;
  sp?: SlotPropsMap<'root'>;
}

const StepperRoot = withMoveComponent<'root', StepperRootProps, HTMLDivElement>({
  name: 'Stepper',
  styles,
  slots: ['root'] as const,
  defaults: { active: 0, orientation: 'horizontal', size: 'md', color: 'indigo' as StepperColor },
  moveProps: ['active', 'onStepClick', 'orientation', 'size', 'color'],

  setup({ props, ref, cx, sp, attrs }) {
    const { className, style, children, active, onStepClick, orientation } = props;

    const contextValue: StepperContextValue = {
      active: active as number,
      orientation: orientation as StepperOrientation,
      onStepClick: onStepClick as ((index: number) => void) | undefined,
    };

    // Count children to determine isLast
    const childArray = React.Children.toArray(children);
    const totalSteps = childArray.length;

    // Inject index and isLast into Step children via context
    let stepIndex = 0;
    const enrichedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && (child.type as any)?._moveComponentName === 'StepperStep') {
        const idx = stepIndex++;
        const status: StepStatus = (child.props as any).status
          || (idx < (active as number) ? 'complete' : idx === (active as number) ? 'active' : 'wait');
        return (
          <StepItemContext.Provider value={{ index: idx, status, isLast: idx === totalSteps - 1 }}>
            {child}
          </StepItemContext.Provider>
        );
      }
      return child;
    });

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        return (
          <StepperContext.Provider value={contextValue}>
            <div
              {...attrs}
              {...spRest}
              ref={ref}
              role="list"
              data-orientation={props.orientation}
              data-size={props.size}
              data-color={props.color}
              className={cx('root', className, spClass as string | undefined)}
              style={{ ...style, ...(spStyle as React.CSSProperties) }}
            >
              {enrichedChildren}
            </div>
          </StepperContext.Provider>
        );
      },
    };
  },
});

// ============================================================================
// Step
// ============================================================================

export interface StepperStepProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  status?: StepStatus;
  loading?: boolean;
  sp?: SlotPropsMap<'step'>;
}

const StepperStep = withMoveComponent<'step', StepperStepProps, HTMLDivElement>({
  name: 'StepperStep',
  styles,
  slots: ['step'] as const,
  moveProps: ['status', 'loading'],

  setup({ props, ref, cx, sp, attrs }) {
    const { className, style, children } = props;
    const rootCtx = useStepperContext();
    const itemCtx = useStepItemContext();
    const isClickable = !!rootCtx.onStepClick;

    const handleClick = () => {
      if (isClickable) {
        rootCtx.onStepClick!(itemCtx.index);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        rootCtx.onStepClick!(itemCtx.index);
      }
    };

    return {
      render() {
        const stepSp = sp('step');
        const { className: spClass, style: spStyle, ...spRest } = stepSp as Record<string, unknown>;

        const parts = React.Children.toArray(children);
        const indicatorParts: React.ReactNode[] = [];
        const contentParts: React.ReactNode[] = [];

        for (const part of parts) {
          if (
            React.isValidElement(part)
            && (part.type as { _moveComponentName?: string })._moveComponentName === 'StepperIndicator'
          ) {
            indicatorParts.push(part);
            continue;
          }
          contentParts.push(part);
        }

        if (rootCtx.orientation === 'vertical') {
          return (
            <div
              {...attrs}
              {...spRest}
              ref={ref}
              role="listitem"
              data-status={itemCtx.status}
              data-clickable={isClickable ? 'true' : undefined}
              className={cx('step', className, spClass as string | undefined)}
              style={{ ...style, ...(spStyle as React.CSSProperties) }}
              onClick={isClickable ? handleClick : undefined}
              onKeyDown={isClickable ? handleKeyDown : undefined}
              tabIndex={isClickable ? 0 : undefined}
            >
              <div className={styles.rail}>
                {indicatorParts[0] ?? <StepperIndicator />}
                {!itemCtx.isLast && (
                  <StepperSeparatorInternal
                    side="end"
                    complete={itemCtx.status === 'complete'}
                  />
                )}
              </div>
              <div className={styles.content}>
                {contentParts}
              </div>
            </div>
          );
        }

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            role="listitem"
            data-status={itemCtx.status}
            data-clickable={isClickable ? 'true' : undefined}
            className={cx('step', className, spClass as string | undefined)}
            style={{ ...style, ...(spStyle as React.CSSProperties) }}
            onClick={isClickable ? handleClick : undefined}
            onKeyDown={isClickable ? handleKeyDown : undefined}
            tabIndex={isClickable ? 0 : undefined}
          >
            {itemCtx.index > 0 && (
              <StepperSeparatorInternal
                side="start"
                complete={itemCtx.status !== 'wait'}
              />
            )}
            {children}
            {!itemCtx.isLast && (
              <StepperSeparatorInternal
                side="end"
                complete={itemCtx.status === 'complete'}
              />
            )}
          </div>
        );
      },
    };
  },
});

// Attach a name so Root can identify Step children
(StepperStep as any)._moveComponentName = 'StepperStep';

// ============================================================================
// Indicator
// ============================================================================

export interface StepperIndicatorProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  completedIcon?: React.ReactNode;
  sp?: SlotPropsMap<'indicator'>;
}

const StepperIndicator = withMoveComponent<'indicator', StepperIndicatorProps, HTMLDivElement>({
  name: 'StepperIndicator',
  styles,
  slots: ['indicator'] as const,
  moveProps: ['icon', 'completedIcon'],

  setup({ props, ref, cx, sp, attrs }) {
    const { className, style, children, icon, completedIcon } = props;
    const itemCtx = useStepItemContext();
    const checkIcon = useResolvedIcon('check', 16);

    let content: React.ReactNode;
    if (children) {
      content = children;
    } else if (itemCtx.status === 'complete') {
      content = completedIcon || checkIcon;
    } else if (icon) {
      content = icon;
    } else {
      content = itemCtx.index + 1;
    }

    return {
      render() {
        const indicatorSp = sp('indicator');
        const { className: spClass, style: spStyle, ...spRest } = indicatorSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            aria-hidden="true"
            className={cx('indicator', className, spClass as string | undefined)}
            style={{ ...style, ...(spStyle as React.CSSProperties) }}
          >
            {content}
          </div>
        );
      },
    };
  },
});
(StepperIndicator as any)._moveComponentName = 'StepperIndicator';

// ============================================================================
// Title
// ============================================================================

export interface StepperTitleProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'title'>;
}

const StepperTitle = withMoveComponent<'title', StepperTitleProps, HTMLDivElement>({
  name: 'StepperTitle',
  styles,
  slots: ['title'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const titleSp = sp('title');
        const { className: spClass, style: spStyle, ...spRest } = titleSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('title', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Description
// ============================================================================

export interface StepperDescriptionProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'description'>;
}

const StepperDescription = withMoveComponent<'description', StepperDescriptionProps, HTMLDivElement>({
  name: 'StepperDescription',
  styles,
  slots: ['description'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const descSp = sp('description');
        const { className: spClass, style: spStyle, ...spRest } = descSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('description', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Separator (public)
// ============================================================================

export interface StepperSeparatorProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'separator'>;
}

const StepperSeparator = withMoveComponent<'separator', StepperSeparatorProps, HTMLDivElement>({
  name: 'StepperSeparator',
  styles,
  slots: ['separator'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const itemCtx = useStepItemContext();

    return {
      render() {
        const sepSp = sp('separator');
        const { className: spClass, style: spStyle, ...spRest } = sepSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            aria-hidden="true"
            data-complete={itemCtx.status === 'complete' ? 'true' : undefined}
            className={cx('separator', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          />
        );
      },
    };
  },
});

// Internal separator auto-rendered by Step
function StepperSeparatorInternal({ side, complete }: { side: 'start' | 'end'; complete: boolean }) {
  return (
    <div
      aria-hidden="true"
      data-side={side}
      data-complete={complete ? 'true' : undefined}
      className={styles.separator}
    />
  );
}

// ============================================================================
// Completed
// ============================================================================

export interface StepperCompletedProps {
  children?: React.ReactNode;
}

function StepperCompleted({ children }: StepperCompletedProps) {
  return <>{children}</>;
}

// ============================================================================
// useStepper hook
// ============================================================================

export interface UseStepperOptions {
  initialStep?: number;
  count: number;
}

export interface UseStepperReturn {
  activeStep: number;
  setActiveStep: (step: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function useStepper({ initialStep = 0, count }: UseStepperOptions): UseStepperReturn {
  const [activeStep, setActiveStep] = React.useState(initialStep);

  return {
    activeStep,
    setActiveStep,
    goToNext: () => setActiveStep((prev) => Math.min(prev + 1, count - 1)),
    goToPrevious: () => setActiveStep((prev) => Math.max(prev - 1, 0)),
    isFirst: activeStep === 0,
    isLast: activeStep >= count - 1,
  };
}

// ============================================================================
// Export
// ============================================================================

export const Stepper = Object.assign(StepperRoot, {
  Step: StepperStep,
  Indicator: StepperIndicator,
  Title: StepperTitle,
  Description: StepperDescription,
  Separator: StepperSeparator,
  Completed: StepperCompleted,
});
