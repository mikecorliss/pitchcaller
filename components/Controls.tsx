import React from 'react';
import { PitchDefinition, WristbandConfig, PitchType } from '../types';
import { WRISTBAND_GRID_SIZES, COLORS } from '../constants';
import { Plus, Trash2, Printer, RotateCcw, Play } from 'lucide-react';

interface ControlsProps {
  config: WristbandConfig;
  setConfig: (c: WristbandConfig) => void;
  pitches: PitchDefinition[];
  setPitches: (p: PitchDefinition[]) => void;
  onGenerate: () => void;
  onReset: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  config,
  setConfig,
  pitches,
  setPitches,
  onGenerate,
  onReset
}) => {
  const handleAddPitch = () => {
    const newPitch: PitchDefinition = {
      id: `p-${Date.now()}`,
      name: 'New Pitch',
      type: PitchType.FASTBALL,
      color: COLORS[pitches.length % COLORS.length],
      abbreviation: 'NP',
      percentage: 0
    };
    setPitches([...pitches, newPitch]);
  };

  const handleRemovePitch = (id: string) => {
    setPitches(pitches.filter(p => p.id !== id));
  };

  const handleUpdatePitch = (id: string, field: keyof PitchDefinition, value: string | number) => {
    setPitches(pitches.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handlePrint = () => {
    window.print();
  };

  const totalPercentage = pitches.reduce((sum, p) => sum + (Number(p.percentage) || 0), 0);

  return (
    <div className="w-full lg:w-[28rem] bg-white border-r border-slate-200 h-full overflow-y-auto flex flex-col no-print shadow-xl z-10">
      <div className="p-6 border-b border-slate-100 bg-slate-50">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-indigo-600 text-white p-1 rounded">PC</span> PitchCaller
        </h1>
        <p className="text-sm text-slate-500 mt-1">Wristband Generator</p>
      </div>

      <div className="p-6 space-y-8 flex-1 overflow-y-auto">
        {/* Team Info Section */}
        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Team Name</label>
              <input
                type="text"
                value={config.teamName}
                onChange={(e) => setConfig({ ...config, teamName: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. Tigers Softball"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Grid Layout</label>
              <select
                value={config.sectionSize}
                onChange={(e) => {
                  const sectionSize = Number(e.target.value);
                  const selectedSize = WRISTBAND_GRID_SIZES.find(s => s.sectionSize === sectionSize);
                  if (selectedSize) {
                    setConfig({ 
                      ...config, 
                      columns: selectedSize.cols, 
                      rows: selectedSize.rows,
                      sectionSize: selectedSize.sectionSize
                    });
                  }
                }}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                {WRISTBAND_GRID_SIZES.map(size => (
                  <option key={size.sectionSize} value={size.sectionSize}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-xs font-medium text-slate-500 mb-1">Wristband Width (in)</label>
                 <input 
                   type="number" 
                   step="0.05"
                   value={config.printWidth}
                   onChange={(e) => setConfig({ ...config, printWidth: Number(e.target.value) })}
                   className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                 />
              </div>
              <div>
                 <label className="block text-xs font-medium text-slate-500 mb-1">Wristband Height (in)</label>
                 <input 
                   type="number" 
                   step="0.05"
                   value={config.printHeight}
                   onChange={(e) => setConfig({ ...config, printHeight: Number(e.target.value) })}
                   className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                 />
              </div>
            </div>
          </div>
        </section>

        {/* Pitches Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Pitches</h3>
            <div className={`text-xs font-bold ${totalPercentage === 100 ? 'text-green-600' : 'text-red-600'}`}>
              Total: {totalPercentage}%
            </div>
            <button onClick={handleAddPitch} className="text-indigo-600 hover:text-indigo-700 p-1 rounded hover:bg-indigo-50 ml-2">
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-2">
            {pitches.map((pitch) => (
              <div key={pitch.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-200 group">
                <input
                  type="color"
                  value={pitch.color}
                  onChange={(e) => handleUpdatePitch(pitch.id, 'color', e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-none bg-transparent p-0 flex-shrink-0"
                />
                <div className="flex-1 grid grid-cols-12 gap-2">
                  <input
                    value={pitch.name}
                    onChange={(e) => handleUpdatePitch(pitch.id, 'name', e.target.value)}
                    className="col-span-6 bg-transparent border-b border-transparent focus:border-indigo-300 outline-none text-sm font-medium"
                    placeholder="Name"
                  />
                  <div className="col-span-3 relative">
                    <input
                      type="number"
                      value={pitch.percentage}
                      onChange={(e) => handleUpdatePitch(pitch.id, 'percentage', Number(e.target.value))}
                      className="w-full bg-transparent border-b border-transparent focus:border-indigo-300 outline-none text-sm text-right pr-3"
                      placeholder="0"
                      min={0}
                      max={100}
                    />
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">%</span>
                  </div>
                  <input
                    value={pitch.abbreviation}
                    onChange={(e) => handleUpdatePitch(pitch.id, 'abbreviation', e.target.value)}
                    className="col-span-3 bg-transparent border-b border-transparent focus:border-indigo-300 outline-none text-sm text-slate-500 uppercase text-right"
                    placeholder="ABBR"
                    maxLength={3}
                  />
                </div>
                <button
                  onClick={() => handleRemovePitch(pitch.id)}
                  className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  disabled={pitches.length <= 1}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          
          <button
            onClick={onGenerate}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Play size={16} />
            Generate Grid
          </button>
        </section>
      </div>

      <div className="p-6 border-t border-slate-200 bg-white space-y-3">
        <button
          onClick={handlePrint}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Printer size={16} />
          Print Wristband
        </button>
        <button
          onClick={onReset}
          className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw size={14} />
          Clear Grid
        </button>
      </div>
    </div>
  );
};