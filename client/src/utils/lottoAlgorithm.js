/**
 * Lotto Weighted Sampling & Helper Utilities
 */

/**
 * Returns the CSS class for 3D Lotto Ball according to official Donghaeng Lottery colors:
 * 1-10: Yellow (#FBC400)
 * 11-20: Blue (#69C8F2)
 * 21-30: Red (#FF7272)
 * 31-40: Gray (#AAAAAA)
 * 41-45: Green (#B0D840)
 */
export function getBallColorClass(num) {
  const number = Number(num);
  if (number >= 1 && number <= 10) return 'ball-range-1';
  if (number >= 11 && number <= 20) return 'ball-range-2';
  if (number >= 21 && number <= 30) return 'ball-range-3';
  if (number >= 31 && number <= 40) return 'ball-range-4';
  if (number >= 41 && number <= 45) return 'ball-range-5';
  return 'bg-slate-700 text-white';
}

export function getBallRangeName(num) {
  const number = Number(num);
  if (number >= 1 && number <= 10) return '1~10 (노랑)';
  if (number >= 11 && number <= 20) return '11~20 (파랑)';
  if (number >= 21 && number <= 30) return '21~30 (빨강)';
  if (number >= 31 && number <= 40) return '31~40 (회색)';
  if (number >= 41 && number <= 45) return '41~45 (초록)';
  return '';
}

/**
 * Generates 1 game using Weighted Random Sampling:
 * 6 main numbers (sorted ascending) + 1 bonus number recommended from remaining pool.
 */
export function generateSingleGame(frequencies = {}, inclusion = [], exclusion = [], baseWeight = 1) {
  const fixedSet = new Set(inclusion);
  const excludedSet = new Set(exclusion);

  const selected = new Set(fixedSet);

  // Available candidates pool: 1..45 excluding fixed & excluded numbers
  let pool = [];
  for (let i = 1; i <= 45; i++) {
    if (!fixedSet.has(i) && !excludedSet.has(i)) {
      pool.push(i);
    }
  }

  // Sample until 6 numbers are filled for main set
  while (selected.size < 6 && pool.length > 0) {
    const weights = pool.map(num => (frequencies[num] || 0) + baseWeight);
    const totalWeight = weights.reduce((acc, val) => acc + val, 0);

    if (totalWeight <= 0) {
      const idx = Math.floor(Math.random() * pool.length);
      selected.add(pool[idx]);
      pool.splice(idx, 1);
      continue;
    }

    let rand = Math.random() * totalWeight;
    let chosenIndex = 0;

    for (let i = 0; i < pool.length; i++) {
      rand -= weights[i];
      if (rand <= 0) {
        chosenIndex = i;
        break;
      }
    }

    const chosenNumber = pool[chosenIndex];
    selected.add(chosenNumber);
    pool.splice(chosenIndex, 1);
  }

  const mainNumbers = Array.from(selected).sort((a, b) => a - b);

  // Sample 1 Bonus Number from remaining pool (1..45 excluding mainNumbers & excludedSet)
  const bonusPool = [];
  for (let i = 1; i <= 45; i++) {
    if (!selected.has(i) && !excludedSet.has(i)) {
      bonusPool.push(i);
    }
  }

  let bonusNumber = null;
  if (bonusPool.length > 0) {
    const bonusWeights = bonusPool.map(num => (frequencies[num] || 0) + baseWeight);
    const totalBonusWeight = bonusWeights.reduce((acc, val) => acc + val, 0);

    let rand = Math.random() * totalBonusWeight;
    let chosenIdx = 0;
    for (let i = 0; i < bonusPool.length; i++) {
      rand -= bonusWeights[i];
      if (rand <= 0) {
        chosenIdx = i;
        break;
      }
    }
    bonusNumber = bonusPool[chosenIdx];
  } else {
    bonusNumber = 45;
  }

  return {
    numbers: mainNumbers,
    bonusNumber
  };
}

/**
 * Generates 5 Games (A, B, C, D, E) with 6 main numbers + 1 bonus number each
 */
export function generate5Games(frequencies = {}, inclusion = [], exclusion = [], baseWeight = 1) {
  const labels = ['A', 'B', 'C', 'D', 'E'];
  return labels.map(label => {
    const { numbers, bonusNumber } = generateSingleGame(frequencies, inclusion, exclusion, baseWeight);
    
    // Calculate odd/even ratio & sum stats
    const oddCount = numbers.filter(n => n % 2 !== 0).length;
    const evenCount = numbers.length - oddCount;
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    const avgScore = (numbers.reduce((acc, n) => acc + (frequencies[n] || 0), 0) / numbers.length).toFixed(1);

    return {
      id: label,
      numbers,
      bonusNumber,
      stats: {
        sum,
        oddEvenRatio: `${oddCount}:${evenCount}`,
        avgScore
      }
    };
  });
}

/**
 * Formats 5 games into a clean copyable string including Bonus numbers
 */
export function formatGamesToClipboard(games) {
  const lines = games.map(g => {
    const numsStr = g.numbers.map(n => String(n).padStart(2, '0')).join(', ');
    const bonusStr = String(g.bonusNumber).padStart(2, '0');
    return `${g.id}게임: ${numsStr} + [보너스 ${bonusStr}]`;
  });

  return `[로또 6/45 통계 기반 가중치 추첨 5게임 (+보너스 번호 추천)]\n${lines.join('\n')}\n(추생 출처: 로또 AI 통계 추출기)`;
}
