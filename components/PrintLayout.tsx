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
    <div className="print-only w-full bg-white flex flex-col items-center justify-start pt-8 pb-8">
        
        {/* PLAYER CARD */}
        <div className="flex flex-col items-center mb-10">
             <WristbandGrid config={config} signals={signals} pitches={pitches} isPrintMode={true} />
        </div>

        {/* DASHED SEPARATOR */}
        <div className="w-full max-w-[5in] border-t-2 border-dashed border-gray-300 flex justify-center relative mb-10">
           <span className="bg-white px-2 text-[10px] text-gray-400 absolute -top-2">Cut Here</span>
        </div>

        {/* COACHES KEY */}
        <div className="flex flex-col items-center mb-8">
             <CoachKey 
               pitches={pitches} 
               signals={signals} 
               width={config.printWidth} 
               height={config.printHeight} 
             />
        </div>

        {/* Footer Info */}
        <div className="text-[8px] text-gray-400 text-center w-full mt-4">
           PitchCaller AI &bull; Generated Wristband &bull; {config.printWidth}" x {config.printHeight}"
        </div>

    </div>
  );
};