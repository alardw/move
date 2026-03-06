// Generated from ImageGroup.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Image, ImageGroup } from 'move';
import type { DemoDefinition } from '../types';

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
];

export const demo: DemoDefinition = {
  id: 'media:ImageGroup',
  name: 'ImageGroup',
  category: 'media',
  description: 'CSS Grid wrapper for arranging images in a responsive column grid with gap, radius, and stagger enter animation',
  controls: [
    {
      name: 'columns',
      kind: 'select',
      options: ['2', '3', '4'],
      defaultValue: '3',
    },
    {
      name: 'gap',
      kind: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      defaultValue: 'md',
    },
    {
      name: 'radius',
      kind: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
      defaultValue: 'none',
    },
  ],
  initialProps: {
    columns: '3',
    gap: 'md',
    radius: 'none',
  },
  render: (props) => (
    <ImageGroup
      columns={Number(props.columns)}
      gap={props.gap as 'xs' | 'sm' | 'md' | 'lg' | 'xl'}
      radius={props.radius as 'none' | 'sm' | 'md' | 'lg' | 'full'}
    >
      {SAMPLE_IMAGES.map((src, i) => (
        <Image key={i} src={src} alt={`Sample ${i + 1}`} aspectRatio="4/3" />
      ))}
    </ImageGroup>
  ),
};
