import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import NumberPicker from './components/NumberPicker';
import GameGenerator from './components/GameGenerator';
import StatsHeatmap from './components/StatsHeatmap';
import DrawHistory from './components/DrawHistory';
import { generate5Games } from './utils/lottoAlgorithm';
import { RefreshCw, Info, AlertTriangle } from 'lucide-react';

export default function App() {
  const [statsData, setStatsData] = useState(null);
  const [analyzedCount, setAnalyzedCount] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Picker States
  const [inclusion, setInclusion] = useState([]); // Max 5 fixed numbers
  const [exclusion, setExclusion] = useState([]); // Max 10 excluded numbers

  // Generated Games State
  const [games, setGames] = useState([]);

  // Fetch statistics from Express Proxy API
  const fetchStats = useCallback(async (count = 30) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/lotto/stats?count=${count}`);
      const json = await res.json();
      if (json.success && json.data) {
        setStatsData(json.data);

        // Auto-generate initial 5 games once stats are loaded
        const newGames = generate5Games(json.data.frequencies, inclusion, exclusion);
        setGames(newGames);
      } else {
        throw new Error('데이터를 불러오지 못했습니다.');
      }
    } catch (err) {
      console.error('Fetch stats error:', err);
      setError('서버 또는 네트워크 통신 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [inclusion, exclusion]);

  useEffect(() => {
    fetchStats(analyzedCount);
  }, [analyzedCount]);

  // Handler for user clicking "5게임 번호 생성"
  const handleGenerateGames = () => {
    const freqs = statsData ? statsData.frequencies : {};
    const newGames = generate5Games(freqs, inclusion, exclusion);
    setGames(newGames);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* Top Header */}
      <Header
        latestDraw={statsData?.recentDraws?.[0]}
        analyzedCount={analyzedCount}
        isMock={statsData?.isMock}
        onRefresh={() => fetchStats(analyzedCount)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Loading / Error Banner */}
        {loading && !statsData && (
          <div className="glass-panel p-8 rounded-2xl text-center">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
            <p className="text-slate-300 text-sm font-semibold">동행복권 최신 통계 데이터를 분석 중입니다...</p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchStats(analyzedCount)}
              className="px-3 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-900 text-rose-200 border border-rose-500/40 font-semibold"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* Section 1: Number Inclusion & Exclusion Settings */}
        <NumberPicker
          inclusion={inclusion}
          setInclusion={setInclusion}
          exclusion={exclusion}
          setExclusion={setExclusion}
          hotNumbers={statsData?.hotNumbers || []}
          coldNumbers={statsData?.coldNumbers || []}
        />

        {/* Section 2: 5 Games Generator & Results */}
        <GameGenerator
          games={games}
          onGenerate={handleGenerateGames}
          inclusion={inclusion}
          exclusion={exclusion}
        />

        {/* Section 3: Visual Statistics & Recent History Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Frequency Heatmap & Chart */}
          <StatsHeatmap
            statsData={statsData}
            analyzedCount={analyzedCount}
            setAnalyzedCount={setAnalyzedCount}
          />

          {/* Recent Draw History Table */}
          <DrawHistory
            recentDraws={statsData?.recentDraws || []}
          />

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Lotto AI Analytics. 동행복권 공식 데이터 기반 가중치 추첨 알고리즘 적용.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>알고리즘: Weighted Random Sampling</span>
            <span>•</span>
            <span>Color Standard: 1-10(노랑), 11-20(파랑), 21-30(빨강), 31-40(회색), 41-45(초록)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
