# Components Move does not have

Drawn from a survey of shadcn/ui, Radix Themes, MUI, Mantine, Chakra UI, Ant
Design, Headless UI, Ark UI, and Polaris. (Carbon docs failed to fetch and are
omitted.) Each entry lists what it is, which surveyed libraries ship it, and
the closest existing Move equivalent.

Entries appear only if they are shipped by 2 or more surveyed libraries. Things
Move already covers under a different name (e.g. Snackbar = Toast,
Spinner = Loader) are not listed.

## Forms

### Rating
- Found in: MUI, Mantine, Ant Design, Ark UI (Rating Group), Chakra
- Purpose: 1–5 (or N) star rating input, often with half-star precision and a
  read-only display mode.
- Closest in Move: none.

### Range slider (two-thumb)
- Found in: MUI (Slider with range), Mantine (RangeSlider), Polaris (Range
  slider), Ant Design (Slider with range)
- Purpose: Numeric range selection with a min and max thumb on a single track.
- Closest in Move: InputRange supports a single thumb; no two-thumb range yet.

### Tags input / Pills input
- Found in: Mantine (TagsInput / PillsInput), Chakra (Tags Input), Ark UI
  (Tags Input)
- Purpose: Free-form text input that converts entries into removable pill
  tokens, often with autocomplete.
- Closest in Move: Autocomplete handles single-value selection; no
  multi-value tokenized input.

### Multi-select
- Found in: Mantine (MultiSelect), MUI (Select multiple), Ant Design
  (Select multiple), Chakra (Select multiple)
- Purpose: Select with multiple selected values shown as removable chips.
- Closest in Move: Select is single-value; no multi-select variant.

### Mentions / typeahead with triggers
- Found in: Ant Design (Mentions), Chakra (via Combobox patterns)
- Purpose: Textarea-like input that triggers a suggestion list on `@`, `#`,
  etc. — used in comment fields.
- Closest in Move: none.

### Cascader / tree select
- Found in: Ant Design (Cascader / TreeSelect), MUI (via SelectTree
  community), Mantine (Tree)
- Purpose: Hierarchical selection where each picked level reveals the next.
- Closest in Move: none.

### Transfer list
- Found in: MUI (Transfer List), Ant Design (Transfer)
- Purpose: Two-pane list with arrows to move items between "available" and
  "selected" sets.
- Closest in Move: none.

### Masked input
- Found in: Mantine (MaskInput), Ant Design (Input with mask)
- Purpose: Text input that enforces a format mask (phone, credit card, date
  segments) while typing.
- Closest in Move: none. InputText has no mask support.

### JSON / structured input
- Found in: Mantine (JsonInput)
- Purpose: Single-vendor — skipped.

## Layout

### Aspect ratio
- Found in: shadcn (Aspect Ratio), Mantine (AspectRatio), Chakra
  (Aspect Ratio), Radix Themes (Aspect Ratio)
- Purpose: Wrapper that locks children to a fixed width-to-height ratio
  (e.g. 16/9 for video embeds).
- Closest in Move: none. Has to be done with custom CSS today.

### Container
- Found in: MUI (Container), Mantine (Container), Chakra (Container), Ant
  Design (via Layout), Polaris (Page)
- Purpose: Max-width centered wrapper for page content with consistent gutters.
- Closest in Move: none — Stack/Grid handle inner layout but there is no
  page-width container primitive.

### Center
- Found in: Mantine (Center), Chakra (Center / AbsoluteCenter)
- Purpose: Tiny utility that centers a single child both axes.
- Closest in Move: Align covers some of this; not a direct match.

### App shell / page chrome
- Found in: Mantine (AppShell), MUI (App Bar + Drawer composite), Polaris
  (Page)
- Purpose: Top-level scaffold for header + sidebar + main content with
  responsive collapse rules.
- Closest in Move: Sidebar exists; no full app-shell composite that wires
  header + sidebar + main together.

### Affix / sticky
- Found in: Mantine (Affix), Ant Design (Affix)
- Purpose: Fixes a child to the viewport edge after scrolling past a
  threshold.
- Closest in Move: none.

## Data display

### Stat / statistic
- Found in: Ant Design (Statistic), Chakra (Stat), MUI (via Typography
  patterns)
- Purpose: Big-number display with label, optional trend arrow, and prefix /
  suffix units. Common on dashboards.
- Closest in Move: none.

### Description list / data list
- Found in: Radix Themes (Data List), Chakra (DataList), Polaris (Description
  list), Ant Design (Descriptions)
- Purpose: Key-value pairs rendered as a definition list, often with a
  two-column layout.
- Closest in Move: none. Could be approximated with Stack + Text.

### Tree view
- Found in: Mantine (Tree), Ant Design (Tree), Chakra (TreeView), Ark UI
  (Tree View)
- Purpose: Hierarchical, expandable navigation/data tree with selection.
- Closest in Move: none.

### QR code
- Found in: Ant Design (QRCode), Chakra (QR Code), Ark UI (QR Code)
- Purpose: Renders a QR code for a string value.
- Closest in Move: none.

### Clipboard / copy button
- Found in: Mantine (CopyButton), Chakra (Clipboard), Ark UI (Clipboard)
- Purpose: Button or wrapper that copies text and shows a "copied" state.
- Closest in Move: none. Easy to build, but not a primitive today.

## Feedback

### Result / success page
- Found in: Ant Design (Result), Polaris (via Empty state variants)
- Purpose: Full-page state for success / error / 404 / 500 with icon,
  heading, body, actions.
- Closest in Move: EmptyState covers part of this but is not styled for
  full-page results.

### Popconfirm / inline confirm
- Found in: Ant Design (Popconfirm), shadcn (via AlertDialog patterns)
- Purpose: Tiny inline confirmation popover ("Are you sure?") anchored to a
  trigger, lighter than a full Dialog.
- Closest in Move: Popover and Dialog exist; an inline confirm could be built
  on Popover, but there is no dedicated popconfirm component.

### Watermark
- Found in: Ant Design (Watermark)
- Purpose: Single-vendor — skipped.

## Navigation

### Anchor / scrollspy
- Found in: Ant Design (Anchor), Mantine (TableOfContents)
- Purpose: Sticky link list that highlights the current section as the page
  scrolls.
- Closest in Move: TableOfContents exists and likely covers most of this —
  treat as covered, not missing.

### Command palette
- Found in: shadcn (Command), Mantine (Spotlight in extensions)
- Purpose: Cmd-K style searchable action launcher.
- Closest in Move: none.

### Bottom navigation / tab bar
- Found in: MUI (Bottom Navigation), Polaris (via Tabs patterns)
- Purpose: Mobile-style fixed bottom tab bar.
- Closest in Move: none. Tabs are inline only.

### Tour / coach marks
- Found in: Ant Design (Tour), Ark UI (Tour)
- Purpose: Step-by-step product tour with highlighted target elements.
- Closest in Move: none.

## Overlay

### Context menu
- Found in: shadcn (Context Menu), Radix Themes (Context Menu)
- Purpose: Right-click menu anchored at the cursor.
- Closest in Move: Dropdown opens on click; no right-click context menu.

### Speed dial / floating action button menu
- Found in: MUI (Speed Dial / FAB), Ant Design (FloatButton)
- Purpose: Floating round button that fans out into a small action menu.
- Closest in Move: none.

## Other

### Rich content blocks (Blockquote / Highlight / Mark / Em / Strong)
- Found in: Mantine (Blockquote / Highlight / Mark), Chakra (Blockquote /
  Highlight / Mark / Em), Radix Themes (Em / Strong / Quote)
- Purpose: Small typographic primitives beyond Text / Heading.
- Closest in Move: Prose and Text cover most; no standalone Blockquote /
  Highlight primitives.

### Number formatter
- Found in: Mantine (NumberFormatter), Ant Design (Statistic)
- Purpose: Pure formatter component for currency, bytes, percentages.
- Closest in Move: none.

### Visually hidden
- Found in: Mantine (VisuallyHidden), Chakra (VisuallyHidden), Radix Themes
  (utilities)
- Purpose: Accessibility utility that hides content visually but keeps it
  available to screen readers.
- Closest in Move: none as a public component.

### Marquee
- Found in: Mantine (Marquee), Chakra (Marquee), Ark UI (Marquee)
- Purpose: Horizontally or vertically scrolling ticker of children.
- Closest in Move: none.

### Signature pad
- Found in: Ark UI (Signature Pad)
- Purpose: Single-vendor — skipped.
