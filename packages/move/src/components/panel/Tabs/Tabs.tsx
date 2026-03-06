'use client';
// Generated from Tabs.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)

import * as React from 'react';
import { Tabs as RadixTabs } from 'radix-ui';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { useAnimations } from '../../../animation';
import type { AnimationTrigger, AnimationState } from '../../../animation';
import styles from './Tabs.module.css';

// =============================================================================
// Root
// =============================================================================

export interface TabsRootProps extends Record<string, unknown> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  dir?: 'ltr' | 'rtl';
  activationMode?: 'automatic' | 'manual';
  sp?: SlotPropsMap<'root'>;
}

const TabsRoot = withMoveComponent<'root', TabsRootProps, HTMLDivElement>({
  name: 'TabsRoot',
  styles,
  slots: ['root'] as const,
  moveProps: ['defaultValue', 'value', 'onValueChange', 'orientation', 'dir', 'activationMode'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        return (
          <RadixTabs.Root
            {...attrs}
            {...spRest}
            ref={ref}
            defaultValue={props.defaultValue as string | undefined}
            value={props.value as string | undefined}
            onValueChange={props.onValueChange as ((value: string) => void) | undefined}
            orientation={props.orientation as 'horizontal' | 'vertical' | undefined}
            dir={props.dir as 'ltr' | 'rtl' | undefined}
            activationMode={props.activationMode as 'automatic' | 'manual' | undefined}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixTabs.Root>
        );
      },
    };
  },
});

// =============================================================================
// List
// =============================================================================

export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsVariant = 'underline' | 'pills' | 'outline';

export interface TabsListProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  loop?: boolean;
  size?: TabsSize;
  variant?: TabsVariant;
  animations?: AnimationTrigger[] | false;
  sp?: SlotPropsMap<'list'>;
}

const TabsList = withMoveComponent<'list' | 'indicator', TabsListProps, HTMLDivElement>({
  name: 'TabsList',
  styles,
  slots: ['list', 'indicator'] as const,
  defaults: { size: 'md', variant: 'underline' },
  moveProps: ['loop', 'size', 'variant', 'animations'],

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    const variant = props.variant as TabsVariant;
    const showIndicator = variant === 'underline';

    // --- Sliding indicator via animatePosition ---
    const indicatorRef = React.useRef<HTMLElement | null>(null);

    const activeRef = React.useMemo(() => {
      const ref = { current: null as HTMLElement | null };
      Object.defineProperty(ref, 'current', {
        get() { return internalRef.current?.querySelector<HTMLElement>('[data-state="active"]') ?? null; },
        set() { /* no-op — always queries live DOM */ },
      });
      return ref;
    }, [internalRef]);

    const STATES: AnimationState[] = [
      { name: 'activeChange', slot: 'List', source: 'data-state', value: 'active' },
    ];

    const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
      { trigger: 'activeChange', sequence: [{ target: 'Indicator', fn: 'animatePosition', animation: {
        translateX: { to: '$Active.x' },
        width: { to: '$Active.width' },
      } }] },
    ];

    const disabled = props.animations === false || !showIndicator;
    const animRefs = React.useMemo(() => ({
      List: internalRef as React.RefObject<HTMLElement | null>,
      Indicator: indicatorRef,
      Active: activeRef,
    }), [internalRef]);
    useAnimations(disabled ? null : DEFAULT_ANIMATIONS, animRefs, STATES);

    return {
      render() {
        const listSp = sp('list');
        const { className: spClass, style: spStyle, ...spRest } = listSp as Record<string, unknown>;
        const indicatorSp = sp('indicator');
        const { className: indSpClass, style: indSpStyle, ...indSpRest } = indicatorSp as Record<string, unknown>;

        return (
          <RadixTabs.List
            {...attrs}
            {...spRest}
            ref={ref}
            loop={props.loop as boolean | undefined}
            data-size={props.size}
            data-variant={variant}
            className={cx('list', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
            {showIndicator && (
              <div
                {...indSpRest}
                ref={indicatorRef as React.Ref<HTMLDivElement>}
                className={cx('indicator', indSpClass as string | undefined)}
                style={indSpStyle as React.CSSProperties}
              />
            )}
          </RadixTabs.List>
        );
      },
    };
  },
});

// =============================================================================
// Trigger
// =============================================================================

export interface TabsTriggerProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  value: string;
  disabled?: boolean;
  sp?: SlotPropsMap<'trigger'>;
}

const TabsTrigger = withMoveComponent<'trigger', TabsTriggerProps, HTMLButtonElement>({
  name: 'TabsTrigger',
  styles,
  slots: ['trigger'] as const,
  moveProps: ['value'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const triggerSp = sp('trigger');
        const { className: spClass, style: spStyle, ...spRest } = triggerSp as Record<string, unknown>;

        return (
          <RadixTabs.Trigger
            {...attrs}
            {...spRest}
            ref={ref}
            value={props.value as string}
            disabled={props.disabled as boolean | undefined}
            className={cx('trigger', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixTabs.Trigger>
        );
      },
    };
  },
});

// =============================================================================
// Content
// =============================================================================

export interface TabsContentProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  value: string;
  forceMount?: true;
  sp?: SlotPropsMap<'content'>;
}

const TabsContent = withMoveComponent<'content', TabsContentProps, HTMLDivElement>({
  name: 'TabsContent',
  styles,
  slots: ['content'] as const,
  moveProps: ['value', 'forceMount'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const contentSp = sp('content');
        const { className: spClass, style: spStyle, ...spRest } = contentSp as Record<string, unknown>;

        return (
          <RadixTabs.Content
            {...attrs}
            {...spRest}
            ref={ref}
            value={props.value as string}
            forceMount={props.forceMount as true | undefined}
            tabIndex={-1}
            className={cx('content', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixTabs.Content>
        );
      },
    };
  },
});

// =============================================================================
// Export
// =============================================================================

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
};
