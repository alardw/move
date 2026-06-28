'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { withMoveComponent } from '../../../engine';
import { Presence, usePresence, useAnimations, resolveAnimationsConfig, quick } from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import { useResolvedIcon } from '../../../infrastructure/Icon/useResolvedIcon';
import {
  useToastStore,
  removeToast,
  type ToastState,
  type ToastPosition,
} from './store';
import styles from './Toast.module.css';

// =============================================================================
// Types
// =============================================================================

export interface ToastLabels {
  /** Accessible label for toast close buttons */
  close: string;
}

const DEFAULT_LABELS: ToastLabels = {
  close: 'Close notification',
};

export interface ToastViewportProps extends React.HTMLAttributes<HTMLElement> {
  position?: ToastPosition;
  animations?: AnimationTrigger[] | false;
  labels?: Partial<ToastLabels>;
}

export type { ToastState, ToastPosition, ToastVariant, ToastOptions } from './store';
export { toast } from './store';

// =============================================================================
// Animation context — passed from Viewport to ToastItem
// =============================================================================

// null = animations disabled (animations={false})
const ToastAnimateContext = React.createContext<AnimationTrigger[] | false | null>(null);
const ToastCloseLabelContext = React.createContext('Close notification');

// =============================================================================
// Variant icon mapping
// =============================================================================

const VARIANT_ICONS: Record<string, string> = {
  info: 'info',
  success: 'circle-check',
  warning: 'triangle-alert',
  error: 'circle-x',
};

const VARIANT_ICON_SIZE = 18;

// =============================================================================
// VariantIcon — resolved via IconProvider with built-in SVG fallback
// =============================================================================

function VariantIcon({ variant }: { variant: string }) {
  const iconName = VARIANT_ICONS[variant];
  if (!iconName) return null;

  const resolved = useResolvedIcon(iconName, VARIANT_ICON_SIZE);
  return resolved ? <>{resolved}</> : null;
}

// =============================================================================
// Default animation config (target-based)
// =============================================================================

const DEFAULT_TOAST_ANIMATIONS: AnimationTrigger[] = [
  {
    trigger: 'Item.enter',
    sequence: [
      { target: 'Item', animation: {
        translateY: { from: 16, to: 0, ease: quick, duration: 250 },
        opacity: { from: 0, to: 1, ease: 'outQuart', duration: 250 },
      } },
    ],
  },
  {
    trigger: 'Wrapper.exit',
    sequence: [
      { target: 'Item', animation: {
        translateY: { from: 0, to: 16, ease: 'outQuart', duration: 200 },
        opacity: { from: 1, to: 0, ease: 'outQuart', duration: 200 },
      } },
      { target: 'Wrapper', fn: 'animateDimension', animation: { height: { ease: 'inOutQuart', duration: 300 } } },
    ],
  },
];

// =============================================================================
// ToastItem (internal) — each toast is independent with its own timer
// =============================================================================

function ToastItem({ toast }: { toast: ToastState }) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const itemRef = React.useRef<HTMLDivElement>(null);
  const progressRef = React.useRef<HTMLDivElement>(null);

  const [isPresent, safeToRemove] = usePresence();
  const animConfig = React.useContext(ToastAnimateContext);
  const closeLabel = React.useContext(ToastCloseLabelContext);
  const closeIcon = useResolvedIcon('x', 14);

  const isClosing = !isPresent;

  const refs = React.useMemo(() => ({
    Wrapper: wrapperRef as React.RefObject<HTMLElement | null>,
    Item: itemRef as React.RefObject<HTMLElement | null>,
  }), []);
  const { runExit } = useAnimations(animConfig, refs);

  // Exit — run exit sequences then signal safe to remove
  React.useEffect(() => {
    if (!isClosing) return;
    if (!animConfig) { safeToRemove?.(); return; }
    runExit().then(() => safeToRemove?.());
  }, [isClosing]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-dismiss: countdown on progress bar via useAnimations, pause on hover
  const toastId = toast.id;
  const toastDuration = toast.duration;

  const progressConfig: AnimationTrigger[] | null = React.useMemo(() => {
    if (!isPresent || toastDuration <= 0) return null;
    return [{
      trigger: 'Progress.enter',
      sequence: [{
        target: 'Progress',
        animation: { scaleX: { from: 1, to: 0, ease: 'linear', duration: toastDuration } },
      }],
      onComplete: () => removeToast(toastId),
    }];
  }, [isPresent, toastId, toastDuration]);

  const progressRefs = React.useMemo(() => ({
    Progress: progressRef as React.RefObject<HTMLElement | null>,
  }), []);

  const { pauseAll: pauseProgress, resumeAll: resumeProgress } = useAnimations(progressConfig, progressRefs);

  // Pause/resume progress on hover/focus
  React.useEffect(() => {
    const el = itemRef.current;
    if (!el || !isPresent || toastDuration <= 0) return;

    const pause = () => pauseProgress();
    const resume = () => resumeProgress();

    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', resume);

    return () => {
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      el.removeEventListener('focusin', pause);
      el.removeEventListener('focusout', resume);
    };
  }, [isPresent, toastDuration, pauseProgress, resumeProgress]);

  const hasIcon = toast.variant !== 'default';

  return (
    <div ref={wrapperRef} className={styles.itemWrapper}>
      <div
        ref={itemRef}
        className={styles.item}
        data-variant={toast.variant}
        data-position={toast.position}
        role="status"
        aria-live="polite"
      >
        {hasIcon && (
          <span className={styles.icon} data-variant={toast.variant}>
            <VariantIcon variant={toast.variant} />
          </span>
        )}
        <div className={styles.content}>
          <div className={styles.message}>{toast.message}</div>
          {toast.description && (
            <div className={styles.description}>{toast.description}</div>
          )}
        </div>
        {isPresent && (
          <button
            className={styles.closeButton}
            onClick={() => removeToast(toast.id)}
            aria-label={closeLabel}
          >
            {closeIcon}
          </button>
        )}
        <div
          ref={progressRef}
          className={styles.progressBar}
          style={{ visibility: toast.duration > 0 ? 'visible' : 'hidden' }}
        />
      </div>
    </div>
  );
}

// =============================================================================
// Toast.Viewport
// =============================================================================

const POSITIONS: ToastPosition[] = [
  'top-right',
  'top-left',
  'top-center',
  'bottom-right',
  'bottom-left',
  'bottom-center',
];

const ToastViewport = withMoveComponent<
  'viewport',
  ToastViewportProps,
  HTMLDivElement
>({
  name: 'ToastViewport',
  styles,
  slots: ['viewport'] as const,
  moveProps: ['position', 'animations', 'labels'] as const,
  setup({ props, ref, cx, sp, attrs }) {
    const labels = { ...DEFAULT_LABELS, ...(props.labels as Partial<ToastLabels>) };
    const allToasts = useToastStore();

    // Resolve animations prop (memoize to avoid re-triggering enter animations)
    const animationsProp = props.animations;
    const animConfig = React.useMemo(
      () => resolveAnimationsConfig(
        DEFAULT_TOAST_ANIMATIONS,
        animationsProp as AnimationTrigger[] | false | undefined,
      ),
      [animationsProp],
    );

    // Group toasts by position (max enforced by the store on add)
    const grouped = React.useMemo(() => {
      const map = new Map<ToastPosition, ToastState[]>();
      for (const t of allToasts) {
        const pos = t.position;
        if (!map.has(pos)) map.set(pos, []);
        map.get(pos)!.push(t);
      }
      return map;
    }, [allToasts]);

    return {
      render() {
        const viewportSp = sp('viewport');
        const { className: spClass, style: spStyle, ...spRest } = viewportSp as Record<string, unknown>;

        return createPortal(
          <ToastCloseLabelContext.Provider value={labels.close}>
          <ToastAnimateContext.Provider value={animConfig}>
            <div
              {...attrs}
              {...spRest}
              ref={ref}
              className={cx('viewport', props.className as string | undefined, spClass as string | undefined)}
              style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
            >
              {POSITIONS.map((pos) => (
                <div
                  key={pos}
                  className={styles.positionContainer}
                  data-position={pos}
                >
                  <Presence>
                    {(grouped.get(pos) ?? []).map((t) => (
                      <ToastItem key={t.id} toast={t} />
                    ))}
                  </Presence>
                </div>
              ))}
            </div>
          </ToastAnimateContext.Provider>
          </ToastCloseLabelContext.Provider>,
          document.body
        );
      },
    };
  },
});

// =============================================================================
// Export
// =============================================================================

export const Toast = Object.assign({} as Record<string, never>, {
  Viewport: ToastViewport,
});
