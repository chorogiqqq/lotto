import React from 'react';
import { Sparkles, Dices, RefreshCw, BarChart2, CheckCircle2 } from 'lucide-react';

export default function Header({ latestDraw, analyzedCount, isMock, onRefresh }) {
  return (
    <header className="relative border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 font-black shadow-lg shadow-amber-500/20 ring-1 ring-white/30">
              <Dices className="w-7 h-7" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  로또 6/45 <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400">가중치 AI 추출기</span>
                </h1>
                <span className="px-2 py-0.5 text-[11px] font-bold tracking-wider rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span>동행복권 최신 통계 API 연동</span>
                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                <span>가중치 랜덤 추첨(Weighted Random Sampling)</span>
              </p>
            </div>
          </div>

          {/* Status & Controls */}
          <div className="flex items-center gap-3">
            {latestDraw && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-slate-300 font-semibold">최신 {latestDraw.drwNo}회</span>
                <span className="text-slate-500">({latestDraw.drwNoDate})</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-medium">
              <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
              <span>최근 {analyzedCount}회차 반영</span>
            </div>

            <button
              onClick={onRefresh}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all duration-200"
              title="통계 데이터 새로고침"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
