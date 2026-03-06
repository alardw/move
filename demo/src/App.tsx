import { useMemo, useState, useCallback, useEffect } from 'react';
import { MoveRoot, darkTheme, lightTheme } from 'move';
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

function getInitialComponent(demos: DemoDefinition[]): string {
  const hash = window.location.hash.replace('#/', '').replace('#', '');
  if (hash && demos.some(d => d.name === hash)) return hash;
  return demos[0]?.name ?? '';
}

function App() {
  const demos = generatedDemos;
  const [theme, setTheme] = useState<Theme>(lightTheme);
  const [activeName, setActiveName] = useState(() => getInitialComponent(demos));
  const [viewMode, setViewMode] = useState<'recipes' | 'playground'>('recipes');
  const [activeRecipeId, setActiveRecipeId] = useState<string>('');

  const active = demos.find((d) => d.name === activeName) ?? demos[0];
  const [propsState, setPropsState] = useState<Record<string, unknown>>(() =>
    active ? buildInitialProps(active) : {},
  );

  // Auto-match recipes by component name
  const componentRecipes = useMemo(
    () => recipes.filter(r => r.component === active?.name),
    [active?.name]
  );

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
      window.history.pushState(null, '', `#/${name}`);
    },
    [demos],
  );

  // Sync with browser back/forward
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash && demos.some(d => d.name === hash)) {
        setActiveName(hash);
        const next = demos.find(d => d.name === hash);
        if (next) setPropsState(buildInitialProps(next));
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [demos]);

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
        <div className={`lab ${showPropsPanel ? '' : 'no-props'}`.trim()}>
          <aside className="panel list-panel">
            <div className="panel-title">Components</div>
            {grouped.map((group) => (
              <div key={group.category} className="group">
                <div className="group-title">{group.category}</div>
                <div className="list">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      className={`list-item ${item.name === active.name ? 'active' : ''}`}
                      onClick={() => onPickDemo(item.name)}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </aside>

          <main className="panel preview-panel">
            <div className="toolbar">
              <div>
                <h1>{active.name}</h1>
                <p>{active.description || 'Demo preview'}</p>
              </div>
              <button
                className="theme-btn"
                onClick={() => setTheme(theme.name === 'dark' ? lightTheme : darkTheme)}
              >
                Theme: {theme.name}
              </button>
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
