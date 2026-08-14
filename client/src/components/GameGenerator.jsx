import React, { useState } from 'react';
import { Play, Copy, Check, Sparkles, Zap, Award, Flame, RefreshCw, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getBallColorClass, formatGamesToClipboard } from '../utils/lottoAlgorithm';

export default function GameGenerator({
  games,
  onGenerate,
  inclusion = [],
  exclusion = []
}) {
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleGenerateClick = () => {
    setIsAnimating(true);
    onGenerate();

    // Trigger colorful confetti effect
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  };

  const handleCopyAll = async () => {
    if (!games || games.length === 0) return;
    const textToCopy = formatGamesToClipboard(games);

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6 shadow-xl border border-slate-800">
      
      {/* Top Banner & Main Action Trigger */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
              가중치 5게임 + 보너스 번호 자동 추출
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
              6+1 Bonus
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            각 게임별 메인 6개 숫자 + 보너스 1개 번호까지 가중치 무작위 알고리즘으로 종합 추천합니다.
          </p>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateClick}
          disabled={isAnimating}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5 group"
        >
          <Sparkles className={`w-4 h-4 text-slate-950 transition-transform ${isAnimating ? 'animate-spin' : 'group-hover:rotate-12'}`} />
          <span>5게임 번호 생성하기</span>
        </button>
      </div>

      {/* Copy All & Game Output Section */}
      {games && games.length > 0 ? (
        <div className="mt-6 space-y-4">
          
          {/* Header Action Bar */}
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              추첨 결과 (게임당 메인 6개 + 보너스 1개 번호)
            </span>

            <button
              onClick={handleCopyAll}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>5게임 전체 복사됨!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>전체 번호 복사</span>
                </>
              )}
            </button>
          </div>

          {/* 5 Games Display List */}
          <div className="space-y-3">
            {games.map((game) => (
              <div
                key={game.id}
                className="group relative flex flex-col md:flex-row items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 hover:bg-slate-900"
              >
                {/* Game Label */}
                <div className="flex items-center gap-3 w-full md:w-auto mb-3 md:mb-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center text-sm shadow-md shadow-amber-500/20">
                    {game.id}
                  </div>
                  <span className="text-xs font-bold text-slate-300">GAME {game.id}</span>
                </div>

                {/* 6 Main Lotto Balls + 1 Bonus Ball */}
                <div className="flex items-center gap-2 sm:gap-2.5 my-2 md:my-0 flex-wrap justify-center">
                  {game.numbers.map((num) => {
                    const isFixed = inclusion.includes(num);
                    return (
                      <div key={num} className="relative">
                        <span className={`lotto-ball w-10 h-10 sm:w-11 sm:h-11 text-sm sm:text-base ${getBallColorClass(num)}`}>
                          {num}
                        </span>
                        {isFixed && (
                          <span
                            className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center text-[9px] font-black border border-slate-900"
                            title="고정 지정 번호"
                          >
                            ★
                          </span>
                        )}
                      </div>
                    );
                  })}

                  {/* Plus separator */}
                  <span className="text-slate-500 font-bold text-lg px-0.5 sm:px-1">+</span>

                  {/* Bonus Ball */}
                  {game.bonusNumber && (
                    <div className="relative flex flex-col items-center">
                      <span className={`lotto-ball w-10 h-10 sm:w-11 sm:h-11 text-sm sm:text-base ${getBallColorClass(game.bonusNumber)} ring-2 ring-amber-400 shadow-amber-500/20`}>
                        {game.bonusNumber}
                      </span>
                      <span className="text-[9px] font-extrabold text-amber-400 mt-0.5 tracking-tight">
                        보너스
                      </span>
                    </div>
                  )}
                </div>

                {/* Game Metrics */}
                <div className="flex items-center gap-3 text-[11px] text-slate-400 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                    합계: <strong className="text-white">{game.stats.sum}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                    홀짝: <strong className="text-white">{game.stats.oddEvenRatio}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20" title="최근 회차 당첨 빈도점수">
                    가중점수: <strong>{game.stats.avgScore}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        <div className="text-center py-12">
          <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-pulse" />
          <p className="text-slate-400 text-sm">버튼을 눌러 가중치 5게임 + 보너스 조합을 추출해보세요!</p>
        </div>
      )}

    </div>
  );
}
