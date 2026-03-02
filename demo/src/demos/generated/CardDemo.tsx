// Generated from Card.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Card } from 'move';
import type { DemoDefinition } from '../types';

const Component = Card as any;

export const demo: DemoDefinition = {
  id: 'panel:Card',
  name: 'Card',
  category: 'panel',
  description: 'Presentational container with header, title, description, body, and footer sections for grouping related content',
  controls: [
    {
      name: 'sample',
      kind: 'select',
      options: ['full', 'headerOnly', 'bodyOnly', 'ghost', 'elevated'],
      defaultValue: 'full',
    },
  ],
  initialProps: {
    sample: 'full',
  },
  subComponents: [
    {
      name: 'Root',
      controls: [
        {
          name: 'variant',
          kind: 'select',
          options: ['default', 'elevated', 'ghost'],
          defaultValue: 'default',
        },
        {
          name: 'size',
          kind: 'select',
          options: ['sm', 'md', 'lg'],
          defaultValue: 'md',
        },
      ],
      initialProps: {
        variant: 'default',
        size: 'md',
      },
      children: [
        {
          name: 'Header',
          optional: true,
          defaultEnabled: true,
          controls: [],
          initialProps: {},
          children: [
            {
              name: 'Title',
              optional: true,
              defaultEnabled: true,
              controls: [
                { name: 'text', kind: 'text', defaultValue: 'Card Title' },
              ],
              initialProps: { text: 'Card Title' },
            },
            {
              name: 'Description',
              optional: true,
              defaultEnabled: true,
              controls: [
                { name: 'text', kind: 'text', defaultValue: 'A short description of the card content.' },
              ],
              initialProps: { text: 'A short description of the card content.' },
            },
          ],
        },
        {
          name: 'Body',
          optional: true,
          defaultEnabled: true,
          controls: [
            { name: 'text', kind: 'text', defaultValue: 'This is the main body content of the card. It can contain any React nodes.' },
          ],
          initialProps: { text: 'This is the main body content of the card. It can contain any React nodes.' },
        },
        {
          name: 'Footer',
          optional: true,
          defaultEnabled: true,
          controls: [],
          initialProps: {},
          children: [
            {
              name: 'FooterStart',
              optional: true,
              defaultEnabled: true,
              controls: [
                { name: 'text', kind: 'text', defaultValue: 'Created today' },
              ],
              initialProps: { text: 'Created today' },
            },
            {
              name: 'FooterEnd',
              optional: true,
              defaultEnabled: true,
              controls: [
                { name: 'text', kind: 'text', defaultValue: 'View details' },
              ],
              initialProps: { text: 'View details' },
            },
          ],
        },
      ],
    },
  ],
  render: (props) => {
    const sample = String(props.sample ?? 'full');
    const root = (props.Root as Record<string, unknown> | undefined) ?? {};
    const header = (root.Header as Record<string, unknown> | undefined) ?? {};
    const title = (header.Title as Record<string, unknown> | undefined) ?? {};
    const description = (header.Description as Record<string, unknown> | undefined) ?? {};
    const body = (root.Body as Record<string, unknown> | undefined) ?? {};
    const footer = (root.Footer as Record<string, unknown> | undefined) ?? {};
    const footerStart = (footer.FooterStart as Record<string, unknown> | undefined) ?? {};
    const footerEnd = (footer.FooterEnd as Record<string, unknown> | undefined) ?? {};

    const variant = (root.variant as string | undefined) ?? 'default';
    const size = (root.size as string | undefined) ?? 'md';

    // Override variant for preset samples
    const effectiveVariant = sample === 'ghost' ? 'ghost' : sample === 'elevated' ? 'elevated' : variant;

    const showHeader = header._enabled !== false && sample !== 'bodyOnly';
    const showBody = body._enabled !== false && sample !== 'headerOnly';
    const showFooter = footer._enabled !== false && sample !== 'headerOnly' && sample !== 'bodyOnly';

    return (
      <Component.Root variant={effectiveVariant} size={size} style={{ maxWidth: 400 }}>
        {showHeader && (
          <Component.Header>
            {title._enabled !== false && (
              <Component.Title>{String(title.text ?? 'Card Title')}</Component.Title>
            )}
            {description._enabled !== false && (
              <Component.Description>
                {String(description.text ?? 'A short description of the card content.')}
              </Component.Description>
            )}
          </Component.Header>
        )}
        {showBody && (
          <Component.Body>
            {String(body.text ?? 'This is the main body content of the card.')}
          </Component.Body>
        )}
        {showFooter && (
          <Component.Footer>
            {footerStart._enabled !== false && (
              <Component.FooterStart>
                {String(footerStart.text ?? 'Created today')}
              </Component.FooterStart>
            )}
            {footerEnd._enabled !== false && (
              <Component.FooterEnd>
                {String(footerEnd.text ?? 'View details')}
              </Component.FooterEnd>
            )}
          </Component.Footer>
        )}
      </Component.Root>
    );
  },
};
