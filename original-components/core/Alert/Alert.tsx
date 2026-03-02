'use client';

import * as React from 'react';
import { animate } from 'animejs';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine/types';
import { prefersReducedMotion } from '../../../animation';
import { toAnimeParams, mergeAnimateConfig } from '../../../animation/utils';
import type { LayerAnimate } from '../../../animation/types';
import { Icon } from '../../core/Icon';
import styles from './Alert.module.css';

// =============================================================================
// Types
// =============================================================================

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';
export type AlertSize = 'sm' | 'md' | 'lg';
type AlertSlots = 'root' | 'icon' | 'content' | 'title' | 'description' | 'close';

// =============================================================================
// Alert
// =============================================================================

export interface AlertProps extends Record<string, unknown> {
  variant?: AlertVariant;
  size?: AlertSize;
  icon?: string | boolean;
  title?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  closeLabel?: string;
  /** Animation configuration. Pass `false` to disable animations. */
  animate?: LayerAnimate | false;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<AlertSlots>;
}

const defaultAlertAnimation: LayerAnimate = {
  enter: {
    opacity: { value: [0, 1], easing: 'outQuart' },
    y: { value: [-8, 0], easing: 'outQuart' },
    duration: 300,
  },
  exit: {
    opacity: { value: [1, 0], easing: 'outQuart' },
    y: { value: [0, -8], easing: 'outQuart' },
    duration: 200,
  },
};

const defaultIcons: Record<AlertVariant, string> = {
  info: 'info',
  success: 'circle-check',
  warning: 'triangle-alert',
  danger: 'circle-x',
};

export const Alert = withMoveComponent<AlertSlots, AlertProps, HTMLDivElement>({
  name: 'Alert',
  styles,
  slots: ['root', 'icon', 'content', 'title', 'description', 'close'] as const,
  defaults: { variant: 'info' },
  moveProps: ['variant', 'size', 'icon', 'title', 'closable', 'onClose', 'closeLabel', 'animate'],

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    const [visible, setVisible] = React.useState(true);
    const animRef = React.useRef<ReturnType<typeof animate> | null>(null);

    const animateProp = props.animate as LayerAnimate | false | undefined;
    const animateConfig = animateProp === false ? null : mergeAnimateConfig(defaultAlertAnimation, animateProp);

    // Entrance animation
    React.useLayoutEffect(() => {
      const el = internalRef.current;
      if (!el || !animateConfig?.enter || prefersReducedMotion()) return;

      const enterParams = toAnimeParams(animateConfig.enter);
      el.style.opacity = '0';

      animRef.current = animate(el, {
        ...enterParams,
        onComplete: () => {
          if (el) {
            el.style.removeProperty('opacity');
            el.style.removeProperty('transform');
          }
        },
      });
    }, [internalRef, animateConfig]);

    const handleClose = React.useCallback(() => {
      const el = internalRef.current;
      if (!el) {
        setVisible(false);
        (props.onClose as (() => void) | undefined)?.();
        return;
      }

      if (!animateConfig?.exit || prefersReducedMotion()) {
        setVisible(false);
        (props.onClose as (() => void) | undefined)?.();
        return;
      }

      if (animRef.current) animRef.current.pause();

      const exitParams = toAnimeParams(animateConfig.exit);
      animate(el, {
        ...exitParams,
        onComplete: () => {
          setVisible(false);
          (props.onClose as (() => void) | undefined)?.();
        },
      });
    }, [internalRef, props.onClose, animateConfig]);

    return {
      render() {
        if (!visible) return null;

        const variant = props.variant as AlertVariant;

        const rootSp = sp('root');
        const { className: rootSpClass, style: rootSpStyle, ...rootSpRest } = rootSp as Record<string, unknown>;

        const iconSp = sp('icon');
        const { className: iconSpClass, style: iconSpStyle, ...iconSpRest } = iconSp as Record<string, unknown>;

        const contentSp = sp('content');
        const { className: contentSpClass, style: contentSpStyle, ...contentSpRest } = contentSp as Record<string, unknown>;

        const titleSp = sp('title');
        const { className: titleSpClass, style: titleSpStyle, ...titleSpRest } = titleSp as Record<string, unknown>;

        const descriptionSp = sp('description');
        const { className: descSpClass, style: descSpStyle, ...descSpRest } = descriptionSp as Record<string, unknown>;

        const closeSp = sp('close');
        const { className: closeSpClass, style: closeSpStyle, ...closeSpRest } = closeSp as Record<string, unknown>;

        // Resolve icon
        const iconProp = props.icon;
        let iconName: string | null = null;
        if (iconProp === false) {
          iconName = null;
        } else if (typeof iconProp === 'string') {
          iconName = iconProp;
        } else {
          iconName = defaultIcons[variant];
        }

        return (
          <div
            {...attrs}
            {...rootSpRest}
            ref={ref}
            role="alert"
            data-variant={variant}
            data-size={props.size}
            className={cx('root', props.className, rootSpClass as string | undefined)}
            style={{ ...props.style, ...(rootSpStyle as React.CSSProperties) }}
          >
            {iconName && (
              <span
                {...iconSpRest}
                className={cx('icon', iconSpClass as string | undefined)}
                style={iconSpStyle as React.CSSProperties}
                aria-hidden="true"
              >
                <Icon name={iconName} size={18} />
              </span>
            )}

            <div
              {...contentSpRest}
              className={cx('content', contentSpClass as string | undefined)}
              style={contentSpStyle as React.CSSProperties}
            >
              {props.title && (
                <div
                  {...titleSpRest}
                  className={cx('title', titleSpClass as string | undefined)}
                  style={titleSpStyle as React.CSSProperties}
                >
                  {props.title as React.ReactNode}
                </div>
              )}
              {props.children && (
                <div
                  {...descSpRest}
                  className={cx('description', descSpClass as string | undefined)}
                  style={descSpStyle as React.CSSProperties}
                >
                  {props.children}
                </div>
              )}
            </div>

            {props.closable && (
              <button
                {...closeSpRest}
                type="button"
                className={cx('close', closeSpClass as string | undefined)}
                style={closeSpStyle as React.CSSProperties}
                onClick={handleClose}
                aria-label={props.closeLabel ?? 'Close alert'}
              >
                <Icon name="x" size={14} />
              </button>
            )}
          </div>
        );
      },
    };
  },
});
