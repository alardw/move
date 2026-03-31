// Generated from Avatar.spec.ts (schemaVersion: 5, specHash: aeb52a7f)
import { Avatar } from 'move';
import type { DemoDefinition } from '../types';

const PALETTE_COLORS = ['gray', 'red', 'pink', 'grape', 'violet', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange'];

export const demo: DemoDefinition = {
  id: 'core:Avatar',
  name: 'Avatar',
  category: 'core',
  description: 'User avatar with image, fallback, color, size options, and spring entrance animation',
  controls: [
    {
      name: 'sample',
      kind: 'select',
      options: ['single', 'fallbackOnly', 'group'],
      defaultValue: 'single',
    },
  ],
  initialProps: {
    sample: 'single',
  },
  subComponents: [
    {
      name: 'Root',
      controls: [
        {
          name: 'size',
          kind: 'select',
          options: ['xs', 'sm', 'md', 'lg', 'xl'],
          defaultValue: 'md',
        },
        {
          name: 'color',
          kind: 'select',
          options: ['(none)', ...PALETTE_COLORS],
          defaultValue: '(none)',
        },
      ],
      initialProps: {
        size: 'md',
        color: '(none)',
      },
      children: [
        {
          name: 'Image',
          optional: true,
          defaultEnabled: true,
          controls: [
            { name: 'src', kind: 'text', defaultValue: 'https://i.pravatar.cc/120?img=10' },
            { name: 'alt', kind: 'text', defaultValue: 'Avatar' },
          ],
          initialProps: {
            src: 'https://i.pravatar.cc/120?img=10',
            alt: 'Avatar',
          },
        },
        {
          name: 'Fallback',
          optional: true,
          defaultEnabled: true,
          controls: [
            { name: 'text', kind: 'text', defaultValue: 'AW' },
            { name: 'delayMs', kind: 'number', defaultValue: 0 },
          ],
          initialProps: {
            text: 'AW',
            delayMs: 0,
          },
        },
      ],
    },
  ],
  render: (props) => {
    const sample = String(props.sample ?? 'single');
    const root = (props.Root as Record<string, unknown> | undefined) ?? {};
    const image = (root.Image as Record<string, unknown> | undefined) ?? {};
    const fallback = (root.Fallback as Record<string, unknown> | undefined) ?? {};
    const color = root.color === '(none)' ? undefined : (root.color as string | undefined);

    const singleAvatar = (
      <Avatar.Root size={root.size as 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined} color={color as string | undefined}>
        {sample !== 'fallbackOnly' && image._enabled !== false && (
          <Avatar.Image
            src={image.src as string | undefined}
            alt={image.alt as string | undefined}
          />
        )}
        {fallback._enabled !== false && (
          <Avatar.Fallback delayMs={Number(fallback.delayMs ?? 0)}>
            {String(fallback.text ?? 'AW')}
          </Avatar.Fallback>
        )}
      </Avatar.Root>
    );

    if (sample === 'group') {
      return (
        <Avatar.Group>
          {['AW', 'BK', 'CL'].map((initials, idx) => (
            <Avatar.Root key={initials} size={root.size as 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined} color={color as string | undefined}>
              {image._enabled !== false && (
                <Avatar.Image
                  src={`https://i.pravatar.cc/120?img=${10 + idx}`}
                  alt={`${initials} avatar`}
                />
              )}
              {fallback._enabled !== false && (
                <Avatar.Fallback delayMs={Number(fallback.delayMs ?? 0)}>
                  {initials}
                </Avatar.Fallback>
              )}
            </Avatar.Root>
          ))}
        </Avatar.Group>
      );
    }

    return singleAvatar;
  },
};
