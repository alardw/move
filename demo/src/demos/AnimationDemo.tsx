import * as React from 'react';
import { Button, InputRange } from 'move';
import { animate, spring, createScope } from 'animejs';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Types
// =============================================================================

type SpringParams = { mass: number; stiffness: number; damping: number; velocity: number };

// =============================================================================
// Data
// =============================================================================

const easingFamilies = [
  { label: 'Quad',    in: 'inQuad',    out: 'outQuad',    inOut: 'inOutQuad' },
  { label: 'Cubic',   in: 'inCubic',   out: 'outCubic',   inOut: 'inOutCubic' },
  { label: 'Quart',   in: 'inQuart',   out: 'outQuart',   inOut: 'inOutQuart' },
  { label: 'Expo',    in: 'inExpo',    out: 'outExpo',    inOut: 'inOutExpo' },
  { label: 'Circ',    in: 'inCirc',    out: 'outCirc',    inOut: 'inOutCirc' },
  { label: 'Back',    in: 'inBack',    out: 'outBack',    inOut: 'inOutBack' },
  { label: 'Elastic', in: 'inElastic', out: 'outElastic', inOut: 'inOutElastic' },
  { label: 'Bounce',  in: 'inBounce',  out: 'outBounce',  inOut: 'inOutBounce' },
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
// Styles
// =============================================================================

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto 1fr 1fr 1fr',
  gap: 6,
  marginBottom: 24,
  alignItems: 'center',
};

const headerStyle: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--move-fg-subtle)',
  fontFamily: 'var(--move-font-mono)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  padding: '0 4px 4px',
};

const rowLabelStyle: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--move-fg-muted)',
  paddingRight: 8,
  fontFamily: 'var(--move-font-mono)',
};

const sliderRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
};

const sliderLabelStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 10,
};

const sliderLabelTextStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--move-fg-muted)',
};

const sliderValueStyle: React.CSSProperties = {
  fontSize: 13,
  fontFamily: 'var(--move-font-mono)',
  color: 'var(--move-fg-muted)',
};

// =============================================================================
// Components
// =============================================================================

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
    const dur = isSpring ? undefined : duration;

    scope.current = createScope({ root: rootRef }).add(() => {
      animate(posRef.current!, {
        translateX: [0, trackWidth],
        ease: easeVal,
        duration: dur,
        loop: true,
      } as any);

      animate(rotRef.current!, {
        rotate: [0, 90],
        ease: easeVal,
        duration: dur,
        loop: true,
      } as any);

      animate(scaleRef.current!, {
        scale: [1, 1.5],
        ease: easeVal,
        duration: dur,
        loop: true,
      } as any);
    });

    return () => scope.current?.revert();
  }, [ease, duration, isSpring]);

  return (
    <div ref={rootRef} style={{ background: 'var(--move-bg-base)', borderRadius: 12, padding: 24, marginTop: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <span style={{ width: 80, fontSize: 13, color: 'var(--move-fg-muted)' }}>Position</span>
        <div ref={trackRef} style={{ flex: 1, height: 60, position: 'relative', borderRadius: 8 }}>
          <div ref={posRef} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--move-primary)', position: 'absolute', top: 10, left: 0 }} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <span style={{ width: 80, fontSize: 13, color: 'var(--move-fg-muted)' }}>Rotation</span>
        <div style={{ flex: 1, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
          <div ref={rotRef} style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--move-primary)' }} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ width: 80, fontSize: 13, color: 'var(--move-fg-muted)' }}>Scale</span>
        <div style={{ flex: 1, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
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
      <div style={{ marginBottom: 16 }}>
        <div style={sliderLabelStyle}>
          <span style={sliderLabelTextStyle}>Duration (ms)</span>
          <span style={sliderValueStyle}>{duration}</span>
        </div>
        <InputRange
          min={200}
          max={3000}
          step={100}
          value={duration}
          onValueChange={(v: number[]) => setDuration(v[0])}
        />
      </div>

      <div style={gridStyle}>
        {/* Column headers */}
        <span />
        <span style={headerStyle}>In</span>
        <span style={headerStyle}>Out</span>
        <span style={headerStyle}>InOut</span>

        {/* Linear — spans all three columns */}
        <span style={rowLabelStyle}>Linear</span>
        <div style={{ gridColumn: 'span 3' }}>
          <Button
            variant={selectedEasing === 'linear' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedEasing('linear')}
            style={{ width: '100%' }}
          >
            linear
          </Button>
        </div>

        {/* Easing families */}
        {easingFamilies.map((family) => (
          <React.Fragment key={family.label}>
            <span style={rowLabelStyle}>{family.label}</span>
            {([family.in, family.out, family.inOut] as const).map((easing) => (
              <Button
                key={easing}
                variant={selectedEasing === easing ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedEasing(easing)}
              >
                {easing}
              </Button>
            ))}
          </React.Fragment>
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
      <div style={sliderRowStyle}>
        <div>
          <div style={sliderLabelStyle}>
            <span style={sliderLabelTextStyle}>Mass</span>
            <span style={sliderValueStyle}>{customParams.mass}</span>
          </div>
          <InputRange min={0.1} max={10} step={0.1} value={customParams.mass} onValueChange={(v: number[]) => updateParam('mass', v[0])} />
        </div>
        <div>
          <div style={sliderLabelStyle}>
            <span style={sliderLabelTextStyle}>Stiffness</span>
            <span style={sliderValueStyle}>{customParams.stiffness}</span>
          </div>
          <InputRange min={10} max={1000} step={10} value={customParams.stiffness} onValueChange={(v: number[]) => updateParam('stiffness', v[0])} />
        </div>
        <div>
          <div style={sliderLabelStyle}>
            <span style={sliderLabelTextStyle}>Damping</span>
            <span style={sliderValueStyle}>{customParams.damping}</span>
          </div>
          <InputRange min={1} max={100} step={1} value={customParams.damping} onValueChange={(v: number[]) => updateParam('damping', v[0])} />
        </div>
        <div>
          <div style={sliderLabelStyle}>
            <span style={sliderLabelTextStyle}>Velocity</span>
            <span style={sliderValueStyle}>{customParams.velocity}</span>
          </div>
          <InputRange min={0} max={10} step={0.5} value={customParams.velocity} onValueChange={(v: number[]) => updateParam('velocity', v[0])} />
        </div>
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
        title="Animation Easing"
        description="Spring physics and easing curves powered by anime.js."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
