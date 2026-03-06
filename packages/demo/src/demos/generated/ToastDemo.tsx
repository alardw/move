// Generated from Toast.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Toast, toast } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'overlay:Toast',
  name: 'Toast',
  category: 'overlay',
  description: 'Notification toast system with imperative API, variant icons, auto-dismiss progress bar, and position grouping',
  controls: [
    {
      name: 'variant',
      kind: 'select',
      options: ['default', 'info', 'success', 'warning', 'error'],
      defaultValue: 'default',
    },
    {
      name: 'position',
      kind: 'select',
      options: ['top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center'],
      defaultValue: 'bottom-right',
    },
    {
      name: 'message',
      kind: 'text',
      defaultValue: 'This is a toast notification',
    },
    {
      name: 'description',
      kind: 'text',
      defaultValue: '',
    },
    {
      name: 'duration',
      kind: 'select',
      options: ['3000', '5000', '0'],
      defaultValue: '5000',
    },
  ],
  initialProps: {
    variant: 'default',
    position: 'bottom-right',
    message: 'This is a toast notification',
    description: '',
    duration: '5000',
  },
  render: (props) => {
    const variant = (props.variant as string) || 'default';
    const position = (props.position as string) || 'bottom-right';
    const message = (props.message as string) || 'Toast notification';
    const description = (props.description as string) || undefined;
    const duration = parseInt(props.duration as string, 10) || 5000;

    const showToast = () => {
      const options = { position: position as any, description, duration };
      switch (variant) {
        case 'info': toast.info(message, options); break;
        case 'success': toast.success(message, options); break;
        case 'warning': toast.warning(message, options); break;
        case 'error': toast.error(message, options); break;
        default: toast(message, options);
      }
    };

    return (
      <div>
        <button onClick={showToast} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Show Toast
        </button>
        <Toast.Viewport />
      </div>
    );
  },
};
