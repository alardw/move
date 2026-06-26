import React from 'react';
import ReactDOM from 'react-dom/client';
import { MoveRoot, lightTheme, darkTheme, Sidebar, Stack, Button, Icon, Tooltip, ScrollArea, Collapsible, useSidebarContext, type Theme } from 'move';
import { AnimatedSubnav, LogoMark } from './components';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation, useNavigationType } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import 'move/styles.css';
import './index.css';

import { DOCS_NAV } from './nav';
import { Placeholder } from './pages/Placeholder';
import { AIOverviewPage } from './pages/ai/AIOverviewPage';
import { SkillsPage } from './pages/ai/SkillsPage';
import { SpecsPage } from './pages/ai/SpecsPage';
import { ComponentDocPage } from './pages/components/ComponentDocPage';
import { ComponentsOverviewPage } from './pages/components/ComponentsOverviewPage';
import { CoreConceptsOverviewPage } from './pages/core-concepts/CoreConceptsOverviewPage';
import { HowMoveWorksPage } from './pages/core-concepts/HowMoveWorksPage';
import { ComponentContractPage } from './pages/core-concepts/ComponentContractPage';
import { AnimationSystemPage } from './pages/core-concepts/AnimationSystemPage';
import { ThemingModelPage } from './pages/core-concepts/ThemingModelPage';
import { HooksPage } from './pages/core-concepts/HooksPage';
import { SurfacesPage } from './pages/core-concepts/SurfacesPage';
import { StackingPage } from './pages/core-concepts/StackingPage';
import { CustomizeOverviewPage } from './pages/customize/CustomizeOverviewPage';
import { IconsPage } from './pages/customize/IconsPage';
import { TypographyPage } from './pages/customize/TypographyPage';
import { InternationalizationPage } from './pages/customize/InternationalizationPage';
import { RecipesOverviewPage } from './pages/recipes/RecipesOverviewPage';
import { RecipeDetailPage } from './pages/recipes/RecipeDetailPage';
import { InstallationPage } from './pages/getting-started/InstallationPage';
import { MoveRootPage } from './pages/getting-started/MoveRootPage';
import { CreateMoveAppPage } from './pages/getting-started/CreateMoveAppPage';
import { NextPage } from './pages/getting-started/NextPage';
import { OverviewPage } from './pages/getting-started/OverviewPage';
import { WhatAIGetsWrongPage } from './pages/getting-started/WhatAIGetsWrongPage';
import { VitePage } from './pages/getting-started/VitePage';

function toPascalCase(str: string) {
  return str.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

const iconResolver = (name: string) => {
  const icons = LucideIcons as Record<string, unknown>;
  return (icons[toPascalCase(name)] || icons[name] || null) as React.ComponentType | null;
};

const THEMES: Record<string, Theme> = { light: lightTheme, dark: darkTheme };
const THEME_STORAGE_KEY = 'docs-theme';

interface ThemeSwitcherValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}
const ThemeSwitcherContext = React.createContext<ThemeSwitcherValue | null>(null);
function useThemeSwitcher() {
  const ctx = React.useContext(ThemeSwitcherContext);
  if (!ctx) throw new Error('useThemeSwitcher must be used inside ThemeSwitcherContext');
  return ctx;
}

function ThemeToggle() {
  const { theme, setTheme } = useThemeSwitcher();
  const isDark = theme.name === 'dark';
  return (
    <Tooltip label={isDark ? 'Light mode' : 'Dark mode'} side="right" sideOffset={8}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme(isDark ? lightTheme : darkTheme)}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <Icon name={isDark ? 'sun' : 'moon'} />
      </Button>
    </Tooltip>
  );
}

/**
 * Sidebar with progressive disclosure — a main section's children are only
 * rendered when that section is the active one (URL-driven). Clicking a main
 * label navigates to its first child (the section overview).
 */
function AppSidebar() {
  const { pathname } = useLocation();
  const { collapsed, toggleCollapsed } = useSidebarContext();

  const activeSectionKey =
    DOCS_NAV.find((s) => s.items.some((i) => i.to === pathname || pathname.startsWith(i.to + '/')))?.key ??
    DOCS_NAV.find((s) => pathname.startsWith('/' + s.key))?.key ??
    null;

  return (
    <Sidebar.Root>
      <Sidebar.Header
        collapsedChildren={
          <Tooltip label="Expand" side="right" sideOffset={8}>
            <Button variant="ghost" size="sm" onClick={toggleCollapsed} aria-label="Expand sidebar">
              <Icon name="panel-left" />
            </Button>
          </Tooltip>
        }
      >
        <LogoMark />
        <Tooltip label="Collapse" sideOffset={8}>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapsed}
            aria-label="Collapse sidebar"
            style={{ marginLeft: 'auto' }}
          >
            <Icon name="panel-left-close" />
          </Button>
        </Tooltip>
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Group>
          {DOCS_NAV.map((section) => {
            const isActive = activeSectionKey === section.key;
            return (
              <React.Fragment key={section.key}>
                <NavLink to={section.items[0].to}>
                  {() => (
                    <Sidebar.Item
                      icon={section.icon}
                      active={isActive}
                      tooltip={section.label}
                    >
                      {section.label}
                    </Sidebar.Item>
                  )}
                </NavLink>
                <Collapsible.Root open={isActive && !collapsed}>
                  <Collapsible.Content>
                    <AnimatedSubnav items={section.items} open={isActive && !collapsed} />
                  </Collapsible.Content>
                </Collapsible.Root>
              </React.Fragment>
            );
          })}
        </Sidebar.Group>
      </Sidebar.Content>
      <Sidebar.Footer>
        <Stack direction="row" justify={collapsed ? 'center' : 'start'} align="center">
          <ThemeToggle />
        </Stack>
      </Sidebar.Footer>
    </Sidebar.Root>
  );
}

function App() {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const scrollPositions = React.useRef<Map<string, number>>(new Map());
  const { pathname, hash, key } = useLocation();
  const navType = useNavigationType();

  // The page scrolls inside ScrollArea.Content, not the window. Remember each
  // history entry's scroll position so Back/Forward (POP) restores it, while new
  // navigations go to the top. useLayoutEffect runs before paint so there's no
  // visible jump. Skip when a hash is present so TOC anchor links still land.
  React.useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el || hash) return;
    const saved = scrollPositions.current.get(key);
    el.scrollTo({ top: navType === 'POP' && saved != null ? saved : 0 });
  }, [pathname, hash, key, navType]);

  // Track the current history entry's scroll position as the user scrolls.
  React.useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => scrollPositions.current.set(key, el.scrollTop);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [key]);

  return (
    <Sidebar.Provider>
      <Stack direction="row" gap="none" align="stretch" fill>
        <AppSidebar />
        <ScrollArea.Root>
          <ScrollArea.Content ref={contentRef}>
            <Stack padding="2xl">
              <Sidebar.Trigger icon="menu" visibility="mobile" />
              <Routes>
                <Route path="/" element={<Navigate to="/getting-started" replace />} />
                <Route path="/getting-started" element={<OverviewPage />} />
                <Route path="/getting-started/what-ai-gets-wrong" element={<WhatAIGetsWrongPage />} />
                <Route path="/getting-started/installation" element={<InstallationPage />} />
                <Route path="/getting-started/move-root" element={<MoveRootPage />} />
                <Route path="/getting-started/create-move-app" element={<CreateMoveAppPage />} />
                <Route path="/getting-started/next" element={<NextPage />} />
                <Route path="/getting-started/vite" element={<VitePage />} />
                <Route path="/core-concepts" element={<CoreConceptsOverviewPage />} />
                <Route path="/core-concepts/how-move-works" element={<HowMoveWorksPage />} />
                <Route path="/core-concepts/component-contract" element={<ComponentContractPage />} />
                <Route path="/core-concepts/animation-system" element={<AnimationSystemPage />} />
                <Route path="/core-concepts/theming-model" element={<ThemingModelPage />} />
                <Route path="/core-concepts/surfaces" element={<SurfacesPage />} />
                <Route path="/core-concepts/stacking" element={<StackingPage />} />
                <Route path="/core-concepts/hooks" element={<HooksPage />} />
                <Route path="/ai" element={<AIOverviewPage />} />
                <Route path="/ai/skills" element={<SkillsPage />} />
                <Route path="/ai/specs" element={<SpecsPage />} />
                <Route path="/components" element={<ComponentsOverviewPage />} />
                <Route path="/customize" element={<CustomizeOverviewPage />} />
                <Route path="/customize/typography" element={<TypographyPage />} />
                <Route path="/customize/icons" element={<IconsPage />} />
                <Route path="/customize/internationalization" element={<InternationalizationPage />} />
                <Route path="/recipes" element={<RecipesOverviewPage />} />
                <Route path="/recipes/:group/:slug" element={<RecipeDetailPage />} />
                {/* Component pages share a single data-driven template.
                    ComponentDocPage looks the slug up in COMPONENT_CONTENT
                    and falls back to Placeholder for unknown slugs. */}
                <Route path="/components/:slug" element={<ComponentDocPage />} />
                {/* Every nav item now has a real route. Anything else
                    falls through to the catchall below. */}
                <Route path="*" element={<Placeholder />} />
              </Routes>
            </Stack>
          </ScrollArea.Content>
        </ScrollArea.Root>
      </Stack>
    </Sidebar.Provider>
  );
}

function Root() {
  const [theme, setTheme] = React.useState<Theme>(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(THEME_STORAGE_KEY) : null;
    return (saved && THEMES[saved]) || lightTheme;
  });

  React.useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme.name);
  }, [theme]);

  const ctx = React.useMemo<ThemeSwitcherValue>(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeSwitcherContext.Provider value={ctx}>
      <MoveRoot theme={theme} iconResolver={iconResolver}>
        <App />
      </MoveRoot>
    </ThemeSwitcherContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Root />
    </BrowserRouter>
  </React.StrictMode>,
);
