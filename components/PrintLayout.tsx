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
    <div className="w-full bg-white flex flex-col items-center justify-start py-8 md:py-12 min-h-screen print:py-0 print:h-auto">
        
        {/* PLAYER CARD 1 */}
        <div className="flex flex-col items-center mb-8 print:mb-4">
             <div className="mb-2 text-slate-400 text-xs font-medium uppercase tracking-wider print:hidden">Player Card 1</div>
             <WristbandGrid config={config} signals={signals} pitches={pitches} isPrintMode={true} />
        </div>

        {/* PLAYER CARD 2 */}
        <div className="flex flex-col items-center mb-12 print:mb-8">
             <div className="mb-2 text-slate-400 text-xs font-medium uppercase tracking-wider print:hidden">Player Card 2</div>
             <WristbandGrid config={config} signals={signals} pitches={pitches} isPrintMode={true} />
        </div>

        {/* COACHES KEY */}
        <div className="flex flex-col items-center mb-4">
             <div className="mb-2 text-slate-400 text-xs font-medium uppercase tracking-wider print:hidden">Coach Key</div>
             <CoachKey 
               pitches={pitches} 
               signals={signals} 
               width={config.coachPrintWidth} 
               height={config.coachPrintHeight} 
             />
        </div>

        {/* Footer Info */}
        <div className="text-[10px] text-gray-400 text-center w-full mt-auto mb-4 print:text-[8px] print:mb-0">
           PitchCaller &bull; Generated Wristband &bull; Player: {config.printWidth}"x{config.printHeight}" / Coach: {config.coachPrintWidth}"x{config.coachPrintHeight}"
        </div>

    </div>
  );
};