import { PitchDefinition } from "../types";

// This service is deprecated. 
// The application now uses client-side randomization logic in App.tsx 
// to ensure no API key is required.

export const generatePitchList = async (
  pitches: PitchDefinition[],
  totalCount: number,
  description: string
): Promise<string[]> => {
  console.warn("AI generation is disabled. Using local randomization.");
  return [];
};