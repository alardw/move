// Generated from Code.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Code } from 'move';
import type { DemoDefinition } from '../types';

const sampleCode = `const greeting = "Hello, world!";
console.log(greeting);`;

export const demo: DemoDefinition = {
  id: 'core:Code',
  name: 'Code',
  category: 'core',
  description: 'Inline or block code element with variant styling and optional syntax highlighting via CodeHighlighterProvider',
  controls: [
    {
      name: 'variant',
      kind: 'select',
      options: ['subtle', 'outline', 'ghost'],
      defaultValue: 'subtle',
    },
    {
      name: 'size',
      kind: 'select',
      options: ['xs', 'sm', 'base', 'lg'],
      defaultValue: 'sm',
    },
    {
      name: 'block',
      kind: 'boolean',
      defaultValue: false,
    },
    {
      name: 'children',
      kind: 'text',
      defaultValue: sampleCode,
    },
  ],
  initialProps: {
    variant: 'subtle',
    size: 'sm',
    block: false,
    children: sampleCode,
  },
  sections: [
    {
      id: 'inline',
      label: 'Inline',
      render: (props) => (
        <p>
          Use the <Code variant={props.variant as string} size={props.size as string}>console.log()</Code> function to debug.
        </p>
      ),
    },
    {
      id: 'block',
      label: 'Block',
      render: (props) => (
        <Code
          variant={props.variant as string}
          size={props.size as string}
          block
        >
          {props.children as string}
        </Code>
      ),
    },
    {
      id: 'variants',
      label: 'Variants',
      render: () => (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Code variant="subtle">subtle</Code>
          <Code variant="outline">outline</Code>
          <Code variant="ghost">ghost</Code>
        </div>
      ),
    },
  ],
  render: (props) => (
    <Code
      variant={props.variant as string}
      size={props.size as string}
      block={props.block as boolean}
    >
      {props.children as string}
    </Code>
  ),
};
