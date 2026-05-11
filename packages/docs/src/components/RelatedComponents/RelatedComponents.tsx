import { useNavigate } from 'react-router-dom';
import { List, Icon } from 'move';

export interface RelatedItem {
  /** Route to the related component's page, e.g. '/components/autocomplete'. */
  to: string;
  /** Display name, e.g. 'Autocomplete'. */
  name: string;
  /** One-sentence reason the reader might want this one instead. */
  reason: string;
}

/**
 * "See also" list at the top of a component page. Built from Move's List
 * primitive so it inherits hover + interactive styling; each row has a
 * chevron on the right signaling navigation.
 */
export function RelatedComponents({ items }: { items: RelatedItem[] }) {
  const navigate = useNavigate();
  return (
    <List.Root hover radius="md">
      {items.map((item) => (
        <List.Item key={item.to} onClick={() => navigate(item.to)}>
          <List.Content>
            <List.Title>{item.name}</List.Title>
            <List.Description>{item.reason}</List.Description>
          </List.Content>
          <List.Trailing>
            <Icon name="chevron-right" size={16} />
          </List.Trailing>
        </List.Item>
      ))}
    </List.Root>
  );
}
