'use client';
// Generated from Image.spec.ts
import * as React from 'react';
import { composeHandlers, withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { useIcon } from '../../../infrastructure/Icon';
import type { Radius, Dimension } from '../../../shared/types';
import styles from './Image.module.css';

// =============================================================================
// Types
// =============================================================================

export type ImageFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
/** Re-exported for backwards-compatible imports. Prefer `Radius` from
 *  `'move'` directly going forward. */
export type ImageRadius = Radius;
export type ImagePosition =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top left'
  | 'top right'
  | 'bottom left'
  | 'bottom right';
type ImageSlots = 'root' | 'backdrop' | 'img' | 'fallback' | 'action';

/** Describes one responsive image variant with its intrinsic pixel width. */
export interface ImageSource {
  src: string;
  width: number;
}

// =============================================================================
// Image
// =============================================================================

export interface ImageProps extends React.HTMLAttributes<HTMLElement> {
  src?: string;
  sources?: ImageSource[];
  alt?: string;
  fallbackSrc?: string;
  fit?: ImageFit;
  /** Fill letterbox bands with a blurred, scaled-up copy of the image
   *  behind it (Apple Music / Spotify pattern). Best with `fit="contain"`. */
  backdrop?: boolean;
  radius?: ImageRadius;
  position?: ImagePosition;
  aspectRatio?: string;
  width?: Dimension;
  height?: Dimension;
  loading?: 'lazy' | 'eager';
  action?: React.ReactNode;
  /** Mark the image as a click target — adds cursor: pointer, hover
   *  tint, focus ring, and Enter/Space activation. Shared opt-in
   *  pattern with `Table.Row` and `List.Item`. */
  interactive?: boolean;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  onError?: React.ReactEventHandler<HTMLImageElement>;
  /** Click handler. Combine with `interactive` (or pass `onClick` to
   *  imply interactivity) for keyboard-accessible click targets. */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<ImageSlots>;
}

export const Image = withMoveComponent<ImageSlots, ImageProps, HTMLDivElement>({
  name: 'Image',
  styles,
  slots: ['root', 'backdrop', 'img', 'fallback', 'action'] as const,
  defaults: { fit: 'cover', radius: 'none', position: 'center', backdrop: false },
  moveProps: [
    'src',
    'sources',
    'alt',
    'fallbackSrc',
    'fit',
    'backdrop',
    'radius',
    'position',
    'aspectRatio',
    'width',
    'height',
    'loading',
    'action',
    'interactive',
    'onLoad',
    'onError',
  ],

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    const [error, setError] = React.useState(false);
    const fallbackErrorIcon = useIcon('imageError', 24);
    const sources = props.sources as ImageSource[] | undefined;

    // ---- Responsive source resolution ----
    const [resolvedSrc, setResolvedSrc] = React.useState<string | undefined>(undefined);

    React.useLayoutEffect(() => {
      if (!sources || sources.length === 0 || !internalRef.current) return;

      const sorted = [...sources].sort((a, b) => a.width - b.width);

      function selectSource(containerWidth: number): string {
        const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
        const effectiveWidth = containerWidth * dpr;
        const match = sorted.find((s) => s.width >= effectiveWidth);
        return match ? match.src : sorted[sorted.length - 1].src;
      }

      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width;
          if (width > 0) {
            setResolvedSrc((prev) => {
              const next = selectSource(width);
              return prev === next ? prev : next;
            });
          }
        }
      });

      observer.observe(internalRef.current);
      return () => observer.disconnect();
    }, [sources, internalRef]);

    const [loaded, setLoaded] = React.useState(false);

    // ---- Error/loaded reset on source change ----
    const baseSrc = resolvedSrc ?? (props.src as string | undefined);
    const baseSrcRef = React.useRef(baseSrc);
    if (baseSrcRef.current !== baseSrc) {
      baseSrcRef.current = baseSrc;
      if (error) setError(false);
      setLoaded(false);
    }

    const handleLoad = React.useCallback(
      (e: React.SyntheticEvent<HTMLImageElement>) => {
        setLoaded(true);
        (props.onLoad as React.ReactEventHandler<HTMLImageElement> | undefined)?.(e);
      },
      [props.onLoad],
    );

    const handleError = React.useCallback(
      (e: React.SyntheticEvent<HTMLImageElement>) => {
        setError(true);
        (props.onError as React.ReactEventHandler<HTMLImageElement> | undefined)?.(e);
      },
      [props.onError],
    );

    return {
      render() {
        const rootSp = sp('root');
        const {
          className: rootSpClass,
          style: rootSpStyle,
          ...rootSpRest
        } = rootSp as Record<string, unknown>;

        const backdropSp = sp('backdrop');
        const {
          className: bdSpClass,
          style: bdSpStyle,
          ...bdSpRest
        } = backdropSp as Record<string, unknown>;

        const imgSp = sp('img');
        const {
          className: imgSpClass,
          style: imgSpStyle,
          ...imgSpRest
        } = imgSp as Record<string, unknown>;

        const fallbackSp = sp('fallback');
        const {
          className: fbSpClass,
          style: fbSpStyle,
          ...fbSpRest
        } = fallbackSp as Record<string, unknown>;

        const actionSp = sp('action');
        const {
          className: actionSpClass,
          style: actionSpStyle,
          ...actionSpRest
        } = actionSp as Record<string, unknown>;

        const width = props.width as string | number | undefined;
        const height = props.height as string | number | undefined;
        const aspectRatio = props.aspectRatio as string | undefined;
        const fallbackSrc = props.fallbackSrc as string | undefined;
        const showFallback = error && !fallbackSrc;
        const effectiveSrc = error && fallbackSrc ? fallbackSrc : baseSrc;
        const showBackdrop = !!props.backdrop && !showFallback && !!effectiveSrc;

        const rootStyle: React.CSSProperties = {
          ...(width != null
            ? { width: typeof width === 'number' ? `${width}px` : width }
            : undefined),
          ...(height != null
            ? { height: typeof height === 'number' ? `${height}px` : height }
            : undefined),
          ...(aspectRatio ? { aspectRatio } : undefined),
          ...props.style,
          ...(rootSpStyle as React.CSSProperties),
        };

        // Shared "clickable tile" pattern with Table.Row and List.Item:
        // explicit `interactive` prop OR an onClick implies the tile
        // should respond to click + keyboard activation. data-interactive
        // hooks the cursor / hover / focus styling.
        const userOnClick = props.onClick as
          ((e: React.MouseEvent<HTMLDivElement>) => void) | undefined;
        const isInteractive = !!(props.interactive || userOnClick);
        const interactiveAttrs = isInteractive
          ? {
              role: 'button' as const,
              tabIndex: 0,
              onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
                if (!userOnClick) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  userOnClick(e as unknown as React.MouseEvent<HTMLDivElement>);
                }
              },
            }
          : null;

        return (
          <div
            {...attrs}
            {...rootSpRest}
            ref={ref}
            data-fit={props.fit}
            data-radius={props.radius}
            data-position={props.position}
            data-backdrop={showBackdrop ? '' : undefined}
            data-interactive={isInteractive ? '' : undefined}
            className={cx('root', props.className, rootSpClass as string | undefined)}
            style={rootStyle}
            onClick={composeHandlers(attrs.onClick, userOnClick)}
            {...interactiveAttrs}
          >
            {showBackdrop && (
              <img
                {...(bdSpRest as React.ImgHTMLAttributes<HTMLImageElement>)}
                src={effectiveSrc}
                alt=""
                aria-hidden
                loading={props.loading as 'lazy' | 'eager' | undefined}
                className={cx('backdrop', bdSpClass as string | undefined)}
                style={bdSpStyle as React.CSSProperties}
              />
            )}

            {!showFallback && effectiveSrc && (
              <img
                {...(imgSpRest as React.ImgHTMLAttributes<HTMLImageElement>)}
                src={effectiveSrc}
                alt={props.alt as string}
                loading={props.loading as 'lazy' | 'eager' | undefined}
                data-loaded={loaded ? '' : undefined}
                className={cx('img', imgSpClass as string | undefined)}
                style={imgSpStyle as React.CSSProperties}
                onLoad={handleLoad}
                onError={handleError}
              />
            )}

            {showFallback && (
              <div
                {...fbSpRest}
                className={cx('fallback', fbSpClass as string | undefined)}
                style={fbSpStyle as React.CSSProperties}
              >
                {props.children || fallbackErrorIcon}
              </div>
            )}

            {props.action && !showFallback && (
              <div
                {...actionSpRest}
                className={cx('action', actionSpClass as string | undefined)}
                style={actionSpStyle as React.CSSProperties}
              >
                {props.action as React.ReactNode}
              </div>
            )}
          </div>
        );
      },
    };
  },
});
