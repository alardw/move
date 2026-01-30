'use client';

import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { PassThrough } from '../../../engine/types';
import styles from './FormField.module.css';

// ============================================================================
// Slots
// ============================================================================

type FormFieldSlots = 'root' | 'label' | 'field' | 'description';

// ============================================================================
// Root
// ============================================================================

export interface FormFieldRootProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  labelWidth?: string;
  pt?: PassThrough<FormFieldSlots>;
}

const FormFieldRoot = withMoveComponent<'root', FormFieldRootProps, HTMLDivElement>({
  name: 'FormField',
  styles,
  slots: ['root'] as const,
  moveProps: ['labelWidth'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const rootPt = ptm('root');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;
        const inlineStyle: Record<string, unknown> = { ...props.style };
        if (props.labelWidth) {
          inlineStyle['--move-formfield-label-width'] = props.labelWidth;
        }
        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('root', props.className, ptClass as string | undefined)}
            style={{ ...inlineStyle, ...(ptStyle as React.CSSProperties) } as React.CSSProperties}
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

export interface FormFieldLabelProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'label'>;
}

const FormFieldLabel = withMoveComponent<'label', FormFieldLabelProps, HTMLDivElement>({
  name: 'FormFieldLabel',
  styles,
  slots: ['label'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const labelPt = ptm('label');
        const { className: ptClass, style: ptStyle, ...ptRest } = labelPt as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('label', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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

export interface FormFieldFieldProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'field'>;
}

const FormFieldField = withMoveComponent<'field', FormFieldFieldProps, HTMLDivElement>({
  name: 'FormFieldField',
  styles,
  slots: ['field'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const fieldPt = ptm('field');
        const { className: ptClass, style: ptStyle, ...ptRest } = fieldPt as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('field', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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

export interface FormFieldDescriptionProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  error?: boolean;
  pt?: PassThrough<'description'>;
}

const FormFieldDescription = withMoveComponent<'description', FormFieldDescriptionProps, HTMLDivElement>({
  name: 'FormFieldDescription',
  styles,
  slots: ['description'] as const,
  moveProps: ['error'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const descPt = ptm('description');
        const { className: ptClass, style: ptStyle, ...ptRest } = descPt as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('description', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
