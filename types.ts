export enum PitchType {
  FASTBALL = 'FB',
  CHANGEUP = 'CH',
  CURVEBALL = 'CU',
  SCREWBALL = 'SC',
  RISEBALL = 'RI',
  DROPBALL = 'DR',
  SLIDER = 'SL',
  KNUCKLE = 'KN'
}

export interface PitchDefinition {
  id: string;
  type: PitchType;
  name: string;
  color: string;
  abbreviation: string;
  percentage: number;
}

export interface SignalEntry {
  code: string; // e.g., "110", "120"
  pitchId: string;
}

export interface WristbandConfig {
  title: string;
  teamName: string;
  columns: number;
  rows: number;
  sectionSize: number; // 3, 4, or 5
  fontSize: 'small' | 'medium' | 'large';
  // Labels for the grid axes
  colStart: number; // e.g. 10
  colStep: number;  // e.g. 10
  rowStart: number; // e.g. 1
  rowStep: number;  // e.g. 1
  
  // Dimensions in inches
  printWidth: number;
  printHeight: number;
}

export interface GenerationParams {
  pitchDistribution: Record<string, number>;
  description: string; 
}