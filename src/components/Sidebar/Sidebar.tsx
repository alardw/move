'use client';

import * as React from 'react';
import { Slot } from 'radix-ui';
import { animate } from 'animejs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Sidebar.module.css';

// Context for sharing collapsed state
interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebarContext() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('Sidebar components must be used within Sidebar.Root');
  }
  return context;
}

// Root
export interface SidebarRootProps extends React.HTMLAttributes<HTMLElement> {
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  collapsedWidth?: string;
  expandedWidth?: string;
}

const SidebarRoot = React.forwardRef<HTMLElement, SidebarRootProps>(
  (
    {
      className,
      children,
      defaultCollapsed = false,
      collapsed: controlledCollapsed,
      onCollapsedChange,
      collapsedWidth = '4rem',
      expandedWidth = '15rem',
      ...props
    },
    ref
  ) => {
    const [internalCollapsed, setInternalCollapsed] = React.useState(defaultCollapsed);
    const isControlled = controlledCollapsed !== undefined;
    const collapsed = isControlled ? controlledCollapsed : internalCollapsed;

    const sidebarRef = React.useRef<HTMLElement>(null);
    const isFirstRender = React.useRef(true);

    const setCollapsed = React.useCallback(
      (value: boolean) => {
        if (!isControlled) {
          setInternalCollapsed(value);
        }
        onCollapsedChange?.(value);
      },
      [isControlled, onCollapsedChange]
    );

    React.useEffect(() => {
      const sidebar = sidebarRef.current;
      if (!sidebar) return;

      if (isFirstRender.current) {
        isFirstRender.current = false;
        sidebar.style.width = collapsed ? collapsedWidth : expandedWidth;
        return;
      }

      animate(sidebar, {
        width: collapsed ? collapsedWidth : expandedWidth,
        ease: 'outQuart',
        duration: 300,
      });
    }, [collapsed, collapsedWidth, expandedWidth]);

    return (
      <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
        <aside
          ref={(node) => {
            (sidebarRef as React.MutableRefObject<HTMLElement | null>).current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          className={`${styles.root} ${className || ''}`}
          data-collapsed={collapsed}
          {...props}
        >
          {children}
        </aside>
      </SidebarContext.Provider>
    );
  }
);
SidebarRoot.displayName = 'Sidebar.Root';

// Header
export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`${styles.header} ${className || ''}`} {...props} />
  )
);
SidebarHeader.displayName = 'Sidebar.Header';

// Content
export interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`${styles.content} ${className || ''}`} {...props} />
  )
);
SidebarContent.displayName = 'Sidebar.Content';

// Item
export interface SidebarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  active?: boolean;
  asChild?: boolean;
}

const SidebarItem = React.forwardRef<HTMLButtonElement, SidebarItemProps>(
  ({ className, icon, active = false, asChild = false, children, ...props }, ref) => {
    const { collapsed } = useSidebarContext();
    const Comp = asChild ? Slot.Root : 'button';

    return (
      <Comp
        ref={ref}
        className={`${styles.item} ${className || ''}`}
        data-active={active}
        data-collapsed={collapsed}
        {...props}
      >
        <span className={styles.itemIcon}>{icon}</span>
        <span className={styles.itemLabel}>{children}</span>
      </Comp>
    );
  }
);
SidebarItem.displayName = 'Sidebar.Item';

// Toggle
export interface SidebarToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SidebarToggle = React.forwardRef<HTMLButtonElement, SidebarToggleProps>(
  ({ className, ...props }, ref) => {
    const { collapsed, setCollapsed } = useSidebarContext();

    return (
      <button
        ref={ref}
        className={`${styles.toggle} ${className || ''}`}
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        {...props}
      >
        {collapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>
    );
  }
);
SidebarToggle.displayName = 'Sidebar.Toggle';

// Footer
export interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`${styles.footer} ${className || ''}`} {...props} />
  )
);
SidebarFooter.displayName = 'Sidebar.Footer';

export const Sidebar = {
  Root: SidebarRoot,
  Header: SidebarHeader,
  Content: SidebarContent,
  Item: SidebarItem,
  Toggle: SidebarToggle,
  Footer: SidebarFooter,
};
