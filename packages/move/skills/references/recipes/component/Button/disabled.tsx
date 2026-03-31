import { Button } from 'move';

export default function ButtonDisabled() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button disabled>Disabled primary</Button>
      <Button variant="secondary" disabled>Disabled secondary</Button>
      <Button variant="ghost" disabled>Disabled ghost</Button>
    </div>
  );
}
