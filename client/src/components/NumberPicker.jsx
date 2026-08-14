import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, RotateCcw, Sparkles, Filter, Lock, EyeOff } from 'lucide-react';
import { getBallColorClass } from '../utils/lottoAlgorithm';

export default function NumberPicker({
  inclusion,
  setInclusion,
  exclusion,
  setExclusion,
  hotNumbers = [],
  coldNumbers = []
}) {
  const [activeTab, setActiveTab] = useState('inclusion'); // 'inclusion' | 'exclusion'

  const toggleInclusion = (num) => {
    if (inclusion.includes(num)) {
      setInclusion(inclusion.filter(n => n !== num));
    } else {
      if (inclusion.length >= 5) {
        alert('고정 번호는 최대 5개까지 설정할 수 있습니다.');
        return;
      }
      // Remove from exclusion if present
      if (exclusion.includes(num)) {
        setExclusion(exclusion.filter(n => n !== num));
      }
      setInclusion([...inclusion, num].sort((a, b) => a - b));
    }
  };

  const toggleExclusion = (num) => {
    if (exclusion.includes(num)) {
      setExclusion(exclusion.filter(n => n !== num));
    } else {
      if (exclusion.length >= 10) {
        alert('제외 번호는 최대 10개까지 설정할 수 있습니다.');
        return;
      }
      // Remove from inclusion if present
      if (inclusion.includes(num)) {
        setInclusion(inclusion.filter(n => n !== num));
      }
      setExclusion([...exclusion, num].sort((a, b) => a - b));
    }
  };

  const handleCellClick = (num) => {
    if (activeTab === 'inclusion') {
      toggleInclusion(num);
    } else {
      toggleExclusion(num);
    }
  };

  // Presets
  const applyHotPreset = () => {
    const topHot = hotNumbers.slice(0, 3).map(item => item.number);
    setInclusion(topHot);
    // Remove selected hot from exclusion
    setExclusion(exclusion.filter(n => !topHot.includes(n)));
  };

  const applyColdExclusionPreset = () => {
    const bottomCold = coldNumbers.slice(0, 5).map(item => item.number);
    setExclusion(bottomCold);
    setInclusion(inclusion.filter(n => !bottomCold.includes(n)));
  };

  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6 shadow-xl border border-slate-800">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Filter className="w-5 h-5 text-amber-400" />
            고정 번호 및 제외 번호 설정
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            원하는 번호를 반드시 포함하거나 추첨에서 제외할 수 있습니다.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('inclusion')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'inclusion'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>고정 번호 ({inclusion.length}/5)</span>
          </button>

          <button
            onClick={() => setActiveTab('exclusion')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'exclusion'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>제외 번호 ({exclusion.length}/10)</span>
          </button>
        </div>
      </div>

      {/* Selected Tags Display */}
      <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        
        {/* Inclusion Badge Bar */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> 고정 ({inclusion.length}/5):
            </span>
            {inclusion.length === 0 ? (
              <span className="text-xs text-slate-500">선택된 번호 없음</span>
            ) : (
              inclusion.map(num => (
                <span
                  key={num}
                  onClick={() => toggleInclusion(num)}
                  className={`lotto-ball w-7 h-7 text-xs ${getBallColorClass(num)} cursor-pointer`}
                  title="클릭하여 고정 해제"
                >
                  {num}
                </span>
              ))
            )}
          </div>
          {inclusion.length > 0 && (
            <button
              onClick={() => setInclusion([])}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 ml-2"
            >
              <RotateCcw className="w-3 h-3" /> 초기화
            </button>
          )}
        </div>

        {/* Exclusion Badge Bar */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-rose-950/20 border border-rose-500/20">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
              <EyeOff className="w-3.5 h-3.5" /> 제외 ({exclusion.length}/10):
            </span>
            {exclusion.length === 0 ? (
              <span className="text-xs text-slate-500">선택된 번호 없음</span>
            ) : (
              exclusion.map(num => (
                <span
                  key={num}
                  onClick={() => toggleExclusion(num)}
                  className={`lotto-ball w-7 h-7 text-xs ${getBallColorClass(num)} opacity-50 line-through cursor-pointer`}
                  title="클릭하여 제외 해제"
                >
                  {num}
                </span>
              ))
            )}
          </div>
          {exclusion.length > 0 && (
            <button
              onClick={() => setExclusion([])}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-0.5 ml-2"
            >
              <RotateCcw className="w-3 h-3" /> 초기화
            </button>
          )}
        </div>

      </div>

      {/* Quick Presets */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-medium whitespace-nowrap">빠른 설정:</span>
        <button
          onClick={applyHotPreset}
          className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap transition"
        >
          🔥 Hot 번호 Top 3 고정
        </button>
        <button
          onClick={applyColdExclusionPreset}
          className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 whitespace-nowrap transition"
        >
          ❄️ Cold 번호 Bottom 5 제외
        </button>
        <button
          onClick={() => { setInclusion([]); setExclusion([]); }}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 whitespace-nowrap transition ml-auto"
        >
          전체 설정 초기화
        </button>
      </div>

      {/* 1..45 Number Selector Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-9 md:grid-cols-15 gap-2 pt-2">
        {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
          const isIncluded = inclusion.includes(num);
          const isExcluded = exclusion.includes(num);

          let borderStyle = 'border-slate-800 hover:border-slate-600 bg-slate-900/60';
          let badge = null;

          if (isIncluded) {
            borderStyle = 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/50';
            badge = <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center text-[9px] font-bold">✓</span>;
          } else if (isExcluded) {
            borderStyle = 'border-rose-500 bg-rose-950/40 opacity-40 ring-1 ring-rose-500/40';
            badge = <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold">✕</span>;
          }

          return (
            <button
              key={num}
              onClick={() => handleCellClick(num)}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-150 ${borderStyle}`}
            >
              {badge}
              <span className={`lotto-ball w-8 h-8 text-xs ${getBallColorClass(num)} ${isExcluded ? 'line-through' : ''}`}>
                {num}
              </span>
            </button>
          );
        })}
      </div>

      {/* Instructions */}
      <p className="text-[11px] text-slate-500 mt-4 text-center">
        * 고정 번호는 최대 5개, 제외 번호는 최대 10개까지 설정 가능합니다. 고정 및 제외로 지정되지 않은 나머지 번호들로 가중치 랜덤 추첨을 진행합니다.
      </p>

    </div>
  );
}
