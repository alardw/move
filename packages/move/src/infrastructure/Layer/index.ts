'use client';
import { createContext, useContext } from 'react';

/**
 * Tracks the z-index layer of the nearest overlay ancestor (Dialog, Drawer, Sidebar).
 * Portaled components (Select, Popover, Dropdown, etc.) read this to ensure their
 * z-index is above the parent overlay, regardless of token ordering.
 *
 * Value is a CSS z-index number (e.g. 400 for modal). Default 0 = no overlay ancestor.
 */
const LayerContext = createContext<number>(0);

/**
 * Returns the z-index of the nearest overlay ancestor, or 0 if none.
 */
export function useLayer(): number {
  return useContext(LayerContext);
}

export const LayerProvider = LayerContext.Provider;
