'use client';

import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import { useMergedRef } from '../../../engine/useMergedRef';
import type { PassThrough } from '../../../engine/types';
import styles from './Textarea.module.css';

// =============================================================================
// Textarea
// =============================================================================

export type TextareaVariant = 'outlined' | 'filled';
export type TextareaSize = 'sm' | 'md' | 'lg';

type TextareaSlots = 'root' | 'textarea';

export interface TextareaProps extends Record<string, unknown> {
  variant?: TextareaVariant;
  size?: TextareaSize;
  invalid?: boolean;
  autoSize?: boolean;
  minRows?: number;
  maxRows?: number;
  rows?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  width?: React.CSSProperties['width'];
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  name?: string;
  id?: string;
  required?: boolean;
  autoFocus?: boolean;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  pt?: PassThrough<TextareaSlots>;
}

export const Textarea = withMoveComponent<TextareaSlots, TextareaProps, HTMLTextAreaElement>({
  name: 'Textarea',
  styles,
  slots: ['root', 'textarea'] as const,
  defaults: { variant: 'outlined', size: 'md', rows: 3, resize: 'vertical' },
  moveProps: ['variant', 'size', 'invalid', 'autoSize', 'minRows', 'maxRows', 'rows', 'resize', 'width'],

  setup({ props, ref, cx, ptm, attrs }) {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const mergedRef = useMergedRef<HTMLTextAreaElement>(ref, textareaRef);

    const adjustHeight = React.useCallback(() => {
      const el = textareaRef.current;
      if (!el || !props.autoSize) return;

      // Reset to get accurate scrollHeight
      el.style.height = 'auto';

      const computed = getComputedStyle(el);
      const lineHeight = parseFloat(computed.lineHeight) || parseFloat(computed.fontSize) * 1.5;
      const paddingY = parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom);
      const borderY = parseFloat(computed.borderTopWidth) + parseFloat(computed.borderBottomWidth);

      const minRows = (props.minRows as number | undefined) ?? (props.rows as number);
      const maxRows = props.maxRows as number | undefined;

      const minHeight = minRows * lineHeight + paddingY + borderY;
      let height = Math.max(el.scrollHeight, minHeight);

      if (maxRows != null) {
        const maxHeight = maxRows * lineHeight + paddingY + borderY;
        height = Math.min(height, maxHeight);
      }

      el.style.height = `${height}px`;
    }, [props.autoSize, props.minRows, props.maxRows, props.rows]);

    // Adjust on mount and value changes
    React.useEffect(() => {
      adjustHeight();
    }, [adjustHeight, props.value]);

    const handleInput = React.useCallback(() => {
      adjustHeight();
    }, [adjustHeight]);

    // Click on wrapper focuses the textarea
    const handleRootClick = () => {
      textareaRef.current?.focus();
    };

    return {
      render() {
        const rootPt = ptm('root');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;
        const textareaPt = ptm('textarea');
        const { className: taPtClass, style: taPtStyle, ...taPtRest } = textareaPt as Record<string, unknown>;

        const resizeValue = props.autoSize ? 'none' : props.resize as string;

        return (
          <div
            {...ptRest}
            className={cx('root', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(props.width != null ? { width: props.width } : {}), ...(ptStyle as React.CSSProperties) }}
            data-variant={props.variant}
            data-size={props.size}
            {...(props.invalid ? { 'data-invalid': '' } : {})}
            {...(props.disabled ? { 'data-disabled': '' } : {})}
            {...(props.readOnly ? { 'data-readonly': '' } : {})}
            onClick={handleRootClick}
          >
            <textarea
              {...attrs}
              {...taPtRest}
              ref={mergedRef}
              className={cx('textarea', taPtClass as string | undefined)}
              style={{ resize: resizeValue as React.CSSProperties['resize'], ...(taPtStyle as React.CSSProperties) }}
              rows={props.autoSize ? (props.minRows as number | undefined) ?? (props.rows as number) : (props.rows as number)}
              disabled={props.disabled as boolean}
              onInput={handleInput}
            />
          </div>
        );
      },
    };
  },
});
