'use client';

import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { PassThrough } from '../../../engine/types';
import { Icon } from '../../core/Icon';
import styles from './Image.module.css';

// =============================================================================
// Types
// =============================================================================

export type ImageFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
export type ImageRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
type ImageSlots = 'root' | 'img' | 'fallback' | 'action';

// =============================================================================
// Image
// =============================================================================

export interface ImageProps extends Record<string, unknown> {
  src?: string;
  alt?: string;
  fallbackSrc?: string;
  fit?: ImageFit;
  radius?: ImageRadius;
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
  pt?: PassThrough<ImageSlots>;
}

export const Image = withMoveComponent<ImageSlots, ImageProps, HTMLDivElement>({
  name: 'Image',
  styles,
  slots: ['root', 'img', 'fallback', 'action'] as const,
  defaults: { fit: 'cover', radius: 'none' },
  moveProps: [
    'src', 'alt', 'fallbackSrc', 'fit', 'radius', 'aspectRatio',
    'width', 'height', 'loading', 'action', 'onLoad', 'onError',
  ],

  setup({ props, ref, cx, ptm, attrs }) {
    const [error, setError] = React.useState(false);

    // Reset error state when src changes
    const srcRef = React.useRef(props.src);
    if (srcRef.current !== props.src) {
      srcRef.current = props.src;
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
        const rootPt = ptm('root');
        const { className: rootPtClass, style: rootPtStyle, ...rootPtRest } = rootPt as Record<string, unknown>;

        const imgPt = ptm('img');
        const { className: imgPtClass, style: imgPtStyle, ...imgPtRest } = imgPt as Record<string, unknown>;

        const fallbackPt = ptm('fallback');
        const { className: fbPtClass, style: fbPtStyle, ...fbPtRest } = fallbackPt as Record<string, unknown>;

        const actionPt = ptm('action');
        const { className: actionPtClass, style: actionPtStyle, ...actionPtRest } = actionPt as Record<string, unknown>;

        const width = props.width as string | number | undefined;
        const height = props.height as string | number | undefined;
        const aspectRatio = props.aspectRatio as string | undefined;
        const fallbackSrc = props.fallbackSrc as string | undefined;
        const showFallback = error && !fallbackSrc;
        const effectiveSrc = error && fallbackSrc ? fallbackSrc : (props.src as string | undefined);

        const rootStyle: React.CSSProperties = {
          ...(width != null ? { width: typeof width === 'number' ? `${width}px` : width } : undefined),
          ...(height != null ? { height: typeof height === 'number' ? `${height}px` : height } : undefined),
          ...(aspectRatio ? { aspectRatio } : undefined),
          ...props.style,
          ...(rootPtStyle as React.CSSProperties),
        };

        return (
          <div
            {...attrs}
            {...rootPtRest}
            ref={ref}
            data-fit={props.fit}
            data-radius={props.radius}
            className={cx('root', props.className, rootPtClass as string | undefined)}
            style={rootStyle}
          >
            {!showFallback && effectiveSrc && (
              <img
                {...(imgPtRest as React.ImgHTMLAttributes<HTMLImageElement>)}
                src={effectiveSrc}
                alt={props.alt as string}
                loading={props.loading as 'lazy' | 'eager' | undefined}
                className={cx('img', imgPtClass as string | undefined)}
                style={imgPtStyle as React.CSSProperties}
                onLoad={handleLoad}
                onError={handleError}
              />
            )}

            {showFallback && (
              <div
                {...fbPtRest}
                className={cx('fallback', fbPtClass as string | undefined)}
                style={fbPtStyle as React.CSSProperties}
              >
                {props.children || <Icon name="image-off" size={24} />}
              </div>
            )}

            {props.action && !showFallback && (
              <div
                {...actionPtRest}
                className={cx('action', actionPtClass as string | undefined)}
                style={actionPtStyle as React.CSSProperties}
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
