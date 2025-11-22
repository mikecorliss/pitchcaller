import React from 'react';
import { PitchDefinition, SignalEntry } from '../types';

interface CoachKeyProps {
  pitches: PitchDefinition[];
  signals: SignalEntry[];
  width?: number;
  height?: number;
}

export const CoachKey: React.FC<CoachKeyProps> = ({ pitches, signals, width, height }) => {
  const getCodesForPitch = (pitchId: string) => {
    return signals
      .filter(s => s.pitchId === pitchId)
      .map(s => s.code)
      .sort();
  };

  function getContrastColor(hexColor: string) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) > 140 ? 'black' : 'white';
  }

  const hasFixedSize = width !== undefined && height !== undefined;

  const containerStyle: React.CSSProperties = hasFixedSize ? {
    width: `${width}in`,
    height: `${height}in`,
    // Explicitly set border styling here to match WristbandGrid's implementation
    border: '2px solid black',
    boxSizing: 'border-box' 
  } : {};
  
  // Scale text for print mode if small
  const textSizeClass = hasFixedSize ? 'text-[8px]' : 'text-xs';
  const rowHeightClass = hasFixedSize ? 'flex-1' : ''; // Distribute vertical space if fixed size

  return (
    <div 
      className={`overflow-hidden bg-white shadow-sm flex flex-col ${textSizeClass} ${hasFixedSize ? '' : 'w-full max-w-3xl border-2 border-black'}`}
      style={containerStyle}
    >
      <div className="bg-blue-300 text-center font-bold border-b-2 border-black py-[2px] uppercase text-black leading-none flex-shrink-0">
        Coaches Key
      </div>
      <div className="flex flex-col flex-1">
        {pitches.map((pitch) => {
          const codes = getCodesForPitch(pitch.id);
          return (
            <div key={pitch.id} className={`flex border-b border-black last:border-b-0 ${rowHeightClass}`}>
              <div 
                className="w-[25%] px-1 font-bold border-r border-black flex items-center justify-center flex-shrink-0 leading-none"
                style={{ backgroundColor: pitch.color, color: getContrastColor(pitch.color) }}
              >
                {pitch.name}
              </div>
              <div className="flex-1 flex bg-white items-center content-center overflow-hidden">
                {codes.length > 0 ? (
                  codes.map((code, idx) => (
                    <div 
                      key={idx} 
                      className="flex-1 border-r border-black last:border-r-0 flex items-center justify-center font-bold text-black leading-none h-full"
                    >
                      {code}
                    </div>
                  ))
                ) : (
                  <div className="p-1 text-gray-400 italic px-2 text-[6px] flex items-center">No signals</div>
                )}
              </div>
            </div>
          );
        })}
        <div className={`flex border-black bg-gray-300 text-black ${rowHeightClass}`}>
          <div className="w-[25%] px-1 font-bold border-r border-black flex items-center justify-center leading-none">Pitch Out</div>
          <div className="flex-1 flex items-center">
            <div className="flex-1 border-r border-black px-1 flex items-center justify-center font-bold leading-none h-full">333</div>
            <div className="flex-1 border-r border-black px-1 flex items-center justify-center font-bold leading-none h-full">999</div>
            <div className="flex-[2]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};