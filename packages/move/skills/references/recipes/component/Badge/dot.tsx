import { Badge } from 'move';

export default function BadgeDot() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="dot" color="green">Online</Badge>
      <Badge variant="dot" color="yellow">Away</Badge>
      <Badge variant="dot" color="red">Offline</Badge>
      <Badge variant="dot" color="gray">Unknown</Badge>
    </div>
  );
}
