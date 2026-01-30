'use client';

import * as React from 'react';
import { Form as RadixForm } from 'radix-ui';
import styles from './Form.module.css';

export interface FormRootProps extends React.ComponentPropsWithoutRef<typeof RadixForm.Root> {
  className?: string;
}

const FormRoot = React.forwardRef<
  React.ElementRef<typeof RadixForm.Root>,
  FormRootProps
>(({ className, ...props }, ref) => (
  <RadixForm.Root
    ref={ref}
    className={`${styles.root} ${className || ''}`}
    {...props}
  />
));
FormRoot.displayName = 'Form.Root';

export interface FormFieldProps extends React.ComponentPropsWithoutRef<typeof RadixForm.Field> {
  className?: string;
}

const FormField = React.forwardRef<
  React.ElementRef<typeof RadixForm.Field>,
  FormFieldProps
>(({ className, ...props }, ref) => (
  <RadixForm.Field
    ref={ref}
    className={`${styles.field} ${className || ''}`}
    {...props}
  />
));
FormField.displayName = 'Form.Field';

export interface FormLabelProps extends React.ComponentPropsWithoutRef<typeof RadixForm.Label> {
  className?: string;
}

const FormLabel = React.forwardRef<
  React.ElementRef<typeof RadixForm.Label>,
  FormLabelProps
>(({ className, ...props }, ref) => (
  <RadixForm.Label
    ref={ref}
    className={`${styles.label} ${className || ''}`}
    {...props}
  />
));
FormLabel.displayName = 'Form.Label';

export interface FormControlProps extends React.ComponentPropsWithoutRef<typeof RadixForm.Control> {
  className?: string;
}

const FormControl = React.forwardRef<
  React.ElementRef<typeof RadixForm.Control>,
  FormControlProps
>(({ className, ...props }, ref) => (
  <RadixForm.Control
    ref={ref}
    className={`${styles.control} ${className || ''}`}
    {...props}
  />
));
FormControl.displayName = 'Form.Control';

export interface FormMessageProps extends React.ComponentPropsWithoutRef<typeof RadixForm.Message> {
  className?: string;
}

const FormMessage = React.forwardRef<
  React.ElementRef<typeof RadixForm.Message>,
  FormMessageProps
>(({ className, ...props }, ref) => (
  <RadixForm.Message
    ref={ref}
    className={`${styles.message} ${className || ''}`}
    {...props}
  />
));
FormMessage.displayName = 'Form.Message';

export interface FormValidityStateProps extends React.ComponentPropsWithoutRef<typeof RadixForm.ValidityState> {}

const FormValidityState: React.FC<FormValidityStateProps> = (props) => (
  <RadixForm.ValidityState {...props} />
);
FormValidityState.displayName = 'Form.ValidityState';

export interface FormSubmitProps extends React.ComponentPropsWithoutRef<typeof RadixForm.Submit> {
  className?: string;
}

const FormSubmit = React.forwardRef<
  React.ElementRef<typeof RadixForm.Submit>,
  FormSubmitProps
>(({ className, ...props }, ref) => (
  <RadixForm.Submit
    ref={ref}
    className={`${styles.submit} ${className || ''}`}
    {...props}
  />
));
FormSubmit.displayName = 'Form.Submit';

export const Form = {
  Root: FormRoot,
  Field: FormField,
  Label: FormLabel,
  Control: FormControl,
  Message: FormMessage,
  ValidityState: FormValidityState,
  Submit: FormSubmit,
};
