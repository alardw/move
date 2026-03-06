'use client';
// Generated from ChatBubble.spec.ts (schemaVersion: 6, specHash: af768c01)
import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import { useAnimations, resolveAnimationsConfig, quick } from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import { Avatar as MoveAvatar } from '../Avatar';
import styles from './ChatBubble.module.css';

// =============================================================================
// Types
// =============================================================================

export type ChatBubblePlacement = 'start' | 'end';
export type ChatBubbleVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'error';
export type ChatBubbleAvatarSize = 'sm' | 'md' | 'lg';

// =============================================================================
// Animation defaults
// =============================================================================

const DEFAULT_ENTER_ANIMATION = {
  scale: { from: 0.6, to: 1, ease: quick },
  opacity: { from: 0, to: 1, ease: 'outQuart', duration: 200 },
};

const STAGGER_DELAY = 60;

// =============================================================================
// Context — Root passes placement to Container
// =============================================================================

const ChatBubbleContext = React.createContext<ChatBubblePlacement>('start');

// =============================================================================
// Root
// =============================================================================

export interface ChatBubbleRootProps extends Record<string, unknown> {
  placement?: ChatBubblePlacement;
  animations?: AnimationTrigger[] | false;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const ChatBubbleRoot = withMoveComponent<'root', ChatBubbleRootProps, HTMLDivElement>({
  name: 'ChatBubbleRoot',
  styles,
  slots: ['root'] as const,
  defaults: { placement: 'start' as ChatBubblePlacement },
  moveProps: ['animations'],

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    // Compute sibling-index stagger delay
    const staggerIndex = React.useRef<number>(0);
    React.useLayoutEffect(() => {
      const el = internalRef.current;
      if (!el) return;
      const parent = el.parentElement;
      if (parent) {
        staggerIndex.current = Array.from(parent.children).indexOf(el);
      }
    }, [internalRef]);

    const delay = staggerIndex.current * STAGGER_DELAY;
    const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
      { trigger: 'Root.enter', sequence: [{ animation: { ...DEFAULT_ENTER_ANIMATION, delay: delay || undefined } }] },
    ];
    const animConfig = resolveAnimationsConfig(DEFAULT_ANIMATIONS, props.animations as AnimationTrigger[] | false | undefined);

    const rootRef = React.useRef<HTMLDivElement>(null);
    const refs = React.useMemo(() => ({ Root: rootRef as React.RefObject<HTMLElement | null> }), []);
    useAnimations(animConfig, refs);

    // Merge refs
    const mergedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        (rootRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') (ref as (el: HTMLDivElement | null) => void)(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref],
    );

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        return (
          <ChatBubbleContext.Provider value={props.placement as ChatBubblePlacement}>
            <div
              {...attrs}
              {...spRest}
              ref={mergedRef}
              data-placement={props.placement as string}
              className={cx('root', props.className, spClass as string | undefined)}
              style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
            >
              {props.children}
            </div>
          </ChatBubbleContext.Provider>
        );
      },
    };
  },
});

// =============================================================================
// Avatar
// =============================================================================

export interface ChatBubbleAvatarProps extends Record<string, unknown> {
  src?: string;
  fallback?: React.ReactNode;
  size?: ChatBubbleAvatarSize;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const ChatBubbleAvatar = withMoveComponent<'avatar', ChatBubbleAvatarProps, HTMLSpanElement>({
  name: 'ChatBubbleAvatar',
  styles,
  slots: ['avatar'] as const,
  defaults: { size: 'md' as ChatBubbleAvatarSize },
  moveProps: ['src', 'fallback'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const avatarSp = sp('avatar');
        const { className: spClass, style: spStyle, ...spRest } = avatarSp as Record<string, unknown>;
        const avatarSize = (props.size as ChatBubbleAvatarSize) ?? 'md';

        return (
          <span
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('avatar', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
          >
            {props.children ?? (
              <MoveAvatar.Root size={avatarSize} animations={false}>
                <MoveAvatar.Image src={props.src as string | undefined} alt="" />
                <MoveAvatar.Fallback>{props.fallback as React.ReactNode}</MoveAvatar.Fallback>
              </MoveAvatar.Root>
            )}
          </span>
        );
      },
    };
  },
});

// =============================================================================
// Container
// =============================================================================

export interface ChatBubbleContainerProps extends Record<string, unknown> {
  variant?: ChatBubbleVariant;
  tail?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const ChatBubbleContainer = withMoveComponent<'container', ChatBubbleContainerProps, HTMLDivElement>({
  name: 'ChatBubbleContainer',
  styles,
  slots: ['container'] as const,
  defaults: { variant: 'neutral' as ChatBubbleVariant, tail: false },
  moveProps: [],

  setup({ props, ref, cx, sp, attrs }) {
    const placement = React.useContext(ChatBubbleContext);

    return {
      render() {
        const containerSp = sp('container');
        const { className: spClass, style: spStyle, ...spRest } = containerSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            data-variant={props.variant as string}
            data-placement={placement}
            data-tail={props.tail || undefined}
            className={cx('container', props.className, spClass as string | undefined)}
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
// Header
// =============================================================================

export interface ChatBubbleHeaderProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const ChatBubbleHeader = withMoveComponent<'header', ChatBubbleHeaderProps, HTMLDivElement>({
  name: 'ChatBubbleHeader',
  styles,
  slots: ['header'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const headerSp = sp('header');
        const { className: spClass, style: spStyle, ...spRest } = headerSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('header', props.className, spClass as string | undefined)}
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
// Content
// =============================================================================

export interface ChatBubbleContentProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const ChatBubbleContent = withMoveComponent<'content', ChatBubbleContentProps, HTMLDivElement>({
  name: 'ChatBubbleContent',
  styles,
  slots: ['content'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const contentSp = sp('content');
        const { className: spClass, style: spStyle, ...spRest } = contentSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('content', props.className, spClass as string | undefined)}
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
// Footer
// =============================================================================

export interface ChatBubbleFooterProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const ChatBubbleFooter = withMoveComponent<'footer', ChatBubbleFooterProps, HTMLDivElement>({
  name: 'ChatBubbleFooter',
  styles,
  slots: ['footer'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const footerSp = sp('footer');
        const { className: spClass, style: spStyle, ...spRest } = footerSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('footer', props.className, spClass as string | undefined)}
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
// Export
// =============================================================================

export const ChatBubble = {
  Root: ChatBubbleRoot,
  Avatar: ChatBubbleAvatar,
  Container: ChatBubbleContainer,
  Header: ChatBubbleHeader,
  Content: ChatBubbleContent,
  Footer: ChatBubbleFooter,
};
