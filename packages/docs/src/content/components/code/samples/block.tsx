import { Code, Stack } from 'move';

const snippet = `import { ThemeProvider, IconProvider } from 'move';
import * as Icons from 'lucide-react';

export function App() {
  return (
    <ThemeProvider theme="dark">
      <IconProvider resolver={(name) => Icons[name]}>
        {/* your app */}
      </IconProvider>
    </ThemeProvider>
  );
}`;

export default function BlockSample() {
  return (
    <Stack gap="sm">
      <Code block language="tsx">{snippet}</Code>
    </Stack>
  );
}
