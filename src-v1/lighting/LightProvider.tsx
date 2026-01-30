'use client';

import * as React from 'react';
import './lighting.css';

interface LightingConfig {
  angle: number;
  ambient: number;
  key: number;
}

interface LightingContextValue extends LightingConfig {
  lx: number;
  ly: number;
  setAngle: (angle: number) => void;
  setAmbient: (ambient: number) => void;
  setKey: (key: number) => void;
}

const LightingContext = React.createContext<LightingContextValue | null>(null);

const DEFAULT_CONFIG: LightingConfig = {
  angle: 315,    // top-left (classic UI lighting)
  ambient: 0.35,
  key: 1,
};

function angleToVector(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    lx: Math.cos(rad),
    ly: Math.sin(rad),
  };
}

export interface LightProviderProps {
  /** Light angle in degrees. 0 = right, 90 = bottom, 180 = left, 270/315 = top-left */
  angle?: number;
  /** Ambient light intensity (0-1). Higher = softer shadows */
  ambient?: number;
  /** Key light intensity (0-1). Controls specular highlight strength */
  intensity?: number;
  children: React.ReactNode;
}

export function LightProvider({
  angle: initialAngle = DEFAULT_CONFIG.angle,
  ambient: initialAmbient = DEFAULT_CONFIG.ambient,
  intensity: initialKey = DEFAULT_CONFIG.key,
  children,
}: LightProviderProps) {
  const [angle, setAngle] = React.useState(initialAngle);
  const [ambient, setAmbient] = React.useState(initialAmbient);
  const [key, setKey] = React.useState(initialKey);

  const { lx, ly } = angleToVector(angle);

  const vars = {
    '--light-lx': lx.toFixed(4),
    '--light-ly': ly.toFixed(4),
    '--light-angle': `${angle}deg`,
    '--light-ambient': ambient,
    '--light-key': key,
  } as React.CSSProperties;

  const value = React.useMemo<LightingContextValue>(() => ({
    angle,
    ambient,
    key,
    lx,
    ly,
    setAngle,
    setAmbient,
    setKey,
  }), [angle, ambient, key, lx, ly]);

  return (
    <LightingContext.Provider value={value}>
      <div style={vars} data-light-root="">
        {children}
      </div>
    </LightingContext.Provider>
  );
}

export function useLighting(): LightingContextValue {
  const ctx = React.useContext(LightingContext);

  if (!ctx) {
    // Fallback to defaults if no provider (graceful degradation)
    const { lx, ly } = angleToVector(DEFAULT_CONFIG.angle);
    return {
      ...DEFAULT_CONFIG,
      lx,
      ly,
      setAngle: () => {},
      setAmbient: () => {},
      setKey: () => {},
    };
  }

  return ctx;
}

LightProvider.displayName = 'LightProvider';
