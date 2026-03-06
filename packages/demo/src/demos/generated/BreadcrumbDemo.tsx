// Generated from Breadcrumb.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Breadcrumb } from 'move';
import type { DemoDefinition } from '../types';

const Component = Breadcrumb as any;

export const demo: DemoDefinition = {
  id: 'nav:Breadcrumb',
  name: 'Breadcrumb',
  category: 'nav',
  description: 'Navigation breadcrumb trail with auto-injected separators, collapsible overflow with ellipsis, and customizable separator content',
  controls: [
    {
      name: 'size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
    {
      name: 'separator',
      kind: 'text',
      defaultValue: '',
    },
    {
      name: 'maxItems',
      kind: 'select',
      options: ['none', '2', '3', '4'],
      defaultValue: 'none',
    },
  ],
  initialProps: {
    size: 'md',
    separator: '',
    maxItems: 'none',
  },
  render: (props) => {
    const size = (props.size as string) || 'md';
    const separator = (props.separator as string) || undefined;
    const maxItemsStr = props.maxItems as string;
    const maxItems = maxItemsStr === 'none' ? undefined : Number(maxItemsStr);

    return (
      <Component size={size} separator={separator || undefined} maxItems={maxItems}>
        <Component.Item>
          <Component.Link href="#">Home</Component.Link>
        </Component.Item>
        <Component.Item>
          <Component.Link href="#">Library</Component.Link>
        </Component.Item>
        <Component.Item>
          <Component.Link href="#">Components</Component.Link>
        </Component.Item>
        <Component.Item>
          <Component.Page>Breadcrumb</Component.Page>
        </Component.Item>
      </Component>
    );
  },
};
