'use client';

import * as React from 'react';
import { Slot } from 'radix-ui';
import { animate, spring } from 'animejs';
import { Tooltip } from '../Tooltip';
import styles from './Dock.module.css';

/* -------------------------------------------------------------------------------------------------
 * DockRoot
 * -----------------------------------------------------------------------------------------------*/

export interface DockRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const DockRoot = React.forwardRef<HTMLDivElement, DockRootProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Tooltip.Provider delayDuration={0}>
        <nav
          ref={ref}
          className={`${styles.root} ${className || ''}`}
          role="toolbar"
          {...props}
        >
          {children}
        </nav>
      </Tooltip.Provider>
    );
  }
);
DockRoot.displayName = 'Dock.Root';

/* -------------------------------------------------------------------------------------------------
 * DockGroup
 * -----------------------------------------------------------------------------------------------*/

export interface DockGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const DockGroup = React.forwardRef<HTMLDivElement, DockGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.group} ${className || ''}`}
        role="group"
        {...props}
      >
        {children}
      </div>
    );
  }
);
DockGroup.displayName = 'Dock.Group';

/* -------------------------------------------------------------------------------------------------
 * DockItem
 * -----------------------------------------------------------------------------------------------*/

export interface DockItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  asChild?: boolean;
}

const DockItem = React.forwardRef<HTMLButtonElement, DockItemProps>(
  ({ className, icon, label, active, asChild, ...props }, ref) => {
    const itemRef = React.useRef<HTMLButtonElement | null>(null);
    const animRef = React.useRef<ReturnType<typeof animate> | null>(null);
    const isHovered = React.useRef(false);

    const springConfig = { mass: 0.6, stiffness: 400, damping: 10, velocity: 0 };

    // Cleanup animation on unmount
    React.useEffect(() => {
      return () => {
        if (animRef.current) {
          animRef.current.pause();
          animRef.current = null;
        }
      };
    }, []);

    // Reset inline styles when active changes
    React.useEffect(() => {
      const el = itemRef.current;
      if (!el || isHovered.current) return;

      // Clear inline color so CSS takes over
      el.style.color = '';
    }, [active]);

    // Scale factor: icon is rendered at 1.625rem, we want it to appear as 1.25rem normally
    // 1.25 / 1.625 = ~0.77
    const baseScale = 0.77;
    const hoverScale = 1;

    const handleMouseEnter = () => {
      const el = itemRef.current;
      if (!el) return;

      isHovered.current = true;

      if (animRef.current) {
        animRef.current.pause();
      }

      animRef.current = animate(el, {
        scale: hoverScale,
        translateY: -4,
        ease: spring(springConfig),
      });
    };

    const handleMouseLeave = () => {
      const el = itemRef.current;
      if (!el) return;

      isHovered.current = false;

      if (animRef.current) {
        animRef.current.pause();
      }

      animRef.current = animate(el, {
        scale: baseScale,
        translateY: 0,
        ease: spring(springConfig),
      });
    };

    const Comp = asChild ? Slot.Root : 'button';

    return (
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Comp
            ref={(node: HTMLButtonElement | null) => {
              itemRef.current = node;
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            className={`${styles.item} ${className || ''}`}
            data-active={active || undefined}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label={label}
            {...props}
          >
            <span className={styles.itemIcon}>{icon}</span>
          </Comp>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content side="top" sideOffset={12}>
            {label}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    );
  }
);
DockItem.displayName = 'Dock.Item';

/* -------------------------------------------------------------------------------------------------
 * Dock
 * -----------------------------------------------------------------------------------------------*/

export const Dock = {
  Root: DockRoot,
  Group: DockGroup,
  Item: DockItem,
};
