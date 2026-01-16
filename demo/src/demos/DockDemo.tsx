import { Dock, Tooltip } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import {
  Home,
  Folder,
  Globe,
  Mail,
  Camera,
  Terminal,
  Settings,
  Music,
  Image,
} from 'lucide-react';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingBlock: '2rem' }}>
      <Tooltip.Provider>
        <Dock.Root>
          <Dock.Group>
            <Dock.Item icon={<Home />} label="Home" />
            <Dock.Item icon={<Folder />} label="Files" />
            <Dock.Item icon={<Globe />} label="Browser" />
          </Dock.Group>
          <Dock.Group>
            <Dock.Item icon={<Mail />} label="Mail" />
            <Dock.Item icon={<Camera />} label="Camera" />
            <Dock.Item icon={<Music />} label="Music" />
            <Dock.Item icon={<Image />} label="Photos" />
          </Dock.Group>
          <Dock.Group>
            <Dock.Item icon={<Terminal />} label="Terminal" />
            <Dock.Item icon={<Settings />} label="Settings" active />
          </Dock.Group>
        </Dock.Root>
      </Tooltip.Provider>
    </div>
  );
}

function SimpleExample() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingBlock: '2rem' }}>
      <Tooltip.Provider>
        <Dock.Root>
          <Dock.Item icon={<Home />} label="Home" />
          <Dock.Item icon={<Mail />} label="Mail" />
          <Dock.Item icon={<Settings />} label="Settings" />
        </Dock.Root>
      </Tooltip.Provider>
    </div>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Dock with grouped items and separators.',
    component: <DefaultExample />,
    code: `<Tooltip.Provider>
  <Dock.Root>
    <Dock.Group>
      <Dock.Item icon={<Home />} label="Home" />
      <Dock.Item icon={<Folder />} label="Files" />
    </Dock.Group>
    <Dock.Group>
      <Dock.Item icon={<Settings />} label="Settings" active />
    </Dock.Group>
  </Dock.Root>
</Tooltip.Provider>`,
  },
  {
    id: 'simple',
    name: 'Simple',
    description: 'Dock without groups.',
    component: <SimpleExample />,
    code: `<Tooltip.Provider>
  <Dock.Root>
    <Dock.Item icon={<Home />} label="Home" />
    <Dock.Item icon={<Mail />} label="Mail" />
    <Dock.Item icon={<Settings />} label="Settings" />
  </Dock.Root>
</Tooltip.Provider>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function DockDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="Dock"
        description="A macOS-style dock with magnification effect on hover."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
