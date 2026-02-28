'use client';

import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine/types';
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
  sp?: SlotPropsMap<FormFieldSlots>;
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

export interface FormFieldLabelProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'label'>;
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

export interface FormFieldFieldProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'field'>;
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

export interface FormFieldDescriptionProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  error?: boolean;
  sp?: SlotPropsMap<'description'>;
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
