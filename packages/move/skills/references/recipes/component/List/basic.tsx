import { List } from 'move';

export default function BasicList() {
  return (
    <List>
      <List.Item>
        <List.Content>
          <List.Title>Leslie Alexander</List.Title>
          <List.Description>leslie.alexander@example.com</List.Description>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Title>Michael Foster</List.Title>
          <List.Description>michael.foster@example.com</List.Description>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Title>Dries Vincent</List.Title>
          <List.Description>dries.vincent@example.com</List.Description>
        </List.Content>
      </List.Item>
    </List>
  );
}
