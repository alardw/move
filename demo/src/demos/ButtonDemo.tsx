import * as React from 'react';
import { Button, Icon, IconProvider } from 'move';
import * as LucideIcons from 'lucide-react';
import { animate, spring } from 'animejs';

// Import custom SVG icons as React components
import WifiIcon from '../assets/icons/Micro Line/Computer Devices/Connection/Wifi.svg?react';
import BluetoothIcon from '../assets/icons/Micro Line/Computer Devices/Connection/Bluetooth.svg?react';
import AiSparkIcon from '../assets/icons/Micro Line/Artificial Intelligence/AI Sparkle/Ai Spark Starlight.svg?react';
import TargetIcon from '../assets/icons/Micro Line/Business/Business Strategy/Target.svg?react';

// Custom icons map
const customIcons: Record<string, React.ComponentType<any>> = {
  'stream': WifiIcon,
  'wifi': WifiIcon,
  'bluetooth': BluetoothIcon,
  'ai-spark': AiSparkIcon,
  'target': TargetIcon,
  'sl-target': TargetIcon,
  'sl-ai-spark': AiSparkIcon,
};

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

const iconResolver = (name: string) => {
  if (customIcons[name]) return customIcons[name];
  const icons = LucideIcons as Record<string, any>;
  return icons[toPascalCase(name)] || icons[name] || null;
};

export function ButtonDemo() {
  return (
    <IconProvider resolver={iconResolver}>
      <div className="demo-section">
        <h3>Button</h3>
        <div className="demo-box">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>Variants</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Button variant="primary" animation="spring">Primary</Button>
                <Button variant="secondary" animation="spring">Secondary</Button>
                <Button variant="ghost" animation="spring">Ghost</Button>
                <Button variant="danger" animation="spring">Danger</Button>
              </div>
            </div>

            <div>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>Sizes</p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Button size="sm" animation="spring">Small</Button>
                <Button size="md" animation="spring">Medium</Button>
                <Button size="lg" animation="spring">Large</Button>
              </div>
            </div>

            <div>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>States</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <Button animation="spring">Default</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>

            <div>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>With icons</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <Button animation="spring">
                  <Icon name="stream" /> Stream
                </Button>
                <Button variant="secondary" animation="spring">
                  <Icon name="bluetooth" /> Connect
                </Button>
                <Button variant="danger" animation="spring">
                  Next <Icon name="chevron-right" />
                </Button>
              </div>
            </div>

            <div>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
                Click animation easings
              </p>
              <EasingMatrix />
            </div>
          </div>
        </div>
      </div>
    </IconProvider>
  );
}

// Standard easings
const standardEasings = [
  'linear',
  'inQuad', 'outQuad', 'inOutQuad',
  'inCubic', 'outCubic', 'inOutCubic',
  'inQuart', 'outQuart', 'inOutQuart',
  'inExpo', 'outExpo', 'inOutExpo',
  'inCirc', 'outCirc', 'inOutCirc',
  'inBack', 'outBack', 'inOutBack',
  'inElastic', 'outElastic', 'inOutElastic',
  'inBounce', 'outBounce', 'inOutBounce',
];

// Spring presets
const springPresets = [
  { name: 'default', params: { mass: 1, stiffness: 100, damping: 10, velocity: 0 } },
  { name: 'snappy', params: { mass: 1, stiffness: 800, damping: 30, velocity: 0 } },
  { name: 'bouncy', params: { mass: 1, stiffness: 200, damping: 8, velocity: 0 } },
  { name: 'strong', params: { mass: 1, stiffness: 500, damping: 15, velocity: 0 } },
  { name: 'gentle', params: { mass: 1, stiffness: 120, damping: 14, velocity: 0 } },
  { name: 'wobbly', params: { mass: 1, stiffness: 180, damping: 12, velocity: 0 } },
  { name: 'stiff', params: { mass: 1, stiffness: 400, damping: 28, velocity: 0 } },
  { name: 'slow', params: { mass: 2, stiffness: 80, damping: 12, velocity: 0 } },
  { name: 'jelly', params: { mass: 0.5, stiffness: 150, damping: 6, velocity: 0 } },
  { name: 'quick', params: { mass: 0.6, stiffness: 600, damping: 18, velocity: 0 } },
];

type SpringParams = { mass: number; stiffness: number; damping: number; velocity: number };

function EasingButton({ label, ease }: { label: string; ease: string }) {
  const ref = React.useRef<HTMLButtonElement>(null);

  const handleMouseDown = () => {
    if (ref.current) {
      animate(ref.current, {
        scale: 0.95,
        ease,
        duration: 150,
      });
    }
  };

  const handleMouseUp = () => {
    if (ref.current) {
      animate(ref.current, {
        scale: 1,
        ease,
        duration: 300,
      });
    }
  };

  const handleMouseLeave = () => {
    if (ref.current) {
      animate(ref.current, {
        scale: 1,
        ease,
        duration: 300,
      });
    }
  };

  return (
    <Button
      ref={ref}
      variant="secondary"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ minWidth: 110 }}
    >
      {label}
    </Button>
  );
}

function SpringButton({ label, params }: { label: string; params: SpringParams }) {
  const ref = React.useRef<HTMLButtonElement>(null);

  const handleMouseDown = () => {
    if (ref.current) {
      animate(ref.current, {
        scale: 0.95,
        ease: spring(params),
      });
    }
  };

  const handleMouseUp = () => {
    if (ref.current) {
      animate(ref.current, {
        scale: 1,
        ease: spring(params),
      });
    }
  };

  const handleMouseLeave = () => {
    if (ref.current) {
      animate(ref.current, {
        scale: 1,
        ease: spring(params),
      });
    }
  };

  return (
    <Button
      ref={ref}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ minWidth: 110 }}
    >
      {label}
    </Button>
  );
}

function EasingMatrix() {
  return (
    <div>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>Standard easings</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {standardEasings.map((ease) => (
          <EasingButton key={ease} label={ease} ease={ease} />
        ))}
      </div>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>Spring physics</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {springPresets.map((preset) => (
          <SpringButton key={preset.name} label={preset.name} params={preset.params} />
        ))}
      </div>
    </div>
  );
}
