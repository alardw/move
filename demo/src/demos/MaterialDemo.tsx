import { useEffect } from 'react';
import { Button, LightProvider, useLighting } from 'move';
import type { MaterialKind, ElevationLevel } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Data
// =============================================================================

const materials: MaterialKind[] = ['paper', 'plastic', 'metal', 'glass'];

// =============================================================================
// Components
// =============================================================================

function useLitBackground() {
  const { angle } = useLighting();

  useEffect(() => {
    const mainContent = document.querySelector('.main-content') as HTMLElement;
    if (!mainContent) return;

    const originalBackground = mainContent.style.background;

    mainContent.style.background = `
      linear-gradient(
        ${angle + 180}deg,
        color-mix(in oklch, var(--move-bg-base, #1a1a1a) 92%, white) 0%,
        var(--move-bg-base, #1a1a1a) 50%,
        color-mix(in oklch, var(--move-bg-base, #1a1a1a) 96%, black) 100%
      )
    `;

    return () => {
      mainContent.style.background = originalBackground;
    };
  }, [angle]);
}

function LightControls() {
  const { angle, setAngle, ambient, setAmbient } = useLighting();

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 12, opacity: 0.7 }}>Light Angle: {angle}°</label>
        <input
          type="range"
          min="0"
          max="360"
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          style={{ width: 200 }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 12, opacity: 0.7 }}>Ambient: {ambient.toFixed(2)}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={ambient}
          onChange={(e) => setAmbient(Number(e.target.value))}
          style={{ width: 200 }}
        />
      </div>
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          background: `conic-gradient(from ${angle - 90}deg, rgba(255,200,0,0.9) 0deg, transparent 45deg, transparent 315deg, rgba(255,200,0,0.9) 360deg)`,
          border: '2px solid rgba(255,255,255,0.2)',
          position: 'relative',
          boxShadow: '0 0 20px rgba(255,200,0,0.3)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#fff',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    </div>
  );
}

function MaterialRow({ material, theme }: { material: MaterialKind; theme: 'light' | 'dark' }) {
  const bgColor = theme === 'light'
    ? 'linear-gradient(180deg, #f4f4f4 0%, #e8e8e8 100%)'
    : 'linear-gradient(180deg, #5a5a5a 0%, #4a4a4a 100%)';

  const isGlass = material === 'glass';
  const glassBg = theme === 'light'
    ? 'linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #d299c2 100%)'
    : 'linear-gradient(135deg, #434343 0%, #6b4984 50%, #355c7d 100%)';

  const showElevations: ElevationLevel[] = [1, 2, 3, 4, 5];

  return (
    <div
      data-theme={theme}
      style={{
        background: isGlass ? glassBg : bgColor,
        borderRadius: 20,
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        position: 'relative',
        zIndex: 3,
      }}>
        <span style={{
          fontSize: 12,
          fontWeight: 600,
          textTransform: 'capitalize',
          color: theme === 'light' ? '#333' : '#ccc',
        }}>
          {material}
        </span>
        <span style={{
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: theme === 'light' ? '#666' : '#999',
        }}>
          {theme}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {showElevations.map((elev) => (
          <div
            key={elev}
            className={`material material-${material} cast-shadow`}
            style={{
              '--elevation': elev * 4,
              width: 50,
              height: 50,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 600,
            } as React.CSSProperties}
          >
            <span style={{ position: 'relative', zIndex: 3 }}>{elev}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', position: 'relative', zIndex: 3 }}>
        <Button material={material} elevation={2}>
          Button
        </Button>
        <Button material={material} elevation={3}>
          Elevated
        </Button>
      </div>
    </div>
  );
}

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  useLitBackground();

  return (
    <div>
      <LightControls />
      <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 16 }}>
        Drag the light angle slider to see how highlights and shadows respond.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {materials.flatMap((mat) => [
          <MaterialRow key={`${mat}-light`} material={mat} theme="light" />,
          <MaterialRow key={`${mat}-dark`} material={mat} theme="dark" />,
        ])}
      </div>
    </div>
  );
}

function WrappedDefaultExample() {
  return (
    <LightProvider angle={315} ambient={0.35}>
      <DefaultExample />
    </LightProvider>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Materials with light-responsive shadows.',
    component: <WrappedDefaultExample />,
    code: `<LightProvider angle={315} ambient={0.35}>
  <Button material="paper" elevation={2}>Paper</Button>
  <Button material="plastic" elevation={2}>Plastic</Button>
  <Button material="metal" elevation={2}>Metal</Button>
  <Button material="glass" elevation={2}>Glass</Button>
</LightProvider>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function MaterialDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="Material"
        description="Light-responsive materials with dynamic shadows and highlights."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
