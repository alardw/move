# Page Patterns Reference

## Page Structure

Every page follows a consistent structure using Move components:

```tsx
<Stack gap="lg">
  {/* Page header */}
  <Align>
    <Align.Start>
      <Stack gap="xs">
        <Breadcrumb.Root>...</Breadcrumb.Root>
        <Heading level={1}>Page Title</Heading>
      </Stack>
    </Align.Start>
    <Align.End>
      {/* Page actions */}
    </Align.End>
  </Align>

  <Divider />

  {/* Page content */}
  ...
</Stack>
```

## Rules

1. **No custom CSS** — only Move component props
2. **Heading hierarchy** — h1 for page title, h2 for sections, h3 for subsections
3. **Responsive** — use `collapseBelow` on Stack/Grid, not media queries
4. **Composites for reuse** — extract repeated patterns into composites
5. **State at page level** — pages own state (filters, selections), composites are presentational

## Common page patterns

### Dashboard
- Page header with title + date range filter
- Grid of stat Cards
- Grid with main content (chart Card) + sidebar (activity Card)

### Settings / Form
- Page header with title + save button
- Tabs for sections (General, Security, Billing)
- Stack of FormField components within each tab

### List / Table
- Page header with title + create button
- Filter bar (Stack direction="row")
- Table with pagination

### Detail
- Breadcrumb trail back to list
- Page header with title + edit/delete actions
- Grid with main content + metadata sidebar
