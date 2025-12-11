import * as React from 'react';
import { Slot } from 'radix-ui';
import styles from './Button.module.css';
import { animationDown, animationUp, animationReset, type ButtonAnimation } from './animations';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type { ButtonAnimation };

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style variant
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * Size of the button
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * Click animation style
   * - 'none': No animation
   * - 'spring': Quick and responsive spring physics
   * @default 'none'
   */
  animation?: ButtonAnimation;
  /**
   * Render as child element (for composition with links, etc.)
   */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', animation = 'none', asChild = false, type = 'button', onMouseDown, onMouseUp, onMouseLeave, onKeyDown, onKeyUp, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : 'button';
    const internalRef = React.useRef<HTMLButtonElement>(null);

    React.useImperativeHandle(ref, () => internalRef.current!);

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (animation !== 'none' && internalRef.current) {
        animationDown[animation](internalRef.current);
      }
      onMouseDown?.(e);
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (animation !== 'none' && internalRef.current) {
        animationUp[animation](internalRef.current);
      }
      onMouseUp?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (animation !== 'none' && internalRef.current) {
        animationReset(internalRef.current);
      }
      onMouseLeave?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if ((e.key === 'Enter' || e.key === ' ') && animation !== 'none' && internalRef.current) {
        animationDown[animation](internalRef.current);
      }
      onKeyDown?.(e);
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if ((e.key === 'Enter' || e.key === ' ') && animation !== 'none' && internalRef.current) {
        animationUp[animation](internalRef.current);
      }
      onKeyUp?.(e);
    };

    return (
      <Comp
        ref={internalRef}
        type={asChild ? undefined : type}
        className={`${styles.root}${className ? ` ${className}` : ''}`}
        data-variant={variant}
        data-size={size}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
