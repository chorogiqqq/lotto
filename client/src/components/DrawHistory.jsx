import React from 'react';
import { History, Trophy, Calendar, Gift, ChevronRight } from 'lucide-react';
import { getBallColorClass } from '../utils/lottoAlgorithm';

export default function DrawHistory({ recentDraws = [] }) {
  if (!recentDraws || recentDraws.length === 0) return null;

  const latest = recentDraws[0];

  const formatMoney = (amount) => {
    if (!amount) return '0원';
    const num = Number(amount);
    if (num >= 100000000) {
      const uk = (num / 100000000).toFixed(1);
      return `${uk}억원`;
    }
    return `${(num / 10000).toLocaleString()}만원`;
  };

  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6 shadow-xl border border-slate-800 space-y-6">
      
      {/* Latest Draw Banner Card */}
      {latest && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 p-5 sm:p-6 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Draw Header Info */}
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs">
                  최신 당첨 결과
                </span>
                <span className="text-lg font-black text-white">{latest.drwNo}회</span>
                <span className="text-xs text-slate-400">({latest.drwNoDate})</span>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-slate-300 mt-2">
                <span>1등 당첨금: <strong className="text-amber-400 font-bold">{formatMoney(latest.firstWinamnt)}</strong></span>
                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                <span>당첨자 수: <strong className="text-white font-bold">{latest.firstPrzwnerCo}명</strong></span>
              </div>
            </div>

            {/* Ball Display: 6 Winning Balls + Bonus Ball */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-center">
              {latest.numbers.map((num) => (
                <span key={num} className={`lotto-ball w-9 h-9 sm:w-10 sm:h-10 text-xs sm:text-sm ${getBallColorClass(num)}`}>
                  {num}
                </span>
              ))}
              <span className="text-slate-400 font-bold text-lg px-1">+</span>
              <div className="relative">
                <span className={`lotto-ball w-9 h-9 sm:w-10 sm:h-10 text-xs sm:text-sm ${getBallColorClass(latest.bnusNo)} border-2 border-amber-400`}>
                  {latest.bnusNo}
                </span>
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-amber-400">보너스</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Recent Draws List Table */}
      <div>
        <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
          <History className="w-4 h-4 text-amber-400" />
          최근 회차 당첨 내역
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-900/40">
                <th className="py-2.5 px-3">회차</th>
                <th className="py-2.5 px-3">추첨일</th>
                <th className="py-2.5 px-3">당첨 번호</th>
                <th className="py-2.5 px-3">보너스</th>
                <th className="py-2.5 px-3 text-right">1등 당첨금 (인원)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentDraws.slice(0, 8).map((draw) => (
                <tr key={draw.drwNo} className="hover:bg-slate-900/50 transition">
                  <td className="py-2.5 px-3 font-bold text-slate-200">{draw.drwNo}회</td>
                  <td className="py-2.5 px-3 text-slate-400">{draw.drwNoDate}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      {draw.numbers.map((n) => (
                        <span key={n} className={`lotto-ball w-6 h-6 text-[10px] ${getBallColorClass(n)}`}>
                          {n}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`lotto-ball w-6 h-6 text-[10px] ${getBallColorClass(draw.bnusNo)}`}>
                      {draw.bnusNo}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300 font-medium">
                    {formatMoney(draw.firstWinamnt)} ({draw.firstPrzwnerCo}명)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
