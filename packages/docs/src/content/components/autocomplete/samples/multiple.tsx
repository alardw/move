import { Autocomplete } from 'move';

// Multi-select renders previously chosen items as tags inside the
// trigger. Backspace at an empty input peels the last one off — the
// same keyboard contract people already expect from email To: fields.
const techs = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
  { value: 'qwik', label: 'Qwik' },
  { value: 'angular', label: 'Angular' },
  { value: 'ember', label: 'Ember' },
  { value: 'htmx', label: 'HTMX' },
  { value: 'alpine', label: 'Alpine' },
  { value: 'lit', label: 'Lit' },
];

export default function MultipleSample() {
  return (
    <Autocomplete.Root multiple defaultValue={['react', 'htmx']}>
      <Autocomplete.Trigger>
        <Autocomplete.TagList />
        <Autocomplete.Input placeholder="Pick your stack…" />
        <Autocomplete.ClearTrigger />
        <Autocomplete.Icon />
      </Autocomplete.Trigger>
      <Autocomplete.Content>
        {techs.map((t) => (
          <Autocomplete.Item key={t.value} value={t.value}>
            {t.label}
          </Autocomplete.Item>
        ))}
        <Autocomplete.Empty>Nothing matches — maybe you already picked them all.</Autocomplete.Empty>
      </Autocomplete.Content>
    </Autocomplete.Root>
  );
}
