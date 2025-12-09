import { PitchType, PitchDefinition } from './types';

export const COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#64748b', // Slate
];

export const DEFAULT_PITCHES: PitchDefinition[] = [
  { id: 'p1', type: PitchType.FASTBALL, name: 'Fastball', color: '#ef4444', abbreviation: 'FB', percentage: 35 },
  { id: 'p2', type: PitchType.CHANGEUP, name: 'Changeup', color: '#f97316', abbreviation: 'CH', percentage: 20 },
  { id: 'p3', type: PitchType.CURVEBALL, name: 'Curveball', color: '#eab308', abbreviation: 'CU', percentage: 15 },
  { id: 'p4', type: PitchType.RISEBALL, name: 'Riseball', color: '#22c55e', abbreviation: 'RI', percentage: 10 },
  { id: 'p5', type: PitchType.DROPBALL, name: 'Dropball', color: '#3b82f6', abbreviation: 'DR', percentage: 10 },
  { id: 'p6', type: PitchType.SCREWBALL, name: 'Screwball', color: '#a855f7', abbreviation: 'SC', percentage: 10 },
];

// 6 sections in a 3x2 layout
export const WRISTBAND_GRID_SIZES = [
  { label: 'Standard (3x3 Sections - 54 calls)', sectionSize: 3, cols: 9, rows: 6 },
  { label: 'Dense (4x4 Sections - 96 calls)', sectionSize: 4, cols: 12, rows: 8 },
  { label: 'Pro (5x5 Sections - 150 calls)', sectionSize: 5, cols: 15, rows: 10 },
];