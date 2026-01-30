import * as React from 'react';
import { useIconContext, type IconProps } from './IconProvider';
import styles from './Icon.module.css';

export interface IconComponentProps extends IconProps {
  /** Name of the icon to render (resolved by IconProvider) */
  name: string;
}

const sizeMap = {
  xs: '0.75em',
  sm: '1em',
  md: '1.25em',
  lg: '1.5em',
  xl: '2em',
};

/**
 * Renders an icon by name using the resolver from IconProvider.
 *
 * @example
 * ```tsx
 * <Icon name="plus" />
 * <Icon name="settings" size="lg" color="var(--move-primary)" />
 * <Icon name="check" aria-label="Success" />
 * ```
 */
export function Icon({
  name,
  size = 'sm',
  color,
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}: IconComponentProps) {
  const context = useIconContext();

  if (!context) {
    console.warn(
      'Icon: No IconProvider found. Wrap your app in <IconProvider resolver={...}>'
    );
    return null;
  }

  const { resolver, fallback } = context;
  const resolved = resolver(name);

  if (!resolved) {
    if (fallback) {
      return <>{fallback}</>;
    }
    console.warn(`Icon: Could not resolve icon "${name}"`);
    return null;
  }

  const computedSize = typeof size === 'number' ? `${size}px` : sizeMap[size];
  const style: React.CSSProperties = {
    '--icon-size': computedSize,
    '--icon-color': color || 'currentColor',
  } as React.CSSProperties;

  const accessibilityProps = ariaLabel
    ? { 'aria-label': ariaLabel, role: 'img' }
    : { 'aria-hidden': ariaHidden ?? true };

  // Check if resolved is a component (function or ForwardRef/memo object)
  const isComponent =
    typeof resolved === 'function' ||
    (typeof resolved === 'object' &&
      resolved !== null &&
      '$$typeof' in resolved);

  if (isComponent) {
    const IconComponent = resolved as React.ComponentType<any>;
    return (
      <span
        className={`${styles.root}${className ? ` ${className}` : ''}`}
        style={style}
        {...accessibilityProps}
      >
        <IconComponent
          width={computedSize}
          height={computedSize}
          color="currentColor"
          aria-hidden="true"
        />
      </span>
    );
  }

  // If resolver returns a ReactNode (e.g., <svg>), wrap it
  return (
    <span
      className={`${styles.root}${className ? ` ${className}` : ''}`}
      style={style}
      {...accessibilityProps}
    >
      {resolved}
    </span>
  );
}

Icon.displayName = 'Icon';
