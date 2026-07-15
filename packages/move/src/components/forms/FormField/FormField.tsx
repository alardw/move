'use client';
// Generated from FormField.spec.ts
import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import styles from './FormField.module.css';

// Bundlers (Vite, webpack, Next) statically replace `process.env.NODE_ENV`; declare it
// locally so tsc is happy without pulling @types/node into a browser library.
declare const process: { env: { NODE_ENV?: string } };

// ============================================================================
// Context — carries the generated ids + invalid state so the label, the control,
// and the description all associate without the consumer wiring ids by hand.
// A form control (InputText, Select, …) reads this to set id / aria-invalid /
// aria-describedby on its actual input element.
// ============================================================================

export interface FormFieldContextValue {
  /** id to put on the control (Label points its htmlFor here). */
  fieldId: string;
  /** id of the Description element, for the control's aria-describedby. */
  descriptionId: string;
  /** Whether the field is invalid — drives aria-invalid. */
  invalid: boolean;
  /** Set only once a Description is actually rendered, so aria-describedby never dangles. */
  describedBy: string | undefined;
  /** Description registers/unregisters itself here. */
  registerDescription: () => () => void;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

/** Read the surrounding FormField, if any. Form controls call this to auto-wire
 *  their id + aria-invalid + aria-describedby. Returns null outside a FormField. */
export function useFormField(): FormFieldContextValue | null {
  return React.useContext(FormFieldContext);
}

/**
 * The one place every form control gets its accessibility wiring. Pass the
 * factory `attrs` and the control's own `invalid` state; spread the result onto
 * the actual input/trigger element. It merges the surrounding FormField (id,
 * aria-describedby) and reflects `invalid` as `aria-invalid` — without ever
 * clobbering a value the consumer passed explicitly. Every control in the forms
 * category should route its input through this, so the behavior lives in one place.
 */
export function useFieldControl(
  attrs: Record<string, unknown>,
  opts: { invalid?: boolean; ref?: React.RefObject<HTMLElement | null> } = {},
): Record<string, unknown> {
  const field = useFormField();
  const { id, 'aria-invalid': ariaInvalid, 'aria-describedby': describedBy, ...rest } = attrs;
  const mergedDescribedBy =
    [describedBy, field?.describedBy].filter(Boolean).join(' ') || undefined;

  // Dev-only: after mount, verify the control actually has an accessible name.
  // Reading the live element catches every source — a FormField <label for>, an
  // aria-label/labelledby, or a title — so it can't false-positive on a valid path.
  const ariaLabel = attrs['aria-label'];
  const ariaLabelledby = attrs['aria-labelledby'];
  React.useEffect(() => {
    // Dev servers only — never in production, never noisy in test runs.
    if (process.env.NODE_ENV !== 'development' || !opts.ref) return;
    const node = opts.ref.current;
    if (!node) return;
    const named =
      node.getAttribute('aria-label') ||
      node.getAttribute('aria-labelledby') ||
      (node as HTMLInputElement).labels?.length ||
      node.getAttribute('title');
    if (!named) {
      // eslint-disable-next-line no-console
      console.warn(
        '[move] This form control has no accessible name. Wrap it in a <FormField> with a ' +
          '<FormField.Label>, or pass an aria-label / aria-labelledby.',
        node,
      );
    }
  }, [opts.ref, ariaLabel, ariaLabelledby, field?.fieldId]);

  return {
    ...rest,
    id: (id as string | undefined) ?? field?.fieldId,
    'aria-invalid':
      (ariaInvalid as boolean | undefined) ?? (opts.invalid || field?.invalid ? true : undefined),
    'aria-describedby': mergedDescribedBy,
  };
}

// ============================================================================
// Root
// ============================================================================

export interface FormFieldRootProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  labelWidth?: string;
  /** Marks the field invalid — surfaces as aria-invalid on the control and data-invalid for styling. */
  invalid?: boolean;
}

const FormFieldRoot = withMoveComponent<'root', FormFieldRootProps, HTMLDivElement>({
  name: 'FormField',
  styles,
  slots: ['root'] as const,
  moveProps: ['labelWidth', 'invalid'],

  setup({ props, ref, cx, sp, attrs }) {
    const generated = React.useId();
    const fieldId = (props.id as string) || `${generated}-field`;
    const descriptionId = `${generated}-desc`;
    const [descriptionCount, setDescriptionCount] = React.useState(0);
    const registerDescription = React.useCallback(() => {
      setDescriptionCount((c) => c + 1);
      return () => setDescriptionCount((c) => c - 1);
    }, []);

    const ctx = React.useMemo<FormFieldContextValue>(
      () => ({
        fieldId,
        descriptionId,
        invalid: !!props.invalid,
        describedBy: descriptionCount > 0 ? descriptionId : undefined,
        registerDescription,
      }),
      [fieldId, descriptionId, props.invalid, descriptionCount, registerDescription],
    );

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        // `id` on the Root names the FIELD (it becomes fieldId → the control + the label's
        // htmlFor). Keep it off the wrapper div so the id isn't duplicated on two elements.
        const { id: _fieldId, ...restAttrs } = attrs as Record<string, unknown>;
        const inlineStyle: Record<string, unknown> = { ...props.style };
        if (props.labelWidth) {
          inlineStyle['--move-formfield-label-width'] = props.labelWidth;
        }
        return (
          <FormFieldContext.Provider value={ctx}>
            <div
              {...restAttrs}
              {...spRest}
              ref={ref}
              className={cx('root', props.className, spClass as string | undefined)}
              style={{ ...inlineStyle, ...(spStyle as React.CSSProperties) } as React.CSSProperties}
              {...(props.invalid ? { 'data-invalid': '' } : {})}
            >
              <div className={styles.inner}>{props.children}</div>
            </div>
          </FormFieldContext.Provider>
        );
      },
    };
  },
});

// ============================================================================
// Label — a real <label htmlFor> tied to the control, so clicking it focuses
// the field and screen readers announce the name.
// ============================================================================

export interface FormFieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const FormFieldLabel = withMoveComponent<'label', FormFieldLabelProps, HTMLLabelElement>({
  name: 'FormFieldLabel',
  styles,
  slots: ['label'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const field = useFormField();
    return {
      render() {
        const labelSp = sp('label');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = labelSp as Record<string, unknown>;
        return (
          <label
            {...attrs}
            {...spRest}
            ref={ref}
            htmlFor={(props.htmlFor as string) ?? field?.fieldId}
            className={cx('label', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </label>
        );
      },
    };
  },
});

// ============================================================================
// Field — layout wrapper around the control. The control wires itself via context.
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
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = fieldSp as Record<string, unknown>;
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
// Description — hint or error text, given a stable id (for aria-describedby) and,
// when it's an error, an assertive live region so it's announced.
// ============================================================================

export interface FormFieldDescriptionProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  error?: boolean;
}

const FormFieldDescription = withMoveComponent<
  'description',
  FormFieldDescriptionProps,
  HTMLDivElement
>({
  name: 'FormFieldDescription',
  styles,
  slots: ['description'] as const,
  moveProps: ['error'],

  setup({ props, ref, cx, sp, attrs }) {
    const field = useFormField();
    React.useEffect(() => field?.registerDescription(), [field]);
    return {
      render() {
        const descSp = sp('description');
        const { className: spClass, style: spStyle, ...spRest } = descSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            id={(props.id as string) ?? field?.descriptionId}
            className={cx('description', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            {...(props.error ? { 'data-error': '', role: 'alert', 'aria-live': 'assertive' } : {})}
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
