/**
 * Mojo Rush Game Types & Data Structures
 */

export type GameState = 'TITLE' | 'HOW_TO_PLAY' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export type DifficultyLevel = 'MORNING_RUSH' | 'DRIVE_THRU_DASH' | 'MOJO_MASTER';

export interface DifficultyConfig {
  id: DifficultyLevel;
  name: string;
  tagline: string;
  durationSeconds: number;
  maxIngredientsPerDrink: number;
  scoreMultiplier: number;
  timeBonusPerOrder: number; // bonus seconds for fast completion
  errorTimePenalty: number;  // seconds deducted on mistake
  description: string;
}

export type IngredientCategory = 'base' | 'dairy' | 'syrup' | 'topping' | 'ice';

export interface Ingredient {
  id: string;
  name: string;
  shortName: string;
  category: IngredientCategory;
  color: string;
  accentColor: string;
  iconName: string;
  hotOrCold: 'hot' | 'cold' | 'both';
  shortcutKey: string; // '1', '2', etc.
}

export interface DrinkRecipe {
  id: string;
  name: string;
  category: 'LATTE_BREVE' | 'FAMOUS_FRAPPE' | 'ENERGY_DRINK' | 'COLD_BREW';
  cupType: 'hot_cup' | 'clear_frappe' | 'iced_cup';
  description: string;
  requiredIngredients: string[]; // array of Ingredient id's in sequence
  isSignature: boolean;
  minDifficulty: DifficultyLevel;
}

export interface ActiveOrder {
  orderId: string;
  customerName: string;
  carColor?: string;
  recipe: DrinkRecipe;
  currentStepIndex: number;
  ingredientsAdded: string[];
  mistakesOnThisOrder: number;
  startedAt: number;
}

export interface Achievement {
  id: 'FIRST_ORDER' | 'PERFECT_POUR' | 'THREE_ORDER_STREAK' | 'RUSH_MASTER' | 'MOJO_LEGEND';
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export type PerformanceRank = 'COFFEE ROOKIE' | 'MOJO REGULAR' | 'RUSH MASTER' | 'MOJO LEGEND';

export interface GameStats {
  score: number;
  ordersCompleted: number;
  totalAttempts: number;
  perfectOrders: number;
  maxStreak: number;
  currentStreak: number;
  mojoMomentsTriggered: number;
  accuracyPercentage: number;
  rank: PerformanceRank;
  difficulty: DifficultyLevel;
  timeRemaining: number;
}

export interface HighScoreEntry {
  id: string;
  name: string;
  score: number;
  rank: PerformanceRank;
  ordersCompleted: number;
  difficulty: DifficultyLevel;
  date: string;
  isBackendScore?: boolean;
}

export interface RewardConfig {
  enabled: boolean;
  minScoreRequired: number;
  rewardTitle: string;
  discountDescription: string;
  eligibleProducts: string;
  validThroughDays: number;
  disclaimer: string;
}
