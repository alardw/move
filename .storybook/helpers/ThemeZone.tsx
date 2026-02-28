import type { ReactNode } from 'react';
import type { Theme } from 'move';
import { ThemeProvider, Text } from 'move';
import { Stack } from './Stack';

interface ThemeZoneProps {
  theme: Theme;
  label: string;
  children: ReactNode;
}

export function ThemeZone({ theme, label, children }: ThemeZoneProps) {
  return (
    <ThemeProvider theme={theme} className="theme-zone">
      <Text color="muted" size="sm">{label}</Text>
      <Stack gap="md" wrap>
        {children}
      </Stack>
    </ThemeProvider>
  );
}
