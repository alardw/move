import * as React from 'react';
import '../../tokens/index.css';
import type { Theme, ThemeAnimation } from '../../themes/types';
import { darkTheme } from '../../themes/dark';

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
    const contextValue = React.useMemo<ThemeContextValue>(
      () => ({
        theme,
        animation: theme.animation,
      }),
      [theme]
    );

    // Apply theme tokens to :root so CSS var() references work everywhere
    // Use useLayoutEffect to apply before paint
    React.useLayoutEffect(() => {
      const root = document.documentElement;
      for (const [key, value] of Object.entries(theme.tokens)) {
        root.style.setProperty(key, value);
      }
    }, [theme]);

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
          data-move-theme={theme.name}
        >
          {children}
        </div>
      </ThemeContext.Provider>
    );
  }
);

ThemeProvider.displayName = 'ThemeProvider';
