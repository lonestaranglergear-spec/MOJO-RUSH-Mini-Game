import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOrderScore,
  getPerformanceRank,
  checkMojoMoment,
  verifyIngredientStep,
  evaluateAchievements,
  isRewardEligible,
  formatTime
} from './rules';

test('calculateOrderScore computes correct base, perfect bonus, and streak bonus', () => {
  // 3 ingredients, not perfect, streak 0, 1x multiplier
  // base = 30, completion = 50, perfect = 0, streak = 0 -> 80
  const normal = calculateOrderScore(3, false, 0, 1.0);
  assert.equal(normal.points, 80);

  // 3 ingredients, perfect (+25), streak 3 (+30), 1.25x multiplier
  // base = 30 + 50 + 25 + 30 = 135 * 1.25 = 168.75 -> 169
  const streakAndPerfect = calculateOrderScore(3, true, 3, 1.25);
  assert.equal(streakAndPerfect.points, 169);
});

test('getPerformanceRank returns appropriate barista tier', () => {
  assert.equal(getPerformanceRank(80), 'COFFEE ROOKIE');
  assert.equal(getPerformanceRank(150), 'MOJO REGULAR');
  assert.equal(getPerformanceRank(299), 'MOJO REGULAR');
  assert.equal(getPerformanceRank(300), 'RUSH MASTER');
  assert.equal(getPerformanceRank(450), 'MOJO LEGEND');
  assert.equal(getPerformanceRank(600), 'MOJO LEGEND');
});

test('checkMojoMoment triggers on 3-streak intervals', () => {
  assert.equal(checkMojoMoment(1), false);
  assert.equal(checkMojoMoment(2), false);
  assert.equal(checkMojoMoment(3), true);
  assert.equal(checkMojoMoment(4), false);
  assert.equal(checkMojoMoment(6), true);
});

test('verifyIngredientStep validates sequence and tracks drink completion', () => {
  const recipe = ['espresso', 'steamed_milk'];

  // Step 0: wrong ingredient selected
  const wrongFirst = verifyIngredientStep(recipe, 0, 'vanilla');
  assert.equal(wrongFirst.isCorrect, false);
  assert.equal(wrongFirst.isDrinkComplete, false);
  assert.equal(wrongFirst.nextStepIndex, 0);

  // Step 0: correct ingredient
  const correctFirst = verifyIngredientStep(recipe, 0, 'espresso');
  assert.equal(correctFirst.isCorrect, true);
  assert.equal(correctFirst.isDrinkComplete, false);
  assert.equal(correctFirst.nextStepIndex, 1);

  // Step 1: correct second ingredient -> completes drink
  const correctSecond = verifyIngredientStep(recipe, 1, 'steamed_milk');
  assert.equal(correctSecond.isCorrect, true);
  assert.equal(correctSecond.isDrinkComplete, true);
  assert.equal(correctSecond.nextStepIndex, 2);
});

test('evaluateAchievements unlocks badges based on criteria', () => {
  const unlocked = evaluateAchievements(
    {
      ordersCompleted: 5,
      perfectOrders: 2,
      maxStreak: 3,
      score: 420
    },
    []
  );

  assert.ok(unlocked.includes('FIRST_ORDER'));
  assert.ok(unlocked.includes('PERFECT_POUR'));
  assert.ok(unlocked.includes('THREE_ORDER_STREAK'));
  assert.ok(unlocked.includes('RUSH_MASTER'));
  assert.ok(unlocked.includes('MOJO_LEGEND'));
});

test('isRewardEligible honors enabled flag and minimum score threshold', () => {
  assert.equal(isRewardEligible(250, { enabled: true, minScoreRequired: 250 }), true);
  assert.equal(isRewardEligible(249, { enabled: true, minScoreRequired: 250 }), false);
  assert.equal(isRewardEligible(350, { enabled: false, minScoreRequired: 250 }), false);
});

test('formatTime outputs formatted mm:ss', () => {
  assert.equal(formatTime(30), '0:30');
  assert.equal(formatTime(5), '0:05');
  assert.equal(formatTime(65), '1:05');
  assert.equal(formatTime(0), '0:00');
});
