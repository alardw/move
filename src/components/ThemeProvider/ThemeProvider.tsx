import * as React from 'react';
import '../../styles/tokens/index.css';
import type { Theme, ThemeAnimation } from '../../styles/themes/types';
import { darkTheme } from '../../styles/themes/dark';

export interface ThemeContextValue {
  theme: Theme;
  animation: ThemeAnimation;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  /**
   * Theme object containing tokens and animation config
   * @default darkTheme
   */
  theme?: Theme;
  /**
   * Additional class name to apply to the theme wrapper
   */
  className?: string;
  /**
   * Apply theme to a wrapper div (true) or to :root via CSS import only (false)
   * When false, no wrapper element is rendered
   * @default true
   */
  asWrapper?: boolean;
}

/**
 * ThemeProvider injects Move design tokens as CSS custom properties
 * and provides animation configuration via context.
 *
 * Usage:
 * ```tsx
 * import { ThemeProvider, darkTheme, lightTheme } from 'move';
 *
 * // Use dark theme (default)
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 *
 * // Use light theme
 * <ThemeProvider theme={lightTheme}>
 *   <App />
 * </ThemeProvider>
 *
 * // Access theme in components
 * function MyComponent() {
 *   const { animation } = useTheme();
 *   // Use animation.spring, animation.duration, etc.
 * }
 * ```
 */
export const ThemeProvider = React.forwardRef<HTMLDivElement, ThemeProviderProps>(
  ({ children, theme = darkTheme, className, asWrapper = true }, ref) => {
    const parentContext = React.useContext(ThemeContext);
    const isNested = parentContext !== null;

    const contextValue = React.useMemo<ThemeContextValue>(
      () => ({
        theme,
        animation: theme.animation,
      }),
      [theme]
    );

    // Top-level provider: apply tokens to :root so CSS var() works everywhere.
    // Nested providers skip :root — they scope tokens via the wrapper div instead.
    React.useLayoutEffect(() => {
      if (isNested) return;
      const root = document.documentElement;
      for (const [key, value] of Object.entries(theme.tokens)) {
        root.style.setProperty(key, value);
      }
    }, [theme, isNested]);

    // For wrapper mode, build inline styles from tokens so CSS custom properties
    // inherit down this subtree (scoped theming).
    const tokenStyle = React.useMemo(() => {
      if (!asWrapper) return undefined;
      const style: Record<string, string> = {};
      for (const [key, value] of Object.entries(theme.tokens)) {
        style[key] = value;
      }
      return style;
    }, [theme, asWrapper]);

    if (!asWrapper) {
      return (
        <ThemeContext.Provider value={contextValue}>
          {children}
        </ThemeContext.Provider>
      );
    }

    return (
      <ThemeContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={className}
          style={tokenStyle}
          data-move-theme={theme.name}
        >
          {children}
        </div>
      </ThemeContext.Provider>
    );
  }
);

ThemeProvider.displayName = 'ThemeProvider';
