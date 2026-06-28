'use client';
// Generated from FormField.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import styles from './FormField.module.css';

// ============================================================================
// Root
// ============================================================================

export interface FormFieldRootProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  labelWidth?: string;
}

const FormFieldRoot = withMoveComponent<'root', FormFieldRootProps, HTMLDivElement>({
  name: 'FormField',
  styles,
  slots: ['root'] as const,
  moveProps: ['labelWidth'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        const inlineStyle: Record<string, unknown> = { ...props.style };
        if (props.labelWidth) {
          inlineStyle['--move-formfield-label-width'] = props.labelWidth;
        }
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...inlineStyle, ...(spStyle as React.CSSProperties) } as React.CSSProperties}
          >
            <div className={styles.inner}>
              {props.children}
            </div>
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Label
// ============================================================================

export interface FormFieldLabelProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const FormFieldLabel = withMoveComponent<'label', FormFieldLabelProps, HTMLDivElement>({
  name: 'FormFieldLabel',
  styles,
  slots: ['label'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const labelSp = sp('label');
        const { className: spClass, style: spStyle, ...spRest } = labelSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('label', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Field
// ============================================================================

export interface FormFieldFieldProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const FormFieldField = withMoveComponent<'field', FormFieldFieldProps, HTMLDivElement>({
  name: 'FormFieldField',
  styles,
  slots: ['field'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const fieldSp = sp('field');
        const { className: spClass, style: spStyle, ...spRest } = fieldSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('field', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Description
// ============================================================================

export interface FormFieldDescriptionProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  error?: boolean;
}

const FormFieldDescription = withMoveComponent<'description', FormFieldDescriptionProps, HTMLDivElement>({
  name: 'FormFieldDescription',
  styles,
  slots: ['description'] as const,
  moveProps: ['error'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const descSp = sp('description');
        const { className: spClass, style: spStyle, ...spRest } = descSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('description', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            {...(props.error ? { 'data-error': '' } : {})}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const FormField = {
  Root: FormFieldRoot,
  Label: FormFieldLabel,
  Field: FormFieldField,
  Description: FormFieldDescription,
};
