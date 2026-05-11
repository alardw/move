import { Autocomplete } from 'move';

// Grouping is purely presentational — filtering still runs over every
// item in the tree, so a search for "typ" still finds TypeScript even
// with the "Languages" label hiding three other matches below it.
const groups = [
  {
    label: 'Languages',
    items: [
      { value: 'typescript', label: 'TypeScript' },
      { value: 'python', label: 'Python' },
      { value: 'rust', label: 'Rust' },
      { value: 'go', label: 'Go' },
    ],
  },
  {
    label: 'Frameworks',
    items: [
      { value: 'next', label: 'Next.js' },
      { value: 'remix', label: 'Remix' },
      { value: 'astro', label: 'Astro' },
      { value: 'sveltekit', label: 'SvelteKit' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { value: 'vite', label: 'Vite' },
      { value: 'esbuild', label: 'esbuild' },
      { value: 'turbopack', label: 'Turbopack' },
    ],
  },
];

export default function GroupedSample() {
  return (
    <Autocomplete.Root>
      <Autocomplete.Trigger>
        <Autocomplete.Input placeholder="What are you working with?" />
        <Autocomplete.ClearTrigger />
        <Autocomplete.Icon />
      </Autocomplete.Trigger>
      <Autocomplete.Content>
        {groups.map((g, i) => (
          <Autocomplete.Group key={g.label}>
            {i > 0 && <Autocomplete.Separator />}
            <Autocomplete.GroupLabel>{g.label}</Autocomplete.GroupLabel>
            {g.items.map((it) => (
              <Autocomplete.Item key={it.value} value={it.value}>
                {it.label}
              </Autocomplete.Item>
            ))}
          </Autocomplete.Group>
        ))}
        <Autocomplete.Empty>No matches. Tell us what you’re actually using.</Autocomplete.Empty>
      </Autocomplete.Content>
    </Autocomplete.Root>
  );
}
