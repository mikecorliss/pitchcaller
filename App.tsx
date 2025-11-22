import React, { useState, useEffect } from 'react';
import { Controls } from './components/Controls';
import { WristbandGrid } from './components/WristbandGrid';
import { PrintLayout } from './components/PrintLayout';
import { CoachKey } from './components/CoachKey';
import { DEFAULT_PITCHES, WRISTBAND_GRID_SIZES } from './constants';
import { PitchDefinition, SignalEntry, WristbandConfig } from './types';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const defaultSize = WRISTBAND_GRID_SIZES[0];
  
  const [config, setConfig] = useState<WristbandConfig>({
    title: `Game ${new Date().toLocaleDateString()}`,
    teamName: 'SOFTBALL',
    columns: defaultSize.cols,
    rows: defaultSize.rows,
    sectionSize: defaultSize.sectionSize,
    fontSize: 'medium',
    colStart: 10,
    colStep: 10,
    rowStart: 1,
    rowStep: 1,
    printWidth: 4.5,
    printHeight: 2.75
  });

  const [pitches, setPitches] = useState<PitchDefinition[]>(DEFAULT_PITCHES);
  const [signals, setSignals] = useState<SignalEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // --- Effects ---
  useEffect(() => {
    // Initial generation on mount if empty? No, let user choose.
    // Actually, let's clear on mount to force user to see the state
    handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clear messages after timeout
  useEffect(() => {
    if (error || successMsg) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccessMsg(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMsg]);

  // --- Handlers ---
  const handleGenerate = () => {
    setError(null);
    setSuccessMsg(null);
    
    const totalPercentage = pitches.reduce((sum, p) => sum + (p.percentage || 0), 0);
    
    if (Math.abs(totalPercentage - 100) > 0.1) {
      setError(`Percentages must equal 100%. Current: ${totalPercentage}%`);
      return;
    }

    try {
      const totalSlots = config.columns * config.rows;
      
      // Calculate slot counts (Largest Remainder Method)
      const countsAndRemainders = pitches.map((p, idx) => {
        const exactCount = totalSlots * (p.percentage / 100);
        const floorCount = Math.floor(exactCount);
        const remainder = exactCount - floorCount;
        return { id: p.id, count: floorCount, remainder, idx };
      });

      const currentTotal = countsAndRemainders.reduce((sum, item) => sum + item.count, 0);
      let deficit = totalSlots - currentTotal;

      countsAndRemainders.sort((a, b) => b.remainder - a.remainder);

      for (let i = 0; i < deficit; i++) {
        countsAndRemainders[i].count++;
      }

      countsAndRemainders.sort((a, b) => a.idx - b.idx);

      const deck: string[] = [];
      countsAndRemainders.forEach(item => {
        for (let i = 0; i < item.count; i++) {
          deck.push(item.id);
        }
      });

      // Fisher-Yates Shuffle
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }

      const newSignals: SignalEntry[] = [];
      let listIndex = 0;

      for (let r = 0; r < config.rows; r++) {
        for (let c = 0; c < config.columns; c++) {
          if (listIndex >= deck.length) break;
          const rowLabel = (config.rowStart + r * config.rowStep).toString();
          const colLabel = (config.colStart + c * config.colStep).toString();
          newSignals.push({
            code: `${rowLabel}${colLabel}`,
            pitchId: deck[listIndex]
          });
          listIndex++;
        }
      }

      setSignals(newSignals);
      setSuccessMsg("Signal grid generated successfully!");
    } catch (err) {
      setError("Failed to generate signals.");
      console.error(err);
    }
  };

  const handleReset = () => {
    setSignals([]);
    setError(null);
    setSuccessMsg(null);
  };

  // --- Render ---
  return (
    <div className="h-screen w-screen flex overflow-hidden bg-slate-100 font-sans text-slate-900">
      {/* Sidebar */}
      <Controls
        config={config}
        setConfig={setConfig}
        pitches={pitches}
        setPitches={setPitches}
        onGenerate={handleGenerate}
        onReset={handleReset}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative no-print">
        
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-700">Wristband Preview</h2>
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              <span>{config.columns * config.rows} slots</span>
              <span>•</span>
              <span>{config.sectionSize}x{config.sectionSize} grid</span>
            </div>
          </div>

          {/* Alerts */}
          <div className="flex items-center gap-4">
             {error && (
               <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-1.5 rounded-md border border-red-100 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                 <AlertCircle size={16} />
                 {error}
               </div>
             )}
             {successMsg && (
               <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-1.5 rounded-md border border-green-100 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                 <CheckCircle2 size={16} />
                 {successMsg}
               </div>
             )}
          </div>
        </div>

        {/* Preview Canvas */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-100/50">
          <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-10 items-start justify-center">
            
            {/* Player Card Preview */}
            <div className="flex flex-col gap-4 items-center flex-shrink-0 w-full xl:w-auto">
              <div className="bg-white p-1 rounded-2xl shadow-xl border border-slate-200">
                 {/* Render actual preview */}
                 <div className="p-4 bg-white rounded-xl">
                    <WristbandGrid 
                      config={config} 
                      signals={signals} 
                      pitches={pitches} 
                      isPrintMode={false}
                    />
                 </div>
              </div>
              <p className="text-xs font-medium text-slate-400 text-center">
                 Actual Print Size: {config.printWidth}" x {config.printHeight}"
              </p>
            </div>

            {/* Coach Key Preview */}
            <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto xl:mx-0">
               <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 w-full">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Coach Key Preview</h3>
                  <CoachKey 
                    pitches={pitches} 
                    signals={signals} 
                  />
               </div>
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