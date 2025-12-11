import { NavigationMenu } from 'move';

export function NavigationMenuDemo() {
  return (
    <div className="demo-section">
      <h3>Navigation Menu</h3>
      <div className="demo-box">
        <NavigationMenu.Root className="nav-menu-root">
          <NavigationMenu.List className="nav-menu-list">
            <NavigationMenu.Item>
              <NavigationMenu.Trigger className="nav-menu-trigger">
                Products <ChevronDown />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="nav-menu-content">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <NavigationMenu.Link className="nav-menu-link" href="#">
                    <div style={{ fontWeight: 500 }}>Analytics</div>
                    <div style={{ fontSize: 13, color: '#666' }}>Track your metrics</div>
                  </NavigationMenu.Link>
                  <NavigationMenu.Link className="nav-menu-link" href="#">
                    <div style={{ fontWeight: 500 }}>Reports</div>
                    <div style={{ fontSize: 13, color: '#666' }}>Generate insights</div>
                  </NavigationMenu.Link>
                  <NavigationMenu.Link className="nav-menu-link" href="#">
                    <div style={{ fontWeight: 500 }}>Dashboards</div>
                    <div style={{ fontSize: 13, color: '#666' }}>Visualize data</div>
                  </NavigationMenu.Link>
                  <NavigationMenu.Link className="nav-menu-link" href="#">
                    <div style={{ fontWeight: 500 }}>API</div>
                    <div style={{ fontSize: 13, color: '#666' }}>Integrate systems</div>
                  </NavigationMenu.Link>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Trigger className="nav-menu-trigger">
                Company <ChevronDown />
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
      </div>
    </div>
  );
}

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 2 }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
