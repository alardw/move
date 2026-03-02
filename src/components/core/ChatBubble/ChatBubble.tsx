'use client';
// Generated from ChatBubble.spec.ts (schemaVersion: 6, specHash: af768c01)
import * as React from 'react';
import { animate } from 'animejs';
import { withMoveComponent, useMergedRef } from '../../../engine';
import { prefersReducedMotion, toAnimeParams, mergeAnimateConfig } from '../../../animation';
import type { LifecycleAnimate } from '../../../animation';
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

const DEFAULT_LIFECYCLE: LifecycleAnimate = {
  enter: {
    scale: { value: [0.6, 1] },
    opacity: { value: [0, 1] },
    easing: 'quick',
  },
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
  animate?: LifecycleAnimate | false;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const ChatBubbleRoot = withMoveComponent<'root', ChatBubbleRootProps, HTMLDivElement>({
  name: 'ChatBubbleRoot',
  styles,
  slots: ['root'] as const,
  defaults: { placement: 'start' as ChatBubblePlacement },
  moveProps: ['animate'],

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    const animateProp = props.animate as LifecycleAnimate | false | undefined;
    const animateConfig = animateProp === false ? null : mergeAnimateConfig(DEFAULT_LIFECYCLE, animateProp as LifecycleAnimate | undefined);

    React.useLayoutEffect(() => {
      const el = internalRef.current;
      if (!el || !animateConfig?.enter || prefersReducedMotion()) return;

      const parent = el.parentElement;
      let index = 0;
      if (parent) {
        const siblings = Array.from(parent.children);
        index = siblings.indexOf(el);
      }

      const enterParams = toAnimeParams(animateConfig.enter);
      el.style.opacity = '0';

      animate(el, {
        ...enterParams,
        delay: index * STAGGER_DELAY,
        onComplete: () => {
          if (el) {
            el.style.removeProperty('opacity');
            el.style.removeProperty('transform');
          }
        },
      });
    }, [internalRef, animateConfig]);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        return (
          <ChatBubbleContext.Provider value={props.placement as ChatBubblePlacement}>
            <div
              {...attrs}
              {...spRest}
              ref={ref}
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
              <MoveAvatar.Root size={avatarSize} animate={false}>
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
