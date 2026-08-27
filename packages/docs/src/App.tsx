import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  MoveRoot,
  darkTheme,
  lightTheme,
  Sidebar,
  Stack,
  Button,
  Icon,
  Tooltip,
  ScrollArea,
  Collapsible,
  Link,
  AnimatedText,
  useSidebarContext,
  type Theme,
} from 'move';
import { AnimatedSubnav, LogoMark } from './components';
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import 'move/styles.css';
import './index.css';

import { DOCS_NAV } from './nav';
import { Placeholder } from './pages/Placeholder';
import { AIOverviewPage } from './pages/ai/AIOverviewPage';
import { SkillsPage } from './pages/ai/SkillsPage';
import { SpecsPage } from './pages/ai/SpecsPage';
import { ValidationPage } from './pages/conformance/ValidationPage';
import { ToolingPage } from './pages/conformance/ToolingPage';
import { CoveragePage } from './pages/ai/CoveragePage';
import { ComponentDocPage } from './pages/components/ComponentDocPage';
import { ComponentsOverviewPage } from './pages/components/ComponentsOverviewPage';
import { CoreConceptsOverviewPage } from './pages/core-concepts/CoreConceptsOverviewPage';
import { HowMoveWorksPage } from './pages/core-concepts/HowMoveWorksPage';
import { ContractsPage } from './pages/core-concepts/ContractsPage';
import { ContractsOverviewPage } from './pages/contracts/ContractsOverviewPage';
import { ComponentContractPage } from './pages/contracts/ComponentContractPage';
import { CompositeContractPage } from './pages/contracts/CompositeContractPage';
import { DesignPatternPage } from './pages/contracts/DesignPatternPage';
import { ConformanceModelPage } from './pages/contracts/ConformanceModelPage';
import { AnimationSystemPage } from './pages/core-concepts/AnimationSystemPage';
import { ThemingModelPage } from './pages/core-concepts/ThemingModelPage';
import { HooksPage } from './pages/systems/HooksPage';
import { PropsPage } from './pages/systems/PropsPage';
import { TruncationPage } from './pages/systems/TruncationPage';
import { SurfacesPage } from './pages/systems/SurfacesPage';
import { SystemsOverviewPage } from './pages/systems/SystemsOverviewPage';
import { FormsPage } from './pages/systems/FormsPage';
import { StackingPage } from './pages/systems/StackingPage';
import { LayoutPage } from './pages/systems/LayoutPage';
import { AdaptersPage } from './pages/core-concepts/AdaptersPage';
import { AnimationOverviewPage } from './pages/animation/AnimationOverviewPage';
import { AnimationLifecyclePage } from './pages/animation/AnimationLifecyclePage';
import { MotionsAndSequencesPage } from './pages/animation/MotionsAndSequencesPage';
import { SpringsPage } from './pages/animation/SpringsPage';
import { ChoreographyPage } from './pages/animation/ChoreographyPage';
import { AnimationReferencePage } from './pages/animation/AnimationReferencePage';
import { AccessibilityPage } from './pages/accessibility/AccessibilityPage';
import { CustomizeOverviewPage } from './pages/customize/CustomizeOverviewPage';
import { IconsPage } from './pages/customize/IconsPage';
import { TypographyPage } from './pages/customize/TypographyPage';
import { ThemeBuilderPage } from './pages/customize/ThemeBuilderPage';
import { InternationalizationPage } from './pages/customize/InternationalizationPage';
import { DesignPatternsOverviewPage } from './pages/design-patterns/DesignPatternsOverviewPage';
import { DesignPatternDetailPage } from './pages/design-patterns/DesignPatternDetailPage';
import { InstallationPage } from './pages/getting-started/InstallationPage';
import { MoveRootPage } from './pages/getting-started/MoveRootPage';
import { CreateMovePage } from './pages/getting-started/CreateMovePage';
import { NextPage } from './pages/getting-started/NextPage';
import { OverviewPage } from './pages/getting-started/OverviewPage';
import { WhatAIGetsWrongPage } from './pages/getting-started/WhatAIGetsWrongPage';
import { VitePage } from './pages/getting-started/VitePage';

function toPascalCase(str: string) {
  return str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

const iconResolver = (name: string) => {
  const icons = LucideIcons as Record<string, unknown>;
  return (icons[toPascalCase(name)] || icons[name] || null) as React.ComponentType | null;
};

// Dogfood: the docs wear the EXACT stock Move themes the library ships —
// darkTheme/lightTheme, generated from MOVE_SEED by the same engine consumers
// use, WCAG 2.2 AA in both modes. (--move-font is set on :root in index.css;
// the theme is colour-only.)
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
  const { collapsed, toggleCollapsed, isMobile } = useSidebarContext();

  const activeSectionKey =
    DOCS_NAV.find((s) => s.items.some((i) => i.to === pathname || pathname.startsWith(i.to + '/')))
      ?.key ??
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
        {/* Collapse is a desktop-only affordance — on mobile the sheet is
            opened/closed, not collapsed (and it would steal initial focus). */}
        {!isMobile && (
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
        )}
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Group>
          {DOCS_NAV.map((section) => {
            const isActive = activeSectionKey === section.key;
            return (
              <React.Fragment key={section.key}>
                {/* asChild renders the item ONTO the NavLink anchor, so each
                    nav item is a single focusable element (not <a><button>). */}
                <Sidebar.Item asChild icon={section.icon} active={isActive} tooltip={section.label}>
                  <NavLink to={section.items[0].to}>{section.label}</NavLink>
                </Sidebar.Item>
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
        <Stack
          direction="row"
          justify={collapsed ? 'center' : 'start'}
          align="center"
          gap="sm"
          padding="sm"
        >
          <ThemeToggle />
          {!collapsed && (
            <Link
              href="https://www.linkedin.com/in/alardweisscher"
              external
              variant="muted"
              underline="hover"
            >
              <AnimatedText size="sm" by="character" effect="scale" trigger="mount" nowrap>
                Built by Alard Weisscher
              </AnimatedText>
            </Link>
          )}
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
  // visible jump. A hash (same-page TOC link OR a cross-page deep link like
  // /ai/skills#app) scrolls its target into view — the browser only does this on
  // full loads, not SPA route changes, so we do it here.
  React.useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (hash) {
      const target = el.querySelector(hash);
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
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

  // Per-route document title (WCAG 2.4.2). A SPA has to set this itself — the
  // browser only updates <title> on full loads. Resolve the active nav label;
  // an item's own "Overview" reads as its section name.
  React.useEffect(() => {
    let label: string | undefined;
    for (const s of DOCS_NAV) {
      const item = s.items.find((i) => i.to === pathname);
      if (item) {
        label = item.label === 'Overview' ? s.label : item.label;
        break;
      }
    }
    if (!label) {
      const section = DOCS_NAV.find(
        (s) =>
          pathname.startsWith('/' + s.key) || s.items.some((i) => pathname.startsWith(i.to + '/')),
      );
      label = section?.label;
    }
    document.title = label ? `${label} — Move` : 'Move — docs';
  }, [pathname]);

  return (
    <Sidebar.Provider>
      {/* Skip link (WCAG 2.4.1) — first focusable element; visually hidden until focused. */}
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Stack direction="row" gap="none" align="stretch" fill="parent">
        <AppSidebar />
        <ScrollArea.Root>
          <ScrollArea.Content ref={contentRef}>
            <Stack padding="xl 2xl">
              <Sidebar.Trigger icon="menu" visibility="mobile" />
              <main id="main" tabIndex={-1}>
                <Routes>
                  <Route path="/" element={<Navigate to="/getting-started" replace />} />
                  <Route path="/getting-started" element={<OverviewPage />} />
                  <Route
                    path="/getting-started/what-ai-gets-wrong"
                    element={<WhatAIGetsWrongPage />}
                  />
                  <Route path="/getting-started/installation" element={<InstallationPage />} />
                  <Route path="/getting-started/move-root" element={<MoveRootPage />} />
                  <Route path="/getting-started/create-move" element={<CreateMovePage />} />
                  <Route path="/getting-started/next" element={<NextPage />} />
                  <Route path="/getting-started/vite" element={<VitePage />} />
                  <Route path="/core-concepts" element={<CoreConceptsOverviewPage />} />
                  <Route path="/core-concepts/how-move-works" element={<HowMoveWorksPage />} />
                  <Route path="/core-concepts/contracts" element={<ContractsPage />} />
                  {/* Contracts — moved out of Core Concepts into their own section. */}
                  <Route path="/contracts" element={<ContractsOverviewPage />} />
                  <Route path="/contracts/component" element={<ComponentContractPage />} />
                  <Route path="/contracts/composite" element={<CompositeContractPage />} />
                  <Route path="/contracts/design-pattern" element={<DesignPatternPage />} />
                  <Route path="/contracts/conformance" element={<ConformanceModelPage />} />
                  {/* Redirects from the old Core Concepts paths. */}
                  <Route
                    path="/contracts/component"
                    element={<Navigate to="/contracts/component" replace />}
                  />
                  <Route
                    path="/contracts/composite"
                    element={<Navigate to="/contracts/composite" replace />}
                  />
                  <Route
                    path="/contracts/design-pattern"
                    element={<Navigate to="/contracts/design-pattern" replace />}
                  />
                  <Route
                    path="/contracts/conformance"
                    element={<Navigate to="/contracts/conformance" replace />}
                  />
                  <Route path="/core-concepts/animation-system" element={<AnimationSystemPage />} />
                  <Route path="/core-concepts/theming-model" element={<ThemingModelPage />} />
                  <Route path="/systems" element={<SystemsOverviewPage />} />
                  <Route path="/systems/forms" element={<FormsPage />} />
                  <Route path="/systems/surfaces" element={<SurfacesPage />} />
                  <Route path="/systems/stacking" element={<StackingPage />} />
                  <Route path="/systems/layout" element={<LayoutPage />} />
                  <Route path="/systems/hooks" element={<HooksPage />} />
                  <Route path="/systems/props" element={<PropsPage />} />
                  <Route path="/systems/truncation" element={<TruncationPage />} />
                  {/* Moved out of Core Concepts into Systems — keep old links working. */}
                  <Route
                    path="/core-concepts/surfaces"
                    element={<Navigate to="/systems/surfaces" replace />}
                  />
                  <Route
                    path="/core-concepts/stacking"
                    element={<Navigate to="/systems/stacking" replace />}
                  />
                  <Route
                    path="/core-concepts/hooks"
                    element={<Navigate to="/systems/hooks" replace />}
                  />
                  <Route
                    path="/core-concepts/truncation"
                    element={<Navigate to="/systems/truncation" replace />}
                  />
                  <Route path="/core-concepts/adapters" element={<AdaptersPage />} />
                  <Route path="/accessibility" element={<AccessibilityPage />} />
                  <Route path="/animation" element={<AnimationOverviewPage />} />
                  <Route path="/animation/lifecycle" element={<AnimationLifecyclePage />} />
                  <Route
                    path="/animation/motions-and-sequences"
                    element={<MotionsAndSequencesPage />}
                  />
                  {/* merged: old paths redirect to the combined page */}
                  <Route
                    path="/animation/format"
                    element={<Navigate to="/animation/motions-and-sequences" replace />}
                  />
                  <Route
                    path="/animation/triggers-and-sequences"
                    element={<Navigate to="/animation/motions-and-sequences" replace />}
                  />
                  <Route path="/animation/springs" element={<SpringsPage />} />
                  <Route path="/animation/choreography" element={<ChoreographyPage />} />
                  <Route path="/animation/reference" element={<AnimationReferencePage />} />
                  <Route path="/ai" element={<AIOverviewPage />} />
                  <Route path="/ai/skills" element={<SkillsPage />} />
                  <Route path="/ai/specs" element={<SpecsPage />} />
                  <Route path="/conformance/validation" element={<ValidationPage />} />
                  <Route path="/conformance/tooling" element={<ToolingPage />} />
                  <Route path="/ai/coverage" element={<CoveragePage />} />
                  <Route path="/components" element={<ComponentsOverviewPage />} />
                  <Route path="/customize" element={<CustomizeOverviewPage />} />
                  <Route path="/customize/theme" element={<ThemeBuilderPage />} />
                  <Route path="/customize/typography" element={<TypographyPage />} />
                  <Route path="/customize/icons" element={<IconsPage />} />
                  <Route
                    path="/customize/internationalization"
                    element={<InternationalizationPage />}
                  />
                  <Route path="/design-patterns" element={<DesignPatternsOverviewPage />} />
                  <Route path="/design-patterns/:slug" element={<DesignPatternDetailPage />} />
                  {/* Component pages share a single data-driven template.
                    ComponentDocPage looks the slug up in COMPONENT_CONTENT
                    and falls back to Placeholder for unknown slugs. */}
                  <Route path="/components/:slug" element={<ComponentDocPage />} />
                  {/* Every nav item now has a real route. Anything else
                    falls through to the catchall below. */}
                  <Route path="*" element={<Placeholder />} />
                </Routes>
              </main>
            </Stack>
          </ScrollArea.Content>
        </ScrollArea.Root>
      </Stack>
    </Sidebar.Provider>
  );
}

function Root() {
  const [theme, setTheme] = React.useState<Theme>(() => {
    const saved =
      typeof window !== 'undefined' ? window.localStorage.getItem(THEME_STORAGE_KEY) : null;
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
