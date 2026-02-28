import { Prose, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

function UsageExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Rich text">
        <Prose>
          <h1>Move UI Library</h1>
          <h2>Getting Started</h2>
          <p>
            Move is an animated UI component library built with React. It provides a{' '}
            <a href="#">comprehensive set of components</a> for building modern interfaces.
          </p>
          <h3>Installation</h3>
          <p>Install the package using your preferred package manager:</p>
          <pre><code>npm install move</code></pre>
          <h3>Features</h3>
          <ul>
            <li>Built-in animation system</li>
            <li>Dark and light theme support</li>
            <li>Accessible by default</li>
            <li>TypeScript-first API</li>
          </ul>
          <h3>Quick Start</h3>
          <ol>
            <li>Install the package</li>
            <li>Import the components you need</li>
            <li>Wrap your app in a ThemeProvider</li>
          </ol>
          <blockquote>
            <p>Move makes it easy to build beautiful, animated interfaces without the complexity.</p>
          </blockquote>
          <h3>Comparison</h3>
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Move</th>
                <th>Others</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Animation</td>
                <td>Built-in</td>
                <td>External</td>
              </tr>
              <tr>
                <td>Theming</td>
                <td>CSS tokens</td>
                <td>Varies</td>
              </tr>
            </tbody>
          </table>
          <hr />
          <p>
            Read the <a href="#">full documentation</a> for more details.
          </p>
        </Prose>
      </DemoSample>
    </Stack>
  );
}

function SizesExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Small">
        <Prose size="sm">
          <h3>Small Prose</h3>
          <p>This prose block uses a smaller base font size, suitable for compact layouts or secondary content areas.</p>
          <ul>
            <li>Compact lists</li>
            <li>Sidebar content</li>
          </ul>
        </Prose>
      </DemoSample>

      <DemoSample label="Base">
        <Prose size="base">
          <h3>Base Prose</h3>
          <p>The default size for most content. Readable and comfortable for body text.</p>
          <ul>
            <li>Articles</li>
            <li>Documentation</li>
          </ul>
        </Prose>
      </DemoSample>

      <DemoSample label="Large">
        <Prose size="lg">
          <h3>Large Prose</h3>
          <p>A larger base size for hero sections or when readability at distance matters.</p>
          <ul>
            <li>Landing pages</li>
            <li>Presentations</li>
          </ul>
        </Prose>
      </DemoSample>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A wrapper that styles raw HTML content \u2014 headings, paragraphs, links, lists, code, tables, and more.',
    component: <UsageExample />,
    code: `import { Prose } from 'move';

<Prose>
  <h1>Move UI Library</h1>
  <h2>Getting Started</h2>
  <p>
    Move is an animated UI component library built with React.
    It provides a <a href="#">comprehensive set of components</a>.
  </p>
  <h3>Installation</h3>
  <pre><code>npm install move</code></pre>
  <ul>
    <li>Built-in animation system</li>
    <li>Dark and light theme support</li>
  </ul>
  <ol>
    <li>Install the package</li>
    <li>Import the components</li>
    <li>Wrap in ThemeProvider</li>
  </ol>
  <blockquote>
    <p>Move makes it easy to build beautiful interfaces.</p>
  </blockquote>
</Prose>`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'Control the base font size with the size prop.',
    component: <SizesExample />,
    code: `import { Prose } from 'move';

<Prose size="sm">
  <h3>Small</h3>
  <p>Compact content...</p>
</Prose>

<Prose size="base">
  <h3>Base</h3>
  <p>Default content...</p>
</Prose>

<Prose size="lg">
  <h3>Large</h3>
  <p>Larger content...</p>
</Prose>`,
  },
];

export function ProseDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Prose"
        description="A rich-text wrapper that styles descendant HTML elements \u2014 ideal for rendering markdown or CMS content."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Prose"
        properties={[
          { name: 'size', type: "'sm' | 'base' | 'lg'", default: "'base'", description: 'Base font size for the prose content.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props to override the root element.' },
        ]}
      />
    </DocPage.Root>
  );
}
