'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { withMoveComponent } from '../../../engine';
import { animate as animeAnimate } from 'animejs';
import { Presence, usePresence, toAnimeParams, toInstantParams, prefersReducedMotion } from '../../../animation';
import type { Animation } from '../../../animation';
import type { LayerAnimate } from '../../../animation/types';
import { useResolvedIcon } from '../../core/Icon/useResolvedIcon';
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

export interface ToastViewportProps extends Record<string, unknown> {
  position?: ToastPosition;
  animate?: LayerAnimate | false;
  closeLabel?: string;
}

// =============================================================================
// Animation context — passed from Viewport to ToastItem
// =============================================================================

// undefined = use defaults (normal behavior)
// null = animations disabled (animate={false})
const ToastAnimateContext = React.createContext<LayerAnimate | null | undefined>(undefined);
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
// Animation configs per position (using Move Animation types + spring presets)
// =============================================================================

function getEnterSlide(position: ToastPosition): Animation {
  switch (position) {
    case 'top-right':
    case 'bottom-right':
      return { x: [400, 0], opacity: [0, 1], scale: [0.92, 1], easing: 'snappy' };
    case 'top-left':
    case 'bottom-left':
      return { x: [-400, 0], opacity: [0, 1], scale: [0.92, 1], easing: 'snappy' };
    case 'top-center':
      return { y: [-80, 0], opacity: [0, 1], scale: [0.92, 1], easing: 'snappy' };
    case 'bottom-center':
      return { y: [80, 0], opacity: [0, 1], scale: [0.92, 1], easing: 'snappy' };
    default:
      return { x: [400, 0], opacity: [0, 1], scale: [0.92, 1], easing: 'snappy' };
  }
}

function getExitSlide(position: ToastPosition): Animation {
  switch (position) {
    case 'top-right':
    case 'bottom-right':
      return { x: [0, 400], opacity: [1, 0], easing: 'outQuart', duration: 400 };
    case 'top-left':
    case 'bottom-left':
      return { x: [0, -400], opacity: [1, 0], easing: 'outQuart', duration: 400 };
    case 'top-center':
      return { y: [0, -80], opacity: [1, 0], easing: 'outQuart', duration: 400 };
    case 'bottom-center':
      return { y: [0, 80], opacity: [1, 0], easing: 'outQuart', duration: 400 };
    default:
      return { x: [0, 400], opacity: [1, 0], easing: 'outQuart', duration: 400 };
  }
}

const heightExpand: Animation = { easing: 'stiff' };

function runAnimation(el: HTMLElement, animation: Animation) {
  const params = prefersReducedMotion()
    ? toInstantParams(animation)
    : toAnimeParams(animation);
  return animeAnimate(el, params);
}

// =============================================================================
// ToastItem (internal) — each toast is independent with its own timer
// =============================================================================

function ToastItem({ toast }: { toast: ToastState }) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const itemRef = React.useRef<HTMLDivElement>(null);
  const progressRef = React.useRef<HTMLDivElement>(null);
  const hasAnimatedEnter = React.useRef(false);
  const hasAnimatedExit = React.useRef(false);

  const [isPresent, safeToRemove] = usePresence();
  const animateConfig = React.useContext(ToastAnimateContext);
  const closeLabel = React.useContext(ToastCloseLabelContext);
  const closeIcon = useResolvedIcon('x', 14);

  // Enter: expand height → slide in
  React.useEffect(() => {
    const wrapper = wrapperRef.current;
    const item = itemRef.current;
    if (!wrapper || !item || hasAnimatedEnter.current) return;
    hasAnimatedEnter.current = true;

    if (animateConfig === null || prefersReducedMotion()) {
      return;
    }

    const naturalHeight = wrapper.offsetHeight;

    wrapper.style.height = '0px';
    item.style.opacity = '0';

    const enterAnim = animateConfig?.enter;

    const heightAnim = runAnimation(wrapper, {
      ...heightExpand,
      height: [0, naturalHeight],
    });

    heightAnim.then(() => {
      wrapper.style.height = '';
    });

    runAnimation(item, {
      ...(enterAnim ?? getEnterSlide(toast.position)),
      ...(enterAnim ? {} : { delay: 60 }),
    }).then(() => {
      if (item) {
        item.style.opacity = '';
        item.style.transform = '';
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Exit: slide out → collapse height → safeToRemove
  React.useEffect(() => {
    if (isPresent || hasAnimatedExit.current) return;
    hasAnimatedExit.current = true;

    const wrapper = wrapperRef.current;
    const item = itemRef.current;

    if (!wrapper || !item || animateConfig === null || prefersReducedMotion()) {
      safeToRemove();
      return;
    }

    const exitAnim = animateConfig?.exit;

    // Slide out
    runAnimation(item, exitAnim ?? getExitSlide(toast.position)).then(() => {
      // Collapse wrapper height, then remove
      const currentHeight = wrapper.offsetHeight;
      runAnimation(wrapper, {
        height: [currentHeight, 0],
        easing: 'stiff',
      }).then(() => safeToRemove());
    });
  }, [isPresent, safeToRemove, toast.position, animateConfig]);

  // Auto-dismiss: countdown on progress bar, pause on hover
  React.useEffect(() => {
    const bar = progressRef.current;
    const el = itemRef.current;
    if (!bar || !el || !isPresent || toast.duration <= 0) return;

    const toastId = toast.id;

    const countdown: Animation = {
      scaleX: [1, 0],
      easing: 'linear',
      duration: toast.duration,
    };

    const anim = animeAnimate(bar, {
      ...toAnimeParams(countdown),
      onComplete: () => removeToast(toastId),
    });

    const pause = () => anim.pause();
    const resume = () => anim.play();

    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', resume);

    return () => {
      anim.pause();
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      el.removeEventListener('focusin', pause);
      el.removeEventListener('focusout', resume);
    };
  }, [isPresent, toast.id, toast.duration]);

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
  moveProps: ['position', 'animate', 'closeLabel'] as const,
  setup({ props, ref, cx, ptm, attrs }) {
    const allToasts = useToastStore();

    // Resolve animate prop:
    // - false → null (animations disabled)
    // - LayerAnimate → use custom config
    // - undefined → use defaults
    const animateConfig = props.animate === false
      ? null
      : (props.animate as LayerAnimate | undefined) ?? undefined;

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
        const viewportPt = ptm('viewport');
        const { className: ptClass, style: ptStyle, ...ptRest } = viewportPt as Record<string, unknown>;

        return createPortal(
          <ToastCloseLabelContext.Provider value={(props.closeLabel as string) ?? 'Close notification'}>
          <ToastAnimateContext.Provider value={animateConfig}>
            <div
              {...attrs}
              {...ptRest}
              ref={ref}
              className={cx('viewport', props.className as string | undefined, ptClass as string | undefined)}
              style={{ ...(props.style as React.CSSProperties), ...(ptStyle as React.CSSProperties) }}
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
