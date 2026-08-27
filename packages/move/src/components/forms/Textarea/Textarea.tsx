'use client';
// Generated from Textarea.spec.ts
import * as React from 'react';
import type { FieldWidth } from '../../../shared/types';
import { composeHandlers, useMergedRef, withMoveComponent } from '../../../engine';
import { useFieldControl } from '../FormField/FormField';
import styles from './Textarea.module.css';

export type TextareaVariant = 'outlined' | 'filled';
export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TextareaVariant;
  size?: TextareaSize;
  invalid?: boolean;
  autoSize?: boolean;
  minRows?: number;
  maxRows?: number;
  rows?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  width?: FieldWidth;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  name?: string;
  id?: string;
  required?: boolean;
  autoFocus?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
}

export const Textarea = withMoveComponent<'root' | 'textarea', TextareaProps, HTMLTextAreaElement>({
  name: 'Textarea',
  styles,
  slots: ['root', 'textarea'] as const,
  defaults: {
    variant: 'outlined' as TextareaVariant,
    size: 'md' as TextareaSize,
    rows: 3,
    resize: 'vertical',
  },
  moveProps: [
    'variant',
    'size',
    'invalid',
    'autoSize',
    'minRows',
    'maxRows',
    'rows',
    'resize',
    'width',
  ],

  setup({ props, ref, cx, sp, attrs }) {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const mergedRef = useMergedRef<HTMLTextAreaElement>(ref, textareaRef);
    const controlProps = useFieldControl(attrs as Record<string, unknown>, {
      invalid: !!props.invalid,
      ref: textareaRef,
    });

    const adjustHeight = React.useCallback(() => {
      const el = textareaRef.current;
      if (!el || !props.autoSize) return;

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

    React.useEffect(() => {
      adjustHeight();
    }, [adjustHeight, props.value]);

    const rootRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const root = rootRef.current;
      if (!root || !props.autoSize) return;

      const ro = new ResizeObserver(adjustHeight);
      ro.observe(root);

      return () => ro.disconnect();
    }, [adjustHeight, props.autoSize]);

    const handleInput = React.useCallback(() => {
      adjustHeight();
    }, [adjustHeight]);

    const handleRootClick = () => {
      textareaRef.current?.focus();
    };

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        const textareaSp = sp('textarea');
        const {
          className: taSpClass,
          style: taSpStyle,
          ...taSpRest
        } = textareaSp as Record<string, unknown>;

        const resizeValue = props.autoSize ? 'none' : (props.resize as string);

        return (
          <div
            {...spRest}
            ref={rootRef}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            data-width={props.width as string | undefined}
            data-variant={props.variant}
            data-size={props.size}
            {...(props.invalid ? { 'data-invalid': '' } : {})}
            {...(props.disabled ? { 'data-disabled': '' } : {})}
            {...(props.readOnly ? { 'data-readonly': '' } : {})}
            onClick={handleRootClick}
          >
            <textarea
              {...controlProps}
              {...taSpRest}
              ref={mergedRef}
              className={cx('textarea', taSpClass as string | undefined)}
              style={{
                resize: resizeValue as React.CSSProperties['resize'],
                ...(taSpStyle as React.CSSProperties),
              }}
              rows={
                props.autoSize
                  ? ((props.minRows as number | undefined) ?? (props.rows as number))
                  : (props.rows as number)
              }
              disabled={props.disabled as boolean}
              onInput={composeHandlers(controlProps.onInput, handleInput)}
            />
          </div>
        );
      },
    };
  },
});
