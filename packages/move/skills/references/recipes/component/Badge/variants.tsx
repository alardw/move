import { Badge } from 'move';

export default function BadgeVariants() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="solid" color="indigo">Solid</Badge>
      <Badge variant="soft" color="indigo">Soft</Badge>
      <Badge variant="surface" color="indigo">Surface</Badge>
      <Badge variant="outline" color="indigo">Outline</Badge>
      <Badge variant="dot" color="green">Active</Badge>
    </div>
  );
}
