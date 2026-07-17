import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  MoveRoot,
  lightTheme,
  darkTheme,
  Stack,
  Heading,
  Text,
  Card,
  Badge,
  Button,
  Table,
  Divider,
  ProgressBar,
  Tabs,
  Avatar,
  ScrollArea,
} from 'move';
import type { Theme } from 'move';
import 'move/styles.css';
import { veldsink, veldsinkMuted } from './theme';

// The three themes under comparison. "Stock" is Move's own brand seed — the baseline
// the distilled Veldsink seed has to visibly beat for the import to be worth anything.
const THEMES: { id: string; label: string; light: Theme; dark: Theme }[] = [
  { id: 'stock', label: 'Move stock', light: lightTheme, dark: darkTheme },
  { id: 'veldsink', label: 'Veldsink (chroma .13)', light: veldsink.light, dark: veldsink.dark },
  { id: 'muted', label: 'Veldsink (chroma .087)', light: veldsinkMuted.light, dark: veldsinkMuted.dark },
];

const POLICIES = [
  { nr: 'VA-2024-0119', product: 'Aansprakelijkheid', premie: '€ 24,50', status: 'Actief' },
  { nr: 'VA-2024-0872', product: 'Rechtsbijstand', premie: '€ 18,95', status: 'Actief' },
  { nr: 'VA-2023-4410', product: 'Woonhuis', premie: '€ 41,20', status: 'In behandeling' },
  { nr: 'VA-2023-2201', product: 'Inboedel', premie: '€ 12,75', status: 'Verlopen' },
];

const STATUS_COLOR: Record<string, 'green' | 'yellow' | 'gray'> = {
  Actief: 'green',
  'In behandeling': 'yellow',
  Verlopen: 'gray',
};

function Portal() {
  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Heading level={1}>Mijn verzekeringen</Heading>
        <Text color="muted">Een overzicht van je lopende polissen en dekkingen.</Text>
      </Stack>

      {/* Surfaces + accent fills */}
      <Stack direction="row" gap="md" wrap>
        <Card.Root>
          <Card.Header>
            <Card.Title>Lopende polissen</Card.Title>
            <Card.Description>Vier actieve producten</Card.Description>
          </Card.Header>
          <Card.Body>
            <Heading level={2}>4</Heading>
            <ProgressBar value={72} />
          </Card.Body>
          <Card.Footer>
            <Button variant="primary" size="sm">Bekijk alles</Button>
            <Button variant="ghost" size="sm">Export</Button>
          </Card.Footer>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title>Adviseur</Card.Title>
            <Card.Description>Je vaste contactpersoon</Card.Description>
          </Card.Header>
          <Card.Body>
            <Stack direction="row" gap="sm" align="center">
              <Avatar.Root>
                <Avatar.Fallback>JD</Avatar.Fallback>
              </Avatar.Root>
              <Stack gap="none">
                <Text weight="medium">Jan de Vries</Text>
                <Text size="sm" color="muted">Veldsink Advies — Eindhoven</Text>
              </Stack>
            </Stack>
          </Card.Body>
          <Card.Footer>
            <Button variant="secondary" size="sm">Neem contact op</Button>
          </Card.Footer>
        </Card.Root>
      </Stack>

      <Divider />

      {/* Status colors + table surfaces — where a theme's neutrals show up hardest */}
      <Stack gap="sm">
        <Heading level={2}>Polissen</Heading>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Polisnummer</Table.Head>
              <Table.Head>Product</Table.Head>
              <Table.Head>Premie p/m</Table.Head>
              <Table.Head>Status</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {POLICIES.map((p) => (
              <Table.Row key={p.nr}>
                <Table.Cell>{p.nr}</Table.Cell>
                <Table.Cell>{p.product}</Table.Cell>
                <Table.Cell>{p.premie}</Table.Cell>
                <Table.Cell>
                  <Badge color={STATUS_COLOR[p.status]}>{p.status}</Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Stack>

      {/* Every button variant — the accent's full range in one row */}
      <Stack gap="sm">
        <Heading level={2}>Acties</Heading>
        <Stack direction="row" gap="sm" wrap>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </Stack>
      </Stack>

      <Tabs.Root defaultValue="dekking">
        <Tabs.List>
          <Tabs.Trigger value="dekking">Dekking</Tabs.Trigger>
          <Tabs.Trigger value="documenten">Documenten</Tabs.Trigger>
          <Tabs.Trigger value="schade">Schade</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="dekking">
          <Text>Je dekking loopt tot 31 december 2026.</Text>
        </Tabs.Content>
        <Tabs.Content value="documenten">
          <Text>Drie documenten beschikbaar.</Text>
        </Tabs.Content>
        <Tabs.Content value="schade">
          <Text>Geen openstaande schademeldingen.</Text>
        </Tabs.Content>
      </Tabs.Root>
    </Stack>
  );
}

function App() {
  const [themeId, setThemeId] = React.useState('veldsink');
  const [dark, setDark] = React.useState(false);

  const active = THEMES.find((t) => t.id === themeId)!;
  const theme = dark ? active.dark : active.light;

  return (
    <MoveRoot theme={theme}>
      <ScrollArea.Root>
        <ScrollArea.Content padded>
          <Stack gap="lg">
            {/* The lab controls. Plain Move components — the point is that switching
                theme is passing a different Theme object, nothing more. */}
            <Stack direction="row" gap="sm" align="center" wrap>
              {THEMES.map((t) => (
                <Button
                  key={t.id}
                  size="sm"
                  variant={t.id === themeId ? 'primary' : 'ghost'}
                  onClick={() => setThemeId(t.id)}
                >
                  {t.label}
                </Button>
              ))}
              <Divider orientation="vertical" />
              <Button size="sm" variant="secondary" onClick={() => setDark((d) => !d)}>
                {dark ? 'Light' : 'Dark'}
              </Button>
            </Stack>
            <Divider />
            <Portal />
          </Stack>
        </ScrollArea.Content>
      </ScrollArea.Root>
    </MoveRoot>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
