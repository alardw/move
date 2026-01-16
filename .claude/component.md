# Move Component Setup Guide

This guide explains how to set up or convert a component to use the Move animation system, following the AlertDialog pattern.

## Animation System Overview

Move uses **anime.js** with a custom abstraction layer for declarative enter/exit animations with spring physics support.

### Core Concepts

1. **`animate` prop** - Components accept an `animate` prop for custom animations
2. **Enter/Exit animations** - Lifecycle animations for mount/unmount
3. **Spring presets** - Physics-based springs for natural motion
4. **Per-property easing** - Different easings for different properties
5. **Reduced motion** - Automatic fallback for accessibility

---

## Animation Types

Choose the appropriate type based on component category:

```typescript
import type {
  OverlayAnimate,      // Dialog, AlertDialog, Popover, Sheet
  InteractiveAnimate,  // Button, Link, clickable elements
  ExpandableAnimate,   // Accordion, Collapsible
  ToggleableAnimate,   // Checkbox, Switch, Radio
  MenuAnimate,         // DropdownMenu, ContextMenu, Select
  MenuItemAnimate,     // Menu items
  ListAnimate,         // List containers
  ListItemAnimate,     // List items
} from '../../animation/types';
```

### Type Definitions

```typescript
// For overlays (Dialog, Popover, etc.)
type OverlayAnimate = {
  enter?: Animation;
  exit?: Animation;
};

// For interactive elements (Button, Link, etc.)
type InteractiveAnimate = {
  enter?: Animation;
  exit?: Animation;
  hover?: Animation | false;
  press?: Animation | false;
};

// For expandable content (Accordion, Collapsible)
type ExpandableAnimate = {
  enter?: Animation;
  exit?: Animation;
  open?: Animation;
  close?: Animation;
  stagger?: StaggerConfig;
};

// For toggleable elements (Checkbox, Switch, Radio)
type ToggleableAnimate = {
  enter?: Animation;
  exit?: Animation;
  press?: Animation | false;
  checked?: Animation;
  unchecked?: Animation;
};
```

---

## Spring Presets

Available spring presets (physics-based, no duration needed):

| Preset | Use Case | Feel |
|--------|----------|------|
| `snappy` | Small UI, buttons | Quick & responsive |
| `quick` | Fast interactions | Nimble |
| `poppy` | Scale animations, popovers | Bouncy & playful |
| `gentle` | Modals, overlays | Smooth & professional |
| `slow` | Page transitions | Elegant |
| `lazy` | Large elements | Very slow |
| `jelly` | Playful interactions | Wobbly & fun |
| `stiff` | Minimal overshoot | Controlled |

## Easing Presets

Standard easings (require `duration`):

`linear`, `inQuad`, `outQuad`, `inOutQuad`, `inCubic`, `outCubic`, `inOutCubic`, `inQuart`, `outQuart`, `inOutQuart`, `inExpo`, `outExpo`, `inOutExpo`, `inCirc`, `outCirc`, `inOutCirc`, `inBack`, `outBack`, `inOutBack`, `inElastic`, `outElastic`, `inOutElastic`, `inBounce`, `outBounce`, `inOutBounce`

---

## Animation Syntax

There are **two patterns** depending on animation type:

### 1. Lifecycle Animations (enter/exit/open/close/checked/unchecked)

Use per-property syntax with `[from, to]` array - explicit start and end values:

```typescript
animate={{
  enter: {
    opacity: { value: [0, 1], easing: 'outQuart' },
    scale: { value: [0.9, 1], easing: 'poppy' },
    y: { value: [20, 0], easing: 'snappy' },
  },
  exit: {
    opacity: { value: [1, 0], easing: 'outQuart' },
    scale: { value: [1, 0.95], easing: 'outQuart' },
    duration: 150,
  },
}}
```

### 2. Interactive Animations (hover/press)

Use simple value with animation-level easing - animates FROM current state TO target:

```typescript
animate={{
  hover: { scale: 1.05, easing: 'snappy' },  // animate TO 1.05
  press: { scale: 0.95, easing: 'snappy' },  // animate TO 0.95
}}
```

**Why the difference?**
- Lifecycle: Element appears/disappears, needs explicit from/to values
- Interactive: Element already exists, animate from its current state to target

### Rules

- Springs (`snappy`, `poppy`, `gentle`, etc.) don't need `duration`
- Standard easings (`outQuart`, `inOutCubic`, etc.) require `duration`
- Per-property syntax allows different easings per property

### Animatable Properties

- **Transform**: `scale`, `scaleX`, `scaleY`, `x`, `y`, `rotate`, `rotateX`, `rotateY`, `skewX`, `skewY`
- **Appearance**: `opacity`
- **Dimensions**: `width`, `height`

---

## Component Structure Template

Follow this pattern for overlay-type components (Dialog, Popover, etc.):

```typescript
'use client';

import * as React from 'react';
import { ComponentName as RadixComponent } from 'radix-ui';
import { animate } from 'animejs';
import {
  toAnimeParams,
  toInstantParams,
  prefersReducedMotion,
  mergeAnimateConfig,
} from '../../animation/utils';
import { defaultAnimations, type OverlayAnimate } from '../../animation/types';
import styles from './ComponentName.module.css';

// ============================================================================
// Context (for coordinating exit animations)
// ============================================================================

interface ComponentContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAnimatingOut: boolean;
  onExitComplete: () => void;
  registerAnimatedElement: () => void;
  unregisterAnimatedElement: () => void;
}

const ComponentContext = React.createContext<ComponentContextValue | null>(null);

function useComponentContext() {
  const context = React.useContext(ComponentContext);
  if (!context) {
    throw new Error('Component parts must be used within Component.Root');
  }
  return context;
}

// ============================================================================
// Root (manages open state and animation coordination)
// ============================================================================

export interface ComponentRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const ComponentRoot: React.FC<ComponentRootProps> = ({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  children,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const [isAnimatingOut, setIsAnimatingOut] = React.useState(false);
  const exitCount = React.useRef(0);
  const expectedExits = React.useRef(0);
  const pendingClose = React.useRef(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  // Track open state changes to trigger exit animations
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current && !open) {
      setIsAnimatingOut(true);
      exitCount.current = 0;
      pendingClose.current = true;
    }
    prevOpen.current = open;
  }, [open]);

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  // Called by each animated element when exit animation completes
  const handleExitComplete = React.useCallback(() => {
    exitCount.current++;
    if (exitCount.current >= expectedExits.current && pendingClose.current) {
      pendingClose.current = false;
      setIsAnimatingOut(false);
    }
  }, []);

  const registerAnimatedElement = React.useCallback(() => {
    expectedExits.current++;
  }, []);

  const unregisterAnimatedElement = React.useCallback(() => {
    expectedExits.current = Math.max(0, expectedExits.current - 1);
  }, []);

  // Keep Radix open during exit animation
  const radixOpen = open || isAnimatingOut;

  return (
    <ComponentContext.Provider
      value={{
        open,
        onOpenChange: handleOpenChange,
        isAnimatingOut,
        onExitComplete: handleExitComplete,
        registerAnimatedElement,
        unregisterAnimatedElement,
      }}
    >
      <RadixComponent.Root open={radixOpen} onOpenChange={handleOpenChange}>
        {children}
      </RadixComponent.Root>
    </ComponentContext.Provider>
  );
};

// ============================================================================
// Animated Content/Overlay (with enter/exit animations)
// ============================================================================

export interface ComponentContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadixComponent.Content>, 'ref'> {
  className?: string;
  /** Animation configuration for enter/exit */
  animate?: OverlayAnimate;
}

const ComponentContent = React.forwardRef<HTMLDivElement, ComponentContentProps>(
  ({ className, animate: animateProp, ...props }, forwardedRef) => {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const {
      isAnimatingOut,
      onExitComplete,
      registerAnimatedElement,
      unregisterAnimatedElement,
    } = useComponentContext();
    const hasAnimatedIn = React.useRef(false);

    // Store config in ref for stable access in effects
    const configRef = React.useRef<OverlayAnimate>(defaultAnimations.overlay);
    configRef.current = mergeAnimateConfig(defaultAnimations.overlay, animateProp);

    // Register this element for exit coordination
    React.useEffect(() => {
      registerAnimatedElement();
      return () => unregisterAnimatedElement();
    }, [registerAnimatedElement, unregisterAnimatedElement]);

    // Enter animation (runs once on mount)
    React.useEffect(() => {
      if (!ref.current || hasAnimatedIn.current) return;
      hasAnimatedIn.current = true;

      const config = configRef.current;
      if (!config.enter) return;

      const params = prefersReducedMotion()
        ? toInstantParams(config.enter)
        : toAnimeParams(config.enter);
      animate(ref.current, params);
    }, []);

    // Exit animation (runs when isAnimatingOut becomes true)
    React.useEffect(() => {
      if (!isAnimatingOut || !ref.current) return;

      const config = configRef.current;
      if (!config.exit) {
        onExitComplete();
        return;
      }

      const params = prefersReducedMotion()
        ? toInstantParams(config.exit)
        : toAnimeParams(config.exit);
      animate(ref.current, {
        ...params,
        onComplete: onExitComplete,
      });
    }, [isAnimatingOut, onExitComplete]);

    return (
      <RadixComponent.Content
        ref={(node) => {
          ref.current = node;
          if (typeof forwardedRef === 'function') forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={`${styles.content} ${className || ''}`}
        {...props}
      />
    );
  }
);

// ============================================================================
// Export as compound component
// ============================================================================

export const Component = {
  Root: ComponentRoot,
  Trigger: ComponentTrigger,
  Portal: ComponentPortal,
  Overlay: ComponentOverlay,  // If has backdrop
  Content: ComponentContent,
  // ... other parts
};
```

---

## Default Animations Reference

Use these as starting points (from `defaultAnimations`):

```typescript
// Overlay content (Dialog, AlertDialog, Popover)
overlay: {
  enter: {
    opacity: { value: [0, 1], easing: 'outQuart' },
    scale: { value: [0.9, 1], easing: 'snappy' },
  },
  exit: {
    opacity: { value: [1, 0], easing: 'outQuart' },
    scale: { value: [1, 0.95], easing: 'outQuart' },
    duration: 150,
  },
}

// Overlay backdrop
overlayBackdrop: {
  enter: { opacity: { value: [0, 1], easing: 'outQuart' }, duration: 200 },
  exit: { opacity: { value: [1, 0], easing: 'outQuart' }, duration: 150 },
}

// Menus (DropdownMenu, ContextMenu, Select)
menu: {
  enter: {
    opacity: { value: [0, 1], easing: 'outQuart' },
    scale: { value: [0.95, 1], easing: 'poppy' },
  },
  exit: {
    opacity: { value: [1, 0], easing: 'outQuart' },
    scale: { value: [1, 0.95], easing: 'outQuart' },
    duration: 150,
  },
  stagger: { delay: 30 },
}

// Interactive elements (Button, Link) - uses simple value syntax
interactive: {
  hover: { scale: 1.05, easing: 'snappy' },
  press: { scale: 0.95, easing: 'snappy' },
}

// Expandable content (Accordion, Collapsible)
expandable: {
  open: {
    height: { value: [0, 'auto'], easing: 'outQuart' },
    opacity: { value: [0, 1], easing: 'outQuart' },
    duration: 200,
  },
  close: {
    height: { value: ['auto', 0], easing: 'outQuart' },
    opacity: { value: [1, 0], easing: 'outQuart' },
    duration: 200,
  },
}

// Toggleable (Checkbox, Switch, Radio)
toggleable: {
  press: { scale: 0.9, easing: 'snappy' },  // simple value for interaction
  checked: {
    opacity: { value: [0, 1], easing: 'outQuart' },
    scale: { value: [0.5, 1], easing: 'poppy' },
  },
  unchecked: {
    opacity: { value: [1, 0], easing: 'outQuart' },
    scale: { value: [1, 0.5], easing: 'outQuart' },
    duration: 150,
  },
}
```

---

## Required Imports

```typescript
// Animation utilities
import { animate } from 'animejs';
import {
  toAnimeParams,
  toInstantParams,
  prefersReducedMotion,
  mergeAnimateConfig,
} from '../../animation/utils';
import { defaultAnimations, type OverlayAnimate } from '../../animation/types';
```

---

## Key Implementation Notes

1. **Always support `animate` prop override** - Users should be able to customize animations
2. **Use `mergeAnimateConfig`** - Merge user config with defaults
3. **Check `prefersReducedMotion()`** - Use `toInstantParams()` for accessibility
4. **Coordinate multiple animated elements** - Use context to track exit completion
5. **Keep Radix open during exit** - `radixOpen = open || isAnimatingOut`
6. **Use refs for animation targets** - anime.js needs DOM elements
7. **Track `hasAnimatedIn`** - Prevent re-running enter animation
8. **Call `onExitComplete`** - Signal when exit animation finishes

---

## Children Animation (Stagger)

For components with animated children (menus, lists):

```typescript
// In container
animate={{
  enter: { ... },
  exit: { ... },
  stagger: { delay: 30, from: 'first' },  // 30ms between each child
}}

// StaggerConfig options
interface StaggerConfig {
  delay?: number;      // Delay between each child (ms)
  from?: 'first' | 'last' | 'center';  // Direction
}
```

---

## Checklist for New Components

- [ ] Choose appropriate animation type (`OverlayAnimate`, `InteractiveAnimate`, etc.)
- [ ] Create context for animation coordination (if has enter/exit)
- [ ] Add `animate` prop to animatable parts (Content, Overlay, etc.)
- [ ] Use `mergeAnimateConfig` to merge with defaults
- [ ] Implement enter animation in `useEffect` (run once)
- [ ] Implement exit animation when `isAnimatingOut` changes
- [ ] Handle reduced motion with `prefersReducedMotion()`
- [ ] Register/unregister animated elements for exit coordination
- [ ] Keep Radix open during exit animation
- [ ] Export as compound component
