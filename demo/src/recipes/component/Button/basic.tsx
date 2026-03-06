// Generated recipe: Button — Basic
import { Button } from 'move';
import type { Recipe } from '../../types';

function BasicButton() {
  return <Button>Click me</Button>;
}

export const recipe: Recipe = {
  id: 'button:basic',
  title: 'Basic',
  description: 'A simple button with default settings.',
  type: 'component',
  component: 'Button',
  render: BasicButton,
  code: `import { Button } from 'move';

<Button>Click me</Button>`,
};
