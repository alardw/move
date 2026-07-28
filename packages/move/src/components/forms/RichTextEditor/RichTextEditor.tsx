'use client';
// Generated from RichTextEditor.spec.ts

import * as React from 'react';
import type { Dimension } from '../../../shared/types';
import { withMoveComponent } from '../../../engine';
import { useControlledState } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { Prose } from '../../typography/Prose/Prose';
import styles from './RichTextEditor.module.css';

// =============================================================================
// Context
// =============================================================================

export type RichTextEditorVariant = 'outline' | 'subtle';
export type RichTextEditorSize = 'sm' | 'md' | 'lg';

interface RichTextEditorContextValue {
  variant: RichTextEditorVariant;
  size: RichTextEditorSize;
}

const RichTextEditorContext = React.createContext<RichTextEditorContextValue>({
  variant: 'outline',
  size: 'md',
});

// =============================================================================
// Labels (i18n)
// =============================================================================

export interface RichTextEditorLabels {
  /** Default aria-label for the toolbar */
  toolbar: string;
}

const DEFAULT_LABELS: RichTextEditorLabels = {
  toolbar: 'Text formatting',
};

// =============================================================================
// Root (plain FC — context wrapper)
// =============================================================================

export interface RichTextEditorRootProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: RichTextEditorVariant;
  size?: RichTextEditorSize;
}

const RichTextEditorRoot: React.FC<RichTextEditorRootProps> = ({
  children,
  className,
  style,
  variant = 'outline',
  size = 'md',
}) => {
  const ctx = React.useMemo(() => ({ variant, size }), [variant, size]);

  return (
    <RichTextEditorContext.Provider value={ctx}>
      <div
        className={`${styles.root}${className ? ` ${className}` : ''}`}
        style={style}
        data-variant={variant}
        data-size={size}
      >
        {children}
      </div>
    </RichTextEditorContext.Provider>
  );
};
RichTextEditorRoot.displayName = 'RichTextEditor.Root';

// =============================================================================
// Toolbar
// =============================================================================

export interface RichTextEditorToolbarProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sticky?: boolean;
  stickyOffset?: number;
  labels?: Partial<RichTextEditorLabels>;
  sp?: SlotPropsMap<'toolbar'>;
}

const RichTextEditorToolbar = withMoveComponent<
  'toolbar',
  RichTextEditorToolbarProps,
  HTMLDivElement
>({
  name: 'RichTextEditorToolbar',
  styles,
  slots: ['toolbar'] as const,
  moveProps: ['sticky', 'stickyOffset', 'labels'],

  setup({ props, ref, cx, sp, attrs }) {
    const labels = { ...DEFAULT_LABELS, ...(props.labels as Partial<RichTextEditorLabels>) };
    return {
      render() {
        const toolbarSp = sp('toolbar');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = toolbarSp as Record<string, unknown>;
        const stickyOffset = props.stickyOffset as number | undefined;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            role="toolbar"
            aria-label={labels.toolbar}
            data-sticky={props.sticky || undefined}
            className={cx('toolbar', props.className, spClass as string | undefined)}
            style={{
              ...(stickyOffset != null ? { top: stickyOffset } : undefined),
              ...props.style,
              ...(spStyle as React.CSSProperties),
            }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// =============================================================================
// ControlGroup
// =============================================================================

export interface RichTextEditorControlGroupProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'controlGroup'>;
}

const RichTextEditorControlGroup = withMoveComponent<
  'controlGroup',
  RichTextEditorControlGroupProps,
  HTMLDivElement
>({
  name: 'RichTextEditorControlGroup',
  styles,
  slots: ['controlGroup'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const groupSp = sp('controlGroup');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = groupSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            role="group"
            className={cx('controlGroup', props.className, spClass as string | undefined)}
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
// Control
// =============================================================================

export interface RichTextEditorControlProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  active?: boolean;
  defaultActive?: boolean;
  onActiveChange?: (active: boolean) => void;
  disabled?: boolean;
  sp?: SlotPropsMap<'control'>;
}

const RichTextEditorControl = withMoveComponent<
  'control',
  RichTextEditorControlProps,
  HTMLButtonElement
>({
  name: 'RichTextEditorControl',
  styles,
  slots: ['control'] as const,
  defaults: { defaultActive: false },
  moveProps: ['active', 'onActiveChange'],

  setup({ props, ref, cx, sp, attrs }) {
    const hasActiveState =
      props.active !== undefined ||
      props.defaultActive !== undefined ||
      props.onActiveChange !== undefined;

    const [active, setActive] = useControlledState<boolean>({
      value: props.active as boolean | undefined,
      defaultValue: props.defaultActive as boolean,
      onChange: props.onActiveChange as ((active: boolean) => void) | undefined,
    });

    return {
      render() {
        const controlSp = sp('control');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = controlSp as Record<string, unknown>;
        const { onClick: userOnClick, ...restAttrs } = attrs as Record<string, unknown>;

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
          if (props.disabled) return;
          if (hasActiveState) setActive(!active);
          (userOnClick as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
        };

        return (
          <button
            {...restAttrs}
            {...spRest}
            ref={ref}
            type="button"
            data-active={active || undefined}
            onClick={handleClick}
            className={cx('control', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </button>
        );
      },
    };
  },
});

// =============================================================================
// Separator
// =============================================================================

export interface RichTextEditorSeparatorProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'separator'>;
}

const RichTextEditorSeparator = withMoveComponent<
  'separator',
  RichTextEditorSeparatorProps,
  HTMLDivElement
>({
  name: 'RichTextEditorSeparator',
  styles,
  slots: ['separator'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const sepSp = sp('separator');
        const { className: spClass, style: spStyle, ...spRest } = sepSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            role="separator"
            aria-orientation="vertical"
            className={cx('separator', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          />
        );
      },
    };
  },
});

// =============================================================================
// Content
// =============================================================================

export interface RichTextEditorContentProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  minHeight?: Dimension;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  sp?: SlotPropsMap<'content'>;
}

const RichTextEditorContent = withMoveComponent<
  'content',
  RichTextEditorContentProps,
  HTMLDivElement
>({
  name: 'RichTextEditorContent',
  styles,
  slots: ['content'] as const,
  moveProps: ['minHeight'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const contentSp = sp('content');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = contentSp as Record<string, unknown>;
        const minHeight = props.minHeight as React.CSSProperties['minHeight'] | undefined;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('content', props.className, spClass as string | undefined)}
            style={{
              ...(minHeight != null ? { minHeight } : undefined),
              ...props.style,
              ...(spStyle as React.CSSProperties),
            }}
          >
            <Prose>{props.children}</Prose>
          </div>
        );
      },
    };
  },
});

// =============================================================================
// Export
// =============================================================================

export const RichTextEditor = {
  Root: RichTextEditorRoot,
  Toolbar: RichTextEditorToolbar,
  ControlGroup: RichTextEditorControlGroup,
  Control: RichTextEditorControl,
  Separator: RichTextEditorSeparator,
  Content: RichTextEditorContent,
};
