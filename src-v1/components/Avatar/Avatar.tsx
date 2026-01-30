'use client';

import * as React from 'react';
import { Avatar as RadixAvatar } from 'radix-ui';
import { animate, spring } from 'animejs';
import styles from './Avatar.module.css';

interface AvatarGroupContextValue {
  registerAvatar: () => number;
}

const AvatarGroupContext = React.createContext<AvatarGroupContextValue | null>(null);

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  staggerDelay?: number;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, staggerDelay = 50, children, ...props }, ref) => {
    const indexRef = React.useRef(0);

    const registerAvatar = React.useCallback(() => {
      return indexRef.current++;
    }, []);

    const contextValue = React.useMemo(
      () => ({ registerAvatar, staggerDelay }),
      [registerAvatar, staggerDelay]
    );

    return (
      <AvatarGroupContext.Provider value={contextValue}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </AvatarGroupContext.Provider>
    );
  }
);
AvatarGroup.displayName = 'Avatar.Group';

export interface AvatarRootProps extends React.ComponentPropsWithoutRef<typeof RadixAvatar.Root> {
  className?: string;
}

const AvatarRoot = React.forwardRef<
  React.ElementRef<typeof RadixAvatar.Root>,
  AvatarRootProps
>(({ className, ...props }, ref) => {
  const rootRef = React.useRef<HTMLSpanElement | null>(null);
  const groupContext = React.useContext(AvatarGroupContext);
  const indexRef = React.useRef<number | null>(null);

  if (indexRef.current === null && groupContext) {
    indexRef.current = groupContext.registerAvatar();
  }

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const delay = groupContext ? (indexRef.current ?? 0) * 50 : 0;

    animate(el, {
      scale: [0, 1],
      ease: spring({ mass: 1, stiffness: 400, damping: 15, velocity: 0 }),
      delay,
    });
  }, [groupContext]);

  return (
    <RadixAvatar.Root
      ref={(node) => {
        rootRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className={`${styles.root} ${className || ''}`}
      {...props}
    />
  );
});
AvatarRoot.displayName = 'Avatar.Root';

export interface AvatarImageProps extends React.ComponentPropsWithoutRef<typeof RadixAvatar.Image> {
  className?: string;
}

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof RadixAvatar.Image>,
  AvatarImageProps
>(({ className, ...props }, ref) => (
  <RadixAvatar.Image
    ref={ref}
    className={`${styles.image} ${className || ''}`}
    {...props}
  />
));
AvatarImage.displayName = 'Avatar.Image';

export interface AvatarFallbackProps extends React.ComponentPropsWithoutRef<typeof RadixAvatar.Fallback> {
  className?: string;
}

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof RadixAvatar.Fallback>,
  AvatarFallbackProps
>(({ className, ...props }, ref) => (
  <RadixAvatar.Fallback
    ref={ref}
    className={`${styles.fallback} ${className || ''}`}
    {...props}
  />
));
AvatarFallback.displayName = 'Avatar.Fallback';

export const Avatar = {
  Group: AvatarGroup,
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
};
