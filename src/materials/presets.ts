/**
 * Material preset type definitions and default values
 */

export type MaterialKind = 'paper' | 'plastic' | 'metal' | 'glass';

export interface MaterialParams {
  roughness: number;    // 0-1: 0 = mirror-like, 1 = completely matte
  occlusion: number;    // 0-1: bottom edge darkening strength
  shadowSoftness: number;
  shadowOpacity: number;
  textureOpacity: number;
}

export const materialPresets: Record<MaterialKind, MaterialParams> = {
  paper: {
    roughness: 0.92,
    occlusion: 0.15,
    shadowSoftness: 1.5,
    shadowOpacity: 0.14,
    textureOpacity: 0.08,
  },
  plastic: {
    roughness: 0.55,
    occlusion: 0.25,
    shadowSoftness: 1.2,
    shadowOpacity: 0.2,
    textureOpacity: 0,
  },
  metal: {
    roughness: 0.18,
    occlusion: 0.12,
    shadowSoftness: 0.85,
    shadowOpacity: 0.24,
    textureOpacity: 1,
  },
  glass: {
    roughness: 0.08,
    occlusion: 0.08,
    shadowSoftness: 1.0,
    shadowOpacity: 0.1,
    textureOpacity: 0,
  },
};
