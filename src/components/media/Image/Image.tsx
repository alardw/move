'use client';

import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine/types';
import { Icon } from '../../core/Icon';
import styles from './Image.module.css';

// =============================================================================
// Types
// =============================================================================

export type ImageFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
export type ImageRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type ImagePosition = 'center' | 'top' | 'bottom' | 'left' | 'right'
  | 'top left' | 'top right' | 'bottom left' | 'bottom right';
type ImageSlots = 'root' | 'img' | 'fallback' | 'action';

/** Describes one responsive image variant with its intrinsic pixel width. */
export interface ImageSource {
  src: string;
  width: number;
}

// =============================================================================
// Image
// =============================================================================

export interface ImageProps extends Record<string, unknown> {
  src?: string;
  sources?: ImageSource[];
  alt?: string;
  fallbackSrc?: string;
  fit?: ImageFit;
  radius?: ImageRadius;
  position?: ImagePosition;
  aspectRatio?: string;
  width?: string | number;
  height?: string | number;
  loading?: 'lazy' | 'eager';
  action?: React.ReactNode;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  onError?: React.ReactEventHandler<HTMLImageElement>;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<ImageSlots>;
}

export const Image = withMoveComponent<ImageSlots, ImageProps, HTMLDivElement>({
  name: 'Image',
  styles,
  slots: ['root', 'img', 'fallback', 'action'] as const,
  defaults: { fit: 'cover', radius: 'none', position: 'center' },
  moveProps: [
    'src', 'sources', 'alt', 'fallbackSrc', 'fit', 'radius', 'position',
    'aspectRatio', 'width', 'height', 'loading', 'action', 'onLoad', 'onError',
  ],

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    const [error, setError] = React.useState(false);
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

    // ---- Error state reset on source change ----
    const baseSrc = resolvedSrc ?? (props.src as string | undefined);
    const baseSrcRef = React.useRef(baseSrc);
    if (baseSrcRef.current !== baseSrc) {
      baseSrcRef.current = baseSrc;
      if (error) setError(false);
    }

    const handleLoad = React.useCallback(
      (e: React.SyntheticEvent<HTMLImageElement>) => {
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
        const { className: rootSpClass, style: rootSpStyle, ...rootSpRest } = rootSp as Record<string, unknown>;

        const imgSp = sp('img');
        const { className: imgSpClass, style: imgSpStyle, ...imgSpRest } = imgSp as Record<string, unknown>;

        const fallbackSp = sp('fallback');
        const { className: fbSpClass, style: fbSpStyle, ...fbSpRest } = fallbackSp as Record<string, unknown>;

        const actionSp = sp('action');
        const { className: actionSpClass, style: actionSpStyle, ...actionSpRest } = actionSp as Record<string, unknown>;

        const width = props.width as string | number | undefined;
        const height = props.height as string | number | undefined;
        const aspectRatio = props.aspectRatio as string | undefined;
        const fallbackSrc = props.fallbackSrc as string | undefined;
        const showFallback = error && !fallbackSrc;
        const effectiveSrc = error && fallbackSrc ? fallbackSrc : baseSrc;

        const rootStyle: React.CSSProperties = {
          ...(width != null ? { width: typeof width === 'number' ? `${width}px` : width } : undefined),
          ...(height != null ? { height: typeof height === 'number' ? `${height}px` : height } : undefined),
          ...(aspectRatio ? { aspectRatio } : undefined),
          ...props.style,
          ...(rootSpStyle as React.CSSProperties),
        };

        return (
          <div
            {...attrs}
            {...rootSpRest}
            ref={ref}
            data-fit={props.fit}
            data-radius={props.radius}
            data-position={props.position}
            className={cx('root', props.className, rootSpClass as string | undefined)}
            style={rootStyle}
          >
            {!showFallback && effectiveSrc && (
              <img
                {...(imgSpRest as React.ImgHTMLAttributes<HTMLImageElement>)}
                src={effectiveSrc}
                alt={props.alt as string}
                loading={props.loading as 'lazy' | 'eager' | undefined}
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
                {props.children || <Icon name="image-off" size={24} />}
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
