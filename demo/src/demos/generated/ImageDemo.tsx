// Generated from Image.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Image } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'media:Image',
  name: 'Image',
  category: 'media',
  description: 'Responsive image wrapper with object-fit, radius, aspect ratio, fallback state, and action overlay support',
  controls: [
    {
      name: 'fit',
      kind: 'select',
      options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
      defaultValue: 'cover',
    },
    {
      name: 'radius',
      kind: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
      defaultValue: 'none',
    },
    {
      name: 'position',
      kind: 'select',
      options: ['center', 'top', 'bottom', 'left', 'right'],
      defaultValue: 'center',
    },
    {
      name: 'src',
      kind: 'text',
      defaultValue: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    },
    {
      name: 'alt',
      kind: 'text',
      defaultValue: 'Mountain landscape',
    },
  ],
  initialProps: {
    fit: 'cover',
    radius: 'none',
    position: 'center',
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    alt: 'Mountain landscape',
  },
  render: (props) => (
    <Image
      src={props.src as string}
      alt={props.alt as string}
      fit={props.fit as 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'}
      radius={props.radius as 'none' | 'sm' | 'md' | 'lg' | 'full'}
      position={props.position as 'center' | 'top' | 'bottom' | 'left' | 'right'}
      width={300}
      height={200}
    />
  ),
};
