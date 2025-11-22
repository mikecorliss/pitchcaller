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
    border: '2px solid black',
    boxSizing: 'border-box'
  } : {};
  
  const textSizeClass = hasFixedSize ? 'text-[9px]' : 'text-xs';

  return (
    <div 
      className={`bg-white shadow-sm flex flex-col ${textSizeClass} ${hasFixedSize ? '' : 'w-full max-w-3xl border-2 border-black rounded-lg overflow-hidden min-h-[300px]'}`}
      style={containerStyle}
    >
      <div className="bg-slate-900 text-white text-center font-bold border-b-2 border-black py-1 uppercase leading-none flex-shrink-0 print:bg-black print:text-white">
        Coaches Key
      </div>
      <div className="flex flex-col flex-1 bg-white w-full">
        {pitches.map((pitch) => {
          const codes = getCodesForPitch(pitch.id);
          return (
            <div key={pitch.id} className="flex border-b border-black last:border-b-0 flex-1 w-full min-h-0">
              {/* Label */}
              <div 
                className="w-[25%] px-1 font-bold border-r border-black flex items-center justify-center text-center print:print-color-adjust-exact break-words"
                style={{ backgroundColor: pitch.color, color: getContrastColor(pitch.color) }}
              >
                {pitch.name}
              </div>
              {/* Codes */}
              <div className="flex-1 flex flex-wrap content-stretch">
                {codes.length > 0 ? (
                  codes.map((code, idx) => (
                    <div 
                      key={idx} 
                      className="flex-grow flex items-center justify-center font-bold text-black leading-none border-r border-b border-gray-200 border-dashed last:border-r-0 min-w-[2em] p-0.5"
                    >
                      {code}
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-300 italic bg-slate-50/50">
                    -
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Pitch Out / Special Row */}
        <div className="flex border-black bg-white text-black print:bg-white flex-1 min-h-0">
          <div className="w-[25%] px-1 font-bold border-r border-black flex items-center justify-center text-center bg-gray-200 print:bg-gray-300 leading-none">
            PITCH OUT
          </div>
          <div className="flex-1 flex items-stretch">
            <div className="flex-1 flex items-center justify-center font-bold border-r border-gray-200 border-dashed">333</div>
            <div className="flex-1 flex items-center justify-center font-bold">999</div>
          </div>
        </div>
      </div>
    </div>
  );
};
