import { Icon, List, Text } from 'move';
import styles from './HighlightList.module.css';

export interface HighlightItem {
  icon: string;
  text: React.ReactNode;
}

/**
 * A simple bullet list with a Lucide icon per item. Used on component
 * pages to narrate what makes each component distinctive. Built on
 * Move's List compound so the ul/li semantics, Leading/Content slots,
 * and keyboard/focus behavior come from the library.
 */
export function HighlightList({ items }: { items: HighlightItem[] }) {
  return (
    <List.Root radius="md" className={styles.root}>
      {items.map((item, i) => (
        <List.Item key={i}>
          <List.Leading className={styles.icon}>
            <Icon name={item.icon} size={20} />
          </List.Leading>
          <List.Content>
            <Text>{item.text}</Text>
          </List.Content>
        </List.Item>
      ))}
    </List.Root>
  );
}
