import React from 'react';
import { PitchDefinition, WristbandConfig, PitchType } from '../types';
import { WRISTBAND_GRID_SIZES, COLORS } from '../constants';
import { Plus, Trash2, Printer, RotateCcw, Play, Settings, List, Shield } from 'lucide-react';

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
    <div className="w-full lg:w-[26rem] bg-white border-r border-slate-200 h-full overflow-y-auto flex flex-col no-print z-10">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-900 text-white shadow-sm">
        <h1 className="text-xl font-bold flex items-center gap-2 tracking-tight">
          <Shield className="w-6 h-6 text-indigo-400" />
          PitchCaller
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">Advanced Wristband Generator</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Configuration Section */}
        <section className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-4 text-slate-800">
            <Settings size={16} className="text-indigo-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Configuration</h3>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Team Name</label>
              <input
                type="text"
                value={config.teamName}
                onChange={(e) => setConfig({ ...config, teamName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="e.g. Tigers Softball"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Grid Layout</label>
              <div className="relative">
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
                  className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                >
                  {WRISTBAND_GRID_SIZES.map(size => (
                    <option key={size.sectionSize} value={size.sectionSize}>
                      {size.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-xs font-semibold text-slate-500 mb-1.5">Width (inches)</label>
                 <input 
                   type="number" 
                   step="0.05"
                   value={config.printWidth}
                   onChange={(e) => setConfig({ ...config, printWidth: Number(e.target.value) })}
                   className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                 />
              </div>
              <div>
                 <label className="block text-xs font-semibold text-slate-500 mb-1.5">Height (inches)</label>
                 <input 
                   type="number" 
                   step="0.05"
                   value={config.printHeight}
                   onChange={(e) => setConfig({ ...config, printHeight: Number(e.target.value) })}
                   className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                 />
              </div>
            </div>
          </div>
        </section>

        {/* Pitches Section */}
        <section className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-800">
               <List size={16} className="text-indigo-600" />
               <h3 className="text-sm font-bold uppercase tracking-wider">Pitches</h3>
            </div>
            <div className={`text-xs font-bold px-2 py-1 rounded ${
              Math.abs(totalPercentage - 100) < 0.1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              Total: {Math.round(totalPercentage)}%
            </div>
          </div>

          <div className="space-y-3">
            {pitches.map((pitch) => (
              <div key={pitch.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-start gap-3 mb-2">
                  <div className="relative">
                     <input
                        type="color"
                        value={pitch.color}
                        onChange={(e) => handleUpdatePitch(pitch.id, 'color', e.target.value)}
                        className="w-8 h-8 rounded-md cursor-pointer border border-slate-200 p-0 overflow-hidden"
                        title="Change Color"
                      />
                  </div>
                  <div className="flex-1 min-w-0">
                    <input
                      value={pitch.name}
                      onChange={(e) => handleUpdatePitch(pitch.id, 'name', e.target.value)}
                      className="w-full bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 outline-none text-sm font-semibold text-slate-800 placeholder-slate-300"
                      placeholder="Pitch Name"
                    />
                    <div className="flex gap-2 mt-1">
                       <input
                        value={pitch.abbreviation}
                        onChange={(e) => handleUpdatePitch(pitch.id, 'abbreviation', e.target.value)}
                        className="w-12 bg-slate-50 border border-slate-100 rounded px-1 py-0.5 text-xs font-bold text-slate-500 uppercase text-center focus:border-indigo-500 outline-none"
                        placeholder="ABBR"
                        maxLength={3}
                        title="Abbreviation"
                      />
                      <select 
                        value={pitch.type}
                        onChange={(e) => handleUpdatePitch(pitch.id, 'type', e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-100 rounded px-1 py-0.5 text-xs text-slate-500 outline-none focus:border-indigo-500"
                      >
                        {Object.values(PitchType).map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemovePitch(pitch.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors p-1"
                    disabled={pitches.length <= 1}
                    title="Remove Pitch"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                
                {/* Percentage Slider/Input */}
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-50">
                   <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full" 
                        style={{ width: `${Math.min(pitch.percentage, 100)}%` }}
                      ></div>
                   </div>
                   <div className="flex items-center w-16 bg-slate-50 rounded border border-slate-200 px-2">
                      <input
                        type="number"
                        value={pitch.percentage}
                        onChange={(e) => handleUpdatePitch(pitch.id, 'percentage', Number(e.target.value))}
                        className="w-full bg-transparent border-none outline-none text-xs font-medium text-right pr-1 py-1"
                        placeholder="0"
                        min={0}
                        max={100}
                      />
                      <span className="text-[10px] text-slate-400">%</span>
                   </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddPitch}
            className="w-full mt-4 py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 text-sm font-medium hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Add Pitch Type
          </button>
        </section>
      </div>

      {/* Actions Footer */}
      <div className="p-5 border-t border-slate-200 bg-white space-y-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button
          onClick={onGenerate}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          <Play size={18} />
          GENERATE WRISTBAND
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handlePrint}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Printer size={16} />
            Print
          </button>
          <button
            onClick={onReset}
            className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};