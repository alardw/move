import { useState, createContext, useContext, type ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button, springs, easings } from 'move';
import type { AnimationPreset } from 'move';

// =============================================================================
// Types
// =============================================================================

export interface PropertyValue {
  from: number;
  to: number;
  easing: AnimationPreset;
}

export interface AnimationValues {
  opacity: PropertyValue;
  scale: PropertyValue;
  x: PropertyValue;
  y: PropertyValue;
  duration: number;
}

export interface TargetAnimations {
  enter: AnimationValues;
  exit: AnimationValues;
}

interface PlaygroundContextValue {
  targets: Record<string, TargetAnimations>;
  setTarget: (name: string, type: 'enter' | 'exit', values: AnimationValues) => void;
  resetKey: number;
  reset: () => void;
}

// =============================================================================
// Defaults
// =============================================================================

const defaultOverlayEnter: AnimationValues = {
  opacity: { from: 0, to: 1, easing: 'outQuart' },
  scale: { from: 1, to: 1, easing: 'outQuart' },
  x: { from: 0, to: 0, easing: 'outQuart' },
  y: { from: 0, to: 0, easing: 'outQuart' },
  duration: 200,
};

const defaultOverlayExit: AnimationValues = {
  opacity: { from: 1, to: 0, easing: 'outQuart' },
  scale: { from: 1, to: 1, easing: 'outQuart' },
  x: { from: 0, to: 0, easing: 'outQuart' },
  y: { from: 0, to: 0, easing: 'outQuart' },
  duration: 150,
};

const defaultContentEnter: AnimationValues = {
  opacity: { from: 0, to: 1, easing: 'outQuart' },
  scale: { from: 0.9, to: 1, easing: 'snappy' },
  x: { from: 0, to: 0, easing: 'snappy' },
  y: { from: 0, to: 0, easing: 'snappy' },
  duration: 200,
};

const defaultContentExit: AnimationValues = {
  opacity: { from: 1, to: 0, easing: 'outQuart' },
  scale: { from: 1, to: 0.95, easing: 'outQuart' },
  x: { from: 0, to: 0, easing: 'outQuart' },
  y: { from: 0, to: 0, easing: 'outQuart' },
  duration: 150,
};

const defaultTargets: Record<string, TargetAnimations> = {
  overlay: { enter: defaultOverlayEnter, exit: defaultOverlayExit },
  content: { enter: defaultContentEnter, exit: defaultContentExit },
};

// =============================================================================
// Context
// =============================================================================

const PlaygroundContext = createContext<PlaygroundContextValue | null>(null);

export function usePlayground() {
  const context = useContext(PlaygroundContext);
  if (!context) {
    throw new Error('Playground components must be used within Playground.Root');
  }
  return context;
}

// =============================================================================
// Helper to convert AnimationValues to animate prop
// =============================================================================

/**
 * Convert AnimationValues to the animate prop format with per-property easing.
 */
export function toAnimateProp(anim: TargetAnimations) {
  return {
    enter: {
      opacity: { value: [anim.enter.opacity.from, anim.enter.opacity.to], easing: anim.enter.opacity.easing },
      scale: { value: [anim.enter.scale.from, anim.enter.scale.to], easing: anim.enter.scale.easing },
      x: { value: [anim.enter.x.from, anim.enter.x.to], easing: anim.enter.x.easing },
      y: { value: [anim.enter.y.from, anim.enter.y.to], easing: anim.enter.y.easing },
      duration: anim.enter.duration,
    },
    exit: {
      opacity: { value: [anim.exit.opacity.from, anim.exit.opacity.to], easing: anim.exit.opacity.easing },
      scale: { value: [anim.exit.scale.from, anim.exit.scale.to], easing: anim.exit.scale.easing },
      x: { value: [anim.exit.x.from, anim.exit.x.to], easing: anim.exit.x.easing },
      y: { value: [anim.exit.y.from, anim.exit.y.to], easing: anim.exit.y.easing },
      duration: anim.exit.duration,
    },
  };
}

// =============================================================================
// Root
// =============================================================================

interface RootProps {
  children: ReactNode;
}

function Root({ children }: RootProps) {
  const [targets, setTargets] = useState<Record<string, TargetAnimations>>(defaultTargets);
  const [resetKey, setResetKey] = useState(0);

  const setTarget = (name: string, type: 'enter' | 'exit', values: AnimationValues) => {
    setTargets((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        [type]: values,
      },
    }));
    // Increment key to force preview remount with new animation settings
    setResetKey((k) => k + 1);
  };

  const reset = () => {
    setTargets(defaultTargets);
    setResetKey((k) => k + 1);
  };

  return (
    <PlaygroundContext.Provider value={{ targets, setTarget, resetKey, reset }}>
      <div className="playground-root">
        {children}
      </div>
    </PlaygroundContext.Provider>
  );
}

// =============================================================================
// Preview Area
// =============================================================================

interface PreviewProps {
  children: ReactNode;
}

function Preview({ children }: PreviewProps) {
  const { resetKey } = usePlayground();

  return (
    <div className="playground-preview" key={resetKey}>
      {children}
    </div>
  );
}

// =============================================================================
// Controls Container
// =============================================================================

interface ControlsProps {
  children: ReactNode;
  title?: string;
}

function Controls({ children, title = 'Animation Settings' }: ControlsProps) {
  const { reset } = usePlayground();

  return (
    <div className="playground-controls">
      <div className="playground-controls-header">
        <span className="playground-controls-title">{title}</span>
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw size={14} />
          Reset
        </Button>
      </div>
      <div className="playground-controls-content">
        {children}
      </div>
    </div>
  );
}

// =============================================================================
// Target Section (groups enter/exit for a target)
// =============================================================================

interface TargetSectionProps {
  target: string;
  title: string;
}

function TargetSection({ target, title }: TargetSectionProps) {
  return (
    <div className="playground-target">
      <h4 className="playground-target-title">{title}</h4>
      <div className="playground-target-panels">
        <AnimationPanel target={target} type="enter" />
        <AnimationPanel target={target} type="exit" />
      </div>
    </div>
  );
}

// =============================================================================
// Animation Panel (Enter or Exit for a specific target)
// =============================================================================

interface AnimationPanelProps {
  target: string;
  type: 'enter' | 'exit';
  title?: string;
}

// Generate options from library exports
const springOptions = Object.keys(springs);
const curveOptions = [...easings];

function AnimationPanel({ target, type, title }: AnimationPanelProps) {
  const { targets, setTarget } = usePlayground();
  const values = targets[target]?.[type] ?? defaultContentEnter;

  const update = (key: keyof AnimationValues, value: unknown) => {
    setTarget(target, type, { ...values, [key]: value });
  };

  const updateProperty = (key: 'opacity' | 'scale' | 'x' | 'y', prop: keyof PropertyValue, value: number | string) => {
    setTarget(target, type, {
      ...values,
      [key]: { ...values[key], [prop]: value },
    });
  };

  return (
    <div className="playground-panel">
      <h5 className="playground-panel-title">{title ?? (type === 'enter' ? 'Enter' : 'Exit')}</h5>

      <div className="playground-fields">
        {/* Opacity */}
        <PropertyField
          label="Opacity"
          value={values.opacity}
          min={0}
          max={1}
          step={0.1}
          onChange={(prop, val) => updateProperty('opacity', prop, val)}
        />

        {/* Scale */}
        <PropertyField
          label="Scale"
          value={values.scale}
          min={0}
          max={2}
          step={0.05}
          onChange={(prop, val) => updateProperty('scale', prop, val)}
        />

        {/* X */}
        <PropertyField
          label="X"
          value={values.x}
          min={-500}
          max={500}
          step={5}
          onChange={(prop, val) => updateProperty('x', prop, val)}
        />

        {/* Y */}
        <PropertyField
          label="Y"
          value={values.y}
          min={-500}
          max={500}
          step={5}
          onChange={(prop, val) => updateProperty('y', prop, val)}
        />

        {/* Duration */}
        <div className="playground-field">
          <label className="playground-field-label">Duration (ms)</label>
          <input
            type="text"
            className="playground-input"
            defaultValue={values.duration}
            key={`duration-${values.duration}`}
            onBlur={(e) => {
              const parsed = parseInt(e.target.value, 10);
              if (!isNaN(parsed)) {
                update('duration', Math.min(2000, Math.max(0, parsed)));
              }
            }}
          />
          <span className="playground-field-hint">Ignored for springs</span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Property Field (from/to + easing)
// =============================================================================

interface PropertyFieldProps {
  label: string;
  value: PropertyValue;
  min: number;
  max: number;
  step: number;
  onChange: (prop: keyof PropertyValue, value: number | string) => void;
}

function PropertyField({ label, value, min, max, step: _step, onChange }: PropertyFieldProps) {
  const handleBlur = (prop: 'from' | 'to', inputValue: string) => {
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      const clamped = Math.min(max, Math.max(min, parsed));
      onChange(prop, clamped);
    }
  };

  return (
    <div className="playground-property">
      <label className="playground-property-label">{label}</label>
      <div className="playground-property-row">
        <input
          type="text"
          className="playground-input playground-input-sm"
          defaultValue={value.from}
          key={`from-${value.from}`}
          onBlur={(e) => handleBlur('from', e.target.value)}
        />
        <span className="playground-arrow">→</span>
        <input
          type="text"
          className="playground-input playground-input-sm"
          defaultValue={value.to}
          key={`to-${value.to}`}
          onBlur={(e) => handleBlur('to', e.target.value)}
        />
        <select
          className="playground-select playground-select-sm"
          value={value.easing}
          onChange={(e) => onChange('easing', e.target.value)}
        >
          <optgroup label="Springs">
            {springOptions.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </optgroup>
          <optgroup label="Curves">
            {curveOptions.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </optgroup>
        </select>
      </div>
    </div>
  );
}

// =============================================================================
// Export
// =============================================================================

export const Playground = {
  Root,
  Preview,
  Controls,
  TargetSection,
  AnimationPanel,
};
