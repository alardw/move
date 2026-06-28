'use client';
// Generated from Avatar.spec.ts (schemaVersion: 5, specHash: c909e0e0)
import * as React from 'react';
import { Avatar as RadixAvatar } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import { useAnimations, resolveAnimationsConfig } from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import type { Color, SizeWithXL } from '../../../shared/types';
import styles from './Avatar.module.css';

// =============================================================================
// Types
// =============================================================================

/** Re-exported for backwards-compatible imports. Prefer `SizeWithXL`
 *  from `'move'` directly going forward. */
export type AvatarSize = SizeWithXL;
/** Re-exported for backwards-compatible imports. Prefer `Color` from
 *  `'move'` directly going forward. */
export type AvatarColor = Color;

type AvatarStatus = 'idle' | 'loading' | 'loaded' | 'error';

// =============================================================================
// Status context — coordinates loading state between Image and Fallback
// =============================================================================

interface AvatarStatusContextValue {
  status: AvatarStatus;
  setStatus: (s: AvatarStatus) => void;
}

const AvatarStatusContext = React.createContext<AvatarStatusContextValue>({
  status: 'idle',
  setStatus: () => {},
});

// =============================================================================
// Group
// =============================================================================

export interface AvatarGroupProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const AvatarGroup = withMoveComponent<'group', AvatarGroupProps, HTMLDivElement>({
  name: 'AvatarGroup',
  styles,
  slots: ['group'] as const,
  defaults: {},
  moveProps: [],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const groupSp = sp('group');
        const { className: spClass, style: spStyle, ...spRest } = groupSp as Record<string, unknown>;

        // Overlap is pure CSS (negative margin on .group children).
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('group', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
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
  color?: AvatarColor;
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
  moveProps: ['size', 'color', 'animations'],

  setup({ props, ref, cx, sp, attrs }) {
    const animConfig = resolveAnimationsConfig([], props.animations as AnimationTrigger[] | false | undefined);

    const contentRef = React.useRef<HTMLSpanElement>(null);
    const refs = React.useMemo(() => ({ Root: contentRef as React.RefObject<HTMLElement | null> }), []);
    useAnimations(animConfig, refs);

    const mergedRef = useMergedRef(ref, contentRef);

    const [status, setStatus] = React.useState<AvatarStatus>('idle');
    const statusCtx = React.useMemo(() => ({ status, setStatus }), [status]);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        return (
          <AvatarStatusContext.Provider value={statusCtx}>
            <RadixAvatar.Root
              {...attrs}
              {...spRest}
              ref={mergedRef}
              className={cx('root', props.className, spClass as string | undefined)}
              style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
              data-size={props.size as string}
              data-color={props.color as string || undefined}
              data-status={status}
            >
              {props.children}
            </RadixAvatar.Root>
          </AvatarStatusContext.Provider>
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
  onLoadingStatusChange?: (status: AvatarStatus) => void;
  className?: string;
  style?: React.CSSProperties;
}

const AvatarImage = withMoveComponent<'image', AvatarImageProps, HTMLImageElement>({
  name: 'AvatarImage',
  styles,
  slots: ['image'] as const,
  moveProps: ['onLoadingStatusChange'],

  setup({ props, ref, cx, sp, attrs }) {
    const { setStatus } = React.useContext(AvatarStatusContext);

    const handleStatusChange = React.useCallback((s: AvatarStatus) => {
      setStatus(s);
      (props.onLoadingStatusChange as AvatarImageProps['onLoadingStatusChange'])?.(s);
    }, [setStatus, props.onLoadingStatusChange]);

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
            onLoadingStatusChange={handleStatusChange}
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
    const { status } = React.useContext(AvatarStatusContext);
    // Only show fallback content when image has failed or no image was provided.
    // During loading, Radix still renders the Fallback element but we hide its
    // children so the root's pulse animation shows through.
    const showContent = status === 'error' || status === 'idle';

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
            data-status={status}
          >
            {showContent ? props.children : null}
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
