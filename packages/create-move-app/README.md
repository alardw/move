# create-move-app

Scaffold a new [Move](https://github.com/weisscher/move) application with a single command.

## Usage

```bash
npx create-move-app my-app
```

You'll be prompted to choose:

1. **Shell type** — Sidebar (dashboard/SaaS), Top nav (marketing/docs), or Minimal (landing page)
2. **Theme** — Dark or Light
3. **Icon library** — Lucide, Heroicons, or None (add later)

## What you get

```
my-app/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx      # MoveRoot + theme + icon resolver
│   ├── App.tsx       # Shell layout
│   └── vite-env.d.ts
├── .agents/skills/   # AI skills for building with Move
└── .claude/skills/   # Claude Code symlink
```

- **Vite + React 19 + TypeScript** — zero-config dev server
- **MoveRoot** — pre-configured with your theme and icon resolver
- **AI skills** — copied from the Move package for assisted development

## After scaffolding

```bash
cd my-app
npm run dev
```

## Adding icons later

If you chose "None" during setup, install an icon library and add a resolver to `main.tsx`:

```tsx
import * as LucideIcons from 'lucide-react';

const iconResolver = (name: string) => {
  const icons = LucideIcons as Record<string, unknown>;
  const pascal = name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
  return (icons[pascal] || null) as React.ComponentType | null;
};

<MoveRoot theme={darkTheme} iconResolver={iconResolver}>
```

## License

MIT
