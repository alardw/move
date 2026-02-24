import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { Code } from 'lucide-react';
import { Tabs as MoveTabs, ToggleButton, Collapsible, Heading, Text } from 'move';
import { createHighlighter, type Highlighter } from 'shiki';

// Lazy-load shiki — only starts when the first CodeBlock mounts
let highlighter: Highlighter | null = null;
let highlighterReady: Promise<void> | null = null;

function ensureHighlighter(): Promise<void> {
  if (!highlighterReady) {
    highlighterReady = createHighlighter({
      themes: ['github-dark'],
      langs: ['tsx'],
    }).then((h) => { highlighter = h; });
  }
  return highlighterReady;
}

// =============================================================================
// Types
// =============================================================================

interface Example {
  id: string;
  name: string;
  description: string;
  component: ReactNode;
  code: string;
  fullWidth?: boolean;
}

interface DocPageContextValue {
  activeExample: string;
  setActiveExample: (id: string) => void;
  showCode: boolean;
  setShowCode: (show: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

// =============================================================================
// Context
// =============================================================================

const DocPageContext = createContext<DocPageContextValue | null>(null);

function useDocPage() {
  const context = useContext(DocPageContext);
  if (!context) {
    throw new Error('DocPage components must be used within DocPage.Root');
  }
  return context;
}

// =============================================================================
// Root
// =============================================================================

interface RootProps {
  children: ReactNode;
  defaultExample?: string;
  defaultTab?: string;
}

function Root({ children, defaultExample, defaultTab = 'examples' }: RootProps) {
  const [activeExample, setActiveExample] = useState(defaultExample ?? '');
  const [showCode, setShowCode] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <DocPageContext.Provider value={{ activeExample, setActiveExample, showCode, setShowCode, activeTab, setActiveTab }}>
      <div className="docs-container">
        {children}
      </div>
    </DocPageContext.Provider>
  );
}

// =============================================================================
// Tabs - Switch between Examples and Playground
// =============================================================================

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

function Tabs({ tabs }: TabsProps) {
  const { activeTab, setActiveTab } = useDocPage();
  const current = tabs.find(t => t.id === activeTab) ?? tabs[0];

  return (
    <MoveTabs.Root value={current?.id} onValueChange={setActiveTab}>
      <MoveTabs.List>
        {tabs.map((tab) => (
          <MoveTabs.Trigger key={tab.id} value={tab.id}>
            {tab.label}
          </MoveTabs.Trigger>
        ))}
      </MoveTabs.List>
      {tabs.map((tab) => (
        <MoveTabs.Content key={tab.id} value={tab.id}>
          {tab.content}
        </MoveTabs.Content>
      ))}
    </MoveTabs.Root>
  );
}

// =============================================================================
// Header
// =============================================================================

interface HeaderProps {
  title: string;
  description: ReactNode;
}

function Header({ title, description }: HeaderProps) {
  return (
    <div className="docs-header">
      <Heading level={2}>{title}</Heading>
      <Text color="muted">{description}</Text>
    </div>
  );
}

// =============================================================================
// Code Block with Syntax Highlighting
// =============================================================================

interface CodeBlockProps {
  code: string;
  language?: string;
}

function CodeBlock({ code, language = 'tsx' }: CodeBlockProps) {
  const [html, setHtml] = useState(() => {
    if (highlighter) {
      return highlighter.codeToHtml(code.trim(), { lang: language, theme: 'github-dark' });
    }
    return '';
  });

  useEffect(() => {
    if (highlighter) {
      setHtml(highlighter.codeToHtml(code.trim(), { lang: language, theme: 'github-dark' }));
    } else {
      ensureHighlighter().then(() => {
        setHtml(highlighter!.codeToHtml(code.trim(), { lang: language, theme: 'github-dark' }));
      });
    }
  }, [code, language]);

  if (!html) {
    return (
      <div className="example-code">
        <pre><code>{code.trim()}</code></pre>
      </div>
    );
  }

  return (
    <div className="example-code" dangerouslySetInnerHTML={{ __html: html }} />
  );
}

// =============================================================================
// Examples - Container with tabs and panel
// =============================================================================

interface ExamplesProps {
  examples: Example[];
}

function Examples({ examples }: ExamplesProps) {
  const { activeExample, setActiveExample, showCode, setShowCode } = useDocPage();

  const currentId = activeExample || examples[0]?.id;

  if (!examples.length) return null;

  return (
    <MoveTabs.Root value={currentId} onValueChange={setActiveExample}>
      <MoveTabs.List>
        {examples.map((example) => (
          <MoveTabs.Trigger key={example.id} value={example.id}>
            {example.name}
          </MoveTabs.Trigger>
        ))}
      </MoveTabs.List>

      {examples.map((example) => (
        <MoveTabs.Content key={example.id} value={example.id}>
          <div className="example-panel">
            <div className={`example-preview${example.fullWidth ? ' example-preview-full' : ''}`}>
              {example.component}
            </div>

            {example.code && (
              <Collapsible.Root open={showCode} onOpenChange={setShowCode}>
                <div className="example-meta">
                  <div className="example-info">
                    <Text weight="semibold" size="sm">{example.name}</Text>
                    <Text as="span" size="sm" color="muted">{example.description}</Text>
                  </div>

                  <Collapsible.Trigger asChild>
                    <ToggleButton
                      size="sm"
                      pressed={showCode}
                      onPressedChange={setShowCode}
                      aria-label={showCode ? 'Hide code' : 'Show code'}
                    >
                      <Code size={14} />
                      {showCode ? 'Hide Code' : 'View Code'}
                    </ToggleButton>
                  </Collapsible.Trigger>
                </div>

                <Collapsible.Content>
                  <CodeBlock code={example.code} />
                </Collapsible.Content>
              </Collapsible.Root>
            )}
          </div>
        </MoveTabs.Content>
      ))}
    </MoveTabs.Root>
  );
}

// =============================================================================
// API Reference Section
// =============================================================================

interface ApiProp {
  name: string;
  type: string;
  description: ReactNode;
  default?: string;
}

interface ApiSectionProps {
  title?: string;
  properties: ApiProp[];
}

function renderType(type: string) {
  const parts = type.split('|').map(s => s.trim());
  if (parts.length <= 1) return type;
  return (
    <ul className="type-list">
      {parts.map((part, i) => <li key={i}>{part}</li>)}
    </ul>
  );
}

function ApiSection({ title = 'API Reference', properties }: ApiSectionProps) {
  return (
    <div className="api-section">
      <Heading level={4} weight="medium">{title}</Heading>
      <table className="api-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((prop) => (
            <tr key={prop.name}>
              <td><code>{prop.name}</code></td>
              <td className="type-cell">{renderType(prop.type)}</td>
              <td>{prop.default ? <code>{prop.default}</code> : '—'}</td>
              <td>{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================================
// Color Swatch
// =============================================================================

function ColorSwatch({ color }: { color: string }) {
  return (
    <span
      className="color-swatch"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
  );
}

// =============================================================================
// Token Reference Section
// =============================================================================

interface TokenProp {
  name: string;
  default: string;
  description: ReactNode;
  /** Show a color swatch preview. Defaults to true. Set to false for non-color tokens. */
  color?: boolean;
}

interface TokenSectionProps {
  title?: string;
  tokens: TokenProp[];
}

function TokenSection({ title = 'Style Tokens', tokens }: TokenSectionProps) {
  return (
    <div className="api-section">
      <Heading level={4} weight="medium">{title}</Heading>
      <table className="api-table token-table">
        <colgroup>
          <col className="col-token" />
          <col className="col-default" />
          <col className="col-desc" />
        </colgroup>
        <thead>
          <tr>
            <th>Token</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token.name}>
              <td><code>{token.name}</code></td>
              <td>
                <span className="token-default">
                  {token.color !== false && <ColorSwatch color={token.default} />}
                  <code>{token.default}</code>
                </span>
              </td>
              <td>{token.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================================
// Export
// =============================================================================

export const DocPage = {
  Root,
  Header,
  Tabs,
  Examples,
  ApiSection,
  TokenSection,
};

export type { Example, ApiProp, TokenProp, Tab };
