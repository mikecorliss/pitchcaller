import React, { useState, useEffect } from 'react';
import { Controls } from './components/Controls';
import { PrintLayout } from './components/PrintLayout';
import { DEFAULT_PITCHES, WRISTBAND_GRID_SIZES } from './constants';
import { PitchDefinition, SignalEntry, WristbandConfig } from './types';
import { AlertCircle, CheckCircle2, Printer } from 'lucide-react';

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
    printWidth: 3.75,
    printHeight: 2.25,
    coachPrintWidth: 6,
    coachPrintHeight: 4
  });

  const [pitches, setPitches] = useState<PitchDefinition[]>(DEFAULT_PITCHES);
  const [signals, setSignals] = useState<SignalEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- Effects ---
  useEffect(() => {
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
    
    // Close sidebar on mobile after generation
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
    
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-100 print:bg-white font-sans text-slate-900">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Wrapper */}
      <div className={`
        fixed inset-y-0 left-0 z-50 h-full w-[85vw] max-w-sm bg-white shadow-2xl lg:shadow-none 
        transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-auto lg:z-40 lg:sticky lg:top-0 lg:h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Close Button (Absolute positioned over the Controls header) */}
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-5 right-4 z-50 p-2 text-slate-400 hover:text-white lg:hidden focus:outline-none"
          aria-label="Close sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <Controls
          config={config}
          setConfig={setConfig}
          pitches={pitches}
          setPitches={setPitches}
          onGenerate={handleGenerate}
          onReset={handleReset}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen relative lg:pt-0 pt-16 print:pt-0">
        
        {/* Mobile Header (Fixed) */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-4 z-40 shadow-md print:hidden">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Open sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 100 100" className="w-8 h-8 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="#FACC15" stroke="#EAB308" strokeWidth="2" />
                <path d="M28 20 C 12 35, 12 65, 28 80" fill="none" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />
                <path d="M72 20 C 88 35, 88 65, 72 80" fill="none" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />
                <path d="M20 28 l 10 -4 M16 40 l 10 -2 M15 50 l 10 0 M16 60 l 10 2 M20 72 l 10 4" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
                <path d="M70 24 l 10 4 M74 40 l 10 2 M75 50 l 10 0 M74 60 l 10 -2 M70 76 l 10 -4" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span className="font-bold text-lg tracking-tight">PitchCaller</span>
            </div>
          </div>
          {signals.length > 0 && (
             <button
               onClick={() => window.print()}
               className="flex items-center gap-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 px-3 py-1.5 rounded text-white shadow-sm transition-colors"
             >
               <Printer size={16} />
               PRINT
             </button>
          )}
        </div>
        
        {/* Floating Alerts */}
        <div className="fixed top-20 right-8 z-50 flex flex-col gap-2 pointer-events-none print:hidden">
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-100 text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top-2 pointer-events-auto">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            {successMsg && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-lg border border-green-100 text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top-2 pointer-events-auto">
                <CheckCircle2 size={16} />
                {successMsg}
              </div>
            )}
        </div>

        {/* Output Canvas (Print Layout View) */}
        <div className="flex-1 overflow-x-hidden">
             <PrintLayout 
               config={config} 
               signals={signals} 
               pitches={pitches} 
             />
        </div>

      </div>
    </div>
  );
};

export default App;