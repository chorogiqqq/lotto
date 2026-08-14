import { generate5Games, generateSingleGame, getBallColorClass, getBallRangeName } from './src/utils/lottoAlgorithm.js';

console.log('====================================================');
console.log('       LOTTO APPLICATION AUTOMATED VERIFICATION     ');
console.log('====================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${message}`);
  }
}

// ----------------------------------------------------
// TEST 1: Exclusion Rule Test
// ----------------------------------------------------
console.log('[Test Suite 1] Exclusion Rule Test');
const excludedNumbers = [1, 2, 3, 4, 5];
let exclusionViolation = false;

// Run 50 iterations of 5-game generation to verify reliability
for (let iter = 0; iter < 50; iter++) {
  const games = generate5Games({}, [], excludedNumbers);
  
  if (games.length !== 5) {
    exclusionViolation = true;
    break;
  }

  for (const game of games) {
    const foundExcluded = game.numbers.filter(n => excludedNumbers.includes(n));
    if (foundExcluded.length > 0) {
      exclusionViolation = true;
      console.error(`    Violation in Game ${game.id}: found excluded numbers [${foundExcluded.join(', ')}]`);
    }
  }
}

assert(!exclusionViolation, 'Excluded numbers [1, 2, 3, 4, 5] did not appear in any of Games A, B, C, D, E across 50 iterations.');


// ----------------------------------------------------
// TEST 2: Inclusion Rule Test
// ----------------------------------------------------
console.log('\n[Test Suite 2] Inclusion Rule Test');
const fixedInclusion = [7, 14, 21];
let inclusionMissing = false;

// Run 50 iterations of 5-game generation
for (let iter = 0; iter < 50; iter++) {
  const games = generate5Games({}, fixedInclusion, []);
  
  for (const game of games) {
    const hasAllFixed = fixedInclusion.every(num => game.numbers.includes(num));
    if (!hasAllFixed) {
      inclusionMissing = true;
      console.error(`    Violation in Game ${game.id}: missing required inclusion numbers [${fixedInclusion.join(', ')}]. Got: [${game.numbers.join(', ')}]`);
    }
  }
}

assert(!inclusionMissing, 'Fixed inclusion numbers [7, 14, 21] appeared in ALL Games A, B, C, D, E across 50 iterations.');


// ----------------------------------------------------
// TEST 3: Official Ball Color Classes Test
// ----------------------------------------------------
console.log('\n[Test Suite 3] Official Ball Color Classes Test');

const range1Pass = Array.from({ length: 10 }, (_, i) => i + 1).every(n => getBallColorClass(n) === 'ball-range-1');
assert(range1Pass, 'Numbers 1~10 correctly map to "ball-range-1" (Yellow #FBC400)');

const range2Pass = Array.from({ length: 10 }, (_, i) => i + 11).every(n => getBallColorClass(n) === 'ball-range-2');
assert(range2Pass, 'Numbers 11~20 correctly map to "ball-range-2" (Blue #69C8F2)');

const range3Pass = Array.from({ length: 10 }, (_, i) => i + 21).every(n => getBallColorClass(n) === 'ball-range-3');
assert(range3Pass, 'Numbers 21~30 correctly map to "ball-range-3" (Red #FF7272)');

const range4Pass = Array.from({ length: 10 }, (_, i) => i + 31).every(n => getBallColorClass(n) === 'ball-range-4');
assert(range4Pass, 'Numbers 31~40 correctly map to "ball-range-4" (Gray #AAAAAA)');

const range5Pass = Array.from({ length: 5 }, (_, i) => i + 41).every(n => getBallColorClass(n) === 'ball-range-5');
assert(range5Pass, 'Numbers 41~45 correctly map to "ball-range-5" (Green #B0D840)');


// ----------------------------------------------------
// TEST 4: Sample Output Generation Verification
// ----------------------------------------------------
console.log('\n[Test Suite 4] Sample Output Generation Verification');
const sampleGames = generate5Games({ 7: 10, 14: 15, 21: 8, 45: 12 }, fixedInclusion, excludedNumbers);

console.log('\nSample Generated Games with Inclusion [7,14,21] & Exclusion [1,2,3,4,5]:');
sampleGames.forEach(g => {
  const numsStr = g.numbers.map(n => String(n).padStart(2, '0')).join(', ');
  const colors = g.numbers.map(n => getBallColorClass(n)).join(', ');
  console.log(`  Game ${g.id}: [${numsStr}] | Stats: Sum=${g.stats.sum}, Odd:Even=${g.stats.oddEvenRatio}, AvgScore=${g.stats.avgScore}`);
});

assert(sampleGames.length === 5, 'Successfully generated exactly 5 games (A, B, C, D, E)');


// ----------------------------------------------------
// VERIFICATION SUMMARY REPORT
// ----------------------------------------------------
console.log('\n====================================================');
console.log(` TEST VERIFICATION SUMMARY: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
console.log('====================================================');

if (failedTests === 0) {
  console.log('Status: ALL TESTS PASSED SUCCESSFULLY! ✅\n');
} else {
  console.error(`Status: ${failedTests} TESTS FAILED ❌\n`);
  process.exit(1);
}
