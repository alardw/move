import { useSyncExternalStore } from 'react';

// =============================================================================
// Types
// =============================================================================

export type ToastVariant = 'default' | 'info' | 'success' | 'warning' | 'error';

export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

export interface ToastState {
  id: string;
  variant: ToastVariant;
  message: string;
  description?: string;
  duration: number;
  position: ToastPosition;
}

export interface ToastOptions {
  variant?: ToastVariant;
  description?: string;
  duration?: number;
  position?: ToastPosition;
}

// =============================================================================
// Store
// =============================================================================

const DEFAULT_DURATION = 5000;
const DEFAULT_POSITION: ToastPosition = 'bottom-right';
const DEFAULT_MAX = 5;

let toasts: ToastState[] = [];
let maxPerPosition = DEFAULT_MAX;
let nextId = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ToastState[] {
  return toasts;
}

function addToast(message: string, options: ToastOptions = {}): string {
  const id = String(++nextId);
  const newToast: ToastState = {
    id,
    variant: options.variant ?? 'default',
    message,
    description: options.description,
    duration: options.duration ?? DEFAULT_DURATION,
    position: options.position ?? DEFAULT_POSITION,
  };
  toasts = [...toasts, newToast];

  // Auto-remove excess oldest toasts for this position
  if (maxPerPosition > 0) {
    const posToasts = toasts.filter((t) => t.position === newToast.position);
    if (posToasts.length > maxPerPosition) {
      const excessCount = posToasts.length - maxPerPosition;
      const excessIds = new Set(posToasts.slice(0, excessCount).map((t) => t.id));
      toasts = toasts.filter((t) => !excessIds.has(t.id));
    }
  }

  emit();
  return id;
}

function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

// =============================================================================
// Imperative API
// =============================================================================

export function toast(message: string, options?: ToastOptions): string {
  return addToast(message, options);
}

toast.info = (message: string, options?: Omit<ToastOptions, 'variant'>) =>
  addToast(message, { ...options, variant: 'info' });

toast.success = (message: string, options?: Omit<ToastOptions, 'variant'>) =>
  addToast(message, { ...options, variant: 'success' });

toast.warning = (message: string, options?: Omit<ToastOptions, 'variant'>) =>
  addToast(message, { ...options, variant: 'warning' });

toast.error = (message: string, options?: Omit<ToastOptions, 'variant'>) =>
  addToast(message, { ...options, variant: 'error' });

toast.dismiss = removeToast;

toast.configure = (options: { max?: number }) => {
  if (options.max !== undefined) maxPerPosition = options.max;
};

// =============================================================================
// Internal helpers (used by ToastItem)
// =============================================================================

export { removeToast };

// =============================================================================
// Reset (for testing)
// =============================================================================

export function resetStore() {
  toasts = [];
  maxPerPosition = DEFAULT_MAX;
  nextId = 0;
  emit();
}

// =============================================================================
// Hook
// =============================================================================

export function useToastStore(): ToastState[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
