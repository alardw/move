import { Stack, TableOfContents } from 'move';
import styles from './TocRail.module.css';

export interface TocItem {
  href: string;
  label: string;
  depth?: 1 | 2 | 3 | 4;
}

/**
 * Sticky right-rail TOC for docs pages. Composed from Move's TableOfContents
 * so scroll-spy, smooth scroll, and active-state styling come for free.
 */
export function TocRail({ items }: { items: TocItem[] }) {
  return (
    <aside className={styles.rail}>
      <Stack gap="xs">
        <div className={styles.label}>On this page</div>
        <TableOfContents.Root>
          {items.map((item) => (
            <TableOfContents.Item key={item.href} href={item.href} depth={item.depth}>
              {item.label}
            </TableOfContents.Item>
          ))}
        </TableOfContents.Root>
      </Stack>
    </aside>
  );
}
