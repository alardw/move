// Generated recipe: Button — Disabled
import { Button } from 'move';
import type { Recipe } from '../../types';

function ButtonDisabledStates() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button disabled>Disabled primary</Button>
      <Button variant="secondary" disabled>Disabled secondary</Button>
      <Button variant="ghost" disabled>Disabled ghost</Button>
    </div>
  );
}

export const recipe: Recipe = {
  id: 'button:disabled',
  title: 'Disabled',
  description: 'Buttons in disabled state across variants.',
  type: 'component',
  component: 'Button',
  render: ButtonDisabledStates,
  code: `import { Button } from 'move';

<Button disabled>Disabled primary</Button>
<Button variant="secondary" disabled>Disabled secondary</Button>
<Button variant="ghost" disabled>Disabled ghost</Button>`,
};
