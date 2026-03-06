'use client';
// Generated from Avatar.spec.ts (schemaVersion: 5, specHash: aeb52a7f)
import * as React from 'react';
import { Avatar as RadixAvatar } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import { useAnimations, resolveAnimationsConfig, poppy } from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import styles from './Avatar.module.css';

// =============================================================================
// Types
// =============================================================================

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// =============================================================================
// Group context — staggered entrance coordination
// =============================================================================

interface AvatarGroupContextValue {
  registerAvatar: () => number;
  staggerDelay: number;
}

const AvatarGroupContext = React.createContext<AvatarGroupContextValue | null>(null);

// =============================================================================
// Default animation
// =============================================================================

const DEFAULT_ENTER_ANIMATION = {
  scale: { from: 0, to: 1, ease: poppy },
};

// =============================================================================
// Group
// =============================================================================

export interface AvatarGroupProps extends Record<string, unknown> {
  staggerDelay?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
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
              style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
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

export interface AvatarRootProps extends Record<string, unknown> {
  size?: AvatarSize;
  animations?: AnimationTrigger[] | false;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const AvatarRoot = withMoveComponent<'root', AvatarRootProps, HTMLSpanElement>({
  name: 'Avatar',
  styles,
  slots: ['root'] as const,
  defaults: { size: 'md' as AvatarSize },
  moveProps: ['size', 'animations'],

  setup({ props, ref, cx, sp, attrs }) {
    const groupCtx = React.useContext(AvatarGroupContext);
    const indexRef = React.useRef<number | null>(null);

    // Register with group for stagger ordering
    if (indexRef.current === null && groupCtx) {
      indexRef.current = groupCtx.registerAvatar();
    }

    // Build per-avatar stagger delay
    const staggerDelay = groupCtx ? (indexRef.current ?? 0) * groupCtx.staggerDelay : 0;

    const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
      { trigger: 'Root.enter', sequence: [{ animation: { ...DEFAULT_ENTER_ANIMATION, delay: staggerDelay || undefined } }] },
    ];
    const animConfig = resolveAnimationsConfig(DEFAULT_ANIMATIONS, props.animations as AnimationTrigger[] | false | undefined);

    const contentRef = React.useRef<HTMLSpanElement>(null);
    const refs = React.useMemo(() => ({ Root: contentRef as React.RefObject<HTMLElement | null> }), []);
    useAnimations(animConfig, refs);

    const mergedRef = useMergedRef(ref, contentRef);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        return (
          <RadixAvatar.Root
            {...attrs}
            {...spRest}
            ref={mergedRef}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
            data-size={props.size as string}
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
  src?: string;
  alt?: string;
  onLoadingStatusChange?: (status: 'idle' | 'loading' | 'loaded' | 'error') => void;
  className?: string;
  style?: React.CSSProperties;
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
            src={props.src as string | undefined}
            alt={props.alt as string | undefined}
            onLoadingStatusChange={props.onLoadingStatusChange as AvatarImageProps['onLoadingStatusChange']}
            className={cx('image', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
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
  delayMs?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
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
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixAvatar.Fallback>
        );
      },
    };
  },
});

// =============================================================================
// Export — compound component as plain object
// =============================================================================

export const Avatar = {
  Group: AvatarGroup,
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
};
