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
  /** id of the Label element, for a composite control's aria-labelledby. */
  labelId: string;
  /** id of the Description element, for the control's aria-describedby. */
  descriptionId: string;
  /** Whether the field is invalid — drives aria-invalid. */
  invalid: boolean;
  /** Set only once a Description is actually rendered, so aria-describedby never dangles. */
  describedBy: string | undefined;
  /** Description registers/unregisters itself here. */
  registerDescription: () => () => void;
  /**
   * True once a composite control has claimed the label by reference. A `<label
   * for>` can only name a labelable element — an input, select, textarea or
   * button — so a widget built from a div plus several inner controls (a radio
   * group, a segmented time field, a slider, an editable region) cannot be
   * named that way at all. Those point `aria-labelledby` at the Label instead,
   * and register here so Label drops the `htmlFor` that would otherwise dangle.
   */
  labelledByControl: boolean;
  /** A composite control registers/unregisters itself here. */
  registerLabelledByControl: () => () => void;
  /**
   * True once a labelable control has claimed the field id. Both can be true at
   * once: a date-and-time field is one InputText plus an inline TimeField, and
   * the group must not strip the `for` that names the input.
   */
  labelableControl: boolean;
  /** A labelable control registers/unregisters itself here. */
  registerLabelableControl: () => () => void;
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
/**
 * The composite-widget counterpart to {@link useFieldControl}.
 *
 * `useFieldControl` marks the one labelable element a `<label for>` can point
 * at. Plenty of controls have no such element: a radio group is a div wrapping
 * several inputs, a time field is a row of spinbutton segments each with its
 * own name, a slider is a div with role="slider" thumbs, an editor is a
 * contenteditable div. Naming those means pointing `aria-labelledby` at the
 * Label from the element that carries the widget role, which is what this
 * returns. Registering also tells Label to drop its `htmlFor`, so no `for`
 * is left pointing at an id that never appears in the DOM.
 *
 * Returns nothing but empty attributes outside a FormField, so a control can
 * spread it unconditionally.
 */
export function useFieldGroup(
  attrs: Record<string, unknown> = {},
  opts: { invalid?: boolean } = {},
): Record<string, unknown> {
  const field = useFormField();
  const register = field?.registerLabelledByControl;
  React.useEffect(() => register?.(), [register]);

  const {
    'aria-labelledby': labelledBy,
    'aria-invalid': ariaInvalid,
    'aria-describedby': describedBy,
    ...rest
  } = attrs;
  const mergedDescribedBy =
    [describedBy, field?.describedBy].filter(Boolean).join(' ') || undefined;

  return {
    ...rest,
    'aria-labelledby': (labelledBy as string | undefined) ?? field?.labelId,
    'aria-describedby': mergedDescribedBy,
    'aria-invalid':
      (ariaInvalid as boolean | undefined) ?? (opts.invalid || field?.invalid ? true : undefined),
  };
}

export function useFieldControl(
  attrs: Record<string, unknown>,
  opts: { invalid?: boolean; ref?: React.RefObject<HTMLElement | null> } = {},
): Record<string, unknown> {
  const field = useFormField();
  const registerLabelable = field?.registerLabelableControl;
  React.useEffect(() => registerLabelable?.(), [registerLabelable]);
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
    const labelId = `${generated}-label`;
    const descriptionId = `${generated}-desc`;
    const [descriptionCount, setDescriptionCount] = React.useState(0);
    const registerDescription = React.useCallback(() => {
      setDescriptionCount((c) => c + 1);
      return () => setDescriptionCount((c) => c - 1);
    }, []);
    const [labelledByCount, setLabelledByCount] = React.useState(0);
    const registerLabelledByControl = React.useCallback(() => {
      setLabelledByCount((c) => c + 1);
      return () => setLabelledByCount((c) => c - 1);
    }, []);
    const [labelableCount, setLabelableCount] = React.useState(0);
    const registerLabelableControl = React.useCallback(() => {
      setLabelableCount((c) => c + 1);
      return () => setLabelableCount((c) => c - 1);
    }, []);

    const ctx = React.useMemo<FormFieldContextValue>(
      () => ({
        fieldId,
        labelId,
        descriptionId,
        invalid: !!props.invalid,
        describedBy: descriptionCount > 0 ? descriptionId : undefined,
        registerDescription,
        labelledByControl: labelledByCount > 0,
        registerLabelledByControl,
        labelableControl: labelableCount > 0,
        registerLabelableControl,
      }),
      [
        fieldId,
        labelId,
        descriptionId,
        props.invalid,
        descriptionCount,
        registerDescription,
        labelledByCount,
        registerLabelledByControl,
        labelableCount,
        registerLabelableControl,
      ],
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
            id={((attrs as Record<string, unknown>).id as string | undefined) ?? field?.labelId}
            /* The `for` is dropped only when a composite is the field's ONLY
               participant. A field can hold both — DatePicker with `showTime`
               is an InputText beside an inline TimeField — and dropping it
               there left the input named by nothing but its title. */
            htmlFor={
              (props.htmlFor as string) ??
              (field?.labelledByControl && !field?.labelableControl ? undefined : field?.fieldId)
            }
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
