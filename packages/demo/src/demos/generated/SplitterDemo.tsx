// Generated from Splitter.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Splitter } from 'move';
import type { DemoDefinition } from '../types';

const Component = Splitter as any;

export const demo: DemoDefinition = {
  id: 'panel:Splitter',
  name: 'Splitter',
  category: 'panel',
  description: 'Resizable panel layout with draggable gutters, keyboard resize support, and responsive collapse to vertical stacking',
  controls: [
    {
      name: 'layout',
      kind: 'select',
      options: ['horizontal', 'vertical'],
      defaultValue: 'horizontal',
    },
    {
      name: 'gutterSize',
      kind: 'select',
      options: ['2', '4', '8'],
      defaultValue: '4',
    },
    {
      name: 'panels',
      kind: 'select',
      options: ['2', '3'],
      defaultValue: '2',
    },
  ],
  initialProps: {
    layout: 'horizontal',
    gutterSize: '4',
    panels: '2',
  },
  subComponents: [
    {
      name: 'Root',
      controls: [
        {
          name: 'layout',
          kind: 'select',
          options: ['horizontal', 'vertical'],
          defaultValue: 'horizontal',
        },
        {
          name: 'gutterSize',
          kind: 'select',
          options: ['2', '4', '8'],
          defaultValue: '4',
        },
      ],
      initialProps: {
        layout: 'horizontal',
        gutterSize: '4',
      },
      children: [
        {
          name: 'Panel',
          optional: false,
          controls: [],
          initialProps: {},
        },
      ],
    },
  ],
  sections: [
    {
      id: 'consumer',
      label: 'Usage',
      render: () => (
        <div style={{ height: 200 }}>
          <Component.Root>
            <Component.Panel>
              <div style={{ padding: 16 }}>Left panel</div>
            </Component.Panel>
            <Component.Panel>
              <div style={{ padding: 16 }}>Right panel</div>
            </Component.Panel>
          </Component.Root>
        </div>
      ),
      code: `<Splitter.Root>
  <Splitter.Panel>
    <div style={{ padding: 16 }}>Left panel</div>
  </Splitter.Panel>
  <Splitter.Panel>
    <div style={{ padding: 16 }}>Right panel</div>
  </Splitter.Panel>
</Splitter.Root>`,
    },
    {
      id: 'vertical',
      label: 'Vertical',
      render: () => (
        <div style={{ height: 300 }}>
          <Component.Root layout="vertical">
            <Component.Panel>
              <div style={{ padding: 16 }}>Top panel</div>
            </Component.Panel>
            <Component.Panel>
              <div style={{ padding: 16 }}>Bottom panel</div>
            </Component.Panel>
          </Component.Root>
        </div>
      ),
      code: `<Splitter.Root layout="vertical">
  <Splitter.Panel>Top panel</Splitter.Panel>
  <Splitter.Panel>Bottom panel</Splitter.Panel>
</Splitter.Root>`,
    },
    {
      id: 'three-panel',
      label: 'Three Panels',
      render: () => (
        <div style={{ height: 200 }}>
          <Component.Root>
            <Component.Panel size={25}>
              <div style={{ padding: 16 }}>Sidebar</div>
            </Component.Panel>
            <Component.Panel size={50}>
              <div style={{ padding: 16 }}>Main content</div>
            </Component.Panel>
            <Component.Panel size={25}>
              <div style={{ padding: 16 }}>Details</div>
            </Component.Panel>
          </Component.Root>
        </div>
      ),
      code: `<Splitter.Root>
  <Splitter.Panel size={25}>Sidebar</Splitter.Panel>
  <Splitter.Panel size={50}>Main content</Splitter.Panel>
  <Splitter.Panel size={25}>Details</Splitter.Panel>
</Splitter.Root>`,
    },
  ],
  render: (props) => {
    const layout = (props.layout as string) ?? 'horizontal';
    const gutterSize = Number(props.gutterSize ?? 4);
    const panelCount = Number(props.panels ?? 2);

    const panels = [];
    for (let i = 0; i < panelCount; i++) {
      panels.push(
        <Component.Panel key={i}>
          <div style={{ padding: 16 }}>Panel {i + 1}</div>
        </Component.Panel>
      );
    }

    return (
      <div style={{ height: 200 }}>
        <Component.Root layout={layout} gutterSize={gutterSize}>
          {panels}
        </Component.Root>
      </div>
    );
  },
};
