import { Ingredient, DrinkRecipe, DifficultyConfig, DifficultyLevel } from './types';

export const INGREDIENTS: Record<string, Ingredient> = {
  espresso: {
    id: 'espresso',
    name: 'Espresso Shot',
    shortName: 'Espresso',
    category: 'base',
    color: '#381E11',
    accentColor: '#B07548',
    iconName: 'Coffee',
    hotOrCold: 'hot',
    shortcutKey: '1'
  },
  steamed_milk: {
    id: 'steamed_milk',
    name: 'Steamed Milk',
    shortName: 'Milk',
    category: 'dairy',
    color: '#F4EDE2',
    accentColor: '#FFFFFF',
    iconName: 'Milk',
    hotOrCold: 'hot',
    shortcutKey: '2'
  },
  breve_cream: {
    id: 'breve_cream',
    name: 'Breve (Half & Half)',
    shortName: 'Breve',
    category: 'dairy',
    color: '#FDF6E2',
    accentColor: '#FFF8E7',
    iconName: 'Milk',
    hotOrCold: 'both',
    shortcutKey: '3'
  },
  cold_brew: {
    id: 'cold_brew',
    name: 'Nitro Cold Brew Base',
    shortName: 'Cold Brew',
    category: 'base',
    color: '#20120B',
    accentColor: '#6B4226',
    iconName: 'Droplet',
    hotOrCold: 'cold',
    shortcutKey: '4'
  },
  energy_base: {
    id: 'energy_base',
    name: 'Mojo Energy Base',
    shortName: 'Energy',
    category: 'base',
    color: '#FFE57F',
    accentColor: '#FFD700',
    iconName: 'Zap',
    hotOrCold: 'cold',
    shortcutKey: '5'
  },
  ice_cubes: {
    id: 'ice_cubes',
    name: 'Fresh Ice',
    shortName: 'Ice',
    category: 'ice',
    color: '#E0F2FE',
    accentColor: '#BAE6FD',
    iconName: 'Sparkles',
    hotOrCold: 'cold',
    shortcutKey: '6'
  },
  ice_cream_base: {
    id: 'ice_cream_base',
    name: 'Frappe Soft-Serve Base',
    shortName: 'Frappe Base',
    category: 'dairy',
    color: '#F8F1E5',
    accentColor: '#FFF9EF',
    iconName: 'IceCream',
    hotOrCold: 'cold',
    shortcutKey: '7'
  },
  vanilla: {
    id: 'vanilla',
    name: 'Vanilla Syrup',
    shortName: 'Vanilla',
    category: 'syrup',
    color: '#FCE7A6',
    accentColor: '#EAB308',
    iconName: 'FlaskConical',
    hotOrCold: 'both',
    shortcutKey: '8'
  },
  dark_chocolate: {
    id: 'dark_chocolate',
    name: 'Dark Chocolate Sauce',
    shortName: 'Chocolate',
    category: 'syrup',
    color: '#3B1808',
    accentColor: '#78350F',
    iconName: 'Candy',
    hotOrCold: 'both',
    shortcutKey: '9'
  },
  caramel: {
    id: 'caramel',
    name: 'Rich Caramel Sauce',
    shortName: 'Caramel',
    category: 'syrup',
    color: '#D97706',
    accentColor: '#F59E0B',
    iconName: 'Flame',
    hotOrCold: 'both',
    shortcutKey: '0'
  },
  blue_raspberry: {
    id: 'blue_raspberry',
    name: 'Blue Raspberry Syrup',
    shortName: 'Blue Rasp',
    category: 'syrup',
    color: '#0284C7',
    accentColor: '#38BDF8',
    iconName: 'Sparkle',
    hotOrCold: 'cold',
    shortcutKey: 'B'
  },
  strawberry_syrup: {
    id: 'strawberry_syrup',
    name: 'Strawberry Syrup / Drizzle',
    shortName: 'Strawberry',
    category: 'syrup',
    color: '#DC2626',
    accentColor: '#F87171',
    iconName: 'Heart',
    hotOrCold: 'cold',
    shortcutKey: 'S'
  },
  coconut_syrup: {
    id: 'coconut_syrup',
    name: 'Coconut Flavor',
    shortName: 'Coconut',
    category: 'syrup',
    color: '#FAF5FF',
    accentColor: '#E9D5FF',
    iconName: 'Sun',
    hotOrCold: 'both',
    shortcutKey: 'C'
  },
  whipped_cream: {
    id: 'whipped_cream',
    name: 'Whipped Cream',
    shortName: 'Whip',
    category: 'topping',
    color: '#FFFFFF',
    accentColor: '#F1F5F9',
    iconName: 'Cloud',
    hotOrCold: 'both',
    shortcutKey: 'W'
  }
};

export const DRINK_RECIPES: DrinkRecipe[] = [
  // 1. Classic Hot Drinks
  {
    id: 'mojo_classic_latte',
    name: 'Mojo Classic Latte',
    category: 'LATTE_BREVE',
    cupType: 'hot_cup',
    description: 'Smooth espresso paired with velvety steamed milk.',
    requiredIngredients: ['espresso', 'steamed_milk'],
    isSignature: true,
    minDifficulty: 'MORNING_RUSH'
  },
  {
    id: 'french_vanilla_breve',
    name: 'French Vanilla Breve',
    category: 'LATTE_BREVE',
    cupType: 'hot_cup',
    description: 'Rich espresso, creamy half & half, and sweet French vanilla.',
    requiredIngredients: ['vanilla', 'espresso', 'breve_cream'],
    isSignature: true,
    minDifficulty: 'MORNING_RUSH'
  },
  {
    id: 'caramel_macchiato',
    name: 'Caramel Macchiato',
    category: 'LATTE_BREVE',
    cupType: 'hot_cup',
    description: 'Vanilla syrup, steamed milk, bold espresso, topped with rich caramel.',
    requiredIngredients: ['vanilla', 'steamed_milk', 'espresso', 'caramel'],
    isSignature: true,
    minDifficulty: 'DRIVE_THRU_DASH'
  },
  {
    id: 'six_shooter',
    name: 'The Six Shooter Mocha',
    category: 'LATTE_BREVE',
    cupType: 'hot_cup',
    description: 'Double espresso punch with dark chocolate and whipped cream.',
    requiredIngredients: ['dark_chocolate', 'espresso', 'steamed_milk', 'whipped_cream'],
    isSignature: true,
    minDifficulty: 'DRIVE_THRU_DASH'
  },

  // 2. Famous Soft-Serve Frappes (Mojo Specialty - Soft serve ice cream machine blended!)
  {
    id: 'dark_chocolate_frappe',
    name: 'Dark Chocolate Frappe',
    category: 'FAMOUS_FRAPPE',
    cupType: 'clear_frappe',
    description: 'Rich dark chocolate infused into Mojo soft-serve frappe base with whip.',
    requiredIngredients: ['cold_brew', 'dark_chocolate', 'ice_cream_base', 'whipped_cream'],
    isSignature: true,
    minDifficulty: 'MORNING_RUSH'
  },
  {
    id: 'almond_joy_frappe',
    name: 'Almond Joy Frappe',
    category: 'FAMOUS_FRAPPE',
    cupType: 'clear_frappe',
    description: 'Rich chocolate, toasted coconut, and cold brew in creamy soft-serve.',
    requiredIngredients: ['dark_chocolate', 'coconut_syrup', 'ice_cream_base', 'whipped_cream'],
    isSignature: true,
    minDifficulty: 'DRIVE_THRU_DASH'
  },
  {
    id: 'caramel_twister_frappe',
    name: 'Caramel Twister Frappe',
    category: 'FAMOUS_FRAPPE',
    cupType: 'clear_frappe',
    description: 'Decadent caramel swirls over frozen frappe with whipped cream.',
    requiredIngredients: ['cold_brew', 'caramel', 'ice_cream_base', 'whipped_cream'],
    isSignature: false,
    minDifficulty: 'MOJO_MASTER'
  },

  // 3. Signature Energy Drinks
  {
    id: 'shark_attack',
    name: 'Shark Attack Energy',
    category: 'ENERGY_DRINK',
    cupType: 'iced_cup',
    description: 'Blue raspberry & coconut energy over ice, crowned with strawberry drizzle.',
    requiredIngredients: ['ice_cubes', 'blue_raspberry', 'coconut_syrup', 'energy_base', 'strawberry_syrup'],
    isSignature: true,
    minDifficulty: 'DRIVE_THRU_DASH'
  },
  {
    id: 'tigers_blood',
    name: "Tiger's Blood Energy",
    category: 'ENERGY_DRINK',
    cupType: 'iced_cup',
    description: 'Strawberry, tropical coconut, and crisp Mojo energy over fresh ice.',
    requiredIngredients: ['ice_cubes', 'strawberry_syrup', 'coconut_syrup', 'energy_base'],
    isSignature: true,
    minDifficulty: 'MORNING_RUSH'
  },
  {
    id: 'mustang_energy',
    name: 'Mustang Energy',
    category: 'ENERGY_DRINK',
    cupType: 'iced_cup',
    description: 'Electric blue raspberry and strawberry rush charged with Mojo energy.',
    requiredIngredients: ['ice_cubes', 'blue_raspberry', 'strawberry_syrup', 'energy_base'],
    isSignature: false,
    minDifficulty: 'MOJO_MASTER'
  },

  // 4. Cold Brew
  {
    id: 'nitro_cold_brew',
    name: 'Nitro Cold Brew Special',
    category: 'COLD_BREW',
    cupType: 'iced_cup',
    description: '24-hour slow steeped cold brew poured over ice with vanilla sweet cream.',
    requiredIngredients: ['ice_cubes', 'vanilla', 'cold_brew', 'breve_cream'],
    isSignature: true,
    minDifficulty: 'MORNING_RUSH'
  }
];

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  MORNING_RUSH: {
    id: 'MORNING_RUSH',
    name: 'Morning Rush',
    tagline: 'Casual Warm-up',
    durationSeconds: 35,
    maxIngredientsPerDrink: 3,
    scoreMultiplier: 1.0,
    timeBonusPerOrder: 3,
    errorTimePenalty: 2,
    description: 'Perfect for first-time virtual baristas. Simpler 2-3 step drink orders with forgiving timers.'
  },
  DRIVE_THRU_DASH: {
    id: 'DRIVE_THRU_DASH',
    name: 'Drive-Thru Dash',
    tagline: 'Standard Shift Pace',
    durationSeconds: 30,
    maxIngredientsPerDrink: 4,
    scoreMultiplier: 1.25,
    timeBonusPerOrder: 2,
    errorTimePenalty: 3,
    description: 'The real Mojo drive-thru pace! 3-4 ingredient recipes including signature frappes and energy drinks.'
  },
  MOJO_MASTER: {
    id: 'MOJO_MASTER',
    name: 'Mojo Master',
    tagline: 'High Speed Barista Legend',
    durationSeconds: 30,
    maxIngredientsPerDrink: 5,
    scoreMultiplier: 1.5,
    timeBonusPerOrder: 1.5,
    errorTimePenalty: 4,
    description: 'Top-tier speed and precision! Full 4-5 ingredient specialty drink builds with drizzles and dripper toppings.'
  }
};

export const INITIAL_REWARD_CONFIG = {
  enabled: true,
  minScoreRequired: 250,
  rewardTitle: 'Drive-Thru Barista Perk',
  discountDescription: '15% Off Any Signature Frappe or Specialty Drink',
  eligibleProducts: 'Famous Frappes, Shark Attack Energy, Cold Brew, Hot Mochas',
  validThroughDays: 14,
  disclaimer: 'DEMO PROTOTYPE: Promotional reward concept. Any actual redemption requires official Mojo Coffee management authorization at participating Central Texas drive-thrus.'
};

export const CUSTOMER_NAMES = [
  'Austin (Burnet)',
  'Forrest (Cedar Park)',
  'Lloyd (Georgetown)',
  'Taylor (Marble Falls)',
  'Morgan (Liberty Hill)',
  'Jordan (Lampasas)',
  'Casey (Lakeline)',
  'Alex (Copperas Cove)',
  'Sam (Kingsland)',
  'Riley (Mayfield Ranch)'
];

export const CAR_COLORS = [
  '#FF6600', // Mojo Orange
  '#2563EB', // Blue Truck
  '#DC2626', // Red SUV
  '#16A34A', // Green Crossover
  '#4B5563', // Slate Sedan
  '#D97706', // Amber Jeep
];
