// Generated recipe: Button — Variants
import { Button } from 'move';
import type { Recipe } from '../../types';

function ButtonVariants() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  );
}

export const recipe: Recipe = {
  id: 'button:variants',
  title: 'Variants',
  description: 'All available button variants: primary, secondary, ghost, and danger.',
  type: 'component',
  component: 'Button',
  render: ButtonVariants,
  code: `import { Button } from 'move';

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>`,
};
