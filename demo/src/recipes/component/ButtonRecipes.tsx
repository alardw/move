// Generated recipe set for Button
import { useState } from 'react';
import { Button, Icon } from 'move';
import type { Recipe } from '../types';

function BasicButton() {
  return <Button>Click me</Button>;
}

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

function ButtonSizes() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}

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

function ButtonDisabledStates() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button disabled>Disabled primary</Button>
      <Button variant="secondary" disabled>Disabled secondary</Button>
      <Button variant="ghost" disabled>Disabled ghost</Button>
    </div>
  );
}

export const buttonRecipes: Recipe[] = [
  {
    id: 'button:basic',
    title: 'Basic',
    description: 'A simple button with default settings.',
    type: 'component',
    component: 'Button',
    tags: ['basic'],
    render: BasicButton,
    code: `import { Button } from 'move';

<Button>Click me</Button>`,
  },
  {
    id: 'button:variants',
    title: 'Variants',
    description: 'All available button variants: primary, secondary, ghost, and danger.',
    type: 'component',
    component: 'Button',
    tags: ['variants'],
    render: ButtonVariants,
    code: `import { Button } from 'move';

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>`,
  },
  {
    id: 'button:sizes',
    title: 'Sizes',
    description: 'Button sizes: small, medium, and large.',
    type: 'component',
    component: 'Button',
    tags: ['sizes'],
    render: ButtonSizes,
    code: `import { Button } from 'move';

<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`,
  },
  {
    id: 'button:with-icon',
    title: 'With Icon',
    description: 'Buttons with icons in various positions.',
    type: 'component',
    component: 'Button',
    tags: ['icon', 'composition'],
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
  },
  {
    id: 'button:disabled',
    title: 'Disabled',
    description: 'Buttons in disabled state across variants.',
    type: 'component',
    component: 'Button',
    tags: ['disabled', 'state'],
    render: ButtonDisabledStates,
    code: `import { Button } from 'move';

<Button disabled>Disabled primary</Button>
<Button variant="secondary" disabled>Disabled secondary</Button>
<Button variant="ghost" disabled>Disabled ghost</Button>`,
  },
];
