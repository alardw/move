'use client';
import { createContext, useContext } from 'react';

export type SurfaceTone = 'base' | 'subtle';

const SurfaceContext = createContext<SurfaceTone>('base');

/**
 * Returns the current surface tone from the nearest ancestor that provides one.
 */
export function useSurface(): SurfaceTone {
  return useContext(SurfaceContext);
}

/**
 * Returns the flipped surface tone — what a child container should become.
 * Use this in components that take on a background (Card, Drawer, Dialog, etc.)
 * to automatically alternate: base ↔ subtle.
 */
export function useSurfaceFlip(): SurfaceTone {
  const current = useContext(SurfaceContext);
  return current === 'base' ? 'subtle' : 'base';
}

export const SurfaceProvider = SurfaceContext.Provider;
