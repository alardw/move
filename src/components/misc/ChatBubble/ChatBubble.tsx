'use client';

import * as React from 'react';
import { animate } from 'animejs';
import { Avatar as MoveAvatar } from '../../core/Avatar/Avatar';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine/types';
import { prefersReducedMotion } from '../../../animation';
import { toAnimeParams, mergeAnimateConfig } from '../../../animation/utils';
import type { ElementAnimate } from '../../../animation/types';
import styles from './ChatBubble.module.css';

const defaultAnimation: ElementAnimate = {
  enter: {
    scale: [0.6, 1],
    opacity: [0, 1],
    easing: 'quick',
  },
};

const STAGGER_DELAY = 60;

// =============================================================================
// Context — Root passes placement to Container for tail direction
// =============================================================================

type ChatBubblePlacement = 'start' | 'end';

const ChatBubbleContext = React.createContext<ChatBubblePlacement>('start');

// =============================================================================
// Root
// =============================================================================

export interface ChatBubbleRootProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  placement?: ChatBubblePlacement;
  /** Animation configuration. Pass `false` to disable animations. */
  animate?: ElementAnimate | false;
  sp?: SlotPropsMap<'root'>;
}

const ChatBubbleRoot = withMoveComponent<'root', ChatBubbleRootProps, HTMLDivElement>({
  name: 'ChatBubbleRoot',
  styles,
  slots: ['root'] as const,
  defaults: { placement: 'start' },
  moveProps: ['placement', 'animate'],

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    const animateProp = props.animate as ElementAnimate | false | undefined;
    const animateConfig = animateProp === false ? null : mergeAnimateConfig(defaultAnimation, animateProp);

    React.useLayoutEffect(() => {
      const el = internalRef.current;
      if (!el || !animateConfig?.enter || prefersReducedMotion()) return;

      // Stagger: compute index among sibling ChatBubble roots
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
              data-placement={props.placement}
              className={cx('root', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
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

export type ChatBubbleAvatarSize = 'sm' | 'md' | 'lg';

export interface ChatBubbleAvatarProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  src?: string;
  fallback?: React.ReactNode;
  size?: ChatBubbleAvatarSize;
  sp?: SlotPropsMap<'avatar'>;
}

const AVATAR_SIZE_MAP: Record<ChatBubbleAvatarSize, 'sm' | 'md' | 'lg'> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

const ChatBubbleAvatar = withMoveComponent<'avatar', ChatBubbleAvatarProps, HTMLSpanElement>({
  name: 'ChatBubbleAvatar',
  styles,
  slots: ['avatar'] as const,
  defaults: { size: 'md' },
  moveProps: ['src', 'fallback', 'size'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const avatarSp = sp('avatar');
        const { className: spClass, style: spStyle, ...spRest } = avatarSp as Record<string, unknown>;
        const avatarSize = AVATAR_SIZE_MAP[(props.size as ChatBubbleAvatarSize) ?? 'md'];

        return (
          <span
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('avatar', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
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
// Container — the bubble shape
// =============================================================================

export type ChatBubbleVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'error';

export interface ChatBubbleContainerProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  variant?: ChatBubbleVariant;
  tail?: boolean;
  sp?: SlotPropsMap<'container'>;
}

const ChatBubbleContainer = withMoveComponent<'container', ChatBubbleContainerProps, HTMLDivElement>({
  name: 'ChatBubbleContainer',
  styles,
  slots: ['container'] as const,
  defaults: { variant: 'neutral', tail: false },
  moveProps: ['variant', 'tail'],

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
            data-variant={props.variant}
            data-placement={placement}
            data-tail={props.tail || undefined}
            className={cx('container', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
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
  sp?: SlotPropsMap<'header'>;
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
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
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
  sp?: SlotPropsMap<'content'>;
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
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
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
  sp?: SlotPropsMap<'footer'>;
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
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
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
