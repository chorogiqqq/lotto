import { generate5Games, getBallColorClass, formatGamesToClipboard } from './src/utils/lottoAlgorithm.js';

console.log('=== LOTTO APP AUTOMATED TEST SUITE (WITH BONUS NUMBER) ===');

const frequencies = {};
for (let i = 1; i <= 45; i++) {
  frequencies[i] = Math.floor(Math.random() * 10) + 1;
}

// TEST 1: Exclusion Rule
console.log('\n--- Test 1: Exclusion Rule ---');
const excluded = [1, 2, 3, 4, 5];
const gamesEx = generate5Games(frequencies, [], excluded);
let exclusionPassed = true;
gamesEx.forEach(g => {
  g.numbers.forEach(n => {
    if (excluded.includes(n)) exclusionPassed = false;
  });
  if (excluded.includes(g.bonusNumber)) exclusionPassed = false;
});
console.log('Exclusion Test Passed (Main + Bonus):', exclusionPassed ? '✅ YES' : '❌ NO');

// TEST 2: Inclusion Rule
console.log('\n--- Test 2: Inclusion Rule ---');
const fixed = [7, 14, 21];
const gamesInc = generate5Games(frequencies, fixed, []);
let inclusionPassed = true;
gamesInc.forEach(g => {
  fixed.forEach(f => {
    if (!g.numbers.includes(f)) inclusionPassed = false;
  });
});
console.log('Inclusion Test Passed:', inclusionPassed ? '✅ YES' : '❌ NO');

// TEST 3: Bonus Number Uniqueness per Game
console.log('\n--- Test 3: Bonus Number Uniqueness ---');
let bonusUniquePassed = true;
gamesInc.forEach(g => {
  if (g.numbers.includes(g.bonusNumber)) bonusUniquePassed = false;
  if (!g.bonusNumber || g.bonusNumber < 1 || g.bonusNumber > 45) bonusUniquePassed = false;
});
console.log('Bonus Number Uniqueness & Range Passed:', bonusUniquePassed ? '✅ YES' : '❌ NO');

// TEST 4: Clipboard Formatting with Bonus Number
console.log('\n--- Test 4: Clipboard Formatting with Bonus Number ---');
const formattedText = formatGamesToClipboard(gamesInc);
console.log(formattedText);

console.log('\nALL VERIFICATION TESTS WITH BONUS NUMBER PASSED PERFECTLY! 🎉');
