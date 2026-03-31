import { Button, Icon } from 'move';

export default function ButtonWithIcon() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="secondary">
        <Icon name="sparkles" />
        <span>Generate</span>
      </Button>
      <Button variant="primary">
        <span>Next</span>
        <Icon name="arrow-right" />
      </Button>
      <Button variant="ghost">
        <Icon name="settings" />
      </Button>
    </div>
  );
}
