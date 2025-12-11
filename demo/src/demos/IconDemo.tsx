import { Button, Icon, IconProvider } from 'move';
import * as LucideIcons from 'lucide-react';

// Import Streamline Micro Line icons (thin stroke style)
import WifiIcon from '../assets/icons/Micro Line/Computer Devices/Connection/Wifi.svg?react';
import BluetoothIcon from '../assets/icons/Micro Line/Computer Devices/Connection/Bluetooth.svg?react';
import AiSparkIcon from '../assets/icons/Micro Line/Artificial Intelligence/AI Sparkle/Ai Spark Starlight.svg?react';
import TargetIcon from '../assets/icons/Micro Line/Business/Business Strategy/Target.svg?react';
import BatteryIcon from '../assets/icons/Micro Line/Computer Devices/Battery/Battery Full.svg?react';
import ChipIcon from '../assets/icons/Micro Line/Computer Devices/Chips/Micro Chip 1.svg?react';
import LaptopIcon from '../assets/icons/Micro Line/Computer Devices/Computer/Computer Laptop.svg?react';
import MegaphoneIcon from '../assets/icons/Micro Line/Business/Business Strategy/Announcement Megaphone.svg?react';
import StartupIcon from '../assets/icons/Micro Line/Business/Business Strategy/Startup.svg?react';
import ShieldIcon from '../assets/icons/Micro Line/Business/Business Strategy/Security Shield.svg?react';

// Custom icons map - Streamline Micro Line
const streamlineIcons: Record<string, React.ComponentType<any>> = {
  'sl-wifi': WifiIcon,
  'sl-bluetooth': BluetoothIcon,
  'sl-ai-spark': AiSparkIcon,
  'sl-target': TargetIcon,
  'sl-battery': BatteryIcon,
  'sl-chip': ChipIcon,
  'sl-laptop': LaptopIcon,
  'sl-megaphone': MegaphoneIcon,
  'sl-startup': StartupIcon,
  'sl-shield': ShieldIcon,
};

// Simple resolver - converts kebab-case to PascalCase and looks up in Lucide
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

const iconResolver = (name: string) => {
  // Check Streamline icons first (prefixed with sl-)
  if (streamlineIcons[name]) return streamlineIcons[name];

  // Fall back to Lucide
  const icons = LucideIcons as Record<string, any>;
  return icons[toPascalCase(name)] || icons[name] || null;
};

export function IconDemo() {
  return (
    <IconProvider resolver={iconResolver}>
      <div className="demo-section">
        <h3>Icon</h3>
        <div className="demo-box">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>Basic usage</p>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Icon name="plus" />
                <Icon name="minus" />
                <Icon name="check" />
                <Icon name="x" />
                <Icon name="settings" />
                <Icon name="user" />
                <Icon name="heart" />
                <Icon name="star" />
              </div>
            </div>

            <div>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>Sizes</p>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Icon name="star" size="xs" />
                <Icon name="star" size="sm" />
                <Icon name="star" size="md" />
                <Icon name="star" size="lg" />
                <Icon name="star" size="xl" />
                <Icon name="star" size={48} />
              </div>
            </div>

            <div>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>Colors</p>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Icon name="heart" size="lg" color="var(--move-error)" />
                <Icon name="check-circle" size="lg" color="var(--move-success)" />
                <Icon name="alert-triangle" size="lg" color="var(--move-warning)" />
                <Icon name="info" size="lg" color="var(--move-info)" />
                <Icon name="star" size="lg" color="var(--move-primary)" />
              </div>
            </div>

            <div>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>Inline with text</p>
              <p style={{ fontSize: 16 }}>
                Click the <Icon name="settings" /> icon to open settings,
                or press <Icon name="heart" color="var(--move-error)" /> to like.
              </p>
            </div>

            <div>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
                Using kebab-case names (auto-converts to PascalCase)
              </p>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Icon name="arrow-left" />
                <Icon name="arrow-right" />
                <Icon name="chevron-down" />
                <Icon name="chevron-up" />
                <Icon name="log-out" />
                <Icon name="external-link" />
              </div>
            </div>

            <div>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
                <strong>Lucide</strong> - 24x24 grid, 2px stroke, rounded caps
              </p>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Icon name="wifi" size="lg" />
                <Icon name="bluetooth" size="lg" />
                <Icon name="sparkles" size="lg" />
                <Icon name="target" size="lg" />
                <Icon name="battery-full" size="lg" />
                <Icon name="cpu" size="lg" />
                <Icon name="laptop" size="lg" />
                <Icon name="megaphone" size="lg" />
                <Icon name="rocket" size="lg" />
                <Icon name="shield" size="lg" />
              </div>
            </div>

            <div>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
                <strong>Streamline Micro Line</strong> - 10x10 grid, 1px stroke, detailed
              </p>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Icon name="sl-wifi" size="lg" />
                <Icon name="sl-bluetooth" size="lg" />
                <Icon name="sl-ai-spark" size="lg" />
                <Icon name="sl-target" size="lg" />
                <Icon name="sl-battery" size="lg" />
                <Icon name="sl-chip" size="lg" />
                <Icon name="sl-laptop" size="lg" />
                <Icon name="sl-megaphone" size="lg" />
                <Icon name="sl-startup" size="lg" />
                <Icon name="sl-shield" size="lg" />
              </div>
            </div>

            <div>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
                Side-by-side comparison (Lucide vs Streamline)
              </p>
              <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <Icon name="wifi" size="xl" />
                  <Icon name="sl-wifi" size="xl" />
                  <span style={{ fontSize: 12, color: '#888' }}>wifi</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <Icon name="target" size="xl" />
                  <Icon name="sl-target" size="xl" />
                  <span style={{ fontSize: 12, color: '#888' }}>target</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <Icon name="shield" size="xl" />
                  <Icon name="sl-shield" size="xl" />
                  <span style={{ fontSize: 12, color: '#888' }}>shield</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <Icon name="laptop" size="xl" />
                  <Icon name="sl-laptop" size="xl" />
                  <span style={{ fontSize: 12, color: '#888' }}>laptop</span>
                </div>
              </div>
            </div>

            <div>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
                Icons in Buttons
              </p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <Button>
                  <Icon name="wifi" /> Lucide
                </Button>
                <Button>
                  <Icon name="sl-wifi" /> Streamline 
                </Button>
                <Button variant="secondary">
                  <Icon name="sparkles" /> Generate
                </Button>
                <Button variant="secondary">
                  <Icon name="sl-ai-spark" /> Generate
                </Button>
                <Button variant="danger">
                  <Icon name="sl-target" /> Target
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </IconProvider>
  );
}
