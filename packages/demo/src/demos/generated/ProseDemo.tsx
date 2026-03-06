// Generated from Prose.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Prose } from 'move';
import type { DemoDefinition } from '../types';

const sampleContent = (
  <>
    <h1>Heading One</h1>
    <p>
      This is a paragraph with <strong>bold text</strong> and a{' '}
      <a href="#">link</a> inside it. The Prose component styles all nested
      HTML elements with consistent typography.
    </p>
    <h2>Heading Two</h2>
    <p>Lists are supported as well:</p>
    <ul>
      <li>First item</li>
      <li>Second item with a nested list
        <ul>
          <li>Nested item A</li>
          <li>Nested item B</li>
        </ul>
      </li>
      <li>Third item</li>
    </ul>
    <h3>Heading Three</h3>
    <ol>
      <li>Step one</li>
      <li>Step two</li>
      <li>Step three</li>
    </ol>
    <blockquote>
      <p>This is a blockquote. It has a left border and muted text color.</p>
    </blockquote>
    <p>
      Inline <code>code snippets</code> are styled with a subtle background.
    </p>
    <pre><code>{`function greet(name: string) {\n  return \`Hello, \${name}!\`;\n}`}</code></pre>
    <hr />
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Headings</td>
          <td>Supported</td>
        </tr>
        <tr>
          <td>Lists</td>
          <td>Supported</td>
        </tr>
        <tr>
          <td>Tables</td>
          <td>Supported</td>
        </tr>
      </tbody>
    </table>
  </>
);

export const demo: DemoDefinition = {
  id: 'core:Prose',
  name: 'Prose',
  category: 'core',
  description: 'Rich-text container that styles child HTML elements with consistent typography',
  controls: [
    {
      name: 'size',
      kind: 'select',
      options: ['sm', 'base', 'lg'],
      defaultValue: 'base',
    },
  ],
  initialProps: {
    size: 'base',
  },
  render: (props) => (
    <Prose size={props.size as string}>
      {sampleContent}
    </Prose>
  ),
};
