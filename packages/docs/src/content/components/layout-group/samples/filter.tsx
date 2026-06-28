import { useState } from 'react';
import { Stack, Button, Badge, LayoutGroup } from 'move';

const ITEMS = [
  { id: 'react', label: 'React', kind: 'lib' },
  { id: 'vue', label: 'Vue', kind: 'lib' },
  { id: 'svelte', label: 'Svelte', kind: 'lib' },
  { id: 'solid', label: 'Solid', kind: 'lib' },
  { id: 'preact', label: 'Preact', kind: 'lib' },
  { id: 'qwik', label: 'Qwik', kind: 'lib' },
  { id: 'angular', label: 'Angular', kind: 'lib' },
  { id: 'ts', label: 'TypeScript', kind: 'lang' },
  { id: 'js', label: 'JavaScript', kind: 'lang' },
  { id: 'rust', label: 'Rust', kind: 'lang' },
  { id: 'go', label: 'Go', kind: 'lang' },
  { id: 'python', label: 'Python', kind: 'lang' },
  { id: 'ruby', label: 'Ruby', kind: 'lang' },
  { id: 'elixir', label: 'Elixir', kind: 'lang' },
  { id: 'vite', label: 'Vite', kind: 'tool' },
  { id: 'esbuild', label: 'esbuild', kind: 'tool' },
  { id: 'turbopack', label: 'Turbopack', kind: 'tool' },
  { id: 'rollup', label: 'Rollup', kind: 'tool' },
  { id: 'webpack', label: 'webpack', kind: 'tool' },
  { id: 'biome', label: 'Biome', kind: 'tool' },
];

const FILTERS = ['all', 'lib', 'lang', 'tool'] as const;

/**
 * The headline use case. As the filter changes, removed chips animate out,
 * the survivors glide to close the gaps, and re-added chips animate back in —
 * all from a plain `items.filter(...)`. LayoutGroup wraps a Stack via `asChild`,
 * so the Stack supplies the wrapping row layout.
 */
export default function FilterSample() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all');
  const shown = ITEMS.filter((i) => filter === 'all' || i.kind === filter);

  return (
    <Stack gap="lg" align="start">
      <Stack direction="row" gap="xs" wrap>
        {FILTERS.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={f === filter ? 'primary' : 'secondary'}
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </Stack>

      <LayoutGroup asChild initial stagger={30}>
        <Stack direction="row" gap="sm" wrap>
          {shown.map((i) => (
            <Badge key={i.id} variant="soft" size="lg">
              {i.label}
            </Badge>
          ))}
        </Stack>
      </LayoutGroup>
    </Stack>
  );
}
