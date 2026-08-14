import React, { useState } from 'react';
import { Flame, Snowflake, BarChart3, TrendingUp, Grid, Layers } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { getBallColorClass } from '../utils/lottoAlgorithm';

export default function StatsHeatmap({
  statsData,
  analyzedCount,
  setAnalyzedCount
}) {
  const [viewMode, setViewMode] = useState('heatmap'); // 'heatmap' | 'chart'

  if (!statsData) return null;

  const { frequencies = {}, hotNumbers = [], coldNumbers = [] } = statsData;

  // Find max frequency for relative heat scaling
  const maxFreq = Math.max(...Object.values(frequencies), 1);

  // Prepare data for Recharts Bar Chart
  const chartData = Array.from({ length: 45 }, (_, i) => {
    const num = i + 1;
    const count = frequencies[num] || 0;
    return {
      number: num,
      count,
      label: `${num}번`
    };
  });

  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6 shadow-xl border border-slate-800">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            최근 회차 당첨 번호 출현 빈도 (Hot & Cold)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            분석 회차 범위 내 번호별 당첨 횟수 및 히트맵 분포입니다.
          </p>
        </div>

        {/* View mode toggle & Analyzed range selector */}
        <div className="flex items-center gap-2">
          
          {/* Range Selector */}
          <select
            value={analyzedCount}
            onChange={(e) => setAnalyzedCount(Number(e.target.value))}
            className="bg-slate-900 text-xs font-semibold text-amber-300 border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-400"
          >
            <option value={20}>최근 20회차</option>
            <option value={30}>최근 30회차</option>
            <option value={50}>최근 50회차</option>
            <option value={100}>최근 100회차</option>
          </select>

          {/* Toggle Buttons */}
          <div className="flex items-center p-1 bg-slate-900/80 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('heatmap')}
              className={`p-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === 'heatmap' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="히트맵 격자 보기"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`p-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === 'chart' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="막대 차트 보기"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Hot / Cold Top Summary Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
        
        {/* Hot Top 5 */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              HOT 최다 출현 번호 (Top 5)
            </span>
            <span className="text-[11px] text-amber-400/70">가중치 최고</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {hotNumbers.slice(0, 5).map((item) => (
              <div key={item.number} className="flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 rounded-xl border border-amber-500/30">
                <span className={`lotto-ball w-6 h-6 text-[11px] ${getBallColorClass(item.number)}`}>
                  {item.number}
                </span>
                <span className="text-xs font-bold text-amber-300 ml-0.5">{item.count}회</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cold Top 5 */}
        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-blue-400 flex items-center gap-1.5">
              <Snowflake className="w-4 h-4 text-blue-400 animate-spin-slow" />
              COLD 최소 출현 번호 (Bottom 5)
            </span>
            <span className="text-[11px] text-blue-400/70">가중치 낮음</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {coldNumbers.slice(0, 5).map((item) => (
              <div key={item.number} className="flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 rounded-xl border border-blue-500/30">
                <span className={`lotto-ball w-6 h-6 text-[11px] ${getBallColorClass(item.number)}`}>
                  {item.number}
                </span>
                <span className="text-xs font-bold text-blue-300 ml-0.5">{item.count}회</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Main Visual Component: Heatmap or Chart */}
      {viewMode === 'heatmap' ? (
        <div className="grid grid-cols-5 sm:grid-cols-9 md:grid-cols-15 gap-2 pt-2">
          {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
            const count = frequencies[num] || 0;
            const ratio = count / maxFreq;

            // Determine hot/cold tag
            const isHot = hotNumbers.slice(0, 5).some(h => h.number === num);
            const isCold = coldNumbers.slice(0, 5).some(c => c.number === num);

            let bgIntensity = `rgba(251, 196, 0, ${Math.max(0.05, ratio * 0.25)})`;
            let borderCol = 'border-slate-800/80';

            if (isHot) {
              borderCol = 'border-amber-400 ring-1 ring-amber-400/50';
              bgIntensity = 'rgba(251, 196, 0, 0.2)';
            } else if (isCold) {
              borderCol = 'border-blue-400/50';
              bgIntensity = 'rgba(105, 200, 242, 0.15)';
            }

            return (
              <div
                key={num}
                style={{ backgroundColor: bgIntensity }}
                className={`relative flex flex-col items-center justify-center p-2 rounded-xl border ${borderCol} transition-all duration-200 hover:scale-105`}
              >
                {isHot && <span className="absolute -top-1 -right-1 text-[10px]">🔥</span>}
                {isCold && <span className="absolute -top-1 -right-1 text-[10px]">❄️</span>}
                <span className={`lotto-ball w-7 h-7 text-xs ${getBallColorClass(num)}`}>
                  {num}
                </span>
                <span className="text-[10px] font-bold text-slate-300 mt-1">
                  {count}회
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-64 sm:h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="number" tick={{ fill: '#94a3b8', fontSize: 10 }} interval={1} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-xs shadow-xl">
                        <p className="font-bold text-amber-300">{data.number}번 공</p>
                        <p className="text-slate-300">최근 당첨: <strong className="text-white">{data.count}회</strong></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => {
                  const isHot = hotNumbers.slice(0, 5).some(h => h.number === entry.number);
                  const isCold = coldNumbers.slice(0, 5).some(c => c.number === entry.number);
                  let color = '#334155';
                  if (isHot) color = '#FBC400';
                  else if (isCold) color = '#69C8F2';
                  return <Cell key={`cell-${entry.number}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
}
