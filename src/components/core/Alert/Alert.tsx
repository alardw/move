'use client';
// Generated from Alert.spec.ts (schemaVersion: 6, specHash: b9fbaaa9)
import * as React from 'react';
import { withMoveComponent, useMergedRef } from '../../../engine';
import { useLifecycleAnimate } from '../../../animation';
import type { LifecycleAnimate } from '../../../animation';
import { useResolvedIcon } from '../../../infrastructure/Icon';
import styles from './Alert.module.css';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';
export type AlertSize = 'sm' | 'md' | 'lg';

export interface AlertLabels {
  close: string;
}

const DEFAULT_LABELS: AlertLabels = {
  close: 'Close alert',
};

const VARIANT_ICONS: Record<AlertVariant, string> = {
  info: 'info',
  success: 'circle-check',
  warning: 'triangle-alert',
  danger: 'circle-x',
};

const DEFAULT_LIFECYCLE: LifecycleAnimate = {
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

export interface AlertProps extends Record<string, unknown> {
  variant?: AlertVariant;
  size?: AlertSize;
  icon?: string | boolean;
  title?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  animate?: LifecycleAnimate | false;
  labels?: Partial<AlertLabels>;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Alert = withMoveComponent<'root' | 'icon' | 'content' | 'title' | 'description' | 'close', AlertProps, HTMLDivElement>({
  name: 'Alert',
  styles,
  slots: ['root', 'icon', 'content', 'title', 'description', 'close'] as const,
  defaults: { variant: 'info' as AlertVariant, size: 'md' as AlertSize, icon: true, closable: false },
  moveProps: ['title', 'onClose', 'animate', 'labels'],

  setup({ props, ref, cx, sp, attrs }) {
    const [visible, setVisible] = React.useState(true);
    const [isClosing, setIsClosing] = React.useState(false);
    const variant = props.variant as AlertVariant;
    const labels = { ...DEFAULT_LABELS, ...(props.labels as Partial<AlertLabels>) };

    const onCloseComplete = React.useCallback(() => {
      setVisible(false);
      setIsClosing(false);
      (props.onClose as (() => void) | undefined)?.();
    }, [props.onClose]);

    const { contentRef } = useLifecycleAnimate({
      animate: props.animate === false
        ? false
        : (props.animate as LifecycleAnimate | undefined) ?? DEFAULT_LIFECYCLE,
      isClosing,
      onCloseComplete,
    });
    const mergedRef = useMergedRef(ref, contentRef as React.RefObject<HTMLElement>);

    // Determine icon
    const iconProp = props.icon;
    const iconName = iconProp === false ? null : typeof iconProp === 'string' ? iconProp : VARIANT_ICONS[variant];
    const resolvedIcon = useResolvedIcon(iconName || '', 18);
    const closeIcon = useResolvedIcon('x', 14);

    const handleClose = React.useCallback(() => {
      if (isClosing) return;
      if (props.animate === false) {
        setVisible(false);
        (props.onClose as (() => void) | undefined)?.();
        return;
      }
      setIsClosing(true);
    }, [isClosing, props.animate, props.onClose]);

    return {
      render() {
        if (!visible) return null;

        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        const iconSp = sp('icon');
        const { className: iconSpClass, style: iconSpStyle, ...iconSpRest } = iconSp as Record<string, unknown>;

        const contentSp = sp('content');
        const { className: contentSpClass, style: contentSpStyle, ...contentSpRest } = contentSp as Record<string, unknown>;

        const titleSp = sp('title');
        const { className: titleSpClass, style: titleSpStyle, ...titleSpRest } = titleSp as Record<string, unknown>;

        const descSp = sp('description');
        const { className: descSpClass, style: descSpStyle, ...descSpRest } = descSp as Record<string, unknown>;

        const closeSp = sp('close');
        const { className: closeSpClass, style: closeSpStyle, ...closeSpRest } = closeSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={mergedRef}
            role="alert"
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
            data-variant={variant}
            data-size={props.size as string}
            data-surface="subtle"
          >
            {iconName && (
              <span
                {...iconSpRest}
                className={cx('icon', iconSpClass as string | undefined)}
                style={iconSpStyle as React.CSSProperties}
                aria-hidden="true"
              >
                {resolvedIcon}
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
                className={cx('close', closeSpClass as string | undefined)}
                style={closeSpStyle as React.CSSProperties}
                type="button"
                aria-label={labels.close}
                onClick={handleClose}
              >
                {closeIcon}
              </button>
            )}
          </div>
        );
      },
    };
  },
});
