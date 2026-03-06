// Generated recipe: Button — With Icon
import { Button, Icon } from 'move';
import type { Recipe } from '../../types';

function ButtonWithIcon() {
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

export const recipe: Recipe = {
  id: 'button:with-icon',
  title: 'With Icon',
  description: 'Buttons with icons in various positions.',
  type: 'component',
  component: 'Button',
  relatedComponents: ['Icon'],
  render: ButtonWithIcon,
  code: `import { Button, Icon } from 'move';

// Icon before text
<Button variant="secondary">
  <Icon name="sparkles" />
  <span>Generate</span>
</Button>

// Icon after text
<Button variant="primary">
  <span>Next</span>
  <Icon name="arrow-right" />
</Button>

// Icon only
<Button variant="ghost">
  <Icon name="settings" />
</Button>`,
};
