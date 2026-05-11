# Layout Composition Reference

## Golden Rule

**Every layout is built entirely from Move components. No custom CSS, no raw HTML divs for spacing, alignment, or structure.** If you need spacing, use `Stack`. If you need columns, use `Grid`. If you need alignment, use `Align`. There is always a Move component for the job.

### What this means

- No `style={{ display: 'flex', gap: 16 }}` — use `<Stack direction="row" gap="md">`
- No `style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}` — use `<Grid cols={2}>`
- No `<div className="header">` with custom CSS — use `<Align>` with `Start`/`Center`/`End`
- No `margin`, `padding` on wrapper divs — use `Stack` gap or component size props
- No `position: sticky` or `overflow: auto` wrappers — use `ScrollArea`
- No media queries for responsive breakpoints — use `collapseBelow` props

### Exceptions

- `style={{ height: N }}` on a container for bounded demos/previews is acceptable
- Component-internal styling (icon inline styles, badge backgrounds) is not layout

---

## Layout Components

### Stack — Linear arrangement

Single-direction container. Use for any vertical or horizontal sequence.

```tsx
<Stack direction="column" gap="lg">
  <Heading level={1}>Title</Heading>
  <Text>Description</Text>
</Stack>

<Stack direction="row" gap="sm" align="center">
  <Avatar /> <Text>Username</Text>
</Stack>
```

| Prop | Values | Default |
|------|--------|---------|
| `direction` | `'row'` \| `'column'` | `'column'` |
| `gap` | `'none'` \| `'xs'` \| `'sm'` \| `'md'` \| `'lg'` \| `'xl'` | `'md'` |
| `align` | `'start'` \| `'center'` \| `'end'` \| `'stretch'` \| `'baseline'` | `'stretch'` |
| `justify` | `'start'` \| `'center'` \| `'end'` \| `'between'` \| `'evenly'` | `'start'` |
| `wrap` | `boolean` | `false` |
| `collapseBelow` | `number` (px) | — |

### Grid — Multi-column layout

Use for dashboards, card grids, data layouts.

```tsx
<Grid cols={3} gap="md">
  <Card.Root>...</Card.Root>
  <Card.Root>...</Card.Root>
  <Card.Root>...</Card.Root>
</Grid>

<Grid columns={12} gap="lg">
  <Grid.Cell span={8}>Main content</Grid.Cell>
  <Grid.Cell span={4}>Sidebar</Grid.Cell>
</Grid>

<Grid minChildWidth={300} gap="md">
  {/* Auto-wraps when children would be < 300px */}
</Grid>
```

| Prop | Values | Default |
|------|--------|---------|
| `cols` | `number` | — |
| `rows` | `number` | — |
| `columns` | `number` (total for span-based) | `12` |
| `minChildWidth` | `number` (px, auto-fit) | — |
| `gap` | same as Stack | `'md'` |
| `rowGap`, `columnGap` | same as gap | — |
| `collapseBelow` | `number` (px) | — |

**Grid.Cell props:** `span`, `rowSpan`, `offset`, `order`, `align`

### Align — Three-section horizontal bar

Use for headers, toolbars, footers — anything with start/center/end sections.

```tsx
<Align>
  <Align.Start><Logo /></Align.Start>
  <Align.Center><Nav /></Align.Center>
  <Align.End><UserMenu /></Align.End>
</Align>
```

| Prop | Values | Default |
|------|--------|---------|
| `gap` | same as Stack | `'md'` |
| `align` | `'start'` \| `'center'` \| `'end'` \| `'stretch'` \| `'baseline'` | `'center'` |

### Divider — Visual separator

```tsx
<Stack gap="lg">
  <Section />
  <Divider />
  <Section />
</Stack>

<Stack direction="row" align="center">
  <Link>Home</Link>
  <Divider orientation="vertical" />
  <Link>About</Link>
</Stack>
```

| Prop | Values | Default |
|------|--------|---------|
| `orientation` | `'horizontal'` \| `'vertical'` | `'horizontal'` |
| `type` | `'solid'` \| `'dashed'` \| `'dotted'` | `'solid'` |
| `size` | `'sm'` \| `'md'` \| `'lg'` | `'sm'` |

---

## Panel Components

### Sidebar — App-level navigation

Always wraps the entire page layout. Provider sits outside, Root is one side, content fills the rest.

```tsx
<Sidebar.Provider>
  <Stack direction="row" gap="none" align="stretch" fill>
    <Sidebar.Root side="left">
      <Sidebar.Header>...</Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Group>
          <Sidebar.GroupLabel>Section</Sidebar.GroupLabel>
          <Sidebar.Item icon={<Icon name="home" />} tooltip="Home">Home</Sidebar.Item>
        </Sidebar.Group>
      </Sidebar.Content>
      <Sidebar.Footer>...</Sidebar.Footer>
    </Sidebar.Root>
    <ScrollArea.Root>
      <ScrollArea.Content padded>
        {/* page content / router outlet */}
      </ScrollArea.Content>
    </ScrollArea.Root>
  </Stack>
</Sidebar.Provider>
```

> **Page area must be a `ScrollArea`**, not a plain `Stack`. Without it,
> tall page content overflows the viewport and scrolls the body — which
> drags the sidebar out of view. `ScrollArea.Content` already provides
> `flex: 1; overflow-y: auto; min-height: 0`; `padded` replaces the old
> `padding="lg"` on the page Stack.

> The mobile backdrop (`Sidebar.Overlay`) is rendered automatically by
> `Sidebar.Root` via a portal when `isMobile && mobileOpen`. Do not place
> `<Sidebar.Overlay />` in the shell yourself — it would appear as a
> permanent full-viewport backdrop on desktop.

### Splitter — Resizable panels

```tsx
<Splitter.Root layout="horizontal">
  <Splitter.Panel size={30} minSize={20}>Left panel</Splitter.Panel>
  <Splitter.Panel size={70} minSize={30}>Right panel</Splitter.Panel>
</Splitter.Root>
```

### ScrollArea — Bounded scrolling

```tsx
<ScrollArea.Root>
  <ScrollArea.Header>Sticky header</ScrollArea.Header>
  <ScrollArea.Content>{/* scrollable */}</ScrollArea.Content>
  <ScrollArea.Footer>Sticky footer</ScrollArea.Footer>
</ScrollArea.Root>
```

### Card — Content container

```tsx
<Card.Root variant="elevated">
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Subtitle</Card.Description>
  </Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>
    <Card.FooterStart><Button>Cancel</Button></Card.FooterStart>
    <Card.FooterEnd><Button>Save</Button></Card.FooterEnd>
  </Card.Footer>
</Card.Root>
```

### Tabs — Tabbed sections

```tsx
<Tabs.Root defaultValue="general">
  <Tabs.List>
    <Tabs.Trigger value="general">General</Tabs.Trigger>
    <Tabs.Trigger value="security">Security</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="general">...</Tabs.Content>
  <Tabs.Content value="security">...</Tabs.Content>
</Tabs.Root>
```

### Accordion / Collapsible — Expandable sections

```tsx
<Accordion.Root type="single" collapsible>
  <Accordion.Item value="section-1">
    <Accordion.Header>
      <Accordion.Trigger>Section 1</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>...</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

---

## Typography

| Component | Use for | Key props |
|-----------|---------|-----------|
| `Heading` | Section titles (renders h1–h6) | `level`, `size`, `weight`, `color`, `align` |
| `Text` | Body text, labels, details | `as`, `size`, `weight`, `color`, `align`, `truncate` |
| `Prose` | Rendered markdown / rich HTML | `size` |

---

## Composition Patterns

### App shell (sidebar + content)

```tsx
<MoveRoot theme={darkTheme} iconResolver={resolver}>
  <Sidebar.Provider>
    <Stack direction="row" gap="none" align="stretch" fill>
      <Sidebar.Root>
        {/* nav items */}
      </Sidebar.Root>
      <ScrollArea.Root>
        <ScrollArea.Content padded>
          {/* router outlet */}
        </ScrollArea.Content>
      </ScrollArea.Root>
    </Stack>
  </Sidebar.Provider>
</MoveRoot>
```

### Page with header

```tsx
<Stack gap="lg">
  <Align>
    <Align.Start>
      <Breadcrumb.Root>
        <Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>
        <Breadcrumb.Item><Breadcrumb.Page>Current</Breadcrumb.Page></Breadcrumb.Item>
      </Breadcrumb.Root>
    </Align.Start>
    <Align.End>
      <Button>Action</Button>
    </Align.End>
  </Align>
  <Divider />
  {/* page content */}
</Stack>
```

### Dashboard grid

```tsx
<Stack gap="lg">
  <Heading level={1} size="xl">Dashboard</Heading>
  <Grid cols={3} gap="md" collapseBelow={768}>
    <Card.Root>...</Card.Root>
    <Card.Root>...</Card.Root>
    <Card.Root>...</Card.Root>
  </Grid>
  <Grid columns={12} gap="md">
    <Grid.Cell span={8}>
      <Card.Root>{/* chart */}</Card.Root>
    </Grid.Cell>
    <Grid.Cell span={4}>
      <Card.Root>{/* activity feed */}</Card.Root>
    </Grid.Cell>
  </Grid>
</Stack>
```

### Settings page with tabs

```tsx
<Stack gap="lg">
  <Heading level={1}>Settings</Heading>
  <Tabs.Root defaultValue="general">
    <Tabs.List>
      <Tabs.Trigger value="general">General</Tabs.Trigger>
      <Tabs.Trigger value="security">Security</Tabs.Trigger>
      <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="general">
      <Stack gap="md">{/* form fields */}</Stack>
    </Tabs.Content>
    <Tabs.Content value="security">
      <Stack gap="md">{/* security settings */}</Stack>
    </Tabs.Content>
  </Tabs.Root>
</Stack>
```

### Responsive behavior

Use `collapseBelow` instead of media queries:

```tsx
{/* Row on desktop, column on mobile */}
<Stack direction="row" collapseBelow={640} gap="md">
  <Card.Root>...</Card.Root>
  <Card.Root>...</Card.Root>
</Stack>

{/* 3 columns on desktop, stacked on mobile */}
<Grid cols={3} collapseBelow={768} gap="md">
  ...
</Grid>
```
