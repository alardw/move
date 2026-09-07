import * as React from 'react';
import { Button, Icon, Sidebar, Stack, Text, Tooltip, useSidebarContext } from 'move';

function HeaderToggle() {
  const { collapsed, toggleCollapsed } = useSidebarContext();
  return (
    <Tooltip label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} side="right">
      <Button variant="ghost" size="sm" onClick={toggleCollapsed} aria-label="Toggle sidebar">
        <Icon name={collapsed ? 'panel-left' : 'panel-left-close'} />
      </Button>
    </Tooltip>
  );
}

const SECTIONS = [
  {
    key: 'docs',
    label: 'Docs',
    icon: 'book-open',
    items: [
      { to: '/docs', label: 'Overview' },
      { to: '/docs/install', label: 'Installation' },
      { to: '/docs/theming', label: 'Theming' },
    ],
  },
  {
    key: 'components',
    label: 'Components',
    icon: 'blocks',
    items: [
      { to: '/components', label: 'Overview' },
      { to: '/components/button', label: 'Button' },
      { to: '/components/sidebar', label: 'Sidebar' },
    ],
  },
];

/**
 * A section's destinations live in `Sidebar.SubNav`, passed to that
 * `NavItem`'s `submenu` so they land inside the same list item — a `<ul>` may
 * only hold `<li>`, and a sub-nav placed beside the row would fall outside the
 * list it belongs to.
 *
 * `open` is the only thing to drive. SubNav handles the rest: the height
 * reveal, the rows arriving one after another, and the line that slides to
 * whichever row carries `active`. Pass an `aria-label` so the nested landmark
 * is distinguishable from the nav around it — the section's own label is
 * usually the right words.
 *
 * `Sidebar.SubActionItem` sits in the same rail for something that acts rather
 * than navigates.
 */
export default function SubNavSample() {
  // A docs sample must not navigate away, so the router's job is done here
  // by state: the click is swallowed and drives `active` instead.
  const [current, setCurrent] = React.useState('/components/sidebar');
  const [compact, setCompact] = React.useState(false);
  const select = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCurrent(e.currentTarget.getAttribute('href') ?? '');
  };

  const activeSection = SECTIONS.find((s) => s.items.some((i) => i.to === current));

  return (
    // composite-purity-ignore: fixed-height demo frame so the Sidebar layout reads in the docs preview; no Move height prop
    <div
      /* composite-purity-ignore, dogfood-ignore: fixed-height demo frame so the Sidebar layout reads in the docs preview; no Move height prop */
      style={{
        display: 'flex',
        height: 400,
        border: '1px solid var(--move-border-base)',
        borderRadius: 'var(--move-rounded-lg)',
        overflow: 'hidden',
      }}
    >
      <Sidebar.Provider>
        <Sidebar.Root>
          <Sidebar.Header>
            <Sidebar.Expanded>
              <Text weight="semibold">Acme Docs</Text>
            </Sidebar.Expanded>
            <HeaderToggle />
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.Nav aria-label="Documentation">
                {SECTIONS.map((section) => {
                  const isActive = activeSection?.key === section.key;
                  return (
                    <Sidebar.NavItem
                      key={section.key}
                      href={section.items[0].to}
                      onClick={select}
                      icon={<Icon name={section.icon} />}
                      active={isActive}
                      tooltip={section.label}
                      submenu={
                        <Sidebar.SubNav open={isActive} aria-label={section.label}>
                          {section.items.map((item) => (
                            <Sidebar.SubNavItem
                              key={item.to}
                              href={item.to}
                              onClick={select}
                              active={current === item.to}
                            >
                              {item.label}
                            </Sidebar.SubNavItem>
                          ))}
                          {section.key === 'components' && (
                            <Sidebar.SubActionItem
                              active={compact}
                              onClick={() => setCompact((c) => !c)}
                            >
                              Compact previews
                            </Sidebar.SubActionItem>
                          )}
                        </Sidebar.SubNav>
                      }
                    >
                      {section.label}
                    </Sidebar.NavItem>
                  );
                })}
              </Sidebar.Nav>
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar.Root>
        <Stack flex={1} align="center" justify="center" padding="lg">
          <Text color="muted">{current}</Text>
        </Stack>
      </Sidebar.Provider>
    </div>
  );
}
