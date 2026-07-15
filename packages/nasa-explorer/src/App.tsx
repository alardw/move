import React from 'react';
import ReactDOM from 'react-dom/client';
import { MoveRoot, lightTheme, Sidebar, Stack, Heading, Text, ScrollArea } from 'move';
import 'move/styles.css';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { iconResolver } from './icons';
import { AboutPage } from './pages/AboutPage';
import { ApodGallery } from './composites/apod-gallery';

function AppSidebar() {
  return (
    <Sidebar.Root>
      <Sidebar.Header collapsedChildren={<Text weight="bold" size="lg">M</Text>}>
        <Heading level={2}>My App</Heading>
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Group>
          <NavLink to="/">{({ isActive }) => <Sidebar.Item icon="home" active={isActive} tooltip="Home">Home</Sidebar.Item>}</NavLink>
          <NavLink to="/about">{({ isActive }) => <Sidebar.Item icon="info" active={isActive} tooltip="About">About</Sidebar.Item>}</NavLink>
        </Sidebar.Group>
      </Sidebar.Content>
      <Sidebar.Footer>
        <Sidebar.Trigger icon="panel-left" tooltip="Toggle sidebar" visibility="desktop">Collapse</Sidebar.Trigger>
      </Sidebar.Footer>
    </Sidebar.Root>
  );
}

// The home page — the ApodGallery composite, generated through the pipeline
// (api-analyze → api-create → adapter → composite). It defaults its own data source
// (the env-configured NASA api), so no wiring is needed here.
function HomePage() {
  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Heading level={1}>Astronomy Picture of the Day</Heading>
        <Text color="muted">A browse of NASA’s daily astronomy pictures.</Text>
      </Stack>
      <ApodGallery />
    </Stack>
  );
}

function App() {
  return (
    <Sidebar.Provider>
      <Stack direction="row" gap="none" align="stretch" fill>
        <AppSidebar />
        <ScrollArea.Root>
          <ScrollArea.Content padded>
            <Sidebar.Trigger icon="menu" visibility="mobile" />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
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
