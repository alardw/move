'use client';
// Generated from Form.spec.ts
import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { FormProvider, useFormContext } from './FormContext';
import styles from './Form.module.css';

export type FormActionsAlign = 'start' | 'end' | 'between';

export interface FormRootProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /**
   * Called with the submitted values. `preventDefault` is already applied.
   *
   * The values come from `FormData`, so the browser collects them by the `name`
   * attributes the controls already render — several of them through a hidden
   * input. The form does not inspect, count or register its children; the
   * platform does the walking.
   */
  onSubmit?: (
    values: Record<string, FormDataEntryValue>,
    event: React.FormEvent<HTMLFormElement>,
  ) => void;
  /**
   * Errors by field name, handed to the matching FormField.
   *
   * The consumer owns this. Errors can arrive from this submit, a route loader,
   * a socket or a validation library, and only the consumer knows when they
   * stop being true — so the form stores nothing and clears nothing.
   */
  errors?: Record<string, React.ReactNode>;
  /** Whether a submission is in flight. Actions and controls read it from context. */
  pending?: boolean;
  /**
   * Suppresses the browser's validation bubbles, which would otherwise appear
   * before a FormField could show its message and disagree with it. The
   * constraints themselves still hold — see the submit handler.
   */
  noValidate?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'root'>;
}

const EMPTY_ERRORS: Record<string, React.ReactNode> = {};

const FormRoot = withMoveComponent<'root', FormRootProps, HTMLFormElement>({
  name: 'Form',
  styles,
  slots: ['root'] as const,
  moveProps: ['onSubmit', 'errors', 'pending'],
  defaults: { pending: false, noValidate: true },

  setup({ props, ref, cx, sp, attrs }) {
    const errors = props.errors ?? EMPTY_ERRORS;
    const pending = !!props.pending;

    // Memoized so a Form re-rendering for an unrelated reason does not re-render
    // every field below it. Note that an inline `errors={{…}}` literal builds a
    // new object each render and defeats this; errors held in state — which is
    // where they belong, since the consumer owns them — keep a stable reference
    // between submits.
    const ctx = React.useMemo(() => ({ errors, pending }), [errors, pending]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;

      // `noValidate` turns off the browser's BUBBLES, not its validation. Asking
      // the form itself keeps `required` and `type="email"` working, and the
      // platform walks the fields to answer — so this stays as ignorant of its
      // children as everything else here.
      if (!form.checkValidity()) return;

      const values = Object.fromEntries(new FormData(form));
      (props.onSubmit as FormRootProps['onSubmit'])?.(values, event);
    };

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        return (
          <FormProvider value={ctx}>
            <form
              {...attrs}
              {...spRest}
              ref={ref}
              noValidate={props.noValidate}
              // The native onSubmit is Omit'ted from this component's props, and
              // the prop of that name has a different signature — (values,
              // event). The caller's handler is not replaced: it runs inside
              // handleSubmit, after preventDefault and the validity gate.
              // precedence-exempt: a different prop, not the native one.
              onSubmit={handleSubmit}
              className={cx('root', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            >
              {props.children}
            </form>
          </FormProvider>
        );
      },
    };
  },
});

// ============================================================================
// Actions
// ============================================================================

export interface FormActionsProps extends React.HTMLAttributes<HTMLFieldSetElement> {
  /** Where the buttons sit in the row. */
  align?: FormActionsAlign;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'actions'>;
}

const FormActions = withMoveComponent<'actions', FormActionsProps, HTMLFieldSetElement>({
  name: 'FormActions',
  styles,
  slots: ['actions'] as const,
  moveProps: ['align'],
  defaults: { align: 'end' },

  setup({ props, ref, cx, sp, attrs }) {
    const form = useFormContext();
    const pending = !!form?.pending;

    return {
      render() {
        const actionsSp = sp('actions');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = actionsSp as Record<string, unknown>;

        return (
          // A fieldset, for the one thing a fieldset does that nothing else can:
          // `disabled` on it disables every control inside, by the platform's own
          // rules, for the pointer AND the keyboard. Styling it inert is three
          // lines of CSS; inspecting children to disable them one by one would
          // be the thing this component exists not to do.
          <fieldset
            {...attrs}
            {...spRest}
            ref={ref}
            disabled={pending}
            data-align={props.align}
            className={cx('actions', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </fieldset>
        );
      },
    };
  },
});

export const Form = Object.assign(FormRoot, {
  Root: FormRoot,
  Actions: FormActions,
});

export { useFormContext };
export type { FormContextValue } from './FormContext';
