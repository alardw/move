import { useEffect, useMemo, useState } from 'react';
import { Autocomplete } from 'move';

// A rough sketch of "hit an API as the user types": debounce the
// input, flip `loading` on while the request is out, swap results
// when it lands. This sample fakes the request with a timeout so the
// story is visible without a server.

const ALL_PEOPLE = [
  { value: '1', label: 'Ada Lovelace' },
  { value: '2', label: 'Alan Turing' },
  { value: '3', label: 'Grace Hopper' },
  { value: '4', label: 'Donald Knuth' },
  { value: '5', label: 'Barbara Liskov' },
  { value: '6', label: 'Linus Torvalds' },
  { value: '7', label: 'Edsger Dijkstra' },
  { value: '8', label: 'Margaret Hamilton' },
];

function fakeSearch(query: string): Promise<typeof ALL_PEOPLE> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const q = query.toLowerCase();
      resolve(q ? ALL_PEOPLE.filter((p) => p.label.toLowerCase().includes(q)) : ALL_PEOPLE);
    }, 450); // deliberate lag so the loading state is visible
  });
}

export default function AsyncSample() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(ALL_PEOPLE);
  const [loading, setLoading] = useState(false);

  // Debounce the query so we don't fire on every keystroke.
  const debounced = useDebounced(query, 180);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fakeSearch(debounced).then((rows) => {
      if (cancelled) return;
      setResults(rows);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [debounced]);

  return (
    <Autocomplete.Root
      onInputValueChange={setQuery}
      loading={loading}
      // The server is doing the filtering; tell the client filter to
      // stand down, otherwise it would narrow our results further.
      filterFn={() => true}
    >
      <Autocomplete.Trigger>
        <Autocomplete.Input placeholder="Search people…" />
        <Autocomplete.ClearTrigger />
        <Autocomplete.Icon />
      </Autocomplete.Trigger>
      <Autocomplete.Content>
        <Autocomplete.Loading>Searching…</Autocomplete.Loading>
        {results.map((p) => (
          <Autocomplete.Item key={p.value} value={p.value}>
            {p.label}
          </Autocomplete.Item>
        ))}
        <Autocomplete.Empty>No one by that name works here.</Autocomplete.Empty>
      </Autocomplete.Content>
    </Autocomplete.Root>
  );
}

function useDebounced<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);
  return useMemo(() => debounced, [debounced]);
}
