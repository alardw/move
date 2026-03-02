// Generated from Skeleton.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Skeleton } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'loading:Skeleton',
  name: 'Skeleton',
  category: 'loading',
  description: 'Compound placeholder shapes for loading states with pulse and wave animation modes',
  controls: [
    {
      name: 'animation',
      kind: 'select',
      options: ['pulse', 'wave', 'false'],
      defaultValue: 'pulse',
    },
    {
      name: 'loading',
      kind: 'boolean',
      defaultValue: true,
    },
    {
      name: 'sample',
      kind: 'select',
      options: ['card', 'text', 'profile', 'shapes'],
      defaultValue: 'card',
    },
  ],
  initialProps: {
    animation: 'pulse',
    loading: true,
    sample: 'card',
  },
  subComponents: [
    {
      name: 'Circle',
      controls: [
        { name: 'size', kind: 'number', defaultValue: 40 },
      ],
      initialProps: { size: 40 },
    },
    {
      name: 'Rectangle',
      controls: [
        { name: 'width', kind: 'text', defaultValue: '100%' },
        { name: 'height', kind: 'text', defaultValue: '1rem' },
      ],
      initialProps: { width: '100%', height: '1rem' },
    },
    {
      name: 'Rounded',
      controls: [
        { name: 'width', kind: 'text', defaultValue: '100%' },
        { name: 'height', kind: 'text', defaultValue: '1rem' },
      ],
      initialProps: { width: '100%', height: '1rem' },
    },
    {
      name: 'Text',
      controls: [
        { name: 'lines', kind: 'number', defaultValue: 3 },
        { name: 'lastLineWidth', kind: 'text', defaultValue: '60%' },
      ],
      initialProps: { lines: 3, lastLineWidth: '60%' },
    },
  ],
  render: (props) => {
    const animation = props.animation === 'false' ? false : (props.animation as 'pulse' | 'wave');
    const loading = props.loading as boolean;
    const sample = String(props.sample ?? 'card');
    const circle = (props.Circle as Record<string, unknown> | undefined) ?? {};
    const rectangle = (props.Rectangle as Record<string, unknown> | undefined) ?? {};
    const rounded = (props.Rounded as Record<string, unknown> | undefined) ?? {};
    const text = (props.Text as Record<string, unknown> | undefined) ?? {};

    if (sample === 'profile') {
      return (
        <Skeleton.Root animation={animation} loading={loading}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Skeleton.Circle size={Number(circle.size ?? 40)} />
            <div style={{ flex: 1 }}>
              <Skeleton.Text lines={2} lastLineWidth="40%" />
            </div>
          </div>
        </Skeleton.Root>
      );
    }

    if (sample === 'text') {
      return (
        <Skeleton.Root animation={animation} loading={loading}>
          <Skeleton.Text
            lines={Number(text.lines ?? 3)}
            lastLineWidth={String(text.lastLineWidth ?? '60%')}
          />
        </Skeleton.Root>
      );
    }

    if (sample === 'shapes') {
      return (
        <Skeleton.Root animation={animation} loading={loading}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: 300 }}>
            <Skeleton.Circle size={Number(circle.size ?? 40)} />
            <Skeleton.Rectangle
              width={String(rectangle.width ?? '100%')}
              height={String(rectangle.height ?? '1rem')}
            />
            <Skeleton.Rounded
              width={String(rounded.width ?? '100%')}
              height={String(rounded.height ?? '1rem')}
            />
          </div>
        </Skeleton.Root>
      );
    }

    // card sample (default)
    return (
      <Skeleton.Root animation={animation} loading={loading}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: 300 }}>
          <Skeleton.Rectangle width="100%" height="160px" />
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Skeleton.Circle size={Number(circle.size ?? 40)} />
            <div style={{ flex: 1 }}>
              <Skeleton.Text
                lines={Number(text.lines ?? 3)}
                lastLineWidth={String(text.lastLineWidth ?? '60%')}
              />
            </div>
          </div>
        </div>
      </Skeleton.Root>
    );
  },
};
