import { Autocomplete } from 'move';

// A short list to keep the sample readable — Autocomplete shines on
// larger sets where scanning and typing both pull their weight.
const cities = [
  { value: 'amsterdam', label: 'Amsterdam' },
  { value: 'antwerp', label: 'Antwerp' },
  { value: 'berlin', label: 'Berlin' },
  { value: 'brussels', label: 'Brussels' },
  { value: 'copenhagen', label: 'Copenhagen' },
  { value: 'dublin', label: 'Dublin' },
  { value: 'lisbon', label: 'Lisbon' },
  { value: 'london', label: 'London' },
  { value: 'madrid', label: 'Madrid' },
  { value: 'oslo', label: 'Oslo' },
  { value: 'paris', label: 'Paris' },
  { value: 'rome', label: 'Rome' },
  { value: 'stockholm', label: 'Stockholm' },
  { value: 'vienna', label: 'Vienna' },
];

export default function BasicSample() {
  return (
    <Autocomplete.Root>
      <Autocomplete.Trigger>
        <Autocomplete.Input placeholder="Start typing a city…" />
        <Autocomplete.ClearTrigger />
        <Autocomplete.Icon />
      </Autocomplete.Trigger>
      <Autocomplete.Content>
        {cities.map((c) => (
          <Autocomplete.Item key={c.value} value={c.value}>
            {c.label}
          </Autocomplete.Item>
        ))}
        <Autocomplete.Empty>No matches. Try fewer letters.</Autocomplete.Empty>
      </Autocomplete.Content>
    </Autocomplete.Root>
  );
}
