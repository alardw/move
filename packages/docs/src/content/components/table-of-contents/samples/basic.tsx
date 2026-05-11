import { TableOfContents } from 'move';

const items = [
  { href: '#installation', label: 'Installation' },
  { href: '#highlights', label: 'Highlights' },
  { href: '#samples', label: 'Samples' },
  { href: '#api', label: 'API' },
  { href: '#design-tokens', label: 'Design tokens' },
];

export default function BasicSample() {
  return (
    <TableOfContents.Root>
      {items.map((it) => (
        <TableOfContents.Item key={it.href} href={it.href}>{it.label}</TableOfContents.Item>
      ))}
    </TableOfContents.Root>
  );
}
