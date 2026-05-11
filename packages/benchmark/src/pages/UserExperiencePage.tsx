import { useMemo, useState } from 'react';
import { Stack, Heading, Text, Select, Autocomplete, Accordion, Card, Sidebar } from 'move';
import {
  MantineProvider,
  Select as MantineSelect,
  MultiSelect as MantineMultiSelect,
  Accordion as MantineAccordion,
} from '@mantine/core';
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  Select as MuiSelect,
  MenuItem as MuiMenuItem,
  FormControl as MuiFormControl,
  InputLabel as MuiInputLabel,
  Autocomplete as MuiAutocomplete,
  TextField as MuiTextField,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
} from '@mui/material';
import {
  ConfigProvider as AntConfigProvider,
  Select as AntSelect,
  Collapse as AntCollapse,
  theme as antTheme,
} from 'antd';
import {
  ChakraProvider,
  Select as ChakraSelect,
  Accordion as ChakraAccordion,
  AccordionItem as ChakraAccordionItem,
  AccordionButton as ChakraAccordionButton,
  AccordionPanel as ChakraAccordionPanel,
  AccordionIcon as ChakraAccordionIcon,
  Box as ChakraBox,
} from '@chakra-ui/react';
import {
  HeroUIProvider,
  Select as HeroSelect,
  SelectItem as HeroSelectItem,
  Accordion as HeroAccordion,
  AccordionItem as HeroAccordionItem,
} from '@heroui/react';
import { Dropdown as PrimeDropdown } from 'primereact/dropdown';
import { AutoComplete as PrimeAutoComplete, type AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { Accordion as PrimeAccordion, AccordionTab as PrimeAccordionTab } from 'primereact/accordion';

const FRUITS = [
  'Apple',
  'Banana',
  'Cherry tomato (technically a fruit, botanically speaking)',
  'Date',
  'Elderberry — wild-harvested from old-growth European hedgerows',
  'Feijoa (pineapple guava)',
  'Grape — a very long cultivar name, specifically Cabernet Sauvignon du Bordeaux',
  'Honeydew melon imported from the Central Valley of California in early summer',
  'Imbe (African mangosteen, Garcinia livingstonei)',
];
const COMPONENTS = [
  { value: 'select', label: 'Select' },
  { value: 'autocomplete', label: 'Autocomplete' },
  { value: 'accordion', label: 'Accordion' },
];

// Intentionally varied content — demonstrates proportional height animation.
// Short items snap open; long items take a beat more.
const FAQ_ITEMS: { title: string; content: React.ReactNode }[] = [
  {
    title: 'Is it accessible?',
    content: 'Yes.',
  },
  {
    title: 'What is Move?',
    content:
      'Move is an animated React UI component library built on Radix primitives.',
  },
  {
    title: 'How does theming work?',
    content:
      'Move exposes a three-layer token system: primitive tokens (raw values), semantic tokens (purpose-named aliases), and component tokens (per-component CSS variables). Consumers typically override semantic or component tokens on :root or a scoped class.',
  },
  {
    title: 'What about custom animations?',
    content: (
      <>
        <p style={{ margin: '0 0 8px' }}>
          Every Move component exposes an <code>animations</code> prop that accepts a list of triggers.
          Triggers bind to component state (open, closed, hover), element lifecycle (mount, unmount),
          or arbitrary deps (value changes).
        </p>
        <p style={{ margin: '0 0 8px' }}>
          Each trigger runs a sequence of steps. Steps target named refs, can stagger across children,
          and support dynamic per-element variables via a function that receives the animated element.
        </p>
        <p style={{ margin: 0 }}>
          Under the hood it's anime.js with spring easings tuned for UI — snappy, poppy, gentle, quick,
          slow, lazy, jelly, stiff, plus specialized springs for tooltip and sidebar timing.
        </p>
      </>
    ),
  },
  {
    title: 'Can I use Move with Next.js or Remix?',
    content: 'Yes — every client-side component has the "use client" directive. MoveRoot wraps your app once at the layout root.',
  },
  {
    title: 'What comes in the box?',
    content: (
      <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: 1.6 }}>
        <li>65+ components across core, form, panel, navigation, overlay, data, toolbar</li>
        <li>Token system with 14 Open Color palettes + Move gray</li>
        <li>Light and dark themes with WCAG-tuned foreground pairs</li>
        <li>Animation engine with spring presets and stagger utilities</li>
        <li>AI skills for scaffold + spec + generate + validate workflows</li>
      </ul>
    ),
  },
];
const fruitOptions = FRUITS.map((f) => ({ label: f, value: f }));

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
      </Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card.Root>
  );
}

// =========================================================================
// Select
// =========================================================================

function BrowserSelect() {
  const [value, setValue] = useState(FRUITS[0]);
  return (
    <select value={value} onChange={(e) => setValue(e.target.value)}>
      {FRUITS.map((f) => (
        <option key={f} value={f}>{f}</option>
      ))}
    </select>
  );
}

function MoveSelect() {
  const [value, setValue] = useState(FRUITS[0]);
  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger>
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>
      <Select.Content>
        <Select.Viewport>
          {FRUITS.map((f) => (
            <Select.Item key={f} value={f}>{f}</Select.Item>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Root>
  );
}

function MantineFruitSelect() {
  const [value, setValue] = useState<string | null>(FRUITS[0]);
  return (
    <MantineProvider defaultColorScheme="light">
      <MantineSelect data={FRUITS} value={value} onChange={setValue} />
    </MantineProvider>
  );
}

function MuiFruitSelect({ theme }: { theme: ReturnType<typeof createTheme> }) {
  const [value, setValue] = useState(FRUITS[0]);
  return (
    <MuiThemeProvider theme={theme}>
      <MuiFormControl fullWidth>
        <MuiInputLabel id="mui-fruit-label">Fruit</MuiInputLabel>
        <MuiSelect
          labelId="mui-fruit-label"
          value={value}
          label="Fruit"
          onChange={(e) => setValue(e.target.value as string)}
        >
          {FRUITS.map((f) => (
            <MuiMenuItem key={f} value={f}>{f}</MuiMenuItem>
          ))}
        </MuiSelect>
      </MuiFormControl>
    </MuiThemeProvider>
  );
}

function AntFruitSelect() {
  const [value, setValue] = useState(FRUITS[0]);
  return (
    <AntConfigProvider theme={{ algorithm: antTheme.defaultAlgorithm }}>
      <AntSelect
        value={value}
        onChange={setValue}
        options={fruitOptions}
        style={{ width: '100%' }}
      />
    </AntConfigProvider>
  );
}

function ChakraFruitSelect() {
  const [value, setValue] = useState(FRUITS[0]);
  return (
    <ChakraProvider>
      <ChakraSelect value={value} onChange={(e) => setValue(e.target.value)}>
        {FRUITS.map((f) => (
          <option key={f} value={f}>{f}</option>
        ))}
      </ChakraSelect>
    </ChakraProvider>
  );
}

function HeroFruitSelect() {
  const [value, setValue] = useState<string>(FRUITS[0]);
  return (
    <HeroUIProvider className="light text-foreground bg-background">
      <HeroSelect
        label="Fruit"
        selectedKeys={new Set([value])}
        onSelectionChange={(keys) => {
          const first = Array.from(keys as Set<string>)[0];
          if (first) setValue(first);
        }}
      >
        {FRUITS.map((f) => (
          <HeroSelectItem key={f}>{f}</HeroSelectItem>
        ))}
      </HeroSelect>
    </HeroUIProvider>
  );
}

function PrimeFruitSelect() {
  const [value, setValue] = useState(FRUITS[0]);
  return (
    <PrimeDropdown
      value={value}
      onChange={(e) => setValue(e.value)}
      options={fruitOptions}
      placeholder="Select a fruit"
      style={{ width: '100%' }}
    />
  );
}

function SelectComparison() {
  const muiTheme = useMemo(() => createTheme({ palette: { mode: 'light' } }), []);
  return (
    <Stack gap="lg">
      <Section title="Browser default">
        <BrowserSelect />
      </Section>
      <Section title="Move">
        <MoveSelect />
      </Section>
      <Section title="Mantine">
        <MantineFruitSelect />
      </Section>
      <Section title="Material UI">
        <MuiFruitSelect theme={muiTheme} />
      </Section>
      <Section title="Ant Design">
        <AntFruitSelect />
      </Section>
      <Section title="Chakra UI">
        <ChakraFruitSelect />
      </Section>
      <Section title="HeroUI">
        <HeroFruitSelect />
      </Section>
      <Section title="PrimeReact">
        <PrimeFruitSelect />
      </Section>
    </Stack>
  );
}

// =========================================================================
// Autocomplete
// =========================================================================

function MoveAutocomplete() {
  const [value, setValue] = useState<string | string[]>([]);
  return (
    <Autocomplete.Root multiple value={value} onValueChange={setValue}>
      <Autocomplete.Trigger>
        <Autocomplete.TagList />
        <Autocomplete.Input placeholder="Search fruits…" />
        <Autocomplete.ClearTrigger />
        <Autocomplete.Icon />
      </Autocomplete.Trigger>
      <Autocomplete.Content>
        {FRUITS.map((f) => (
          <Autocomplete.Item key={f} value={f}>{f}</Autocomplete.Item>
        ))}
        <Autocomplete.Empty>No matches.</Autocomplete.Empty>
      </Autocomplete.Content>
    </Autocomplete.Root>
  );
}

function MantineFruitAutocomplete() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <MantineProvider defaultColorScheme="light">
      <MantineMultiSelect
        data={FRUITS}
        value={value}
        onChange={setValue}
        placeholder="Search fruits…"
        searchable
        clearable
      />
    </MantineProvider>
  );
}

function MuiFruitAutocomplete({ theme }: { theme: ReturnType<typeof createTheme> }) {
  const [value, setValue] = useState<string[]>([]);
  return (
    <MuiThemeProvider theme={theme}>
      <MuiAutocomplete
        multiple
        options={FRUITS}
        value={value}
        onChange={(_e, newValue) => setValue(newValue)}
        renderInput={(params) => <MuiTextField {...params} label="Fruits" placeholder="Search fruits…" />}
        fullWidth
      />
    </MuiThemeProvider>
  );
}

function AntFruitAutocomplete() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <AntConfigProvider theme={{ algorithm: antTheme.defaultAlgorithm }}>
      <AntSelect
        mode="multiple"
        value={value}
        onChange={setValue}
        options={fruitOptions}
        placeholder="Search fruits…"
        showSearch
        allowClear
        style={{ width: '100%' }}
      />
    </AntConfigProvider>
  );
}

// HeroUI Autocomplete is single-value only; multi-select with search is not
// supported out of the box.

function PrimeFruitAutocomplete() {
  const [values, setValues] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const search = (event: AutoCompleteCompleteEvent) => {
    const q = event.query.toLowerCase();
    setSuggestions(FRUITS.filter((f) => f.toLowerCase().includes(q)));
  };
  return (
    <PrimeAutoComplete
      value={values}
      suggestions={suggestions}
      completeMethod={search}
      multiple
      onChange={(e) => setValues(e.value)}
      placeholder="Search fruits…"
      style={{ width: '100%' }}
    />
  );
}

// =========================================================================
// Accordion
// =========================================================================

function BrowserAccordion() {
  return (
    <>
      {FAQ_ITEMS.map((item, i) => (
        <details key={i}>
          <summary>{item.title}</summary>
          <div style={{ padding: '8px 0' }}>{item.content}</div>
        </details>
      ))}
    </>
  );
}

function MoveAccordion() {
  return (
    <Accordion.Root type="single" collapsible>
      {FAQ_ITEMS.map((item, i) => (
        <Accordion.Item key={i} value={`item-${i}`}>
          <Accordion.Header>
            <Accordion.Trigger>{item.title}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>{item.content}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

function MantineFaqAccordion() {
  return (
    <MantineProvider defaultColorScheme="light">
      <MantineAccordion>
        {FAQ_ITEMS.map((item, i) => (
          <MantineAccordion.Item key={i} value={`item-${i}`}>
            <MantineAccordion.Control>{item.title}</MantineAccordion.Control>
            <MantineAccordion.Panel>{item.content}</MantineAccordion.Panel>
          </MantineAccordion.Item>
        ))}
      </MantineAccordion>
    </MantineProvider>
  );
}

function MuiFaqAccordion({ theme }: { theme: ReturnType<typeof createTheme> }) {
  return (
    <MuiThemeProvider theme={theme}>
      {FAQ_ITEMS.map((item, i) => (
        <MuiAccordion key={i}>
          <MuiAccordionSummary>{item.title}</MuiAccordionSummary>
          <MuiAccordionDetails>{item.content}</MuiAccordionDetails>
        </MuiAccordion>
      ))}
    </MuiThemeProvider>
  );
}

function AntFaqAccordion() {
  return (
    <AntConfigProvider theme={{ algorithm: antTheme.defaultAlgorithm }}>
      <AntCollapse
        items={FAQ_ITEMS.map((item, i) => ({
          key: String(i),
          label: item.title,
          children: item.content,
        }))}
      />
    </AntConfigProvider>
  );
}

function ChakraFaqAccordion() {
  return (
    <ChakraProvider>
      <ChakraAccordion allowToggle>
        {FAQ_ITEMS.map((item, i) => (
          <ChakraAccordionItem key={i}>
            <h2>
              <ChakraAccordionButton>
                <ChakraBox flex="1" textAlign="left">{item.title}</ChakraBox>
                <ChakraAccordionIcon />
              </ChakraAccordionButton>
            </h2>
            <ChakraAccordionPanel>{item.content}</ChakraAccordionPanel>
          </ChakraAccordionItem>
        ))}
      </ChakraAccordion>
    </ChakraProvider>
  );
}

function HeroFaqAccordion() {
  return (
    <HeroUIProvider className="light text-foreground bg-background">
      <HeroAccordion>
        {FAQ_ITEMS.map((item, i) => (
          <HeroAccordionItem key={i} aria-label={item.title} title={item.title}>
            {item.content}
          </HeroAccordionItem>
        ))}
      </HeroAccordion>
    </HeroUIProvider>
  );
}

function PrimeFaqAccordion() {
  return (
    <PrimeAccordion>
      {FAQ_ITEMS.map((item, i) => (
        <PrimeAccordionTab key={i} header={item.title}>
          {item.content}
        </PrimeAccordionTab>
      ))}
    </PrimeAccordion>
  );
}

function AccordionComparison() {
  const muiTheme = useMemo(() => createTheme({ palette: { mode: 'light' } }), []);
  return (
    <Stack gap="lg">
      <Section title="Browser default (details/summary)">
        <BrowserAccordion />
      </Section>
      <Section title="Move">
        <MoveAccordion />
      </Section>
      <Section title="Mantine">
        <MantineFaqAccordion />
      </Section>
      <Section title="Material UI">
        <MuiFaqAccordion theme={muiTheme} />
      </Section>
      <Section title="Ant Design (Collapse)">
        <AntFaqAccordion />
      </Section>
      <Section title="Chakra UI">
        <ChakraFaqAccordion />
      </Section>
      <Section title="HeroUI">
        <HeroFaqAccordion />
      </Section>
      <Section title="PrimeReact">
        <PrimeFaqAccordion />
      </Section>
    </Stack>
  );
}

function AutocompleteComparison() {
  const muiTheme = useMemo(() => createTheme({ palette: { mode: 'light' } }), []);
  return (
    <Stack gap="lg">
      <Section title="Browser default">
        <Text color="muted">
          Browsers don't ship a native multi-value autocomplete. `&lt;select multiple&gt;` has
          no autocomplete; `&lt;input list&gt;` + `&lt;datalist&gt;` is single-value only.
        </Text>
      </Section>
      <Section title="Move">
        <MoveAutocomplete />
      </Section>
      <Section title="Mantine (MultiSelect)">
        <MantineFruitAutocomplete />
      </Section>
      <Section title="Material UI">
        <MuiFruitAutocomplete theme={muiTheme} />
      </Section>
      <Section title="Ant Design (Select mode=multiple)">
        <AntFruitAutocomplete />
      </Section>
      <Section title="Chakra UI">
        <Text color="muted">
          Chakra v2 does not ship a multi-value autocomplete — typically built with a
          third-party library or composed via Chakra primitives.
        </Text>
      </Section>
      <Section title="HeroUI">
        <Text color="muted">
          HeroUI's <code>Autocomplete</code> is single-value only. Multi-select with search
          isn't supported out of the box — you'd need to compose it from <code>Select</code>
          (multi-select) + a separate search input.
        </Text>
      </Section>
      <Section title="PrimeReact">
        <PrimeFruitAutocomplete />
      </Section>
    </Stack>
  );
}

// =========================================================================
// Page
// =========================================================================

export function UserExperiencePage() {
  const [component, setComponent] = useState('select');

  return (
    <Stack gap="lg">
      <Stack direction="row" gap="md" align="center">
        <Sidebar.Trigger
          icon="menu"
          visibility="mobile"
          style={{ width: 'auto', color: 'var(--move-fg-base)' }}
        />
        <Heading level={1}>User experience</Heading>
      </Stack>
      <Text color="muted">
        Stacked comparison across libraries. Move is built on Radix UI primitives; this page
        compares against other styled, ready-to-ship libraries. Resize the viewport to test
        responsive behavior.
      </Text>

      <Stack gap="sm">
        <Text weight="medium">Component</Text>
        <Select.Root value={component} onValueChange={setComponent}>
          <Select.Trigger>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Content>
            <Select.Viewport>
              {COMPONENTS.map((c) => (
                <Select.Item key={c.value} value={c.value}>{c.label}</Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Root>
      </Stack>

      {component === 'select' && <SelectComparison />}
      {component === 'autocomplete' && <AutocompleteComparison />}
      {component === 'accordion' && <AccordionComparison />}
    </Stack>
  );
}
