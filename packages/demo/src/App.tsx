import { useMemo, useState, useCallback, useEffect } from 'react';
import { MoveRoot, Sidebar, Select, darkTheme, lightTheme } from 'move';
import type { Theme } from 'move';
import * as LucideIcons from 'lucide-react';
import { codeToHtml } from 'shiki';
import type { Control, DemoDefinition, DemoSection, DemoSubComponent } from './demos/types';
import { demos as generatedDemos } from './demos/generated';
import { recipes } from './recipes';
import type { Recipe } from './recipes/types';
import './App.css';

type ScopedControl = {
  propKey: string;
  control: Control;
};

type ScopedControlGroup = {
  name: string;
  controls: ScopedControl[];
};

function toPascalCase(value: string): string {
  return value
    .split('-')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join('');
}

const iconResolver = (name: string) => {
  const icons = LucideIcons as Record<string, any>;
  return (icons[toPascalCase(name)] || icons[name] || null) as any;
};

// ---------------------------------------------------------------------------
// Build initial nested props from subComponents tree
// ---------------------------------------------------------------------------

function buildInitialProps(demo: DemoDefinition): Record<string, unknown> {
  const base = { ...demo.initialProps };
  if (demo.subComponents) {
    for (const sub of demo.subComponents) {
      base[sub.name] = buildSubProps(sub);
    }
  }
  return base;
}

function buildSubProps(sub: DemoSubComponent): Record<string, unknown> {
  const props: Record<string, unknown> = { ...sub.initialProps };
  props._enabled = sub.optional ? (sub.defaultEnabled ?? true) : true;
  if (sub.children) {
    for (const child of sub.children) {
      props[child.name] = buildSubProps(child);
    }
  }
  return props;
}

// ---------------------------------------------------------------------------
// Deep-set helper for nested props
// ---------------------------------------------------------------------------

function deepSet(obj: Record<string, unknown>, path: string[], value: unknown): Record<string, unknown> {
  if (path.length === 0) return obj;
  if (path.length === 1) {
    return { ...obj, [path[0]]: value };
  }
  const [head, ...rest] = path;
  const child = (obj[head] as Record<string, unknown>) ?? {};
  return { ...obj, [head]: deepSet(child, rest, value) };
}

// ---------------------------------------------------------------------------
// Control renderer (single control input)
// ---------------------------------------------------------------------------

function ControlInput({
  control,
  value,
  onChange,
}: {
  control: Control;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const nameLabel = (
    <span>
      {control.name}
      {control.required && <span className="required">*</span>}
    </span>
  );

  if (control.kind === 'select') {
    return (
      <label className="control">
        {nameLabel}
        <select value={String(value ?? '')} onChange={(e) => onChange(e.target.value)}>
          {control.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (control.kind === 'boolean') {
    return (
      <label className="control row">
        {nameLabel}
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
      </label>
    );
  }

  if (control.kind === 'number') {
    return (
      <label className="control">
        {nameLabel}
        <input type="number" value={Number(value ?? 0)} onChange={(e) => onChange(Number(e.target.value))} />
      </label>
    );
  }

  return (
    <label className="control">
      {nameLabel}
      <input type="text" value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

// ---------------------------------------------------------------------------
// Recursive sub-component controls tree
// ---------------------------------------------------------------------------

function SubComponentControls({
  sub,
  path,
  propsState,
  onPropChange,
}: {
  sub: DemoSubComponent;
  path: string[];
  propsState: Record<string, unknown>;
  onPropChange: (path: string[], value: unknown) => void;
}) {
  const subPath = [...path, sub.name];
  const subProps = resolveNested(propsState, subPath);
  const enabled = subProps._enabled !== false;

  return (
    <div className="sub-component">
      <div className="sub-header">
        <span className="sub-name">{sub.name}</span>
        {sub.optional && (
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onPropChange([...subPath, '_enabled'], e.target.checked)}
          />
        )}
      </div>
      {enabled && (
        <div className="sub-controls">
          {sub.controls.map((control) => (
            <ControlInput
              key={control.name}
              control={control}
              value={subProps[control.name]}
              onChange={(v) => onPropChange([...subPath, control.name], v)}
            />
          ))}
          {sub.children?.map((child) => (
            <SubComponentControls
              key={child.name}
              sub={child}
              path={subPath}
              propsState={propsState}
              onPropChange={onPropChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function resolveNested(obj: Record<string, unknown>, path: string[]): Record<string, unknown> {
  let current: unknown = obj;
  for (const key of path) {
    if (current && typeof current === 'object') {
      current = (current as Record<string, unknown>)[key];
    } else {
      return {};
    }
  }
  return (current as Record<string, unknown>) ?? {};
}

function splitControls(controls: Control[]): { root: Control[]; groups: ScopedControlGroup[] } {
  const root: Control[] = [];
  const grouped = new Map<string, ScopedControl[]>();

  for (const control of controls) {
    const parts = control.name.split('.');
    if (parts.length <= 1) {
      root.push(control);
      continue;
    }

    const [scope, ...rest] = parts;
    const scopedControl: ScopedControl = {
      propKey: control.name,
      control: { ...control, name: rest.join('.') },
    };
    const list = grouped.get(scope) ?? [];
    list.push(scopedControl);
    grouped.set(scope, list);
  }

  const groups = [...grouped.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, scopedControls]) => ({ name, controls: scopedControls }));

  return { root, groups };
}

// ---------------------------------------------------------------------------
// RecipeCard
// ---------------------------------------------------------------------------

function RecipeCodeBlock({ code, themeName }: { code: string; themeName: string }) {
  const [html, setHtml] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    codeToHtml(code, {
      lang: 'tsx',
      theme: themeName === 'dark' ? 'github-dark' : 'github-light',
    }).then((result) => {
      if (!cancelled) setHtml(result);
    });
    return () => { cancelled = true; };
  }, [code, themeName]);

  const onCopy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div className="recipe-code">
      <button className="recipe-copy-btn" onClick={onCopy}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
      {html ? (
        <div className="recipe-code-html" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className="recipe-code-fallback"><code>{code}</code></pre>
      )}
    </div>
  );
}

function RecipeCard({ recipe, isActive, onSelect, themeName }: {
  recipe: Recipe;
  isActive: boolean;
  onSelect: () => void;
  themeName: string;
}) {
  const Component = recipe.render;
  return (
    <div className={`recipe-card ${isActive ? 'active' : ''}`} onClick={onSelect}>
      <div className="recipe-header">
        <h3 className="recipe-title">{recipe.title}</h3>
        {recipe.description && <p className="recipe-description">{recipe.description}</p>}
      </div>
      <div className="recipe-preview">
        <Component />
      </div>
      <RecipeCodeBlock code={recipe.code} themeName={themeName} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

type SidebarShowMode = 'components' | 'recipes';

type RouteState = {
  mode: SidebarShowMode;
  name: string;
};

function parseHash(demos: DemoDefinition[], compositeComponents: string[]): RouteState {
  const raw = window.location.hash.replace('#/', '').replace('#', '');
  // #/recipes/{component}
  if (raw.startsWith('recipes/')) {
    const name = decodeURIComponent(raw.slice('recipes/'.length));
    if (compositeComponents.includes(name)) return { mode: 'recipes', name };
  }
  // #/components/{Name}
  if (raw.startsWith('components/')) {
    const name = raw.slice('components/'.length);
    if (demos.some(d => d.name === name)) return { mode: 'components', name };
  }
  // Legacy: #/{Name} — treat as component
  if (raw && demos.some(d => d.name === raw)) return { mode: 'components', name: raw };
  return { mode: 'components', name: demos[0]?.name ?? '' };
}

function buildHash(mode: SidebarShowMode, name: string): string {
  return mode === 'recipes' ? `#/recipes/${encodeURIComponent(name)}` : `#/components/${name}`;
}

function App() {
  const demos = generatedDemos;

  // Pre-compute composite component names for routing
  const compositeComponentNames = useMemo(() => {
    const composites = recipes.filter(r => r.type === 'composite');
    return [...new Set(composites.map(r => r.component))];
  }, []);

  const initialRoute = useMemo(() => parseHash(demos, compositeComponentNames), []);
  const [theme, setTheme] = useState<Theme>(lightTheme);
  const [sidebarShow, setSidebarShow] = useState<SidebarShowMode>(initialRoute.mode);
  const [activeName, setActiveName] = useState(initialRoute.mode === 'components' ? initialRoute.name : (demos[0]?.name ?? ''));
  const [viewMode, setViewMode] = useState<'recipes' | 'playground'>('recipes');
  const [activeRecipeId, setActiveRecipeId] = useState<string>('');
  const [activeCompositeGroup, setActiveCompositeGroup] = useState<string>(initialRoute.mode === 'recipes' ? initialRoute.name : '');

  const active = demos.find((d) => d.name === activeName) ?? demos[0];
  const [propsState, setPropsState] = useState<Record<string, unknown>>(() =>
    active ? buildInitialProps(active) : {},
  );

  // Auto-match recipes by component name
  const componentRecipes = useMemo(
    () => recipes.filter(r => r.component === active?.name && r.type === 'component'),
    [active?.name]
  );

  // Composite recipes grouped by category > component for sidebar recipe mode
  const compositeGroups = useMemo(() => {
    const composites = recipes.filter(r => r.type === 'composite');
    const catMap = new Map<string, Map<string, Recipe[]>>();
    for (const r of composites) {
      const category = r.id.includes('/') ? r.id.split('/')[0] : 'other';
      if (!catMap.has(category)) catMap.set(category, new Map());
      const compMap = catMap.get(category)!;
      const list = compMap.get(r.component) ?? [];
      list.push(r);
      compMap.set(r.component, list);
    }
    return [...catMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, compMap]) => ({
        category,
        components: [...compMap.entries()]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([component, items]) => ({ component, items })),
      }));
  }, []);

  // Legacy sections support
  const sections = active?.sections ?? [];
  const hasLegacySections = sections.length > 0;

  // Determine what tabs to show
  const hasRecipes = componentRecipes.length > 0;
  const hasControls = active ? (active.controls.length > 0 || (active.subComponents && active.subComponents.length > 0)) : false;
  const showViewTabs = hasRecipes && hasControls && !hasLegacySections;

  // When switching components, reset view mode intelligently
  useEffect(() => {
    if (hasLegacySections) {
      // Legacy: don't interfere
    } else if (hasRecipes) {
      setViewMode('recipes');
      setActiveRecipeId(componentRecipes[0]?.id ?? '');
    } else {
      setViewMode('playground');
    }
  }, [active?.name]); // eslint-disable-line react-hooks/exhaustive-deps

  const grouped = useMemo(() => {
    const map = new Map<string, DemoDefinition[]>();
    for (const d of demos) {
      const list = map.get(d.category) ?? [];
      list.push(d);
      map.set(d.category, list);
    }

    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, items]) => ({
        category,
        items: items.sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [demos]);

  const onPickDemo = useCallback(
    (name: string) => {
      const next = demos.find((d) => d.name === name);
      if (!next) return;
      setActiveName(name);
      setPropsState(buildInitialProps(next));
      window.history.pushState(null, '', buildHash('components', name));
    },
    [demos],
  );

  // Sync with browser back/forward
  useEffect(() => {
    const onHashChange = () => {
      const route = parseHash(demos, compositeComponentNames);
      setSidebarShow(route.mode);
      if (route.mode === 'components') {
        setActiveName(route.name);
        const next = demos.find(d => d.name === route.name);
        if (next) setPropsState(buildInitialProps(next));
      } else {
        setActiveCompositeGroup(route.name);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [demos, compositeComponentNames]);

  const onFlatPropChange = useCallback((name: string, value: unknown) => {
    setPropsState((prev) => ({ ...prev, [name]: value }));
  }, []);

  const onNestedPropChange = useCallback((path: string[], value: unknown) => {
    setPropsState((prev) => deepSet(prev, path, value));
  }, []);

  if (!active) {
    return (
      <div className="empty">
        No generated demos found. Generate them via <code>/generate-demo {'{Name}'}</code>.
      </div>
    );
  }

  // --- Playground controls ---
  const scopedControls = splitControls(active.controls);
  const hasSubComponents = active.subComponents && active.subComponents.length > 0;

  // Show props panel only in playground mode (or legacy non-consumer sections)
  const isPlaygroundActive = hasLegacySections ? false : viewMode === 'playground';
  const showPropsPanel = isPlaygroundActive &&
    (scopedControls.root.length > 0 || scopedControls.groups.length > 0 || hasSubComponents);

  return (
    <MoveRoot theme={theme} iconResolver={iconResolver}>
      <Sidebar.Provider>
        <div className={`lab ${showPropsPanel ? '' : 'no-props'}`.trim()}>
          <Sidebar.Root>
            <Sidebar.Header>
              <div className="sidebar-header-stack">
                <span className="sidebar-logo">Move UI</span>
                <div className="sidebar-show-field">
                  <span className="sidebar-show-label">Show</span>
                  <Select.Root value={sidebarShow} onValueChange={(v) => {
                    const mode = v as SidebarShowMode;
                    setSidebarShow(mode);
                    if (mode === 'recipes' && activeCompositeGroup) {
                      window.history.pushState(null, '', buildHash('recipes', activeCompositeGroup));
                    } else if (mode === 'components') {
                      window.history.pushState(null, '', buildHash('components', activeName));
                    }
                  }}>
                    <Select.Trigger size="sm">
                      <Select.Value />
                      <Select.Icon />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Viewport>
                        <Select.Item value="components">Components</Select.Item>
                        <Select.Item value="recipes">Recipes</Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Root>
                </div>
              </div>
            </Sidebar.Header>
            <Sidebar.Content>
              {sidebarShow === 'components' && grouped.map((group) => (
                <Sidebar.Group key={group.category}>
                  <Sidebar.GroupLabel>{group.category}</Sidebar.GroupLabel>
                  {group.items.map((item) => (
                    <Sidebar.Item
                      key={item.id}
                      active={item.name === active.name}
                      onClick={() => onPickDemo(item.name)}
                    >
                      {item.name}
                    </Sidebar.Item>
                  ))}
                </Sidebar.Group>
              ))}
              {sidebarShow === 'recipes' && compositeGroups.map((group) => (
                <Sidebar.Group key={group.category}>
                  <Sidebar.GroupLabel>{group.category}</Sidebar.GroupLabel>
                  {group.components.map((comp) => (
                    <Sidebar.Item
                      key={comp.component}
                      active={activeCompositeGroup === comp.component}
                      onClick={() => {
                        setActiveCompositeGroup(comp.component);
                        window.history.pushState(null, '', buildHash('recipes', comp.component));
                      }}
                    >
                      {comp.component}
                    </Sidebar.Item>
                  ))}
                </Sidebar.Group>
              ))}
            </Sidebar.Content>
            <Sidebar.Footer>
              <Sidebar.Item
                icon="sun"
                onClick={() => setTheme(theme.name === 'dark' ? lightTheme : darkTheme)}
              >
                Theme: {theme.name}
              </Sidebar.Item>
            </Sidebar.Footer>
          </Sidebar.Root>

          <main className="panel preview-panel">
            {sidebarShow === 'recipes' ? (
              // Composite recipes view
              (() => {
                const groupRecipes = compositeGroups.flatMap(g => g.components).find(c => c.component === activeCompositeGroup)?.items ?? [];
                if (!activeCompositeGroup || groupRecipes.length === 0) {
                  return <div className="empty-main">Select a recipe from the sidebar</div>;
                }
                return (
                  <>
                    <div className="toolbar">
                      <div>
                        <h1>{activeCompositeGroup}</h1>
                      </div>
                    </div>
                    <div className="recipe-list">
                      {groupRecipes.map(recipe => (
                        <RecipeCard
                          key={recipe.id}
                          recipe={recipe}
                          isActive={recipe.id === activeRecipeId}
                          onSelect={() => setActiveRecipeId(recipe.id)}
                          themeName={theme.name}
                        />
                      ))}
                    </div>
                  </>
                );
              })()
            ) : (
              // Components view
              <>
                <div className="toolbar">
                  <div>
                    <h1>{active.name}</h1>
                    <p>{active.description || 'Demo preview'}</p>
                  </div>
                </div>

                {/* View mode tabs: Recipes / Playground */}
                {showViewTabs && (
                  <div className="view-tabs">
                    <button
                      className={`view-tab ${viewMode === 'recipes' ? 'active' : ''}`}
                      onClick={() => setViewMode('recipes')}
                    >
                      Recipes
                    </button>
                    <button
                      className={`view-tab ${viewMode === 'playground' ? 'active' : ''}`}
                      onClick={() => setViewMode('playground')}
                    >
                      Playground
                    </button>
                  </div>
                )}

                {/* Legacy section tabs (backward compat) */}
                {hasLegacySections && (
                  <LegacySectionTabs
                    sections={sections}
                    propsState={propsState}
                    active={active}
                    controls={active.controls}
                    onFlatPropChange={onFlatPropChange}
                  />
                )}

                {/* Recipe cards view */}
                {!hasLegacySections && viewMode === 'recipes' && hasRecipes && (
                  <div className="recipe-list">
                    {componentRecipes.map(recipe => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        isActive={recipe.id === activeRecipeId}
                        onSelect={() => setActiveRecipeId(recipe.id)}
                        themeName={theme.name}
                      />
                    ))}
                  </div>
                )}

                {/* Playground view (shown when in playground mode, or when no recipes exist) */}
                {!hasLegacySections && (viewMode === 'playground' || !hasRecipes) && (
                  <div className="preview-canvas">
                    {active.render(propsState)}
                  </div>
                )}
              </>
            )}
          </main>

          {showPropsPanel && (
            <aside className="panel controls-panel">
              <div className="panel-title">Props</div>
              <div className="controls">
                {scopedControls.root.map((control) => (
                  <ControlInput
                    key={control.name}
                    control={control}
                    value={propsState[control.name]}
                    onChange={(v) => onFlatPropChange(control.name, v)}
                  />
                ))}

                {scopedControls.groups.map((group) => (
                  <div key={group.name} className="sub-component">
                    <div className="sub-header">
                      <span className="sub-name">{group.name}</span>
                    </div>
                    <div className="sub-controls">
                      {group.controls.map((scoped) => (
                        <ControlInput
                          key={scoped.propKey}
                          control={scoped.control}
                          value={propsState[scoped.propKey]}
                          onChange={(v) => onFlatPropChange(scoped.propKey, v)}
                        />
                      ))}
                    </div>
                  </div>
                ))}

                {hasSubComponents &&
                  active.subComponents!.map((sub) => (
                    <SubComponentControls
                      key={sub.name}
                      sub={sub}
                      path={[]}
                      propsState={propsState}
                      onPropChange={onNestedPropChange}
                    />
                  ))}
              </div>
            </aside>
          )}
        </div>
      </Sidebar.Provider>
    </MoveRoot>
  );
}

// ---------------------------------------------------------------------------
// Legacy section tabs (backward compat for demos with sections)
// ---------------------------------------------------------------------------

function LegacySectionTabs({
  sections,
  propsState,
  active,
  controls,
  onFlatPropChange,
}: {
  sections: DemoSection[];
  propsState: Record<string, unknown>;
  active: DemoDefinition;
  controls: Control[];
  onFlatPropChange: (name: string, value: unknown) => void;
}) {
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id ?? '');
  const activeSection = sections.find((s) => s.id === activeSectionId) ?? sections[0] ?? null;

  useEffect(() => {
    setActiveSectionId(sections[0]?.id ?? '');
  }, [active.name]); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleControls = filterControlsForSection(controls, activeSection);
  const scopedControls = splitControls(visibleControls);
  const showControls = activeSection?.id !== 'consumer' &&
    (scopedControls.root.length > 0 || scopedControls.groups.length > 0);

  return (
    <>
      {sections.length > 1 && (
        <div className="section-tabs">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`section-tab ${activeSection?.id === section.id ? 'active' : ''}`}
              onClick={() => setActiveSectionId(section.id)}
            >
              {section.label}
            </button>
          ))}
        </div>
      )}
      <div className="preview-canvas" key={activeSection?.id ?? 'default'}>
        {activeSection ? activeSection.render(propsState) : active.render(propsState)}
      </div>
      {showControls && (
        <div className="legacy-controls">
          {scopedControls.root.map((control) => (
            <ControlInput
              key={control.name}
              control={control}
              value={propsState[control.name]}
              onChange={(v) => onFlatPropChange(control.name, v)}
            />
          ))}
          {scopedControls.groups.map((group) => (
            <div key={group.name} className="sub-component">
              <div className="sub-header">
                <span className="sub-name">{group.name}</span>
              </div>
              <div className="sub-controls">
                {group.controls.map((scoped) => (
                  <ControlInput
                    key={scoped.propKey}
                    control={scoped.control}
                    value={propsState[scoped.propKey]}
                    onChange={(v) => onFlatPropChange(scoped.propKey, v)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function filterControlsForSection(controls: Control[], section: DemoSection | null): Control[] {
  if (!section) return controls;
  if (section.id === 'consumer') {
    return [];
  }
  if (section.id === 'playground') {
    return controls.filter(
      (control) => !control.name.includes('.') || control.name.startsWith('playground.'),
    );
  }
  return controls;
}

export default App;
