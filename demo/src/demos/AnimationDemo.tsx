import * as React from 'react';
import { animate, spring, createScope } from 'animejs';

type SpringParams = { mass: number; stiffness: number; damping: number; velocity: number };

// Standard easing functions
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

// Spring presets
const springPresets: { name: string; params: SpringParams }[] = [
  { name: 'default', params: { mass: 1, stiffness: 100, damping: 10, velocity: 0 } },
  { name: 'snappy', params: { mass: 1, stiffness: 800, damping: 30, velocity: 0 } },
  { name: 'bouncy', params: { mass: 1, stiffness: 200, damping: 8, velocity: 0 } },
  { name: 'strong', params: { mass: 1, stiffness: 500, damping: 15, velocity: 0 } },
  { name: 'gentle', params: { mass: 1, stiffness: 120, damping: 14, velocity: 0 } },
  { name: 'wobbly', params: { mass: 1, stiffness: 180, damping: 12, velocity: 0 } },
  { name: 'stiff', params: { mass: 1, stiffness: 400, damping: 28, velocity: 0 } },
  { name: 'slow', params: { mass: 2, stiffness: 80, damping: 12, velocity: 0 } },
  { name: 'molasses', params: { mass: 4, stiffness: 60, damping: 20, velocity: 0 } },
  { name: 'jelly', params: { mass: 0.5, stiffness: 150, damping: 6, velocity: 0 } },
  { name: 'quick', params: { mass: 0.6, stiffness: 600, damping: 18, velocity: 0 } },
  { name: 'heavy', params: { mass: 3, stiffness: 300, damping: 25, velocity: 0 } },
  { name: 'drop', params: { mass: 1, stiffness: 300, damping: 10, velocity: 10 } },
];

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
    <div className="param-slider">
      <div className="param-header">
        <span className="param-label">{label}</span>
        <span className="param-value">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
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
    <div ref={rootRef} className="preview-container">
      <div className="preview-row">
        <span className="preview-label">Position</span>
        <div ref={trackRef} className="preview-track">
          <div ref={posRef} className="preview-dot" />
        </div>
      </div>
      <div className="preview-row">
        <span className="preview-label">Rotation</span>
        <div className="preview-track center">
          <div ref={rotRef} className="preview-square" />
        </div>
      </div>
      <div className="preview-row">
        <span className="preview-label">Scale</span>
        <div className="preview-track center">
          <div ref={scaleRef} className="preview-dot" />
        </div>
      </div>
    </div>
  );
}

export function AnimationDemo() {
  const [activeTab, setActiveTab] = React.useState<'easing' | 'spring'>('easing');
  const [selectedEasing, setSelectedEasing] = React.useState('linear');
  const [duration, setDuration] = React.useState(1000);
  const [selectedPreset, setSelectedPreset] = React.useState(1);
  const [customParams, setCustomParams] = React.useState<SpringParams>(springPresets[1].params);

  const updateParam = (key: keyof SpringParams, value: number) => {
    setCustomParams(prev => ({ ...prev, [key]: value }));
  };

  const selectPreset = (index: number) => {
    setSelectedPreset(index);
    setCustomParams(springPresets[index].params);
  };

  return (
    <div className="demo-section">
      <h3>Animation Easings</h3>

      <div className="demo-box">
        <style>{`
          .tab-btn {
            padding: 8px 16px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
          }
          .tab-btn.active {
            background: var(--move-primary, #3b82f6);
            color: var(--move-primary-fg, #fff);
          }
          .tab-btn:not(.active) {
            background: var(--move-bg-muted, #374151);
            color: var(--move-fg-base, #f3f4f6);
          }
          .easing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 8px;
            margin-bottom: 24px;
          }
          .easing-btn {
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid var(--move-border-base, #4b5563);
            background: var(--move-bg-muted, #374151);
            color: var(--move-fg-base, #f3f4f6);
            font-size: 12px;
            font-family: var(--move-font-mono, monospace);
            cursor: pointer;
            transition: all 0.15s;
          }
          .easing-btn:hover {
            border-color: var(--move-primary, #3b82f6);
          }
          .easing-btn.active {
            background: var(--move-primary, #3b82f6);
            color: var(--move-primary-fg, #fff);
            border-color: var(--move-primary, #3b82f6);
          }
          .preset-btn {
            padding: 8px 16px;
            border-radius: 6px;
            border: 1px solid var(--move-border-base, #4b5563);
            background: var(--move-bg-muted, #374151);
            color: var(--move-fg-base, #f3f4f6);
            font-size: 13px;
            cursor: pointer;
          }
          .preset-btn.active {
            background: var(--move-success, #22c55e);
            color: #fff;
            border-color: var(--move-success, #22c55e);
          }
          .preview-container {
            background: var(--move-bg-base, #1f2937);
            border-radius: 12px;
            padding: 24px;
            margin-top: 24px;
          }
          .preview-row {
            display: flex;
            align-items: center;
            margin-bottom: 24px;
          }
          .preview-row:last-child {
            margin-bottom: 0;
          }
          .preview-label {
            width: 80px;
            font-size: 13px;
            color: var(--move-fg-muted, #9ca3af);
          }
          .preview-track {
            flex: 1;
            height: 60px;
            position: relative;
            background: var(--move-bg-muted, #374151);
            border-radius: 8px;
          }
          .preview-track.center {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .preview-dot {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--move-primary, #3b82f6);
            position: absolute;
            top: 10px;
            left: 0;
          }
          .preview-track.center .preview-dot {
            position: static;
          }
          .preview-square {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background: var(--move-primary, #3b82f6);
          }
          .param-slider {
            margin-bottom: 16px;
          }
          .param-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
          }
          .param-label {
            font-size: 13px;
            color: var(--move-fg-muted, #9ca3af);
          }
          .param-value {
            font-size: 13px;
            font-family: var(--move-font-mono, monospace);
            color: var(--move-fg-base, #f3f4f6);
          }
          .param-slider input[type="range"] {
            width: 100%;
            height: 4px;
            border-radius: 2px;
            background: var(--move-bg-emphasis, #4b5563);
            outline: none;
            -webkit-appearance: none;
          }
          .param-slider input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: var(--move-primary, #3b82f6);
            cursor: pointer;
          }
          .controls-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
        `}</style>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setActiveTab('easing')}
              className={`tab-btn ${activeTab === 'easing' ? 'active' : ''}`}
            >
              Standard Easings
            </button>
            <button
              onClick={() => setActiveTab('spring')}
              className={`tab-btn ${activeTab === 'spring' ? 'active' : ''}`}
            >
              Spring Physics
            </button>
          </div>
        </div>

        {activeTab === 'easing' && (
          <>
            <div style={{ marginBottom: 24 }}>
              <Slider label="Duration (ms)" value={duration} onChange={setDuration} min={200} max={3000} step={100} />
            </div>
            <div className="easing-grid">
              {easings.map((easing) => (
                <button
                  key={easing}
                  className={`easing-btn ${selectedEasing === easing ? 'active' : ''}`}
                  onClick={() => setSelectedEasing(easing)}
                >
                  {easing}
                </button>
              ))}
            </div>
            <AnimationPreview key={`${selectedEasing}-${duration}`} ease={selectedEasing} duration={duration} isSpring={false} />
          </>
        )}

        {activeTab === 'spring' && (
          <>
            <div style={{ marginBottom: 24 }}>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>Presets</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                {springPresets.map((preset, i) => (
                  <button
                    key={preset.name}
                    className={`preset-btn ${selectedPreset === i ? 'active' : ''}`}
                    onClick={() => selectPreset(i)}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>Custom parameters</p>
              <div className="controls-grid">
                <Slider label="Mass" value={customParams.mass} onChange={(v) => updateParam('mass', v)} min={0.1} max={10} step={0.1} />
                <Slider label="Stiffness" value={customParams.stiffness} onChange={(v) => updateParam('stiffness', v)} min={10} max={1000} step={10} />
                <Slider label="Damping" value={customParams.damping} onChange={(v) => updateParam('damping', v)} min={1} max={100} step={1} />
                <Slider label="Velocity" value={customParams.velocity} onChange={(v) => updateParam('velocity', v)} min={0} max={10} step={0.5} />
              </div>
            </div>
            <AnimationPreview key={JSON.stringify(customParams)} ease={customParams} duration={1000} isSpring={true} />
          </>
        )}
      </div>
    </div>
  );
}
