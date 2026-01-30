import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { Code, ChevronDown, ChevronUp } from 'lucide-react';
import { createHighlighter, type Highlighter } from 'shiki';

// Initialize shiki once — loads TextMate grammars for correct JSX parsing
let highlighter: Highlighter | null = null;
const highlighterReady = createHighlighter({
  themes: ['github-dark'],
  langs: ['tsx'],
}).then((h) => { highlighter = h; });

// =============================================================================
// Types
// =============================================================================

interface Example {
  id: string;
  name: string;
  description: string;
  component: ReactNode;
  code: string;
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
  const [showCode, setShowCode] = useState(true);
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
    <div className="docs-tabs">
      <div className="docs-tabs-list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className="docs-tab"
            data-active={current?.id === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="docs-tabs-content">
        {current?.content}
      </div>
    </div>
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
      <h3 className="docs-title">{title}</h3>
      <p className="docs-description">{description}</p>
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
      highlighterReady.then(() => {
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

  // Set default if not set
  const currentId = activeExample || examples[0]?.id;
  const current = examples.find(e => e.id === currentId) ?? examples[0];

  if (!current) return null;

  return (
    <>
      {/* Tabs */}
      <div className="example-selector">
        {examples.map((example) => (
          <button
            key={example.id}
            className="example-tab"
            data-active={currentId === example.id}
            onClick={() => setActiveExample(example.id)}
          >
            {example.name}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="example-panel">
        <div className="example-preview">
          {current.component}
        </div>

        {current.code && (
          <div className="example-meta">
            <div className="example-info">
              <h4 className="example-name">{current.name}</h4>
              <p className="example-note">{current.description}</p>
            </div>

            <button
              className="code-toggle"
              data-open={showCode}
              onClick={() => setShowCode(!showCode)}
            >
              <Code />
              {showCode ? 'Hide Code' : 'View Code'}
              {showCode ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>
        )}

        {showCode && current.code && <CodeBlock code={current.code} />}
      </div>
    </>
  );
}

// =============================================================================
// API Reference Section
// =============================================================================

interface ApiProp {
  name: string;
  type: string;
  description: string;
  default?: string;
}

interface ApiSectionProps {
  title?: string;
  properties: ApiProp[];
}

function ApiSection({ title = 'API Reference', properties }: ApiSectionProps) {
  return (
    <div className="api-section">
      <h4 className="api-title">{title}</h4>
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
              <td className="type-cell">{prop.type}</td>
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
// Export
// =============================================================================

export const DocPage = {
  Root,
  Header,
  Tabs,
  Examples,
  ApiSection,
};

export type { Example, ApiProp, Tab };
