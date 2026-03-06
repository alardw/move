# Bootstrap Reference — MoveRoot

## MoveRoot

Single wrapper that bootstraps a Move application. Composes all required providers so consumers need one import and one component.

```tsx
import { MoveRoot, darkTheme } from 'move';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `Theme` | `darkTheme` | Theme object with tokens and animation config |
| `iconResolver` | `IconResolver` | — | Function that resolves icon names to components |
| `slotProps` | `GlobalSlotProps` | — | Global slot-props overrides keyed by component name |
| `className` | `string` | — | Additional class name on the theme wrapper |

### What it does

1. **ThemeProvider** — Injects CSS custom properties (design tokens) and provides animation config via context
2. **Tooltip.Provider** — Coordinates tooltip skip-delay behavior across all tooltips
3. **IconProvider** — Supplies icon resolver to all `<Icon>` components (only when `iconResolver` is provided)
4. **MoveProvider** — Supplies global slot-props overrides (only when `slotProps` is provided)
5. **Background color** — Applies `--move-bg-base` to `html` and `body` elements

### Available themes

```tsx
import { darkTheme, lightTheme } from 'move';
```

Consumers can also create custom themes implementing the `Theme` interface.

---

## Icon Resolver

Move is icon-library agnostic. The consumer provides a resolver function that maps string names to components.

### Lucide Icons

```tsx
import * as LucideIcons from 'lucide-react';

function toPascalCase(str: string) {
  return str.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('');
}

const iconResolver = (name: string) => {
  const icons = LucideIcons as Record<string, any>;
  return icons[toPascalCase(name)] || icons[name] || null;
};
```

### Heroicons

```tsx
import * as HeroIcons from '@heroicons/react/24/outline';

const iconResolver = (name: string) => {
  const icons = HeroIcons as Record<string, any>;
  return icons[toPascalCase(name)] || null;
};
```

### Custom icon map

```tsx
import { Plus, Minus, Check } from './my-icons';

const icons: Record<string, React.ComponentType> = { plus: Plus, minus: Minus, check: Check };
const iconResolver = (name: string) => icons[name] || null;
```

**Important:** Define the resolver outside the component or memoize it to avoid unnecessary re-renders.

---

## Minimal Setup Examples

### Vite + React

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MoveRoot, darkTheme } from 'move';
import * as LucideIcons from 'lucide-react';
import App from './App';

function toPascalCase(str: string) {
  return str.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('');
}

const iconResolver = (name: string) => {
  const icons = LucideIcons as Record<string, any>;
  return icons[toPascalCase(name)] || icons[name] || null;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MoveRoot theme={darkTheme} iconResolver={iconResolver}>
      <App />
    </MoveRoot>
  </React.StrictMode>,
);
```

### Next.js App Router

```tsx
// app/providers.tsx
'use client';

import { MoveRoot, darkTheme } from 'move';
import * as LucideIcons from 'lucide-react';

function toPascalCase(str: string) {
  return str.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('');
}

const iconResolver = (name: string) => {
  const icons = LucideIcons as Record<string, any>;
  return icons[toPascalCase(name)] || icons[name] || null;
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MoveRoot theme={darkTheme} iconResolver={iconResolver}>
      {children}
    </MoveRoot>
  );
}
```

```tsx
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Without icons

```tsx
<MoveRoot theme={darkTheme}>
  <App />
</MoveRoot>
```

Icons are optional. Components that use `<Icon>` will render nothing if no resolver is provided.

---

## Theme switching

```tsx
import { useState } from 'react';
import { MoveRoot, darkTheme, lightTheme } from 'move';

function App() {
  const [theme, setTheme] = useState(darkTheme);

  return (
    <MoveRoot theme={theme} iconResolver={iconResolver}>
      <button onClick={() => setTheme(t => t.name === 'dark' ? lightTheme : darkTheme)}>
        Toggle theme
      </button>
      {/* app content */}
    </MoveRoot>
  );
}
```

Theme changes are instant — `MoveRoot` updates CSS custom properties on `:root` and the background color on `html`/`body`.
