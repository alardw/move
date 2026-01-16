import * as React from 'react';
import { Button } from 'move';
import { animate, spring, createScope } from 'animejs';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Types
// =============================================================================

type SpringParams = { mass: number; stiffness: number; damping: number; velocity: number };

// =============================================================================
// Data
// =============================================================================

const easings = [
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

const springPresets: { name: string; params: SpringParams }[] = [
  { name: 'snappy', params: { mass: 1, stiffness: 500, damping: 30, velocity: 0 } },
  { name: 'quick', params: { mass: 0.6, stiffness: 400, damping: 20, velocity: 0 } },
  { name: 'poppy', params: { mass: 0.8, stiffness: 350, damping: 12, velocity: 0 } },
  { name: 'gentle', params: { mass: 1, stiffness: 80, damping: 12, velocity: 0 } },
  { name: 'slow', params: { mass: 2, stiffness: 100, damping: 20, velocity: 0 } },
  { name: 'lazy', params: { mass: 3, stiffness: 80, damping: 25, velocity: 0 } },
  { name: 'jelly', params: { mass: 0.5, stiffness: 150, damping: 6, velocity: 0 } },
  { name: 'stiff', params: { mass: 1, stiffness: 400, damping: 35, velocity: 0 } },
];

// =============================================================================
// Components
// =============================================================================

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: 'var(--move-fg-muted)' }}>{label}</span>
        <span style={{ fontSize: 13, fontFamily: 'var(--move-font-mono)' }}>{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%' }}
      />
    </div>
  );
}

function AnimationPreview({ ease, duration, isSpring }: { ease: string | SpringParams; duration: number; isSpring: boolean }) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const posRef = React.useRef<HTMLDivElement>(null);
  const rotRef = React.useRef<HTMLDivElement>(null);
  const scaleRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const scope = React.useRef<ReturnType<typeof createScope> | null>(null);

  React.useEffect(() => {
    if (!posRef.current || !rotRef.current || !scaleRef.current || !trackRef.current) return;

    const trackWidth = (trackRef.current.offsetWidth - 40) * 0.6;
    const easeVal = isSpring ? spring(ease as SpringParams) : ease as string;

    scope.current = createScope({ root: rootRef }).add(() => {
      animate(posRef.current!, {
        translateX: [0, trackWidth],
        ease: easeVal,
        duration: isSpring ? undefined : duration,
        loop: true,
      });

      animate(rotRef.current!, {
        rotate: [0, 90],
        ease: easeVal,
        duration: isSpring ? undefined : duration,
        loop: true,
      });

      animate(scaleRef.current!, {
        scale: [1, 1.5],
        ease: easeVal,
        duration: isSpring ? undefined : duration,
        loop: true,
      });
    });

    return () => scope.current?.revert();
  }, [ease, duration, isSpring]);

  return (
    <div ref={rootRef} style={{ background: 'var(--move-bg-base)', borderRadius: 12, padding: 24, marginTop: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <span style={{ width: 80, fontSize: 13, color: 'var(--move-fg-muted)' }}>Position</span>
        <div ref={trackRef} style={{ flex: 1, height: 60, position: 'relative', background: 'var(--move-bg-muted)', borderRadius: 8 }}>
          <div ref={posRef} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--move-primary)', position: 'absolute', top: 10, left: 0 }} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <span style={{ width: 80, fontSize: 13, color: 'var(--move-fg-muted)' }}>Rotation</span>
        <div style={{ flex: 1, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--move-bg-muted)', borderRadius: 8 }}>
          <div ref={rotRef} style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--move-primary)' }} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ width: 80, fontSize: 13, color: 'var(--move-fg-muted)' }}>Scale</span>
        <div style={{ flex: 1, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--move-bg-muted)', borderRadius: 8 }}>
          <div ref={scaleRef} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--move-primary)' }} />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Example Components
// =============================================================================

function EasingExample() {
  const [selectedEasing, setSelectedEasing] = React.useState('outQuart');
  const [duration, setDuration] = React.useState(1000);

  return (
    <div>
      <Slider label="Duration (ms)" value={duration} onChange={setDuration} min={200} max={3000} step={100} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8, marginBottom: 24 }}>
        {easings.map((easing) => (
          <Button
            key={easing}
            variant={selectedEasing === easing ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedEasing(easing)}
          >
            {easing}
          </Button>
        ))}
      </div>
      <AnimationPreview key={`${selectedEasing}-${duration}`} ease={selectedEasing} duration={duration} isSpring={false} />
    </div>
  );
}

function SpringExample() {
  const [selectedPreset, setSelectedPreset] = React.useState(0);
  const [customParams, setCustomParams] = React.useState<SpringParams>(springPresets[0].params);

  const updateParam = (key: keyof SpringParams, value: number) => {
    setCustomParams(prev => ({ ...prev, [key]: value }));
  };

  const selectPreset = (index: number) => {
    setSelectedPreset(index);
    setCustomParams(springPresets[index].params);
  };

  return (
    <div>
      <p style={{ marginBottom: 12, fontSize: 13, color: 'var(--move-fg-muted)' }}>Presets</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {springPresets.map((preset, i) => (
          <Button
            key={preset.name}
            variant={selectedPreset === i ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => selectPreset(i)}
          >
            {preset.name}
          </Button>
        ))}
      </div>
      <p style={{ marginBottom: 12, fontSize: 13, color: 'var(--move-fg-muted)' }}>Custom Parameters</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Slider label="Mass" value={customParams.mass} onChange={(v) => updateParam('mass', v)} min={0.1} max={10} step={0.1} />
        <Slider label="Stiffness" value={customParams.stiffness} onChange={(v) => updateParam('stiffness', v)} min={10} max={1000} step={10} />
        <Slider label="Damping" value={customParams.damping} onChange={(v) => updateParam('damping', v)} min={1} max={100} step={1} />
        <Slider label="Velocity" value={customParams.velocity} onChange={(v) => updateParam('velocity', v)} min={0} max={10} step={0.5} />
      </div>
      <AnimationPreview key={JSON.stringify(customParams)} ease={customParams} duration={1000} isSpring={true} />
    </div>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'easing',
    name: 'Easing Curves',
    description: 'Standard CSS easing functions.',
    component: <EasingExample />,
    code: `import { animate } from 'animejs';

animate(element, {
  translateX: [0, 200],
  ease: 'outQuart',
  duration: 1000,
});`,
  },
  {
    id: 'spring',
    name: 'Spring Physics',
    description: 'Physics-based spring animations.',
    component: <SpringExample />,
    code: `import { animate, spring } from 'animejs';

animate(element, {
  scale: [1, 1.5],
  ease: spring({ mass: 1, stiffness: 500, damping: 30 }),
});`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function AnimationDemo() {
  return (
    <DocPage.Root defaultExample="easing">
      <DocPage.Header
        title="Animation"
        description="Spring physics and easing curves powered by anime.js."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
