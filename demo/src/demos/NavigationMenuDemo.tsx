import { NavigationMenu, Icon } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  return (
    <NavigationMenu.Root className="nav-menu-root">
      <NavigationMenu.List className="nav-menu-list">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="nav-menu-trigger">
            Products <Icon name="chevron-down" size="sm" />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="nav-menu-content">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <NavigationMenu.Link className="nav-menu-link" href="#">
                <div style={{ fontWeight: 500 }}>Analytics</div>
                <div style={{ fontSize: 13, color: '#9ca3af' }}>Track your metrics</div>
              </NavigationMenu.Link>
              <NavigationMenu.Link className="nav-menu-link" href="#">
                <div style={{ fontWeight: 500 }}>Reports</div>
                <div style={{ fontSize: 13, color: '#9ca3af' }}>Generate insights</div>
              </NavigationMenu.Link>
              <NavigationMenu.Link className="nav-menu-link" href="#">
                <div style={{ fontWeight: 500 }}>Dashboards</div>
                <div style={{ fontSize: 13, color: '#9ca3af' }}>Visualize data</div>
              </NavigationMenu.Link>
              <NavigationMenu.Link className="nav-menu-link" href="#">
                <div style={{ fontWeight: 500 }}>API</div>
                <div style={{ fontSize: 13, color: '#9ca3af' }}>Integrate systems</div>
              </NavigationMenu.Link>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="nav-menu-trigger">
            Company <Icon name="chevron-down" size="sm" />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="nav-menu-content">
            <NavigationMenu.Link className="nav-menu-link" href="#">About</NavigationMenu.Link>
            <NavigationMenu.Link className="nav-menu-link" href="#">Careers</NavigationMenu.Link>
            <NavigationMenu.Link className="nav-menu-link" href="#">Contact</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link className="nav-menu-trigger" href="#" style={{ textDecoration: 'none' }}>
            Pricing
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Website navigation with dropdown menus.',
    component: <DefaultExample />,
    code: `<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>
        Products <Icon name="chevron-down" />
      </NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link href="#">Analytics</NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function NavigationMenuDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="NavigationMenu"
        description="A collection of links for website navigation."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
