import { Autocomplete } from 'move';

// Default filter is case-insensitive "starts with". That’s fine until
// someone types "son" trying to find "Johnson" — the default won’t
// match. A substring filter fixes it. Here we also search the label
// AND a parallel `keywords` string so people can find "NYC" when the
// label reads "New York".
const cities = [
  { value: 'nyc', label: 'New York', keywords: 'nyc new york big apple' },
  { value: 'sf', label: 'San Francisco', keywords: 'sf san francisco bay area' },
  { value: 'la', label: 'Los Angeles', keywords: 'la los angeles socal hollywood' },
  { value: 'chi', label: 'Chicago', keywords: 'chi chicago chitown' },
  { value: 'bos', label: 'Boston', keywords: 'bos boston beantown' },
  { value: 'sea', label: 'Seattle', keywords: 'sea seattle emerald city' },
  { value: 'mia', label: 'Miami', keywords: 'mia miami mia' },
  { value: 'atx', label: 'Austin', keywords: 'atx austin weird' },
];

// The filter receives the typed text, the item's value, and its label.
// We stash the extended keywords on the item via a lookup so the
// filter can reach them — same pattern works with tags, aliases, or
// translated labels.
const keywordsByValue = Object.fromEntries(cities.map((c) => [c.value, c.keywords]));

export default function CustomFilterSample() {
  return (
    <Autocomplete.Root
      filterFn={(input, itemValue, itemLabel) => {
        if (!input) return true;
        const q = input.toLowerCase();
        const haystack = `${itemLabel} ${keywordsByValue[itemValue] ?? ''}`.toLowerCase();
        return haystack.includes(q);
      }}
    >
      <Autocomplete.Trigger>
        <Autocomplete.Input placeholder='Try "nyc", "emerald", or "beantown"…' />
        <Autocomplete.ClearTrigger />
        <Autocomplete.Icon />
      </Autocomplete.Trigger>
      <Autocomplete.Content>
        {cities.map((c) => (
          <Autocomplete.Item key={c.value} value={c.value}>
            {c.label}
          </Autocomplete.Item>
        ))}
        <Autocomplete.Empty>Not a city we know. Did you make it up?</Autocomplete.Empty>
      </Autocomplete.Content>
    </Autocomplete.Root>
  );
}
