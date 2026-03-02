export interface ThemeTokens {
  // Background
  '--move-bg-base': string;
  '--move-bg-subtle': string;
  '--move-bg-muted': string;
  '--move-bg-emphasis': string;
  '--move-bg-inverse': string;

  // Foreground
  '--move-fg-base': string;
  '--move-fg-muted': string;
  '--move-fg-subtle': string;
  '--move-fg-inverse': string;

  // Border
  '--move-border-base': string;
  '--move-border-muted': string;
  '--move-border-emphasis': string;

  // Primary
  '--move-primary': string;
  '--move-primary-hover': string;
  '--move-primary-active': string;
  '--move-primary-subtle': string;
  '--move-primary-fg': string;

  // Secondary
  '--move-secondary': string;
  '--move-secondary-hover': string;
  '--move-secondary-active': string;
  '--move-secondary-fg': string;

  // Success
  '--move-success': string;
  '--move-success-hover': string;
  '--move-success-subtle': string;
  '--move-success-fg': string;

  // Warning
  '--move-warning': string;
  '--move-warning-hover': string;
  '--move-warning-subtle': string;
  '--move-warning-fg': string;

  // Error
  '--move-error': string;
  '--move-error-hover': string;
  '--move-error-subtle': string;
  '--move-error-fg': string;

  // Info
  '--move-info': string;
  '--move-info-hover': string;
  '--move-info-subtle': string;
  '--move-info-fg': string;

  // Focus
  '--move-focus-ring-color': string;

  // Overlay
  '--move-overlay': string;

  // Scrollbar
  '--move-scrollbar-thumb': string;
  '--move-scrollbar-track': string;

  // Shadows — config
  '--move-shadow-angle': string;
  // Shadows — per surface (5 × 4 = 20)
  '--move-shadow-base-sm': string;
  '--move-shadow-base-md': string;
  '--move-shadow-base-lg': string;
  '--move-shadow-base-xl': string;
  '--move-shadow-subtle-sm': string;
  '--move-shadow-subtle-md': string;
  '--move-shadow-subtle-lg': string;
  '--move-shadow-subtle-xl': string;
  '--move-shadow-muted-sm': string;
  '--move-shadow-muted-md': string;
  '--move-shadow-muted-lg': string;
  '--move-shadow-muted-xl': string;
  '--move-shadow-emphasis-sm': string;
  '--move-shadow-emphasis-md': string;
  '--move-shadow-emphasis-lg': string;
  '--move-shadow-emphasis-xl': string;
  '--move-shadow-inverse-sm': string;
  '--move-shadow-inverse-md': string;
  '--move-shadow-inverse-lg': string;
  '--move-shadow-inverse-xl': string;
}

export interface ThemeAnimation {
  spring: {
    mass: number;
    stiffness: number;
    damping: number;
  };
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  reducedMotion: boolean;
}

export interface Theme {
  name: string;
  tokens: ThemeTokens;
  animation: ThemeAnimation;
}
