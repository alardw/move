import { useState } from 'react';
import { Table, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// ============================================================================
// Sample data
// ============================================================================

const invoices = [
  { id: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
  { id: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
  { id: 'INV003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
  { id: 'INV004', status: 'Paid', method: 'Credit Card', amount: '$450.00' },
  { id: 'INV005', status: 'Paid', method: 'PayPal', amount: '$550.00' },
  { id: 'INV006', status: 'Pending', method: 'Bank Transfer', amount: '$200.00' },
  { id: 'INV007', status: 'Unpaid', method: 'Credit Card', amount: '$300.00' },
];

// ============================================================================
// Usage
// ============================================================================

function UsageExample() {
  return (
    <Table variant="default" size="md">
      <Table.Caption>A list of recent invoices.</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Invoice</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Method</Table.Head>
          <Table.Head style={{ textAlign: 'right' }}>Amount</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {invoices.slice(0, 5).map((inv) => (
          <Table.Row key={inv.id}>
            <Table.Cell style={{ fontWeight: 'var(--move-weight-medium)' }}>{inv.id}</Table.Cell>
            <Table.Cell>{inv.status}</Table.Cell>
            <Table.Cell>{inv.method}</Table.Cell>
            <Table.Cell style={{ textAlign: 'right' }}>{inv.amount}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell colSpan={3}>Total</Table.Cell>
          <Table.Cell style={{ textAlign: 'right' }}>$1,750.00</Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
}

// ============================================================================
// Variants
// ============================================================================

function VariantsExample() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--move-spacing-xl)' }}>
      <div>
        <p style={{ margin: '0 0 var(--move-spacing-sm)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-sm)' }}>Default</p>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Name</Table.Head>
              <Table.Head>Role</Table.Head>
              <Table.Head>Status</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row><Table.Cell>Alice</Table.Cell><Table.Cell>Engineer</Table.Cell><Table.Cell>Active</Table.Cell></Table.Row>
            <Table.Row><Table.Cell>Bob</Table.Cell><Table.Cell>Designer</Table.Cell><Table.Cell>Active</Table.Cell></Table.Row>
            <Table.Row><Table.Cell>Charlie</Table.Cell><Table.Cell>Manager</Table.Cell><Table.Cell>Away</Table.Cell></Table.Row>
          </Table.Body>
        </Table>
      </div>
      <div>
        <p style={{ margin: '0 0 var(--move-spacing-sm)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-sm)' }}>Striped</p>
        <Table variant="striped">
          <Table.Header>
            <Table.Row>
              <Table.Head>Name</Table.Head>
              <Table.Head>Role</Table.Head>
              <Table.Head>Status</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row><Table.Cell>Alice</Table.Cell><Table.Cell>Engineer</Table.Cell><Table.Cell>Active</Table.Cell></Table.Row>
            <Table.Row><Table.Cell>Bob</Table.Cell><Table.Cell>Designer</Table.Cell><Table.Cell>Active</Table.Cell></Table.Row>
            <Table.Row><Table.Cell>Charlie</Table.Cell><Table.Cell>Manager</Table.Cell><Table.Cell>Away</Table.Cell></Table.Row>
            <Table.Row><Table.Cell>Diana</Table.Cell><Table.Cell>Engineer</Table.Cell><Table.Cell>Active</Table.Cell></Table.Row>
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}

// ============================================================================
// Sizes
// ============================================================================

function SizesExample() {
  const sizes = ['sm', 'md', 'lg'] as const;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--move-spacing-xl)' }}>
      {sizes.map((size) => (
        <div key={size}>
          <p style={{ margin: '0 0 var(--move-spacing-sm)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-sm)' }}>{size}</p>
          <Table size={size}>
            <Table.Header>
              <Table.Row>
                <Table.Head>Name</Table.Head>
                <Table.Head>Email</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row><Table.Cell>Alice</Table.Cell><Table.Cell>alice@example.com</Table.Cell></Table.Row>
              <Table.Row><Table.Cell>Bob</Table.Cell><Table.Cell>bob@example.com</Table.Cell></Table.Row>
            </Table.Body>
          </Table>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Bordered
// ============================================================================

function BorderedExample() {
  return (
    <Table bordered>
      <Table.Header>
        <Table.Row>
          <Table.Head>Product</Table.Head>
          <Table.Head>Category</Table.Head>
          <Table.Head>Price</Table.Head>
          <Table.Head>Stock</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row><Table.Cell>Widget A</Table.Cell><Table.Cell>Hardware</Table.Cell><Table.Cell>$29.99</Table.Cell><Table.Cell>142</Table.Cell></Table.Row>
        <Table.Row><Table.Cell>Gadget B</Table.Cell><Table.Cell>Electronics</Table.Cell><Table.Cell>$49.99</Table.Cell><Table.Cell>85</Table.Cell></Table.Row>
        <Table.Row><Table.Cell>Tool C</Table.Cell><Table.Cell>Hardware</Table.Cell><Table.Cell>$19.99</Table.Cell><Table.Cell>230</Table.Cell></Table.Row>
      </Table.Body>
    </Table>
  );
}

// ============================================================================
// Sticky Header
// ============================================================================

function StickyHeaderExample() {
  const rows = Array.from({ length: 20 }, (_, i) => ({
    id: `ROW-${String(i + 1).padStart(3, '0')}`,
    name: `Item ${i + 1}`,
    value: `$${((i + 1) * 12.5).toFixed(2)}`,
  }));

  return (
    <div style={{ height: 300, overflow: 'auto', borderRadius: 'var(--move-rounded-lg)', border: '1px solid var(--move-border-base)' }}>
      <Table stickyHeader>
        <Table.Header>
          <Table.Row>
            <Table.Head>ID</Table.Head>
            <Table.Head>Name</Table.Head>
            <Table.Head style={{ textAlign: 'right' }}>Value</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row key={row.id}>
              <Table.Cell>{row.id}</Table.Cell>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell style={{ textAlign: 'right' }}>{row.value}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

// ============================================================================
// Row Selection
// ============================================================================

function SelectionExample() {
  const [selected, setSelected] = useState<Set<string>>(new Set(['INV002']));

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Table hoverable>
      <Table.Header>
        <Table.Row>
          <Table.Head>Invoice</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Method</Table.Head>
          <Table.Head style={{ textAlign: 'right' }}>Amount</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {invoices.slice(0, 5).map((inv) => (
          <Table.Row
            key={inv.id}
            selected={selected.has(inv.id)}
            onClick={() => toggle(inv.id)}
            style={{ cursor: 'pointer' }}
          >
            <Table.Cell>{inv.id}</Table.Cell>
            <Table.Cell>{inv.status}</Table.Cell>
            <Table.Cell>{inv.method}</Table.Cell>
            <Table.Cell style={{ textAlign: 'right' }}>{inv.amount}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

// ============================================================================
// Sortable Headers
// ============================================================================

type SortDir = 'asc' | 'desc' | false;
type SortKey = 'id' | 'status' | 'method' | 'amount';

function SortableExample() {
  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : prev === 'desc' ? false : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...invoices].sort((a, b) => {
    if (!sortDir) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    const cmp = aVal.localeCompare(bVal);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head sortable sorted={sortKey === 'id' ? sortDir : false} onSort={() => handleSort('id')}>Invoice</Table.Head>
          <Table.Head sortable sorted={sortKey === 'status' ? sortDir : false} onSort={() => handleSort('status')}>Status</Table.Head>
          <Table.Head sortable sorted={sortKey === 'method' ? sortDir : false} onSort={() => handleSort('method')}>Method</Table.Head>
          <Table.Head sortable sorted={sortKey === 'amount' ? sortDir : false} onSort={() => handleSort('amount')} style={{ textAlign: 'right' }}>Amount</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sorted.map((inv) => (
          <Table.Row key={inv.id}>
            <Table.Cell style={{ fontWeight: 'var(--move-weight-medium)' }}>{inv.id}</Table.Cell>
            <Table.Cell>{inv.status}</Table.Cell>
            <Table.Cell>{inv.method}</Table.Cell>
            <Table.Cell style={{ textAlign: 'right' }}>{inv.amount}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

// ============================================================================
// Custom Styling
// ============================================================================

function CustomStylingExample() {
  return (
    <Table
      variant="striped"
      bordered
      hoverable
      size="lg"
      pt={{
        root: { style: { borderRadius: 'var(--move-rounded-xl)' } },
        header: { style: { backgroundColor: 'var(--move-bg-emphasis)' } },
      }}
    >
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Department</Table.Head>
          <Table.Head style={{ textAlign: 'right' }}>Salary</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row><Table.Cell>Alice Johnson</Table.Cell><Table.Cell>Engineering</Table.Cell><Table.Cell style={{ textAlign: 'right' }}>$120,000</Table.Cell></Table.Row>
        <Table.Row><Table.Cell>Bob Smith</Table.Cell><Table.Cell>Design</Table.Cell><Table.Cell style={{ textAlign: 'right' }}>$105,000</Table.Cell></Table.Row>
        <Table.Row><Table.Cell>Charlie Brown</Table.Cell><Table.Cell>Marketing</Table.Cell><Table.Cell style={{ textAlign: 'right' }}>$95,000</Table.Cell></Table.Row>
      </Table.Body>
    </Table>
  );
}

// ============================================================================
// Examples
// ============================================================================

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Basic table with headers, body rows, footer, and caption',
    component: <UsageExample />,
    code: `import { Table } from 'move';

<Table>
  <Table.Caption>A list of recent invoices.</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head>Invoice</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head>Method</Table.Head>
      <Table.Head>Amount</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>INV001</Table.Cell>
      <Table.Cell>Paid</Table.Cell>
      <Table.Cell>Credit Card</Table.Cell>
      <Table.Cell>$250.00</Table.Cell>
    </Table.Row>
  </Table.Body>
  <Table.Footer>
    <Table.Row>
      <Table.Cell colSpan={3}>Total</Table.Cell>
      <Table.Cell>$1,750.00</Table.Cell>
    </Table.Row>
  </Table.Footer>
</Table>`,
  },
  {
    id: 'variants',
    name: 'Variants',
    description: 'Default or striped row styling',
    component: <VariantsExample />,
    code: `<Table variant="default">...</Table>
<Table variant="striped">...</Table>`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'Small, medium, and large cell padding density',
    component: <SizesExample />,
    code: `<Table size="sm">...</Table>
<Table size="md">...</Table>
<Table size="lg">...</Table>`,
  },
  {
    id: 'bordered',
    name: 'Bordered',
    description: 'Full grid borders on every cell',
    component: <BorderedExample />,
    code: `<Table bordered>
  <Table.Header>
    <Table.Row>
      <Table.Head>Product</Table.Head>
      <Table.Head>Category</Table.Head>
      <Table.Head>Price</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>...</Table.Body>
</Table>`,
  },
  {
    id: 'sticky-header',
    name: 'Sticky Header',
    description: 'Fixed header while the body scrolls',
    component: <StickyHeaderExample />,
    code: `<div style={{ height: 300, overflow: 'auto' }}>
  <Table stickyHeader>
    <Table.Header>
      <Table.Row>
        <Table.Head>ID</Table.Head>
        <Table.Head>Name</Table.Head>
        <Table.Head>Value</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {rows.map(row => (
        <Table.Row key={row.id}>...</Table.Row>
      ))}
    </Table.Body>
  </Table>
</div>`,
  },
  {
    id: 'selection',
    name: 'Row Selection',
    description: 'Click rows to toggle selection state',
    component: <SelectionExample />,
    code: `const [selected, setSelected] = useState(new Set());

<Table hoverable>
  <Table.Body>
    {items.map(item => (
      <Table.Row
        key={item.id}
        selected={selected.has(item.id)}
        onClick={() => toggle(item.id)}
      >
        <Table.Cell>{item.name}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>`,
  },
  {
    id: 'sortable',
    name: 'Sortable Headers',
    description: 'Column headers with sort indicators and callbacks',
    component: <SortableExample />,
    code: `<Table>
  <Table.Header>
    <Table.Row>
      <Table.Head
        sortable
        sorted={sortKey === 'name' ? sortDir : false}
        onSort={() => handleSort('name')}
      >
        Name
      </Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>...</Table.Body>
</Table>`,
  },
  {
    id: 'custom-styling',
    name: 'Custom Styling',
    description: 'Override styles via pt (passthrough) props',
    component: <CustomStylingExample />,
    code: `<Table
  variant="striped"
  bordered
  hoverable
  size="lg"
  pt={{
    root: { style: { borderRadius: 'var(--move-rounded-xl)' } },
    header: { style: { backgroundColor: 'var(--move-bg-emphasis)' } },
  }}
>
  ...
</Table>`,
  },
];

export function TableDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Table"
        description="Structured data display with sortable headers, row selection, and density options."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Table (Root)"
        properties={[
          { name: 'variant', type: "'default' | 'striped'", default: "'default'", description: 'Row striping style.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Cell padding density.' },
          { name: 'bordered', type: 'boolean', default: 'false', description: 'Show full grid borders.' },
          { name: 'hoverable', type: 'boolean', default: 'false', description: 'Highlight rows on hover.' },
          { name: 'stickyHeader', type: 'boolean', default: 'false', description: 'Stick the header to the top when scrolling.' },
          { name: 'animate', type: 'ListAnimate | false', default: '(enter + stagger)', description: 'Animation config for row entrance.' },
        ]}
      />
      <DocPage.ApiSection
        title="Table.Row"
        properties={[
          { name: 'selected', type: 'boolean', default: 'false', description: 'Highlight the row as selected.' },
          { name: 'animate', type: 'ListItemAnimate | false', default: '{}', description: 'Per-row animation overrides.' },
        ]}
      />
      <DocPage.ApiSection
        title="Table.Head"
        properties={[
          { name: 'sortable', type: 'boolean', default: 'false', description: 'Enable sort indicator and click handler.' },
          { name: 'sorted', type: "'asc' | 'desc' | false", default: 'false', description: 'Current sort direction.' },
          { name: 'onSort', type: '() => void', description: 'Callback when sort is triggered.' },
        ]}
      />
    </DocPage.Root>
  );
}
