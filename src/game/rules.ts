import { PerformanceRank, Achievement, RewardConfig } from './types';

/**
 * Calculates points awarded for a completed drink order.
 */
export function calculateOrderScore(
  ingredientCount: number,
  isPerfect: boolean,
  currentStreak: number,
  scoreMultiplier: number
): { points: number; breakdown: { base: number; completion: number; perfectBonus: number; streakBonus: number } } {
  const base = ingredientCount * 10;
  const completion = 50;
  const perfectBonus = isPerfect ? 25 : 0;
  // Award 30 bonus points if currently on a 3+ order streak (Mojo Moment)
  const streakBonus = currentStreak >= 3 ? 30 : 0;

  const totalRaw = base + completion + perfectBonus + streakBonus;
  const points = Math.round(totalRaw * scoreMultiplier);

  return {
    points,
    breakdown: {
      base,
      completion,
      perfectBonus,
      streakBonus
    }
  };
}

/**
 * Determines barista performance rank based on actual score.
 */
export function getPerformanceRank(score: number): PerformanceRank {
  if (score >= 450) {
    return 'MOJO LEGEND';
  }
  if (score >= 300) {
    return 'RUSH MASTER';
  }
  if (score >= 150) {
    return 'MOJO REGULAR';
  }
  return 'COFFEE ROOKIE';
}

/**
 * Determines if a Mojo Moment is triggered (every 3 consecutive flawless orders).
 */
export function checkMojoMoment(streak: number): boolean {
  return streak >= 3 && streak % 3 === 0;
}

/**
 * Verifies if the selected ingredient is the expected next step in the drink sequence.
 */
export function verifyIngredientStep(
  requiredIngredients: string[],
  currentStepIndex: number,
  selectedIngredientId: string
): { isCorrect: boolean; isDrinkComplete: boolean; nextStepIndex: number } {
  if (currentStepIndex >= requiredIngredients.length) {
    return { isCorrect: false, isDrinkComplete: true, nextStepIndex: currentStepIndex };
  }

  const expected = requiredIngredients[currentStepIndex];
  const isCorrect = expected === selectedIngredientId;

  if (isCorrect) {
    const nextStepIndex = currentStepIndex + 1;
    const isDrinkComplete = nextStepIndex === requiredIngredients.length;
    return { isCorrect: true, isDrinkComplete, nextStepIndex };
  }

  return { isCorrect: false, isDrinkComplete: false, nextStepIndex: currentStepIndex };
}

/**
 * Evaluates achievement unlocks based on gameplay stats.
 */
export function evaluateAchievements(
  stats: {
    ordersCompleted: number;
    perfectOrders: number;
    maxStreak: number;
    score: number;
  },
  unlockedIds: string[]
): string[] {
  const newUnlocked = new Set<string>(unlockedIds);

  if (stats.ordersCompleted >= 1) {
    newUnlocked.add('FIRST_ORDER');
  }
  if (stats.perfectOrders >= 1) {
    newUnlocked.add('PERFECT_POUR');
  }
  if (stats.maxStreak >= 3) {
    newUnlocked.add('THREE_ORDER_STREAK');
  }
  if (stats.ordersCompleted >= 5) {
    newUnlocked.add('RUSH_MASTER');
  }
  if (stats.score >= 400) {
    newUnlocked.add('MOJO_LEGEND');
  }

  return Array.from(newUnlocked);
}

/**
 * Evaluates promotional reward eligibility.
 */
export function isRewardEligible(score: number, config: Pick<RewardConfig, 'enabled' | 'minScoreRequired'>): boolean {
  return config.enabled && score >= config.minScoreRequired;
}

/**
 * Formats countdown seconds nicely.
 */
export function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.ceil(seconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
