'use client';

import * as React from 'react';
import { Tabs as RadixTabs } from 'radix-ui';
import { animate, spring } from 'animejs';
import { withMoveComponent } from '../../../engine';
import type { PassThrough } from '../../../engine/types';
import { prefersReducedMotion } from '../../../animation';
import type { Animation } from '../../../animation/types';
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
  pt?: PassThrough<'root'>;
}

const TabsRoot = withMoveComponent<'root', TabsRootProps, HTMLDivElement>({
  name: 'TabsRoot',
  styles,
  slots: ['root'] as const,
  moveProps: ['defaultValue', 'value', 'onValueChange', 'orientation', 'dir', 'activationMode'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const rootPt = ptm('root');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;

        return (
          <RadixTabs.Root
            {...attrs}
            {...ptRest}
            ref={ref}
            defaultValue={props.defaultValue as string | undefined}
            value={props.value as string | undefined}
            onValueChange={props.onValueChange as ((value: string) => void) | undefined}
            orientation={props.orientation as 'horizontal' | 'vertical' | undefined}
            dir={props.dir as 'ltr' | 'rtl' | undefined}
            activationMode={props.activationMode as 'automatic' | 'manual' | undefined}
            className={cx('root', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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

export interface TabsListProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  loop?: boolean;
  animate?: Animation | false;
  pt?: PassThrough<'list'>;
}

const TabsList = withMoveComponent<'list' | 'indicator', TabsListProps, HTMLDivElement>({
  name: 'TabsList',
  styles,
  slots: ['list', 'indicator'] as const,
  moveProps: ['loop', 'animate'],

  setup({ props, ref, internalRef, cx, ptm, attrs }) {
    const indicatorRef = React.useRef<HTMLDivElement | null>(null);
    const isFirstRun = React.useRef(true);

    const updateIndicator = React.useCallback(() => {
      const list = internalRef.current;
      const indicator = indicatorRef.current;
      if (!list || !indicator) return;

      const active = list.querySelector<HTMLElement>('[data-state="active"]');
      if (!active) {
        indicator.style.opacity = '0';
        return;
      }

      const listRect = list.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      const left = activeRect.left - listRect.left + list.scrollLeft;
      const width = activeRect.width;

      if (isFirstRun.current || prefersReducedMotion()) {
        isFirstRun.current = false;
        indicator.style.opacity = '1';
        indicator.style.transform = `translateX(${left}px)`;
        indicator.style.width = `${width}px`;
        return;
      }

      indicator.style.opacity = '1';

      if (props.animate === false) {
        indicator.style.transform = `translateX(${left}px)`;
        indicator.style.width = `${width}px`;
        return;
      }

      animate(indicator, {
        translateX: left,
        width: width,
        ease: spring({ mass: 1, stiffness: 500, damping: 30, velocity: 0 }),
      });
    }, [internalRef]);

    React.useEffect(() => {
      const list = internalRef.current;
      if (!list) return;

      // Initial position
      updateIndicator();

      // Watch for data-state changes on triggers
      const observer = new MutationObserver(updateIndicator);
      observer.observe(list, {
        attributes: true,
        attributeFilter: ['data-state'],
        subtree: true,
      });

      return () => observer.disconnect();
    }, [internalRef, updateIndicator]);

    return {
      render() {
        const listPt = ptm('list');
        const { className: ptClass, style: ptStyle, ...ptRest } = listPt as Record<string, unknown>;
        const indicatorPt = ptm('indicator');
        const { className: indPtClass, style: indPtStyle, ...indPtRest } = indicatorPt as Record<string, unknown>;

        return (
          <RadixTabs.List
            {...attrs}
            {...ptRest}
            ref={ref}
            loop={props.loop as boolean | undefined}
            className={cx('list', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
          >
            {props.children}
            <div
              {...indPtRest}
              ref={indicatorRef}
              className={cx('indicator', indPtClass as string | undefined)}
              style={indPtStyle as React.CSSProperties}
            />
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
  pt?: PassThrough<'trigger'>;
}

const TabsTrigger = withMoveComponent<'trigger', TabsTriggerProps, HTMLButtonElement>({
  name: 'TabsTrigger',
  styles,
  slots: ['trigger'] as const,
  moveProps: ['value'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const triggerPt = ptm('trigger');
        const { className: ptClass, style: ptStyle, ...ptRest } = triggerPt as Record<string, unknown>;

        return (
          <RadixTabs.Trigger
            {...attrs}
            {...ptRest}
            ref={ref}
            value={props.value as string}
            disabled={props.disabled as boolean | undefined}
            className={cx('trigger', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
  pt?: PassThrough<'content'>;
}

const TabsContent = withMoveComponent<'content', TabsContentProps, HTMLDivElement>({
  name: 'TabsContent',
  styles,
  slots: ['content'] as const,
  moveProps: ['value', 'forceMount'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const contentPt = ptm('content');
        const { className: ptClass, style: ptStyle, ...ptRest } = contentPt as Record<string, unknown>;

        return (
          <RadixTabs.Content
            {...attrs}
            {...ptRest}
            ref={ref}
            value={props.value as string}
            forceMount={props.forceMount as true | undefined}
            tabIndex={-1}
            className={cx('content', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
