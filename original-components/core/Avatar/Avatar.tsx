'use client';

import * as React from 'react';
import { Avatar as RadixAvatar } from 'radix-ui';
import { animate, spring } from 'animejs';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine/types';
import { prefersReducedMotion } from '../../../animation';
import styles from './Avatar.module.css';

// =============================================================================
// Group context
// =============================================================================

interface AvatarGroupContextValue {
  registerAvatar: () => number;
  staggerDelay: number;
}

const AvatarGroupContext = React.createContext<AvatarGroupContextValue | null>(null);

// =============================================================================
// Group
// =============================================================================

export interface AvatarGroupProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  staggerDelay?: number;
  sp?: SlotPropsMap<'group'>;
}

const AvatarGroup = withMoveComponent<'group', AvatarGroupProps, HTMLDivElement>({
  name: 'AvatarGroup',
  styles,
  slots: ['group'] as const,
  defaults: { staggerDelay: 50 },
  moveProps: ['staggerDelay'],

  setup({ props, ref, cx, sp, attrs }) {
    const indexRef = React.useRef(0);

    const registerAvatar = React.useCallback(() => {
      return indexRef.current++;
    }, []);

    const contextValue = React.useMemo(
      () => ({ registerAvatar, staggerDelay: props.staggerDelay as number }),
      [registerAvatar, props.staggerDelay],
    );

    return {
      render() {
        const groupSp = sp('group');
        const { className: spClass, style: spStyle, ...spRest } = groupSp as Record<string, unknown>;

        return (
          <AvatarGroupContext.Provider value={contextValue}>
            <div
              {...attrs}
              {...spRest}
              ref={ref}
              className={cx('group', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            >
              {props.children}
            </div>
          </AvatarGroupContext.Provider>
        );
      },
    };
  },
});

// =============================================================================
// Root
// =============================================================================

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarRootProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  size?: AvatarSize;
  animate?: false;
  sp?: SlotPropsMap<'root'>;
}

const AvatarRoot = withMoveComponent<'root', AvatarRootProps, HTMLSpanElement>({
  name: 'AvatarRoot',
  styles,
  slots: ['root'] as const,
  defaults: { size: 'md' },
  moveProps: ['size', 'animate'],

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    const { size, animate: animateProp } = props;
    const groupCtx = React.useContext(AvatarGroupContext);
    const indexRef = React.useRef<number | null>(null);
    const skipAnimation = animateProp === false || prefersReducedMotion();

    if (indexRef.current === null && groupCtx) {
      indexRef.current = groupCtx.registerAvatar();
    }

    React.useEffect(() => {
      const el = internalRef.current;
      if (!el) return;

      if (skipAnimation) {
        el.style.transform = 'scale(1)';
        return;
      }

      const delay = groupCtx ? (indexRef.current ?? 0) * groupCtx.staggerDelay : 0;

      animate(el, {
        scale: [0, 1],
        ease: spring({ mass: 1, stiffness: 400, damping: 15, velocity: 0 }),
        delay,
      });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        return (
          <RadixAvatar.Root
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            data-size={size}
          >
            {props.children}
          </RadixAvatar.Root>
        );
      },
    };
  },
});

// =============================================================================
// Image
// =============================================================================

export interface AvatarImageProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  src?: string;
  alt?: string;
  onLoadingStatusChange?: (status: 'idle' | 'loading' | 'loaded' | 'error') => void;
  sp?: SlotPropsMap<'image'>;
}

const AvatarImage = withMoveComponent<'image', AvatarImageProps, HTMLImageElement>({
  name: 'AvatarImage',
  styles,
  slots: ['image'] as const,
  moveProps: ['onLoadingStatusChange'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const imageSp = sp('image');
        const { className: spClass, style: spStyle, ...spRest } = imageSp as Record<string, unknown>;

        return (
          <RadixAvatar.Image
            {...attrs}
            {...spRest}
            ref={ref}
            src={props.src as string}
            alt={props.alt as string}
            onLoadingStatusChange={props.onLoadingStatusChange as AvatarImageProps['onLoadingStatusChange']}
            className={cx('image', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          />
        );
      },
    };
  },
});

// =============================================================================
// Fallback
// =============================================================================

export interface AvatarFallbackProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  delayMs?: number;
  sp?: SlotPropsMap<'fallback'>;
}

const AvatarFallback = withMoveComponent<'fallback', AvatarFallbackProps, HTMLSpanElement>({
  name: 'AvatarFallback',
  styles,
  slots: ['fallback'] as const,
  moveProps: ['delayMs'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const fallbackSp = sp('fallback');
        const { className: spClass, style: spStyle, ...spRest } = fallbackSp as Record<string, unknown>;

        return (
          <RadixAvatar.Fallback
            {...attrs}
            {...spRest}
            ref={ref}
            delayMs={props.delayMs as number | undefined}
            className={cx('fallback', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixAvatar.Fallback>
        );
      },
    };
  },
});

// =============================================================================
// Export
// =============================================================================

export const Avatar = {
  Group: AvatarGroup,
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
};
