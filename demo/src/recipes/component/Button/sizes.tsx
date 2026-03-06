// Generated recipe: Button — Sizes
import { Button } from 'move';
import type { Recipe } from '../../types';

function ButtonSizes() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}

export const recipe: Recipe = {
  id: 'button:sizes',
  title: 'Sizes',
  description: 'Button sizes: small, medium, and large.',
  type: 'component',
  component: 'Button',
  render: ButtonSizes,
  code: `import { Button } from 'move';

<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`,
};
