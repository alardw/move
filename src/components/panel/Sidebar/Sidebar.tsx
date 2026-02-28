'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { Slot } from 'radix-ui';
import { animate, spring } from 'animejs';
import { withMoveComponent } from '../../../engine';
import { useMergedRef } from '../../../engine/useMergedRef';
import { prefersReducedMotion } from '../../../animation';
import type { LayerAnimate } from '../../../animation/types';
import { Tooltip } from '../../core/Tooltip';
import type { SlotPropsMap } from '../../../engine/types';
import { useSidebar } from './useSidebar';
import type { UseSidebarOptions, UseSidebarReturn } from './useSidebar';
import styles from './Sidebar.module.css';

// ============================================================================
// Animation config
// ============================================================================

const sidebarSpring = { mass: 1, stiffness: 300, damping: 25, velocity: 0 };
const itemStaggerDelay = 30;

// ============================================================================
// Context
// ============================================================================

const SidebarContext = React.createContext<UseSidebarReturn | null>(null);

/**
 * Animation context for Sidebar sub-components.
 * - `undefined` = use default animations
 * - `null`      = all animations disabled (animate={false})
 */
const SidebarAnimateContext = React.createContext<LayerAnimate | null | undefined>(undefined);

export function useSidebarContext() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) {
    throw new Error('Sidebar components must be used within <Sidebar.Provider>');
  }
  return ctx;
}

// ============================================================================
// Provider (no factory — pure context wrapper)
// ============================================================================

export interface SidebarProviderProps extends UseSidebarOptions {
  children?: React.ReactNode;
  /** Animation configuration. Pass `false` to disable all sidebar animations. */
  animate?: LayerAnimate | false;
}

const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  animate,
  ...options
}) => {
  const sidebar = useSidebar(options);
  const animateConfig = animate === false ? null : undefined;
  return (
    <SidebarContext.Provider value={sidebar}>
      <SidebarAnimateContext.Provider value={animateConfig}>
        {children}
      </SidebarAnimateContext.Provider>
    </SidebarContext.Provider>
  );
};
SidebarProvider.displayName = 'Sidebar.Provider';

// ============================================================================
// Overlay (mobile backdrop)
// ============================================================================

export interface SidebarOverlayProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'overlay'>;
}

const SidebarOverlay = withMoveComponent<'overlay', SidebarOverlayProps, HTMLDivElement>({
  name: 'SidebarOverlay',
  styles,
  slots: ['overlay'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const { setMobileOpen } = useSidebarContext();
    const animateConfig = React.useContext(SidebarAnimateContext);
    const overlayRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef<HTMLDivElement>(ref, overlayRef);
    const animRef = React.useRef<ReturnType<typeof animate> | null>(null);

    // Animate entrance with anime.js
    React.useLayoutEffect(() => {
      const el = overlayRef.current;
      if (!el) return;

      if (animateConfig === null || prefersReducedMotion()) return;

      el.style.opacity = '0';
      animRef.current = animate(el, {
        opacity: [0, 1],
        ease: 'outQuart',
        duration: 200,
        onComplete: () => {
          if (el) el.style.opacity = '';
        },
      });

      return () => {
        if (animRef.current) animRef.current.pause();
      };
    }, [animateConfig]);

    return {
      render() {
        const overlaySp = sp('overlay');
        const { className: spClass, style: spStyle, ...spRest } = overlaySp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={mergedRef}
            className={cx('overlay', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        );
      },
    };
  },
});

// ============================================================================
// Root (<aside> container)
// ============================================================================

export interface SidebarRootProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  side?: 'left' | 'right';
  sp?: SlotPropsMap<'root'>;
}

const SidebarRoot = withMoveComponent<'root', SidebarRootProps, HTMLElement>({
  name: 'SidebarRoot',
  styles,
  slots: ['root'] as const,
  moveProps: ['side'],
  defaults: { side: 'left' },

  setup({ props, ref, cx, sp, attrs }) {
    const { collapsed, mobileOpen, isMobile } = useSidebarContext();
    const animateConfig = React.useContext(SidebarAnimateContext);
    const side = (props.side as string) || 'left';

    const asideRef = React.useRef<HTMLElement>(null);
    const mergedRef = useMergedRef<HTMLElement>(ref, asideRef);
    const animRef = React.useRef<ReturnType<typeof animate> | null>(null);
    const isFirstRender = React.useRef(true);

    // Animate width on collapse/expand (desktop only).
    // Must be useLayoutEffect so we can snap back to the old width
    // before the browser paints (CSS applies the new width instantly
    // via data-collapsed, so we override it with inline style first).
    React.useLayoutEffect(() => {
      // Skip animation on first render — CSS handles initial state
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }

      const el = asideRef.current;
      if (!el || isMobile) return;

      if (animRef.current) animRef.current.pause();

      // Read CSS variable values for the two widths
      const rootStyles = getComputedStyle(el);
      const expandedWidth = rootStyles.getPropertyValue('--move-sidebar-width').trim() || '15rem';
      const collapsedWidth = rootStyles.getPropertyValue('--move-sidebar-width-collapsed').trim() || '4rem';

      const fromWidth = collapsed ? expandedWidth : collapsedWidth;
      const targetWidth = collapsed ? collapsedWidth : expandedWidth;

      if (animateConfig === null || prefersReducedMotion()) {
        el.style.width = targetWidth;
        return;
      }

      // Snap to old width before paint (overrides the CSS rule)
      el.style.width = fromWidth;

      animRef.current = animate(el, {
        width: targetWidth,
        ease: spring(sidebarSpring),
        onComplete: () => {
          // Clear inline style so CSS takes over
          if (el) el.style.width = '';
        },
      });

      return () => {
        if (animRef.current) animRef.current.pause();
      };
    }, [collapsed, isMobile, animateConfig]);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        const aside = (
          <aside
            {...attrs}
            {...spRest}
            ref={mergedRef}
            data-collapsed={collapsed}
            data-side={side}
            data-mobile={isMobile || undefined}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </aside>
        );

        // Mobile: portal with overlay
        if (isMobile) {
          if (!mobileOpen) return null;
          return createPortal(
            <>
              <SidebarOverlay />
              {aside}
            </>,
            document.body,
          );
        }

        // Desktop: plain aside
        return aside;
      },
    };
  },
});

// ============================================================================
// Header (sticky top)
// ============================================================================

export interface SidebarHeaderProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Content shown when sidebar is collapsed. Falls back to children if not provided. */
  collapsedChildren?: React.ReactNode;
  sp?: SlotPropsMap<'header'>;
}

const SidebarHeader = withMoveComponent<'header', SidebarHeaderProps, HTMLDivElement>({
  name: 'SidebarHeader',
  styles,
  slots: ['header'] as const,
  moveProps: ['collapsedChildren'],

  setup({ props, ref, cx, sp, attrs }) {
    const { collapsed, isMobile } = useSidebarContext();
    const showCollapsed = collapsed && !isMobile;

    return {
      render() {
        const headerSp = sp('header');
        const { className: spClass, style: spStyle, ...spRest } = headerSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('header', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {showCollapsed && props.collapsedChildren !== undefined
              ? props.collapsedChildren
              : props.children}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Content (scrollable middle — stagger items on mount)
// ============================================================================

export interface SidebarContentProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'content'>;
}

const SidebarContent = withMoveComponent<'content', SidebarContentProps, HTMLDivElement>({
  name: 'SidebarContent',
  styles,
  slots: ['content'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const animateConfig = React.useContext(SidebarAnimateContext);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef<HTMLDivElement>(ref, contentRef);
    const animRef = React.useRef<ReturnType<typeof animate> | null>(null);

    // Stagger entrance animation on items
    React.useLayoutEffect(() => {
      const el = contentRef.current;
      if (!el || animateConfig === null || prefersReducedMotion()) return;

      const items = el.querySelectorAll<HTMLElement>(`.${styles.item}`);
      if (!items.length) return;

      items.forEach((item) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-8px)';
      });

      animRef.current = animate(items, {
        opacity: [0, 1],
        translateX: [-8, 0],
        ease: spring(sidebarSpring),
        delay: (_el: any, i: number) => i * itemStaggerDelay,
        onComplete: () => {
          items.forEach((item) => {
            item.style.opacity = '';
            item.style.transform = '';
          });
        },
      });

      return () => {
        if (animRef.current) animRef.current.pause();
      };
    }, [animateConfig]);

    return {
      render() {
        const contentSp = sp('content');
        const { className: spClass, style: spStyle, ...spRest } = contentSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={mergedRef}
            className={cx('content', props.className, spClass as string | undefined)}
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
// Footer (sticky bottom)
// ============================================================================

export interface SidebarFooterProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'footer'>;
}

const SidebarFooter = withMoveComponent<'footer', SidebarFooterProps, HTMLDivElement>({
  name: 'SidebarFooter',
  styles,
  slots: ['footer'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const footerSp = sp('footer');
        const { className: spClass, style: spStyle, ...spRest } = footerSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('footer', props.className, spClass as string | undefined)}
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
// Group (section container)
// ============================================================================

export interface SidebarGroupProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'group'>;
}

const SidebarGroup = withMoveComponent<'group', SidebarGroupProps, HTMLDivElement>({
  name: 'SidebarGroup',
  styles,
  slots: ['group'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const groupSp = sp('group');
        const { className: spClass, style: spStyle, ...spRest } = groupSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            role="group"
            className={cx('group', props.className, spClass as string | undefined)}
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
// GroupLabel (section heading)
// ============================================================================

export interface SidebarGroupLabelProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'groupLabel'>;
}

const SidebarGroupLabel = withMoveComponent<'groupLabel', SidebarGroupLabelProps, HTMLDivElement>({
  name: 'SidebarGroupLabel',
  styles,
  slots: ['groupLabel'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const groupLabelSp = sp('groupLabel');
        const { className: spClass, style: spStyle, ...spRest } = groupLabelSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('groupLabel', props.className, spClass as string | undefined)}
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
// Item (interactive nav element)
// ============================================================================

export interface SidebarItemProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  asChild?: boolean;
  tooltip?: React.ReactNode;
  sp?: SlotPropsMap<'item' | 'itemIcon' | 'itemLabel' | 'itemBadge'>;
}

const SidebarItem = withMoveComponent<
  'item' | 'itemIcon' | 'itemLabel' | 'itemBadge',
  SidebarItemProps,
  HTMLButtonElement
>({
  name: 'SidebarItem',
  styles,
  slots: ['item', 'itemIcon', 'itemLabel', 'itemBadge'] as const,
  moveProps: ['icon', 'badge', 'active', 'disabled', 'asChild', 'tooltip'],

  setup({ props, ref, cx, sp, attrs }) {
    const { collapsed, isMobile } = useSidebarContext();
    const showTooltip = collapsed && !isMobile && !!props.tooltip;

    return {
      render() {
        const itemSp = sp('item');
        const { className: spClass, style: spStyle, ...spRest } = itemSp as Record<string, unknown>;

        const iconSp = sp('itemIcon');
        const { className: iconSpClass, style: iconSpStyle, ...iconSpRest } = iconSp as Record<string, unknown>;

        const labelSp = sp('itemLabel');
        const { className: labelSpClass, style: labelSpStyle, ...labelSpRest } = labelSp as Record<string, unknown>;

        const badgeSp = sp('itemBadge');
        const { className: badgeSpClass, style: badgeSpStyle, ...badgeSpRest } = badgeSp as Record<string, unknown>;

        const innerContent = (child?: React.ReactNode) => (
          <>
            {props.icon && (
              <span
                {...iconSpRest}
                className={cx('itemIcon', iconSpClass as string | undefined)}
                style={iconSpStyle as React.CSSProperties}
              >
                {props.icon as React.ReactNode}
              </span>
            )}
            <span
              {...labelSpRest}
              className={cx('itemLabel', labelSpClass as string | undefined)}
              style={labelSpStyle as React.CSSProperties}
            >
              {child}
            </span>
            {props.badge && (
              <span
                {...badgeSpRest}
                className={cx('itemBadge', badgeSpClass as string | undefined)}
                style={badgeSpStyle as React.CSSProperties}
              >
                {props.badge as React.ReactNode}
              </span>
            )}
          </>
        );

        let element: React.ReactElement;

        if (props.asChild) {
          // Clone the single child element, injecting icon/label/badge as its content
          const child = React.Children.only(props.children) as React.ReactElement<any>;
          element = React.cloneElement(
            child,
            {
              ...attrs,
              ...spRest,
              ref,
              'data-active': props.active || undefined,
              'data-disabled': props.disabled || undefined,
              className: cx('item', props.className, child.props.className, spClass as string | undefined),
              style: { ...child.props.style, ...props.style, ...(spStyle as React.CSSProperties) },
            },
            innerContent(child.props.children),
          );
        } else {
          element = (
            <button
              {...attrs}
              {...spRest}
              ref={ref as any}
              data-active={props.active || undefined}
              data-disabled={props.disabled || undefined}
              className={cx('item', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            >
              {innerContent(props.children)}
            </button>
          );
        }

        if (showTooltip) {
          return (
            <Tooltip label={props.tooltip as React.ReactNode} side="right" sideOffset={8}>
              {element}
            </Tooltip>
          );
        }

        return element;
      },
    };
  },
});

// ============================================================================
// Trigger (toggle button)
// ============================================================================

export interface SidebarTriggerProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  asChild?: boolean;
  sp?: SlotPropsMap<'trigger'>;
}

const SidebarTrigger = withMoveComponent<'trigger', SidebarTriggerProps, HTMLButtonElement>({
  name: 'SidebarTrigger',
  styles,
  slots: ['trigger'] as const,
  moveProps: ['asChild'],

  setup({ props, ref, cx, sp, attrs }) {
    const { toggleCollapsed, toggleMobileOpen, isMobile } = useSidebarContext();

    const handleClick = React.useCallback(
      (e: React.MouseEvent) => {
        (attrs as any).onClick?.(e);
        if (e.defaultPrevented) return;
        if (isMobile) {
          toggleMobileOpen();
        } else {
          toggleCollapsed();
        }
      },
      [isMobile, toggleCollapsed, toggleMobileOpen, attrs],
    );

    return {
      render() {
        const triggerSp = sp('trigger');
        const { className: spClass, style: spStyle, ...spRest } = triggerSp as Record<string, unknown>;
        const Comp = props.asChild ? Slot.Root : 'button';
        return (
          <Comp
            {...attrs}
            {...spRest}
            ref={ref as any}
            className={cx('trigger', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            onClick={handleClick}
          >
            {props.children}
          </Comp>
        );
      },
    };
  },
});

// ============================================================================
// Rail (thin edge bar for re-expanding)
// ============================================================================

export interface SidebarRailProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'rail'>;
}

const SidebarRail = withMoveComponent<'rail', SidebarRailProps, HTMLDivElement>({
  name: 'SidebarRail',
  styles,
  slots: ['rail'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const { toggleCollapsed } = useSidebarContext();

    return {
      render() {
        const railSp = sp('rail');
        const { className: spClass, style: spStyle, ...spRest } = railSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('rail', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            onClick={() => toggleCollapsed()}
            aria-hidden="true"
          />
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const Sidebar = {
  Provider: SidebarProvider,
  Root: SidebarRoot,
  Header: SidebarHeader,
  Content: SidebarContent,
  Footer: SidebarFooter,
  Group: SidebarGroup,
  GroupLabel: SidebarGroupLabel,
  Item: SidebarItem,
  Trigger: SidebarTrigger,
  Rail: SidebarRail,
  Overlay: SidebarOverlay,
};
