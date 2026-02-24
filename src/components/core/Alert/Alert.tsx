'use client';

import * as React from 'react';
import { animate } from 'animejs';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { PassThrough } from '../../../engine/types';
import { prefersReducedMotion } from '../../../animation';
import { Icon } from '../../core/Icon';
import styles from './Alert.module.css';

// =============================================================================
// Types
// =============================================================================

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';
type AlertSlots = 'root' | 'icon' | 'content' | 'title' | 'description' | 'close';

// =============================================================================
// Alert
// =============================================================================

export interface AlertProps extends Record<string, unknown> {
  variant?: AlertVariant;
  icon?: string | boolean;
  title?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  closeLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<AlertSlots>;
}

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
  moveProps: ['variant', 'icon', 'title', 'closable', 'onClose', 'closeLabel'],

  setup({ props, ref, internalRef, cx, ptm, attrs }) {
    const [visible, setVisible] = React.useState(true);
    const animRef = React.useRef<ReturnType<typeof animate> | null>(null);

    // Entrance animation
    React.useLayoutEffect(() => {
      const el = internalRef.current;
      if (!el || prefersReducedMotion()) return;

      el.style.opacity = '0';
      el.style.transform = 'translateY(-8px)';

      animRef.current = animate(el, {
        opacity: 1,
        translateY: 0,
        ease: 'outQuart',
        duration: 300,
        onComplete: () => {
          el.style.removeProperty('opacity');
          el.style.removeProperty('transform');
        },
      });
    }, [internalRef]);

    const handleClose = React.useCallback(() => {
      const el = internalRef.current;
      if (!el) {
        setVisible(false);
        (props.onClose as (() => void) | undefined)?.();
        return;
      }

      if (prefersReducedMotion()) {
        setVisible(false);
        (props.onClose as (() => void) | undefined)?.();
        return;
      }

      if (animRef.current) animRef.current.pause();

      animate(el, {
        opacity: 0,
        translateY: -8,
        ease: 'outQuart',
        duration: 200,
        onComplete: () => {
          setVisible(false);
          (props.onClose as (() => void) | undefined)?.();
        },
      });
    }, [internalRef, props.onClose]);

    return {
      render() {
        if (!visible) return null;

        const variant = props.variant as AlertVariant;

        const rootPt = ptm('root');
        const { className: rootPtClass, style: rootPtStyle, ...rootPtRest } = rootPt as Record<string, unknown>;

        const iconPt = ptm('icon');
        const { className: iconPtClass, style: iconPtStyle, ...iconPtRest } = iconPt as Record<string, unknown>;

        const contentPt = ptm('content');
        const { className: contentPtClass, style: contentPtStyle, ...contentPtRest } = contentPt as Record<string, unknown>;

        const titlePt = ptm('title');
        const { className: titlePtClass, style: titlePtStyle, ...titlePtRest } = titlePt as Record<string, unknown>;

        const descriptionPt = ptm('description');
        const { className: descPtClass, style: descPtStyle, ...descPtRest } = descriptionPt as Record<string, unknown>;

        const closePt = ptm('close');
        const { className: closePtClass, style: closePtStyle, ...closePtRest } = closePt as Record<string, unknown>;

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
            {...rootPtRest}
            ref={ref}
            role="alert"
            data-variant={variant}
            className={cx('root', props.className, rootPtClass as string | undefined)}
            style={{ ...props.style, ...(rootPtStyle as React.CSSProperties) }}
          >
            {iconName && (
              <span
                {...iconPtRest}
                className={cx('icon', iconPtClass as string | undefined)}
                style={iconPtStyle as React.CSSProperties}
                aria-hidden="true"
              >
                <Icon name={iconName} size={18} />
              </span>
            )}

            <div
              {...contentPtRest}
              className={cx('content', contentPtClass as string | undefined)}
              style={contentPtStyle as React.CSSProperties}
            >
              {props.title && (
                <div
                  {...titlePtRest}
                  className={cx('title', titlePtClass as string | undefined)}
                  style={titlePtStyle as React.CSSProperties}
                >
                  {props.title as React.ReactNode}
                </div>
              )}
              {props.children && (
                <div
                  {...descPtRest}
                  className={cx('description', descPtClass as string | undefined)}
                  style={descPtStyle as React.CSSProperties}
                >
                  {props.children}
                </div>
              )}
            </div>

            {props.closable && (
              <button
                {...closePtRest}
                type="button"
                className={cx('close', closePtClass as string | undefined)}
                style={closePtStyle as React.CSSProperties}
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
