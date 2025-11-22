import { PitchType, PitchDefinition } from './types';

export const DEFAULT_PITCHES: PitchDefinition[] = [
  { id: 'p1', type: PitchType.FASTBALL, name: 'Fastball', color: '#86efac', abbreviation: 'FB', percentage: 35 },
  { id: 'p2', type: PitchType.CHANGEUP, name: 'Changeup', color: '#f9a8d4', abbreviation: 'CH', percentage: 20 },
  { id: 'p3', type: PitchType.CURVEBALL, name: 'Curveball', color: '#fdba74', abbreviation: 'CU', percentage: 15 },
  { id: 'p4', type: PitchType.RISEBALL, name: 'Riseball', color: '#93c5fd', abbreviation: 'RI', percentage: 10 },
  { id: 'p5', type: PitchType.DROPBALL, name: 'Dropball', color: '#c4b5fd', abbreviation: 'DR', percentage: 10 },
  { id: 'p6', type: PitchType.SCREWBALL, name: 'Screwball', color: '#67e8f9', abbreviation: 'SC', percentage: 10 },
];

export const COLORS = [
  '#ef4444', // Red
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#eab308', // Yellow
  '#a855f7', // Purple
  '#f97316', // Orange
  '#ec4899', // Pink
  '#64748b', // Slate
];

// 6 sections in a 3x2 layout
export const WRISTBAND_GRID_SIZES = [
  { label: 'Standard (3x3 Sections - 54 calls)', sectionSize: 3, cols: 9, rows: 6 },
  { label: 'Dense (4x4 Sections - 96 calls)', sectionSize: 4, cols: 12, rows: 8 },
  { label: 'Pro (5x5 Sections - 150 calls)', sectionSize: 5, cols: 15, rows: 10 },
];