import { useNavigate } from 'react-router-dom';
import { Badge, List, Icon } from 'move';

export interface RelatedItem {
  /** Route to the related component's page, e.g. '/components/autocomplete'. */
  to: string;
  /** Display name, e.g. 'Autocomplete'. */
  name: string;
  /** One-sentence reason the reader might want this one instead. */
  reason: string;
}

/**
 * Whether a row points at a system rather than a sibling component.
 *
 * Read off the route instead of declared per item: a `kind` field would be one
 * more thing to set correctly on every entry, and the path already knows. A
 * system and a component are different kinds of destination — one is another
 * component you might use instead, the other is the model this one takes part
 * in — so the row says which it is rather than leaving the reader to infer it
 * from the name.
 */
const isSystem = (to: string) => to.startsWith('/systems/');

/**
 * "See also" list at the top of a component page. Built from Move's List
 * primitive so it inherits hover + interactive styling; each row has a
 * chevron on the right signaling navigation.
 *
 * Rows point at two kinds of destination: sibling components, and the systems
 * this component takes part in. They are marked differently because they answer
 * different questions — "what else could I use here" versus "what model is this
 * behaving according to".
 */
export function RelatedComponents({ items }: { items: RelatedItem[] }) {
  const navigate = useNavigate();
  return (
    <List.Root hover radius="md">
      {items.map((item) => (
        <List.Item key={item.to} onClick={() => navigate(item.to)}>
          <List.Leading>
            <Icon name={isSystem(item.to) ? 'layers' : 'box'} size={16} />
          </List.Leading>
          <List.Content>
            <List.Title>{item.name}</List.Title>
            <List.Description>{item.reason}</List.Description>
          </List.Content>
          <List.Trailing>
            {isSystem(item.to) && (
              <Badge variant="soft" color="indigo">
                System
              </Badge>
            )}
            <Icon name="chevron-right" size={16} />
          </List.Trailing>
        </List.Item>
      ))}
    </List.Root>
  );
}
