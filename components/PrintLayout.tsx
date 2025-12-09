import React from 'react';
import { WristbandGrid } from './WristbandGrid';
import { CoachKey } from './CoachKey';
import { WristbandConfig, SignalEntry, PitchDefinition } from '../types';

interface PrintLayoutProps {
  config: WristbandConfig;
  signals: SignalEntry[];
  pitches: PitchDefinition[];
}

export const PrintLayout: React.FC<PrintLayoutProps> = ({ config, signals, pitches }) => {
  return (
    <div className="print-only w-full bg-white flex flex-col items-center justify-start py-4 min-h-screen">
        
        {/* PLAYER CARD */}
        <div className="flex flex-col items-center mb-6">
             <WristbandGrid config={config} signals={signals} pitches={pitches} isPrintMode={true} />
        </div>

        {/* DASHED SEPARATOR */}
        <div className="w-full max-w-[5in] border-t-2 border-dashed border-gray-300 flex justify-center relative mb-6">
           <span className="bg-white px-2 text-[10px] text-gray-400 absolute -top-2">Cut Here</span>
        </div>

        {/* COACHES KEY */}
        <div className="flex flex-col items-center mb-4">
             <CoachKey 
               pitches={pitches} 
               signals={signals} 
               width={config.coachPrintWidth} 
               height={config.coachPrintHeight} 
             />
        </div>

        {/* Footer Info */}
        <div className="text-[8px] text-gray-400 text-center w-full mt-auto mb-2">
           PitchCaller &bull; Generated Wristband &bull; Player: {config.printWidth}"x{config.printHeight}" / Coach: {config.coachPrintWidth}"x{config.coachPrintHeight}"
        </div>

    </div>
  );
};