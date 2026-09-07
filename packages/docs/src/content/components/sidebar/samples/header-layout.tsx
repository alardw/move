import * as React from 'react';
import { Avatar, Button, Icon, Sidebar, Stack, Text, Tooltip, useSidebarContext } from 'move';

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

/**
 * Each part of the sidebar arranges its children for you, so the common case
 * needs no layout code:
 *
 * - **Header** — a row, ends apart, centred once collapsed.
 * - **Content**, **Group**, **Footer** — a column with a gap.
 *
 * A column is the only arrangement anyone wants for a list of nav groups, so
 * `Content` and `Group` bake it in. `Header` holds arbitrary content, and there
 * a `Stack` takes over: it puts a workspace name over a plan label with the
 * toggle alongside. The footer takes a `Sidebar.ActionItem`, which is the nav
 * row as a button — it spans the rail, so its icon lines up with the mark in
 * the header and with every nav icon between them.
 *
 * `Sidebar.Expanded` marks what goes when the rail narrows, at whatever
 * granularity applies: a whole block, or just the words beside a mark that
 * stays. Everything outside it is rendered in both states — here the toggle,
 * which the collapsed rail centres on its own.
 *
 * Put the `Stack` inside `Expanded` rather than around it. A 4rem rail has no
 * room to arrange anything, and a Stack that keeps its width there pushes
 * whatever sits beside it off the edge.
 */
export default function HeaderLayoutSample() {
  const [current, setCurrent] = React.useState('/overview');
  const select = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCurrent(e.currentTarget.getAttribute('href') ?? '');
  };

  return (
    // composite-purity-ignore, dogfood-ignore: fixed-height demo frame so the Sidebar layout reads in the docs preview; no Move height prop
    <div
      /* dogfood-ignore */
      /* composite-purity-ignore, dogfood-ignore: fixed-height demo frame so the Sidebar layout reads in the docs preview; no Move height prop */
      style={{
        display: 'flex',
        height: 300,
        border: '1px solid var(--move-border-base)',
        borderRadius: 'var(--move-rounded-lg)',
        overflow: 'hidden',
      }}
    >
      <Sidebar.Provider>
        <Sidebar.Root>
          <Sidebar.Header>
            {/* The Stack goes inside Expanded, not around it: a 4rem rail has no
                room for an arrangement, and a Stack that keeps its width there
                would push the toggle off the edge. */}
            <Sidebar.Expanded>
              <Stack flex={1} direction="row" align="center" gap="sm">
                <Avatar.Root size="sm" color="indigo">
                  <Avatar.Fallback>AC</Avatar.Fallback>
                </Avatar.Root>
                <Stack gap="none">
                  <Text weight="semibold" size="sm">
                    Acme Co.
                  </Text>
                  <Text color="muted" size="xs">
                    Team plan
                  </Text>
                </Stack>
              </Stack>
            </Sidebar.Expanded>
            <HeaderToggle />
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
              <Sidebar.Nav>
                <Sidebar.NavItem
                  href="/overview"
                  active={current === '/overview'}
                  onClick={select}
                  icon={<Icon name="layout-dashboard" />}
                  tooltip="Overview"
                >
                  Overview
                </Sidebar.NavItem>
                <Sidebar.NavItem
                  href="/reports"
                  active={current === '/reports'}
                  onClick={select}
                  icon={<Icon name="chart-line" />}
                  tooltip="Reports"
                >
                  Reports
                </Sidebar.NavItem>
              </Sidebar.Nav>
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer>
            {/* Footer is a column of rows. A row spans the rail and brings the
                inset with it, so its icon lands under the header's mark. */}
            <Sidebar.ActionItem icon={<Icon name="settings" />} tooltip="Settings">
              Alex Smith
            </Sidebar.ActionItem>
          </Sidebar.Footer>
        </Sidebar.Root>
        <Stack flex={1} align="center" justify="center" padding="lg">
          <Text color="muted">Main content</Text>
        </Stack>
      </Sidebar.Provider>
    </div>
  );
}
