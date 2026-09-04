import * as React from 'react';
import { Badge, Button, Icon, Sidebar, Stack, Text, Tooltip, useSidebarContext } from 'move';

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
 * Nav items take a `badge` on the right — unread counts, status pills, anything
 * that says "look here next." Badges fade out with the labels when the rail
 * collapses, so the icons-only mode stays tidy.
 *
 * Each badge keeps its own colour, where the colour still means something — red
 * is urgent, gray is inert. On the active row it takes that row's colours
 * instead, because no palette colour reads against a strong fill: the closest
 * of the thirteen manages 2.32:1 against the primary, and blue manages 1.16:1.
 * The row hands the badge the pair it already guarantees, so nothing at the
 * call site has to know which row it is on.
 */
export default function WithBadgesSample() {
  // A docs sample must not navigate away, so the router's job is done here
  // by state: the click is swallowed and drives `active` instead.
  const [current, setCurrent] = React.useState('/inbox');
  const select = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCurrent(e.currentTarget.getAttribute('href') ?? '');
  };

  return (
    // composite-purity-ignore: fixed-height demo frame so the Sidebar layout reads in the docs preview; no Move height prop
    <div style={{ display: 'flex', height: 360, border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-lg)', overflow: 'hidden' }}>
      <Sidebar.Provider>
        <Sidebar.Root>
          <Sidebar.Header>
            <Sidebar.Expanded>
              <Text weight="semibold">Inbox Zero</Text>
            </Sidebar.Expanded>
            <HeaderToggle />
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Mailboxes</Sidebar.GroupLabel>
              <Sidebar.Nav>
                <Sidebar.NavItem href="/inbox" active={current === "/inbox"} onClick={select} icon={<Icon name="inbox" />} badge={<Badge color="blue">12</Badge>} tooltip="Inbox">Inbox</Sidebar.NavItem>
                <Sidebar.NavItem href="/starred" active={current === "/starred"} onClick={select} icon={<Icon name="star" />} tooltip="Starred">Starred</Sidebar.NavItem>
                <Sidebar.NavItem href="/sent" active={current === "/sent"} onClick={select} icon={<Icon name="send" />} tooltip="Sent">Sent</Sidebar.NavItem>
                <Sidebar.NavItem href="/archive" active={current === "/archive"} onClick={select} icon={<Icon name="archive" />} badge={<Badge color="teal">203</Badge>} tooltip="Archive">Archive</Sidebar.NavItem>
              </Sidebar.Nav>
            </Sidebar.Group>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Labels</Sidebar.GroupLabel>
              <Sidebar.Nav>
                <Sidebar.NavItem href="/important" active={current === "/important"} onClick={select} icon={<Icon name="tag" />} badge={<Badge color="orange">3</Badge>} tooltip="Important">Important</Sidebar.NavItem>
                <Sidebar.NavItem href="/work" active={current === "/work"} onClick={select} icon={<Icon name="briefcase" />} tooltip="Work">Work</Sidebar.NavItem>
                <Sidebar.NavItem href="/receipts" active={current === "/receipts"} onClick={select} icon={<Icon name="receipt" />} tooltip="Receipts">Receipts</Sidebar.NavItem>
              </Sidebar.Nav>
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar.Root>
        <Stack flex={1} align="center" justify="center" padding="lg">
          <Text color="muted">Main content</Text>
        </Stack>
      </Sidebar.Provider>
    </div>
  );
}
