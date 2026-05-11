import React from 'react';
import ReactDOM from 'react-dom/client';
import { MoveRoot, lightTheme, Sidebar, Stack, Heading, Text, ScrollArea } from 'move';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import 'move/styles.css';
import '@mantine/core/styles.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './index.css';

import { UserExperiencePage } from './pages/UserExperiencePage';

function toPascalCase(str: string) {
  return str.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

const iconResolver = (name: string) => {
  const icons = LucideIcons as Record<string, unknown>;
  return (icons[toPascalCase(name)] || icons[name] || null) as React.ComponentType | null;
};

function AppSidebar() {
  return (
    <Sidebar.Root>
      <Sidebar.Header collapsedChildren={<Text weight="bold" size="lg">B</Text>}>
        <Heading level={2} size="lg">Benchmark</Heading>
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Group>
          <Sidebar.GroupLabel>Components</Sidebar.GroupLabel>
          <NavLink to="/components/user-experience">{({ isActive }) => <Sidebar.Item icon="sparkles" active={isActive} tooltip="User experience">User experience</Sidebar.Item>}</NavLink>
        </Sidebar.Group>
      </Sidebar.Content>
      <Sidebar.Footer>
        <Sidebar.Trigger icon="panel-left" tooltip="Toggle sidebar" visibility="desktop">Collapse</Sidebar.Trigger>
      </Sidebar.Footer>
    </Sidebar.Root>
  );
}

function App() {
  return (
    <Sidebar.Provider>
      <Stack direction="row" gap="none" align="stretch" fill>
        <AppSidebar />
        <ScrollArea.Root>
          <ScrollArea.Content padded>
            <Routes>
              <Route path="/" element={<Navigate to="/components/user-experience" replace />} />
              <Route path="/components/user-experience" element={<UserExperiencePage />} />
            </Routes>
          </ScrollArea.Content>
        </ScrollArea.Root>
      </Stack>
    </Sidebar.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MoveRoot theme={lightTheme} iconResolver={iconResolver}>
        <App />
      </MoveRoot>
    </BrowserRouter>
  </React.StrictMode>,
);
