import { useState, useCallback } from 'react';
import { Autocomplete, FormField, Label, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

// ─────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
  { value: 'orange', label: 'Orange' },
  { value: 'pineapple', label: 'Pineapple' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'watermelon', label: 'Watermelon' },
];

const tags = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
  { value: 'next', label: 'Next.js' },
  { value: 'nuxt', label: 'Nuxt' },
  { value: 'remix', label: 'Remix' },
];

// ─────────────────────────────────────────────────────────────────
// Usage
// ─────────────────────────────────────────────────────────────────

function UsageExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Basic">
        <Autocomplete.Root>
          <Autocomplete.Trigger>
            <Autocomplete.Input placeholder="Search fruits..." />
            <Autocomplete.Icon />
          </Autocomplete.Trigger>
          <Autocomplete.Portal>
            <Autocomplete.Content>
              <Autocomplete.Empty>No results found</Autocomplete.Empty>
              {fruits.map((f) => (
                <Autocomplete.Item key={f.value} value={f.value}>
                  {f.label}
                </Autocomplete.Item>
              ))}
            </Autocomplete.Content>
          </Autocomplete.Portal>
        </Autocomplete.Root>
      </DemoSample>

      <DemoSample label="Default value">
        <Autocomplete.Root defaultValue="cherry">
          <Autocomplete.Trigger>
            <Autocomplete.Input placeholder="Search fruits..." />
            <Autocomplete.ClearTrigger />
            <Autocomplete.Icon />
          </Autocomplete.Trigger>
          <Autocomplete.Portal>
            <Autocomplete.Content>
              <Autocomplete.Empty>No results found</Autocomplete.Empty>
              {fruits.map((f) => (
                <Autocomplete.Item key={f.value} value={f.value}>
                  {f.label}
                </Autocomplete.Item>
              ))}
            </Autocomplete.Content>
          </Autocomplete.Portal>
        </Autocomplete.Root>
      </DemoSample>

      <DemoSample label="Disabled items">
        <Autocomplete.Root>
          <Autocomplete.Trigger>
            <Autocomplete.Input placeholder="Search fruits..." />
            <Autocomplete.Icon />
          </Autocomplete.Trigger>
          <Autocomplete.Portal>
            <Autocomplete.Content>
              <Autocomplete.Empty>No results found</Autocomplete.Empty>
              <Autocomplete.Item value="apple">Apple</Autocomplete.Item>
              <Autocomplete.Item value="banana" disabled>Banana (unavailable)</Autocomplete.Item>
              <Autocomplete.Item value="cherry">Cherry</Autocomplete.Item>
              <Autocomplete.Item value="grape" disabled>Grape (unavailable)</Autocomplete.Item>
              <Autocomplete.Item value="orange">Orange</Autocomplete.Item>
            </Autocomplete.Content>
          </Autocomplete.Portal>
        </Autocomplete.Root>
      </DemoSample>
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────────
// Multi
// ─────────────────────────────────────────────────────────────────

function MultiExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Multi-select with tags">
        <Autocomplete.Root multiple>
          <Autocomplete.Trigger>
            <Autocomplete.TagList />
            <Autocomplete.Input placeholder="Add frameworks..." />
            <Autocomplete.ClearTrigger />
            <Autocomplete.Icon />
          </Autocomplete.Trigger>
          <Autocomplete.Portal>
            <Autocomplete.Content>
              <Autocomplete.Empty>No matches</Autocomplete.Empty>
              {tags.map((t) => (
                <Autocomplete.Item key={t.value} value={t.value}>
                  {t.label}
                </Autocomplete.Item>
              ))}
            </Autocomplete.Content>
          </Autocomplete.Portal>
        </Autocomplete.Root>
      </DemoSample>

      <DemoSample label="With default values">
        <Autocomplete.Root multiple defaultValue={['react', 'svelte']}>
          <Autocomplete.Trigger>
            <Autocomplete.TagList />
            <Autocomplete.Input placeholder="Select technologies..." />
            <Autocomplete.ClearTrigger />
            <Autocomplete.Icon />
          </Autocomplete.Trigger>
          <Autocomplete.Portal>
            <Autocomplete.Content>
              <Autocomplete.Empty>No matches</Autocomplete.Empty>
              {tags.map((t) => (
                <Autocomplete.Item key={t.value} value={t.value}>
                  {t.label}
                </Autocomplete.Item>
              ))}
            </Autocomplete.Content>
          </Autocomplete.Portal>
        </Autocomplete.Root>
      </DemoSample>
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────────
// Async
// ─────────────────────────────────────────────────────────────────

interface User {
  id: string;
  name: string;
}

const allUsers: User[] = [
  { id: '1', name: 'Alice Johnson' },
  { id: '2', name: 'Bob Smith' },
  { id: '3', name: 'Carol Williams' },
  { id: '4', name: 'David Brown' },
  { id: '5', name: 'Eva Martinez' },
  { id: '6', name: 'Frank Davis' },
  { id: '7', name: 'Grace Wilson' },
  { id: '8', name: 'Henry Taylor' },
];

function AsyncExample() {
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback((value: string) => {
    if (!value.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // Simulate async search
    const timer = setTimeout(() => {
      const filtered = allUsers.filter((u) =>
        u.name.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Async search">
        <Autocomplete.Root
          loading={loading}
          onInputValueChange={handleSearch}
          filterFn={() => true}
        >
          <Autocomplete.Trigger>
            <Autocomplete.Input placeholder="Search users..." />
            <Autocomplete.Icon />
          </Autocomplete.Trigger>
          <Autocomplete.Portal>
            <Autocomplete.Content>
              <Autocomplete.Loading>Searching...</Autocomplete.Loading>
              <Autocomplete.Empty>No users found</Autocomplete.Empty>
              {results.map((u) => (
                <Autocomplete.Item key={u.id} value={u.id} label={u.name}>
                  {u.name}
                </Autocomplete.Item>
              ))}
            </Autocomplete.Content>
          </Autocomplete.Portal>
        </Autocomplete.Root>
      </DemoSample>
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────────
// Grouped
// ─────────────────────────────────────────────────────────────────

function GroupedExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Grouped items">
        <Autocomplete.Root>
          <Autocomplete.Trigger>
            <Autocomplete.Input placeholder="Search countries..." />
            <Autocomplete.Icon />
          </Autocomplete.Trigger>
          <Autocomplete.Portal>
            <Autocomplete.Content>
              <Autocomplete.Empty>No countries found</Autocomplete.Empty>
              <Autocomplete.Group>
                <Autocomplete.GroupLabel>Europe</Autocomplete.GroupLabel>
                <Autocomplete.Item value="de">Germany</Autocomplete.Item>
                <Autocomplete.Item value="nl">Netherlands</Autocomplete.Item>
                <Autocomplete.Item value="fr">France</Autocomplete.Item>
              </Autocomplete.Group>
              <Autocomplete.Separator />
              <Autocomplete.Group>
                <Autocomplete.GroupLabel>Americas</Autocomplete.GroupLabel>
                <Autocomplete.Item value="us">United States</Autocomplete.Item>
                <Autocomplete.Item value="ca">Canada</Autocomplete.Item>
                <Autocomplete.Item value="br">Brazil</Autocomplete.Item>
              </Autocomplete.Group>
              <Autocomplete.Separator />
              <Autocomplete.Group>
                <Autocomplete.GroupLabel>Asia</Autocomplete.GroupLabel>
                <Autocomplete.Item value="jp">Japan</Autocomplete.Item>
                <Autocomplete.Item value="kr">South Korea</Autocomplete.Item>
                <Autocomplete.Item value="sg">Singapore</Autocomplete.Item>
              </Autocomplete.Group>
            </Autocomplete.Content>
          </Autocomplete.Portal>
        </Autocomplete.Root>
      </DemoSample>
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────────
// Sizes & Variants
// ─────────────────────────────────────────────────────────────────

function SizesExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Sizes">
        <Stack gap="lg" direction="column">
          <Autocomplete.Root>
            <Autocomplete.Trigger size="sm">
              <Autocomplete.Input placeholder="Small" />
              <Autocomplete.Icon />
            </Autocomplete.Trigger>
            <Autocomplete.Portal>
              <Autocomplete.Content>
                {fruits.slice(0, 3).map((f) => (
                  <Autocomplete.Item key={f.value} value={f.value}>{f.label}</Autocomplete.Item>
                ))}
              </Autocomplete.Content>
            </Autocomplete.Portal>
          </Autocomplete.Root>
          <Autocomplete.Root>
            <Autocomplete.Trigger size="md">
              <Autocomplete.Input placeholder="Medium (default)" />
              <Autocomplete.Icon />
            </Autocomplete.Trigger>
            <Autocomplete.Portal>
              <Autocomplete.Content>
                {fruits.slice(0, 3).map((f) => (
                  <Autocomplete.Item key={f.value} value={f.value}>{f.label}</Autocomplete.Item>
                ))}
              </Autocomplete.Content>
            </Autocomplete.Portal>
          </Autocomplete.Root>
          <Autocomplete.Root>
            <Autocomplete.Trigger size="lg">
              <Autocomplete.Input placeholder="Large" />
              <Autocomplete.Icon />
            </Autocomplete.Trigger>
            <Autocomplete.Portal>
              <Autocomplete.Content>
                {fruits.slice(0, 3).map((f) => (
                  <Autocomplete.Item key={f.value} value={f.value}>{f.label}</Autocomplete.Item>
                ))}
              </Autocomplete.Content>
            </Autocomplete.Portal>
          </Autocomplete.Root>
        </Stack>
      </DemoSample>

      <DemoSample label="Variants">
        <Stack gap="lg" direction="column">
          <Autocomplete.Root>
            <Autocomplete.Trigger variant="outlined">
              <Autocomplete.Input placeholder="Outlined (default)" />
              <Autocomplete.Icon />
            </Autocomplete.Trigger>
            <Autocomplete.Portal>
              <Autocomplete.Content>
                {fruits.slice(0, 3).map((f) => (
                  <Autocomplete.Item key={f.value} value={f.value}>{f.label}</Autocomplete.Item>
                ))}
              </Autocomplete.Content>
            </Autocomplete.Portal>
          </Autocomplete.Root>
          <Autocomplete.Root>
            <Autocomplete.Trigger variant="filled">
              <Autocomplete.Input placeholder="Filled" />
              <Autocomplete.Icon />
            </Autocomplete.Trigger>
            <Autocomplete.Portal>
              <Autocomplete.Content>
                {fruits.slice(0, 3).map((f) => (
                  <Autocomplete.Item key={f.value} value={f.value}>{f.label}</Autocomplete.Item>
                ))}
              </Autocomplete.Content>
            </Autocomplete.Portal>
          </Autocomplete.Root>
        </Stack>
      </DemoSample>

      <DemoSample label="Error">
        <Autocomplete.Root>
          <Autocomplete.Trigger invalid>
            <Autocomplete.Input placeholder="Required field..." />
            <Autocomplete.Icon />
          </Autocomplete.Trigger>
          <Autocomplete.Portal>
            <Autocomplete.Content>
              {fruits.slice(0, 3).map((f) => (
                <Autocomplete.Item key={f.value} value={f.value}>{f.label}</Autocomplete.Item>
              ))}
            </Autocomplete.Content>
          </Autocomplete.Portal>
        </Autocomplete.Root>
      </DemoSample>

      <DemoSample label="Disabled">
        <Autocomplete.Root>
          <Autocomplete.Trigger disabled>
            <Autocomplete.Input placeholder="Disabled" disabled />
            <Autocomplete.Icon />
          </Autocomplete.Trigger>
          <Autocomplete.Portal>
            <Autocomplete.Content>
              <Autocomplete.Item value="a">Item A</Autocomplete.Item>
            </Autocomplete.Content>
          </Autocomplete.Portal>
        </Autocomplete.Root>
      </DemoSample>
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────────
// FormField
// ─────────────────────────────────────────────────────────────────

function FormFieldExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Basic">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label>Fruit</Label></FormField.Label>
          <FormField.Field>
            <Autocomplete.Root>
              <Autocomplete.Trigger>
                <Autocomplete.Input placeholder="Search fruits..." />
                <Autocomplete.Icon />
              </Autocomplete.Trigger>
              <Autocomplete.Portal>
                <Autocomplete.Content>
                  <Autocomplete.Empty>No results</Autocomplete.Empty>
                  {fruits.map((f) => (
                    <Autocomplete.Item key={f.value} value={f.value}>{f.label}</Autocomplete.Item>
                  ))}
                </Autocomplete.Content>
              </Autocomplete.Portal>
            </Autocomplete.Root>
          </FormField.Field>
        </FormField.Root>
      </DemoSample>

      <DemoSample label="Multi-select in FormField">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label>Frameworks</Label></FormField.Label>
          <FormField.Field>
            <Autocomplete.Root multiple>
              <Autocomplete.Trigger>
                <Autocomplete.TagList />
                <Autocomplete.Input placeholder="Add frameworks..." />
                <Autocomplete.ClearTrigger />
                <Autocomplete.Icon />
              </Autocomplete.Trigger>
              <Autocomplete.Portal>
                <Autocomplete.Content>
                  <Autocomplete.Empty>No matches</Autocomplete.Empty>
                  {tags.map((t) => (
                    <Autocomplete.Item key={t.value} value={t.value}>{t.label}</Autocomplete.Item>
                  ))}
                </Autocomplete.Content>
              </Autocomplete.Portal>
            </Autocomplete.Root>
          </FormField.Field>
          <FormField.Description>Select one or more frameworks.</FormField.Description>
        </FormField.Root>
      </DemoSample>

      <DemoSample label="Error state">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label required>Category</Label></FormField.Label>
          <FormField.Field>
            <Autocomplete.Root>
              <Autocomplete.Trigger invalid>
                <Autocomplete.Input placeholder="Search categories..." />
                <Autocomplete.Icon />
              </Autocomplete.Trigger>
              <Autocomplete.Portal>
                <Autocomplete.Content>
                  <Autocomplete.Empty>No results</Autocomplete.Empty>
                  <Autocomplete.Item value="design">Design</Autocomplete.Item>
                  <Autocomplete.Item value="engineering">Engineering</Autocomplete.Item>
                  <Autocomplete.Item value="marketing">Marketing</Autocomplete.Item>
                </Autocomplete.Content>
              </Autocomplete.Portal>
            </Autocomplete.Root>
          </FormField.Field>
          <FormField.Description error>Please select a category.</FormField.Description>
        </FormField.Root>
      </DemoSample>
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────────
// Controlled
// ─────────────────────────────────────────────────────────────────

function ControlledExample() {
  const [value, setValue] = useState<string>('');
  const [multiValue, setMultiValue] = useState<string[]>(['react']);

  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Controlled single">
        <Stack gap="lg" direction="column">
          <Autocomplete.Root
            value={value}
            onValueChange={(v) => setValue(v as string)}
          >
            <Autocomplete.Trigger>
              <Autocomplete.Input placeholder="Search fruits..." />
              <Autocomplete.ClearTrigger />
              <Autocomplete.Icon />
            </Autocomplete.Trigger>
            <Autocomplete.Portal>
              <Autocomplete.Content>
                <Autocomplete.Empty>No results</Autocomplete.Empty>
                {fruits.map((f) => (
                  <Autocomplete.Item key={f.value} value={f.value}>{f.label}</Autocomplete.Item>
                ))}
              </Autocomplete.Content>
            </Autocomplete.Portal>
          </Autocomplete.Root>
          <div style={{ fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-muted)' }}>
            Selected: {value || '(none)'}
          </div>
        </Stack>
      </DemoSample>

      <DemoSample label="Controlled multi">
        <Stack gap="lg" direction="column">
          <Autocomplete.Root
            multiple
            value={multiValue}
            onValueChange={(v) => setMultiValue(v as string[])}
          >
            <Autocomplete.Trigger>
              <Autocomplete.TagList />
              <Autocomplete.Input placeholder="Add frameworks..." />
              <Autocomplete.ClearTrigger />
              <Autocomplete.Icon />
            </Autocomplete.Trigger>
            <Autocomplete.Portal>
              <Autocomplete.Content>
                <Autocomplete.Empty>No matches</Autocomplete.Empty>
                {tags.map((t) => (
                  <Autocomplete.Item key={t.value} value={t.value}>{t.label}</Autocomplete.Item>
                ))}
              </Autocomplete.Content>
            </Autocomplete.Portal>
          </Autocomplete.Root>
          <div style={{ fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-muted)' }}>
            Selected: {multiValue.length > 0 ? multiValue.join(', ') : '(none)'}
          </div>
        </Stack>
      </DemoSample>
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────────
// Examples
// ─────────────────────────────────────────────────────────────────

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A searchable dropdown for picking a value with keyboard navigation and filtering.',
    component: <UsageExample />,
    code: `import { Autocomplete } from 'move';

<Autocomplete.Root>
  <Autocomplete.Trigger>
    <Autocomplete.Input placeholder="Search fruits..." />
    <Autocomplete.Icon />
  </Autocomplete.Trigger>
  <Autocomplete.Portal>
    <Autocomplete.Content>
      <Autocomplete.Empty>No results found</Autocomplete.Empty>
      <Autocomplete.Item value="apple">Apple</Autocomplete.Item>
      <Autocomplete.Item value="banana">Banana</Autocomplete.Item>
    </Autocomplete.Content>
  </Autocomplete.Portal>
</Autocomplete.Root>`,
  },
  {
    id: 'multi',
    name: 'Multi-select',
    description: 'Multi-value mode with removable tags and optional check indicators.',
    component: <MultiExample />,
    code: `<Autocomplete.Root multiple>
  <Autocomplete.Trigger>
    <Autocomplete.TagList />
    <Autocomplete.Input placeholder="Add tags..." />
    <Autocomplete.ClearTrigger />
    <Autocomplete.Icon />
  </Autocomplete.Trigger>
  <Autocomplete.Portal>
    <Autocomplete.Content>
      <Autocomplete.Empty>No matches</Autocomplete.Empty>
      <Autocomplete.Item value="react">React</Autocomplete.Item>
    </Autocomplete.Content>
  </Autocomplete.Portal>
</Autocomplete.Root>`,
  },
  {
    id: 'async',
    name: 'Async Search',
    description: 'Load results from an async source with loading and empty states.',
    component: <AsyncExample />,
    code: `const [results, setResults] = useState([]);
const [loading, setLoading] = useState(false);

const handleSearch = (value) => {
  setLoading(true);
  fetchUsers(value).then(users => {
    setResults(users);
    setLoading(false);
  });
};

<Autocomplete.Root
  loading={loading}
  onInputValueChange={handleSearch}
  filterFn={() => true}
>
  <Autocomplete.Trigger>
    <Autocomplete.Input placeholder="Search users..." />
    <Autocomplete.Icon />
  </Autocomplete.Trigger>
  <Autocomplete.Portal>
    <Autocomplete.Content>
      <Autocomplete.Loading>Searching...</Autocomplete.Loading>
      <Autocomplete.Empty>No users found</Autocomplete.Empty>
      {results.map(u => (
        <Autocomplete.Item key={u.id} value={u.id} label={u.name}>
          {u.name}
        </Autocomplete.Item>
      ))}
    </Autocomplete.Content>
  </Autocomplete.Portal>
</Autocomplete.Root>`,
  },
  {
    id: 'grouped',
    name: 'Grouped',
    description: 'Items organized into groups with labels and separators.',
    component: <GroupedExample />,
    code: `<Autocomplete.Root>
  <Autocomplete.Trigger>
    <Autocomplete.Input placeholder="Search countries..." />
    <Autocomplete.Icon />
  </Autocomplete.Trigger>
  <Autocomplete.Portal>
    <Autocomplete.Content>
      <Autocomplete.Group>
        <Autocomplete.GroupLabel>Europe</Autocomplete.GroupLabel>
        <Autocomplete.Item value="de">Germany</Autocomplete.Item>
        <Autocomplete.Item value="nl">Netherlands</Autocomplete.Item>
      </Autocomplete.Group>
      <Autocomplete.Separator />
      <Autocomplete.Group>
        <Autocomplete.GroupLabel>Americas</Autocomplete.GroupLabel>
        <Autocomplete.Item value="us">United States</Autocomplete.Item>
      </Autocomplete.Group>
    </Autocomplete.Content>
  </Autocomplete.Portal>
</Autocomplete.Root>`,
  },
  {
    id: 'sizes',
    name: 'Sizes & Variants',
    description: 'Trigger sizes and visual variants matching InputText.',
    component: <SizesExample />,
    code: `{/* Sizes */}
<Autocomplete.Trigger size="sm">...</Autocomplete.Trigger>
<Autocomplete.Trigger size="md">...</Autocomplete.Trigger>
<Autocomplete.Trigger size="lg">...</Autocomplete.Trigger>

{/* Variants */}
<Autocomplete.Trigger variant="outlined">...</Autocomplete.Trigger>
<Autocomplete.Trigger variant="filled">...</Autocomplete.Trigger>

{/* Error */}
<Autocomplete.Trigger invalid>...</Autocomplete.Trigger>

{/* Disabled */}
<Autocomplete.Trigger disabled>
  <Autocomplete.Input disabled />
</Autocomplete.Trigger>`,
  },
  {
    id: 'formfield',
    name: 'In FormField',
    description: 'Autocomplete composed with FormField for labels, descriptions, and errors.',
    component: <FormFieldExample />,
    code: `<FormField.Root labelWidth="8rem">
  <FormField.Label><Label>Fruit</Label></FormField.Label>
  <FormField.Field>
    <Autocomplete.Root>
      <Autocomplete.Trigger>
        <Autocomplete.Input placeholder="Search..." />
        <Autocomplete.Icon />
      </Autocomplete.Trigger>
      <Autocomplete.Portal>
        <Autocomplete.Content>
          <Autocomplete.Empty>No results</Autocomplete.Empty>
          <Autocomplete.Item value="apple">Apple</Autocomplete.Item>
        </Autocomplete.Content>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  </FormField.Field>
</FormField.Root>`,
  },
  {
    id: 'controlled',
    name: 'Controlled',
    description: 'Fully controlled value and multi-value state.',
    component: <ControlledExample />,
    code: `const [value, setValue] = useState('');

<Autocomplete.Root
  value={value}
  onValueChange={(v) => setValue(v)}
>
  ...
</Autocomplete.Root>

// Multi
const [values, setValues] = useState(['react']);

<Autocomplete.Root
  multiple
  value={values}
  onValueChange={(v) => setValues(v)}
>
  ...
</Autocomplete.Root>`,
  },
];

export function AutocompleteDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Autocomplete"
        description="A searchable dropdown supporting single and multi-value selection with keyboard navigation, filtering, and async search."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Autocomplete.Root"
        properties={[
          { name: 'value', type: 'string | string[]', description: 'Controlled selected value(s).' },
          { name: 'defaultValue', type: 'string | string[]', description: 'Default value(s) for uncontrolled usage.' },
          { name: 'onValueChange', type: '(value: string | string[]) => void', description: 'Called when selected value(s) change.' },
          { name: 'open', type: 'boolean', description: 'Controlled open state.' },
          { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Whether open by default.' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when open state changes.' },
          { name: 'multiple', type: 'boolean', default: 'false', description: 'Enable multi-value mode with tags.' },
          { name: 'inputValue', type: 'string', description: 'Controlled input value.' },
          { name: 'onInputValueChange', type: '(value: string) => void', description: 'Called when input value changes.' },
          { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading state in content.' },
          { name: 'animate', type: 'PopupAnimate | false', description: 'Animation config for content.' },
          { name: 'closeOnSelect', type: 'boolean', description: 'Close after selecting. Default: true (single), false (multi).' },
          { name: 'openOnFocus', type: 'boolean', default: 'true', description: 'Open dropdown when input is focused.' },
          { name: 'filterFn', type: '(input, value, label) => boolean', description: 'Custom filter. Default: case-insensitive includes.' },
        ]}
      />

      <DocPage.ApiSection
        title="Autocomplete.Trigger"
        properties={[
          { name: 'disabled', type: 'boolean', description: 'Disable the trigger.' },
          { name: 'invalid', type: 'boolean', description: 'Error state.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Trigger size.' },
          { name: 'variant', type: "'outlined' | 'filled'", default: "'outlined'", description: 'Visual variant.' },
          { name: 'width', type: "CSSProperties['width']", description: 'Custom trigger width.' },
        ]}
      />

      <DocPage.ApiSection
        title="Autocomplete.Item"
        properties={[
          { name: 'value', type: 'string', description: 'Unique value for this item.' },
          { name: 'label', type: 'string', description: 'Text label for filtering. Defaults to children text content.' },
          { name: 'disabled', type: 'boolean', description: 'Disable this item.' },
        ]}
      />
    </DocPage.Root>
  );
}
