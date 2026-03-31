import { Badge } from 'move';

const colors = ['gray', 'red', 'pink', 'grape', 'violet', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange'] as const;

export default function BadgeColors() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {colors.map((c) => (
          <Badge key={c} variant="solid" color={c}>{c}</Badge>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {colors.map((c) => (
          <Badge key={c} variant="soft" color={c}>{c}</Badge>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {colors.map((c) => (
          <Badge key={c} variant="outline" color={c}>{c}</Badge>
        ))}
      </div>
    </div>
  );
}
