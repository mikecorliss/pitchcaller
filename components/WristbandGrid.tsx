import React from 'react';
import { SignalEntry, PitchDefinition, WristbandConfig } from '../types';

interface WristbandGridProps {
  config: WristbandConfig;
  signals: SignalEntry[];
  pitches: PitchDefinition[];
  isPrintMode?: boolean;
}

export const WristbandGrid: React.FC<WristbandGridProps> = ({ config, signals, pitches, isPrintMode = false }) => {
  // Generate all headers first
  const allColHeaders = Array.from({ length: config.columns }).map((_, i) => 
    (config.colStart + i * config.colStep).toString()
  );
  
  const allRowHeaders = Array.from({ length: config.rows }).map((_, i) => 
    (config.rowStart + i * config.rowStep).toString()
  );

  const sectionSize = config.sectionSize || 3;
  
  // Helper to get pitch content
  const getCellContent = (rowLabel: string, colLabel: string) => {
    const code = `${rowLabel}${colLabel}`;
    const signal = signals.find(s => s.code === code);
    const pitch = signal ? pitches.find(p => p.id === signal.pitchId) : null;
    return { code, pitch };
  };

  // Dynamic text sizing optimized for print
  const getFontSize = () => {
    if (!isPrintMode) return { base: 'text-sm', abbr: 'text-sm', header: 'text-xs' };
    
    // User requested Dense and Pro sizes to match Standard
    // Standard sizes:
    return { base: 'text-[9px]', abbr: 'text-[8.5px]', header: 'text-[8px]' };
  };

  const { abbr: abbrTextSize, header: headerTextSize } = getFontSize();

  // Helper to render a single section
  const renderSection = (sectionRowIndex: number, sectionColIndex: number) => {
    const rowStart = sectionRowIndex * sectionSize;
    const rowEnd = rowStart + sectionSize;
    const colStart = sectionColIndex * sectionSize;
    const colEnd = colStart + sectionSize;

    const sectionRows = allRowHeaders.slice(rowStart, rowEnd);
    const sectionCols = allColHeaders.slice(colStart, colEnd);

    return (
      <div className="flex flex-col border border-black bg-white flex-1 h-full box-border">
        {/* Column Headers */}
        <div className="flex border-b border-black bg-slate-200 h-[15%] print:bg-gray-200">
          {/* Corner spacer */}
          <div className="border-r border-black w-[15%] flex-shrink-0 bg-slate-300 print:bg-gray-300"></div>
          {sectionCols.map((header, i) => (
            <div 
              key={`h-${i}`} 
              className={`flex-1 flex items-center justify-center font-bold text-black leading-none border-r border-black last:border-r-0 ${headerTextSize}`}
            >
              {header}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="flex-1 flex flex-col">
          {sectionRows.map((rowLabel, rIdx) => (
            <div 
              key={`r-${rIdx}`} 
              className="flex flex-1 border-b border-black last:border-b-0"
            >
              {/* Row Header */}
              <div 
                className={`font-bold bg-slate-200 print:bg-gray-200 flex items-center justify-center border-r border-black w-[15%] flex-shrink-0 leading-none ${headerTextSize}`}
              >
                {rowLabel}
              </div>

              {/* Cells */}
              {sectionCols.map((colLabel, cIdx) => {
                const { pitch } = getCellContent(rowLabel, colLabel);
                return (
                  <div 
                    key={`c-${cIdx}`} 
                    className="flex-1 flex items-center justify-center border-r border-black last:border-r-0 relative overflow-hidden print:print-color-adjust-exact"
                    style={{ backgroundColor: pitch ? pitch.color : 'white' }}
                  >
                    {pitch && (
                      <span 
                        className={`font-black leading-none ${abbrTextSize}`}
                        style={{ color: getContrastColor(pitch.color) }}
                      >
                        {pitch.abbreviation}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Layout constants
  const gapClass = isPrintMode ? 'gap-[2px]' : 'gap-2';
  const containerPadding = isPrintMode ? 'p-[2px]' : 'p-2';

  // Dynamic dimensions for print
  const containerStyle = isPrintMode ? { 
    width: `${config.printWidth}in`,
    height: `${config.printHeight}in`,
    border: '2px solid black',
    boxSizing: 'border-box' as const
  } : {};

  return (
    <div 
      className={`bg-white overflow-hidden flex flex-col ${isPrintMode ? '' : 'w-full max-w-4xl rounded-xl shadow-2xl border border-slate-800'}`}
      style={containerStyle}
    >
      {/* Header - Customizable */}
      <div className={`bg-black border-b-2 border-black flex items-center justify-center flex-shrink-0 ${isPrintMode ? 'h-[11%]' : 'p-2'}`}>
         <h2 className={`font-bold text-white uppercase leading-none text-center tracking-wider ${isPrintMode ? 'text-[10px]' : 'text-xl'}`}>
           {config.teamName}
         </h2>
      </div>

      {/* Grid Container - Split into 6 sections with gaps */}
      <div className={`flex-1 flex flex-col bg-black ${gapClass} ${containerPadding}`}>
        
        {/* Top Half (Sections 1, 2, 3) */}
        <div className={`flex-1 flex ${gapClass}`}>
          {renderSection(0, 0)}
          {renderSection(0, 1)}
          {renderSection(0, 2)}
        </div>

        {/* Bottom Half (Sections 4, 5, 6) */}
        <div className={`flex-1 flex ${gapClass}`}>
          {renderSection(1, 0)}
          {renderSection(1, 1)}
          {renderSection(1, 2)}
        </div>
      </div>

      {/* Pitch Out Footer */}
      <div className={`bg-white border-t-2 border-black flex items-center justify-between px-3 flex-shrink-0 ${isPrintMode ? 'h-[9%]' : 'p-1.5'}`}>
          <span className={`font-bold uppercase leading-none ${isPrintMode ? 'text-[7px]' : 'text-sm'}`}>Pitch Out</span>
          <div className={`flex gap-4 font-bold leading-none ${isPrintMode ? 'text-[7px]' : 'text-sm'}`}>
            <span>333</span>
            <span>999</span>
          </div>
      </div>
    </div>
  );
};

function getContrastColor(hexColor: string) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return (r * 0.299 + g * 0.587 + b * 0.114) > 140 ? 'black' : 'white';
}