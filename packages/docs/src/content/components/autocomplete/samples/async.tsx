import { useCallback, useEffect, useState } from 'react';
import { Autocomplete, asyncResource } from 'move';
import { fakeAsyncSource } from '../../../../fixtures/asyncSource';

const PEOPLE = [
  { value: '1', label: 'Ada Lovelace' },
  { value: '2', label: 'Alan Turing' },
  { value: '3', label: 'Grace Hopper' },
  { value: '4', label: 'Donald Knuth' },
  { value: '5', label: 'Barbara Liskov' },
  { value: '6', label: 'Linus Torvalds' },
  { value: '7', label: 'Edsger Dijkstra' },
  { value: '8', label: 'Margaret Hamilton' },
];

type Person = (typeof PEOPLE)[number];

// ── Stand-in for your data layer ──────────────────────────────────────────────
// In a real app this is your fetch / React Query / SWR call. Here it's a fake
// that fails ~40% of the time so the error + retry path is visible. Delete it and
// drop in your real request — the Move wiring below doesn't change.
const search = fakeAsyncSource<Person>({
  data: PEOPLE,
  failRate: 0.4,
  filter: (p, q) => p.label.toLowerCase().includes(q.toLowerCase()),
});

export default function AsyncSample() {
  const [query, setQuery] = useState('');
  const [state, setState] = useState<{ data?: Person[]; error?: Error; isLoading: boolean }>({
    isLoading: false,
  });

  // Run the request; aborts any in-flight one so a stale result can't overwrite a
  // newer query. (React Query / SWR do this for you — shown by hand here.)
  const run = useCallback((q: string) => {
    const ctrl = new AbortController();
    setState((s) => ({ ...s, isLoading: true, error: undefined }));
    search(q, ctrl.signal)
      .then((data) => setState({ data, isLoading: false }))
      .catch((error: Error) => {
        if (error.name !== 'AbortError') setState({ error, isLoading: false });
      });
    return () => ctrl.abort();
  }, []);

  useEffect(() => run(query), [query, run]);

  // The one Move-specific line: collapse your data-layer state onto the contract.
  const resource = asyncResource.from({ ...state, refetch: () => run(query) });

  return (
    <Autocomplete.Root
      resource={resource}
      onInputValueChange={setQuery}
      // The server does the filtering; stand the client filter down.
      filterFn={() => true}
    >
      <Autocomplete.Trigger>
        <Autocomplete.Input placeholder="Search people…" />
        <Autocomplete.ClearTrigger />
        <Autocomplete.Icon />
      </Autocomplete.Trigger>
      <Autocomplete.Content>
        <Autocomplete.Loading>Searching…</Autocomplete.Loading>
        <Autocomplete.Error>
          Couldn’t reach the server.
          <Autocomplete.RetryTrigger>Try again</Autocomplete.RetryTrigger>
        </Autocomplete.Error>
        {(state.data ?? []).map((p) => (
          <Autocomplete.Item key={p.value} value={p.value}>
            {p.label}
          </Autocomplete.Item>
        ))}
        <Autocomplete.Empty>No one by that name works here.</Autocomplete.Empty>
      </Autocomplete.Content>
    </Autocomplete.Root>
  );
}
