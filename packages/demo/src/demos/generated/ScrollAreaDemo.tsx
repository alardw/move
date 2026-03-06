// Generated from ScrollArea.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { ScrollArea } from 'move';
import type { DemoDefinition } from '../types';

const Component = ScrollArea as any;

export const demo: DemoDefinition = {
  id: 'panel:ScrollArea',
  name: 'ScrollArea',
  category: 'panel',
  description: 'Scrollable content container with customizable scrollbar styling, optional sticky header and footer',
  controls: [
    {
      name: 'sample',
      kind: 'select',
      options: ['full', 'contentOnly', 'noFooter', 'paddedContent'],
      defaultValue: 'full',
    },
  ],
  initialProps: {
    sample: 'full',
  },
  subComponents: [
    {
      name: 'Root',
      controls: [],
      initialProps: {},
      children: [
        {
          name: 'Header',
          optional: true,
          defaultEnabled: true,
          controls: [
            { name: 'text', kind: 'text', defaultValue: 'Scroll Area Header' },
            {
              name: 'padded',
              kind: 'select',
              options: ['true', 'false'],
              defaultValue: 'true',
            },
          ],
          initialProps: { text: 'Scroll Area Header', padded: 'true' },
        },
        {
          name: 'Content',
          controls: [
            {
              name: 'padded',
              kind: 'select',
              options: ['true', 'false'],
              defaultValue: 'false',
            },
          ],
          initialProps: { padded: 'false' },
        },
        {
          name: 'Footer',
          optional: true,
          defaultEnabled: true,
          controls: [
            { name: 'text', kind: 'text', defaultValue: 'Scroll Area Footer' },
            {
              name: 'padded',
              kind: 'select',
              options: ['true', 'false'],
              defaultValue: 'true',
            },
          ],
          initialProps: { text: 'Scroll Area Footer', padded: 'true' },
        },
      ],
    },
  ],
  render: (props) => {
    const sample = String(props.sample ?? 'full');
    const root = (props.Root as Record<string, unknown> | undefined) ?? {};
    const header = (root.Header as Record<string, unknown> | undefined) ?? {};
    const content = (root.Content as Record<string, unknown> | undefined) ?? {};
    const footer = (root.Footer as Record<string, unknown> | undefined) ?? {};

    const headerPadded = header.padded !== 'false';
    const contentPadded = sample === 'paddedContent' ? true : content.padded === 'true';
    const footerPadded = footer.padded !== 'false';

    const showHeader = header._enabled !== false && sample !== 'contentOnly';
    const showFooter = footer._enabled !== false && sample !== 'contentOnly' && sample !== 'noFooter';

    const loremLines = Array.from({ length: 20 }, (_, i) => (
      <p key={i} style={{ margin: '0 0 8px' }}>
        Line {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>
    ));

    return (
      <Component.Root style={{ height: 300, maxWidth: 400, border: '1px solid var(--move-border-base)', borderRadius: 8 }}>
        {showHeader && (
          <Component.Header padded={headerPadded}>
            {String(header.text ?? 'Scroll Area Header')}
          </Component.Header>
        )}
        <Component.Content padded={contentPadded}>
          {loremLines}
        </Component.Content>
        {showFooter && (
          <Component.Footer padded={footerPadded}>
            {String(footer.text ?? 'Scroll Area Footer')}
          </Component.Footer>
        )}
      </Component.Root>
    );
  },
};
