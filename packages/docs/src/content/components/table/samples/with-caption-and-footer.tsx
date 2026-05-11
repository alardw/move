import { Table } from 'move';

const items = [
  { name: 'T-shirt', qty: 2, price: 25 },
  { name: 'Socks', qty: 5, price: 8 },
  { name: 'Hat', qty: 1, price: 18 },
];
const total = items.reduce((sum, i) => sum + i.qty * i.price, 0);

export default function WithCaptionSample() {
  return (
    <Table>
      <Table.Caption>Order #A-10384 — 3 items</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Item</Table.Head>
          <Table.Head>Qty</Table.Head>
          <Table.Head>Price</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {items.map((i) => (
          <Table.Row key={i.name}>
            <Table.Cell>{i.name}</Table.Cell>
            <Table.Cell>{i.qty}</Table.Cell>
            <Table.Cell>${i.price.toFixed(2)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell>Total</Table.Cell>
          <Table.Cell>{items.reduce((n, i) => n + i.qty, 0)}</Table.Cell>
          <Table.Cell>${total.toFixed(2)}</Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
}
