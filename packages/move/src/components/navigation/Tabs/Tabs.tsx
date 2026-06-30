'use client';
// Generated from Tabs.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)

import * as React from 'react';
import { Tabs as RadixTabs } from 'radix-ui';
import { withMoveComponent, useControlledState } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { useAnimations, useSlidingIndicator } from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import styles from './Tabs.module.css';

// =============================================================================
// Context — exposes the active value and orientation so Content can drive
// the vertical-orientation stagger reveal.
// =============================================================================

interface TabsContextValue {
  value: string | undefined;
  orientation: 'horizontal' | 'vertical';
}
const TabsContext = React.createContext<TabsContextValue | null>(null);

// =============================================================================
// Root
// =============================================================================

export interface TabsRootProps extends React.HTMLAttributes<HTMLElement> {
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
    // Track value internally so TabsContent can match against it via
    // context. Honors controlled / uncontrolled modes via
    // useControlledState — same triple Radix expects.
    const userOnChange = props.onValueChange as ((value: string) => void) | undefined;
    const [value, setValue] = useControlledState<string | undefined>({
      value: props.value as string | undefined,
      defaultValue: props.defaultValue as string | undefined,
      onChange: (v) => {
        if (typeof v === 'string') userOnChange?.(v);
      },
    });

    const orientation =
      (props.orientation as 'horizontal' | 'vertical' | undefined) ?? 'horizontal';
    const ctx = React.useMemo(() => ({ value, orientation }), [value, orientation]);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        return (
          <TabsContext.Provider value={ctx}>
            <RadixTabs.Root
              {...attrs}
              {...spRest}
              ref={ref}
              defaultValue={props.defaultValue as string | undefined}
              value={props.value as string | undefined}
              onValueChange={(v) => setValue(v)}
              orientation={orientation}
              dir={props.dir as 'ltr' | 'rtl' | undefined}
              activationMode={props.activationMode as 'automatic' | 'manual' | undefined}
              className={cx('root', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            >
              {props.children}
            </RadixTabs.Root>
          </TabsContext.Provider>
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

export interface TabsListProps extends React.HTMLAttributes<HTMLElement> {
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
    const { indicatorRef, update } = useSlidingIndicator({
      containerRef: internalRef as React.RefObject<HTMLElement | null>,
      activeSelector: '[data-state="active"]',
      track: 'width',
      disabled: props.animations === false || !showIndicator,
    });

    React.useEffect(() => {
      if (!showIndicator) return;
      update();
    }, [showIndicator, update, props.children]);

    return {
      render() {
        const listSp = sp('list');
        const { className: spClass, style: spStyle, ...spRest } = listSp as Record<string, unknown>;
        const indicatorSp = sp('indicator');
        const {
          className: indSpClass,
          style: indSpStyle,
          ...indSpRest
        } = indicatorSp as Record<string, unknown>;

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
                ref={indicatorRef}
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

export interface TabsTriggerProps extends React.HTMLAttributes<HTMLElement> {
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
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = triggerSp as Record<string, unknown>;

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

export interface TabsContentProps extends React.HTMLAttributes<HTMLElement> {
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
    const ctx = React.useContext(TabsContext);
    const isActive = ctx?.value === (props.value as string);
    const isVertical = ctx?.orientation === 'vertical';
    const innerRef = React.useRef<HTMLDivElement | null>(null);

    // Stagger reveal — only for vertical Tabs and only when this
    // panel is the active one. Mirrors the AccordionContent /
    // AnimatedSubnav reveal: a per-child opacity + translateY,
    // sequenced via stagger, all driven through useAnimations so
    // it respects prefers-reduced-motion via the move system.
    const config: AnimationTrigger[] | null = React.useMemo(() => {
      if (!isVertical || !isActive) return null;
      return [
        {
          trigger: 'Inner.enter',
          sequence: [
            {
              target: 'Inner',
              children: '> *',
              stagger: { delay: 30 },
              animation: {
                opacity: { from: 0, to: 1, ease: 'outQuart', duration: 240, delay: 80 },
                translateY: { from: 6, to: 0, ease: 'outQuart', duration: 240, delay: 80 },
              },
            },
          ],
        },
      ];
    }, [isVertical, isActive]);

    const refs = React.useMemo(
      () => ({ Inner: innerRef as React.RefObject<HTMLElement | null> }),
      [],
    );

    useAnimations(config, refs);

    return {
      render() {
        const contentSp = sp('content');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = contentSp as Record<string, unknown>;

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
            {/* Inner wrapper exists so the stagger sequence has a
                stable ref target distinct from RadixTabs.Content
                itself (which Radix mounts/unmounts on tab switch). */}
            <div ref={innerRef}>{props.children}</div>
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
