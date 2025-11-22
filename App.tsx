import React, { useState, useEffect } from 'react';
import { Controls } from './components/Controls';
import { WristbandGrid } from './components/WristbandGrid';
import { PrintLayout } from './components/PrintLayout';
import { CoachKey } from './components/CoachKey';
import { DEFAULT_PITCHES, WRISTBAND_GRID_SIZES } from './constants';
import { PitchDefinition, SignalEntry, WristbandConfig } from './types';

const App: React.FC = () => {
  // --- State ---
  // Default to the first option (3x3 sections = 9 cols x 6 rows)
  const defaultSize = WRISTBAND_GRID_SIZES[0];
  
  const [config, setConfig] = useState<WristbandConfig>({
    title: `Game ${new Date().toLocaleDateString()}`,
    teamName: 'Reds',
    columns: defaultSize.cols,
    rows: defaultSize.rows,
    sectionSize: defaultSize.sectionSize,
    fontSize: 'medium',
    colStart: 10,
    colStep: 10,
    rowStart: 1,
    rowStep: 1,
    printWidth: 3.75, // Default width in inches
    printHeight: 2.0  // Default height in inches
  });

  const [pitches, setPitches] = useState<PitchDefinition[]>(DEFAULT_PITCHES);
  const [signals, setSignals] = useState<SignalEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  // --- Effects ---
  useEffect(() => {
    if (signals.length === 0) {
      handleReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Handlers ---
  const handleGenerate = () => {
    setError(null);
    
    // Validation: Check percentages
    const totalPercentage = pitches.reduce((sum, p) => sum + (p.percentage || 0), 0);
    
    // Use a small epsilon for float comparison logic, though integers are typical
    if (Math.abs(totalPercentage - 100) > 0.1) {
      const msg = `Error: Pitch percentages must add up to 100%.\nCurrent total: ${totalPercentage}%`;
      setError(msg);
      alert(msg); // Popup as requested
      return;
    }

    try {
      // Calculate total slots based on grid config
      const totalSlots = config.columns * config.rows;
      
      // Calculate slot counts for each pitch based on percentage (Largest Remainder Method)
      const countsAndRemainders = pitches.map((p, idx) => {
        const exactCount = totalSlots * (p.percentage / 100);
        const floorCount = Math.floor(exactCount);
        const remainder = exactCount - floorCount;
        return { id: p.id, count: floorCount, remainder, idx };
      });

      // Calculate how many slots are still missing after flooring
      const currentTotal = countsAndRemainders.reduce((sum, item) => sum + item.count, 0);
      let deficit = totalSlots - currentTotal;

      // Sort by remainder (descending) to distribute deficit
      countsAndRemainders.sort((a, b) => b.remainder - a.remainder);

      // Distribute the remaining slots
      for (let i = 0; i < deficit; i++) {
        countsAndRemainders[i].count++;
      }

      // Re-sort by index to maintain original order (optional, but clean)
      countsAndRemainders.sort((a, b) => a.idx - b.idx);

      // Build the deck
      const deck: string[] = [];
      countsAndRemainders.forEach(item => {
        for (let i = 0; i < item.count; i++) {
          deck.push(item.id);
        }
      });

      // Fallback safety: if deck is somehow larger than slots (rounding errors), trim it.
      // If smaller (e.g. 0% total), fill with first pitch or empty.
      while (deck.length > totalSlots) deck.pop();
      while (deck.length < totalSlots && pitches.length > 0) deck.push(pitches[0].id);

      // Shuffle the deck (Fisher-Yates)
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }

      // Map linear deck to grid
      const newSignals: SignalEntry[] = [];
      let listIndex = 0;

      for (let r = 0; r < config.rows; r++) {
        for (let c = 0; c < config.columns; c++) {
          if (listIndex >= deck.length) break;
          
          const rowLabel = (config.rowStart + r * config.rowStep).toString();
          const colLabel = (config.colStart + c * config.colStep).toString();
          const code = `${rowLabel}${colLabel}`;
          
          newSignals.push({
            code,
            pitchId: deck[listIndex]
          });
          
          listIndex++;
        }
      }

      setSignals(newSignals);
    } catch (err) {
      setError("Failed to generate signals. Please try again.");
      console.error(err);
    }
  };

  const handleReset = () => {
    setSignals([]);
  };

  // --- Render ---
  return (
    <div className="h-screen w-screen flex overflow-hidden bg-slate-100">
      {/* Sidebar */}
      <Controls
        config={config}
        setConfig={setConfig}
        pitches={pitches}
        setPitches={setPitches}
        onGenerate={handleGenerate}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative no-print">
        {/* Toolbar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800">Preview</h2>
            <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-full border border-slate-200">
              {config.columns * config.rows} call slots ({config.sectionSize}x{config.sectionSize} sections)
            </span>
          </div>
          {error && (
             <div className="text-red-600 text-sm bg-red-50 px-3 py-1 rounded border border-red-100 animate-pulse">
               {error}
             </div>
          )}
        </div>

        {/* Preview Canvas */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-200">
          <div className="flex flex-col xl:flex-row gap-8 justify-center items-start max-w-6xl mx-auto">
            
            {/* Player Card Preview */}
            <div className="flex flex-col gap-2 items-center flex-shrink-0">
              <h3 className="text-slate-500 text-sm font-medium">Player Card Preview</h3>
              <WristbandGrid 
                config={config} 
                signals={signals} 
                pitches={pitches} 
                isPrintMode={false}
              />
              <p className="text-xs text-slate-400 max-w-[300px] text-center">
                 Set size in left panel. Current print size: {config.printWidth}" x {config.printHeight}"
              </p>
            </div>

            {/* Coach Key Preview */}
            <div className="flex flex-col gap-2 items-center w-full max-w-xl">
              <h3 className="text-slate-500 text-sm font-medium">Coach Key Preview</h3>
              <CoachKey 
                pitches={pitches} 
                signals={signals} 
              />
            </div>

          </div>
        </div>
      </div>

      {/* Print View (Hidden on Screen) */}
      <PrintLayout 
        config={config} 
        signals={signals} 
        pitches={pitches} 
      />
    </div>
  );
};

export default App;