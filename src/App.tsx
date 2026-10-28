/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GameState,
  DifficultyLevel,
  DrinkRecipe,
  ActiveOrder,
  GameStats,
  HighScoreEntry,
  RewardConfig
} from './game/types';
import {
  INGREDIENTS,
  DRINK_RECIPES,
  DIFFICULTY_CONFIGS,
  INITIAL_REWARD_CONFIG,
  CUSTOMER_NAMES,
  CAR_COLORS
} from './game/recipes';
import {
  calculateOrderScore,
  getPerformanceRank,
  checkMojoMoment,
  verifyIngredientStep,
  evaluateAchievements,
  isRewardEligible,
  formatTime
} from './game/rules';
import { sound } from './game/audio';
import { CoffeeCupCanvas } from './components/CoffeeCupCanvas';
import { ScoreCardCanvas } from './components/ScoreCardCanvas';
import { HowToPlayModal } from './components/HowToPlayModal';
import { RewardModal } from './components/RewardModal';
import { ManagerSettingsModal } from './components/ManagerSettingsModal';
import { LeaderboardModal } from './components/LeaderboardModal';

import {
  Coffee,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Trophy,
  Gift,
  ExternalLink,
  Pause,
  Award,
  Sparkles,
  HelpCircle,
  Clock,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

import HERO_CUP_IMG from './assets/images/mojo_coffee_cup_hero_1793125906561.jpg';
import DRIVE_THRU_IMG from './assets/images/mojo_drive_thru_scene_1793125907482.jpg';
import FRAPPE_IMG from './assets/images/mojo_frappe_showcase_1793125906895.jpg';

export default function App() {
  // Navigation & State Machine
  const [gameState, setGameState] = useState<GameState>('TITLE');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('DRIVE_THRU_DASH');
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem('mojo_barista_name') || 'Mojo Barista';
  });

  // Modals
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isRewardOpen, setIsRewardOpen] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Settings & Storage
  const [rewardConfig, setRewardConfig] = useState<RewardConfig>(() => {
    try {
      const stored = localStorage.getItem('mojo_reward_config');
      return stored ? JSON.parse(stored) : INITIAL_REWARD_CONFIG;
    } catch {
      return INITIAL_REWARD_CONFIG;
    }
  });

  const [highScores, setHighScores] = useState<HighScoreEntry[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('mojo_unlocked_achievements');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Gameplay Round State
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [score, setScore] = useState<number>(0);
  const [ordersCompleted, setOrdersCompleted] = useState<number>(0);
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [correctSteps, setCorrectSteps] = useState<number>(0);
  const [perfectOrders, setPerfectOrders] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [mojoMomentsTriggered, setMojoMomentsTriggered] = useState<number>(0);

  // Visual transients
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);
  const [isMojoMomentActive, setIsMojoMomentActive] = useState<boolean>(false);
  const [hasMistakeShake, setHasMistakeShake] = useState<boolean>(false);

  // Sync state to body attribute for ultra-mode and styling
  useEffect(() => {
    document.body.dataset.state = gameState.toLowerCase();
  }, [gameState]);

  // Load high scores from backend with fallback
  const fetchScores = useCallback(async () => {
    // 1. Load from localStorage or initialize with Mojo founders
    const local = localStorage.getItem('mojo_local_scores');
    if (local) {
      try {
        setHighScores(JSON.parse(local));
      } catch {
        // Ignored
      }
    } else {
      const defaultScores: HighScoreEntry[] = [
        {
          id: 'score-1',
          name: 'Austin (Burnet Founder)',
          score: 480,
          rank: 'MOJO LEGEND',
          ordersCompleted: 7,
          difficulty: 'DRIVE_THRU_DASH',
          date: 'Oct 27, 2026'
        },
        {
          id: 'score-2',
          name: 'Forrest (Cedar Park)',
          score: 435,
          rank: 'RUSH MASTER',
          ordersCompleted: 6,
          difficulty: 'DRIVE_THRU_DASH',
          date: 'Oct 26, 2026'
        },
        {
          id: 'score-3',
          name: 'Lloyd (Georgetown)',
          score: 390,
          rank: 'RUSH MASTER',
          ordersCompleted: 5,
          difficulty: 'MORNING_RUSH',
          date: 'Oct 25, 2026'
        },
        {
          id: 'score-4',
          name: 'Marble Falls Racer',
          score: 320,
          rank: 'RUSH MASTER',
          ordersCompleted: 4,
          difficulty: 'DRIVE_THRU_DASH',
          date: 'Oct 24, 2026'
        },
        {
          id: 'score-5',
          name: 'Liberty Hill Barista',
          score: 260,
          rank: 'MOJO REGULAR',
          ordersCompleted: 4,
          difficulty: 'MORNING_RUSH',
          date: 'Oct 23, 2026'
        }
      ];
      setHighScores(defaultScores);
      localStorage.setItem('mojo_local_scores', JSON.stringify(defaultScores));
    }

    // 2. Attempt backend sync if running full-stack
    try {
      const res = await fetch('/api/scores');
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        if (data.scores) {
          setHighScores(data.scores);
        }
      }
    } catch {
      // Expected on static deployments like GitHub Pages
    }
  }, []);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  // Check URL params for ?autostart=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      startNewGame();
    }
  }, []);

  // Keyboard navigation & Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If modal open, Escape closes it
      if (e.key === 'Escape') {
        if (isHowToPlayOpen) { setIsHowToPlayOpen(false); return; }
        if (isRewardOpen) { setIsRewardOpen(false); return; }
        if (isManagerOpen) { setIsManagerOpen(false); return; }
        if (isLeaderboardOpen) { setIsLeaderboardOpen(false); return; }

        if (gameState === 'PLAYING') {
          setGameState('PAUSED');
          return;
        }
        if (gameState === 'PAUSED') {
          setGameState('PLAYING');
          return;
        }
      }

      // Title screen Space/Enter starts game
      if (gameState === 'TITLE' && !isHowToPlayOpen && !isLeaderboardOpen) {
        if (e.key === ' ' || e.key === 'Enter') {
          // If not currently focused on an input
          if (document.activeElement?.tagName !== 'INPUT') {
            e.preventDefault();
            startNewGame();
          }
        }
      }

      // In game controls
      if (gameState === 'PLAYING') {
        if (e.key === 'p' || e.key === 'P') {
          setGameState('PAUSED');
          return;
        }
        if (e.key === 'm' || e.key === 'M') {
          toggleSound();
          return;
        }

        // Ingredient shortcuts
        const key = e.key.toUpperCase();
        const found = Object.values(INGREDIENTS).find(
          (ing) => ing.shortcutKey.toUpperCase() === key
        );
        if (found) {
          handleSelectIngredient(found.id);
        }
      }

      // Pause screen controls
      if (gameState === 'PAUSED') {
        if (e.key === 'r' || e.key === 'R') {
          startNewGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isHowToPlayOpen, isRewardOpen, isManagerOpen, isLeaderboardOpen]);

  // Generate next customer drink order based on current difficulty
  const spawnNextOrder = useCallback((currentDiff: DifficultyLevel): ActiveOrder => {
    const eligibleRecipes = DRINK_RECIPES.filter((r) => {
      if (currentDiff === 'MORNING_RUSH') {
        return r.minDifficulty === 'MORNING_RUSH';
      }
      if (currentDiff === 'DRIVE_THRU_DASH') {
        return r.minDifficulty === 'MORNING_RUSH' || r.minDifficulty === 'DRIVE_THRU_DASH';
      }
      return true; // All for MOJO_MASTER
    });

    const chosenRecipe = eligibleRecipes[Math.floor(Math.random() * eligibleRecipes.length)];
    const customer = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];
    const carColor = CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)];

    return {
      orderId: `order-${Date.now()}`,
      customerName: customer,
      carColor,
      recipe: chosenRecipe,
      currentStepIndex: 0,
      ingredientsAdded: [],
      mistakesOnThisOrder: 0,
      startedAt: Date.now()
    };
  }, []);

  // Start / Restart Game
  const startNewGame = useCallback(() => {
    sound.playClick();
    const config = DIFFICULTY_CONFIGS[difficulty];
    setTimeLeft(config.durationSeconds);
    setScore(0);
    setOrdersCompleted(0);
    setTotalAttempts(0);
    setCorrectSteps(0);
    setPerfectOrders(0);
    setCurrentStreak(0);
    setMaxStreak(0);
    setMojoMomentsTriggered(0);
    setIsMojoMomentActive(false);
    setBannerNotice(null);
    setHasMistakeShake(false);

    const firstOrder = spawnNextOrder(difficulty);
    setActiveOrder(firstOrder);
    setGameState('PLAYING');
  }, [difficulty, spawnNextOrder]);

  // Timer Tick during PLAYING
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Finish Game & Record Score
  const finishGame = useCallback(() => {
    sound.playOrderComplete(true);
    setGameState('GAME_OVER');

    // Update stats and evaluate achievements
    setUnlockedAchievements((prev) => {
      const updated = evaluateAchievements(
        {
          ordersCompleted,
          perfectOrders,
          maxStreak,
          score
        },
        prev
      );
      localStorage.setItem('mojo_unlocked_achievements', JSON.stringify(updated));
      return updated;
    });

    // Save score to backend and localStorage
    const rank = getPerformanceRank(score);
    const newEntry: HighScoreEntry = {
      id: `score-${Date.now()}`,
      name: playerName || 'Texas Racer',
      score,
      rank,
      ordersCompleted,
      difficulty,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    // Always update local storage first so high scores record immediately
    setHighScores((prev) => {
      const updated = [...prev, newEntry].sort((a, b) => b.score - a.score).slice(0, 10);
      localStorage.setItem('mojo_local_scores', JSON.stringify(updated));
      return updated;
    });

    // Optional backend sync if running full-stack
    try {
      fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      })
        .then((res) => {
          if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
            return res.json();
          }
          return null;
        })
        .then((data) => {
          if (data && data.scores) {
            setHighScores(data.scores);
          }
        })
        .catch(() => {});
    } catch {
      // Ignored on static hosts
    }
  }, [ordersCompleted, perfectOrders, maxStreak, score, playerName, difficulty]);

  // Ingredient Tap / Click Handler
  const handleSelectIngredient = (ingredientId: string) => {
    if (gameState !== 'PLAYING' || !activeOrder) return;

    setTotalAttempts((t) => t + 1);

    const result = verifyIngredientStep(
      activeOrder.recipe.requiredIngredients,
      activeOrder.currentStepIndex,
      ingredientId
    );

    if (result.isCorrect) {
      // 1. Correct Step!
      const ingredient = INGREDIENTS[ingredientId];
      sound.playPour(ingredient.category);
      setCorrectSteps((c) => c + 1);

      const updatedIngredients = [...activeOrder.ingredientsAdded, ingredientId];

      if (result.isDrinkComplete) {
        // Completed Order!
        const isPerfect = activeOrder.mistakesOnThisOrder === 0;
        const nextStreak = isPerfect ? currentStreak + 1 : 0;
        setCurrentStreak(nextStreak);
        if (nextStreak > maxStreak) {
          setMaxStreak(nextStreak);
        }

        const isMojoMoment = checkMojoMoment(nextStreak);
        if (isMojoMoment) {
          sound.playMojoMoment();
          setIsMojoMomentActive(true);
          setMojoMomentsTriggered((m) => m + 1);
          setBannerNotice('⚡ MOJO MOMENT! +30 COMBO ⚡');
          setTimeout(() => {
            setIsMojoMomentActive(false);
            setBannerNotice(null);
          }, 2400);
        } else {
          sound.playOrderComplete(isPerfect);
          if (isPerfect) {
            setBannerNotice('✨ PERFECT POUR! +25 BONUS ✨');
            setTimeout(() => setBannerNotice(null), 1500);
          }
        }

        if (isPerfect) {
          setPerfectOrders((p) => p + 1);
        }

        // Calculate score
        const diffConfig = DIFFICULTY_CONFIGS[difficulty];
        const earned = calculateOrderScore(
          activeOrder.recipe.requiredIngredients.length,
          isPerfect,
          nextStreak,
          diffConfig.scoreMultiplier
        );

        // Apply Rush Mode bonus in last 10 seconds
        const rushMultiplier = timeLeft <= 10 ? 2 : 1;
        const totalPoints = earned.points * rushMultiplier;
        setScore((s) => s + totalPoints);

        // Add bonus time for quick completion
        setTimeLeft((t) => Math.min(60, t + diffConfig.timeBonusPerOrder));

        setOrdersCompleted((o) => o + 1);

        // Spawn next customer order with smooth transition
        setActiveOrder(spawnNextOrder(difficulty));
      } else {
        // Advance step
        setActiveOrder({
          ...activeOrder,
          currentStepIndex: result.nextStepIndex,
          ingredientsAdded: updatedIngredients
        });
      }
    } else {
      // Mistake!
      sound.playMistake();
      setHasMistakeShake(true);
      setTimeout(() => setHasMistakeShake(false), 400);

      // Deduct penalty seconds
      const diffConfig = DIFFICULTY_CONFIGS[difficulty];
      setTimeLeft((t) => Math.max(0, t - diffConfig.errorTimePenalty));

      // Reset streak
      setCurrentStreak(0);

      setActiveOrder({
        ...activeOrder,
        mistakesOnThisOrder: activeOrder.mistakesOnThisOrder + 1
      });

      setBannerNotice('⚠️ WRONG INGREDIENT! -TIME');
      setTimeout(() => setBannerNotice(null), 1200);
    }
  };

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleNameChange = (name: string) => {
    setPlayerName(name);
    localStorage.setItem('mojo_barista_name', name);
  };

  const handleSaveRewardConfig = (newConfig: RewardConfig) => {
    setRewardConfig(newConfig);
    localStorage.setItem('mojo_reward_config', JSON.stringify(newConfig));
  };

  // Compile final stats snapshot
  const accuracy = totalAttempts > 0 ? Math.round((correctSteps / totalAttempts) * 100) : 100;
  const currentRank = getPerformanceRank(score);

  const gameStats: GameStats = {
    score,
    ordersCompleted,
    totalAttempts,
    perfectOrders,
    maxStreak,
    currentStreak,
    mojoMomentsTriggered,
    accuracyPercentage: accuracy,
    rank: currentRank,
    difficulty,
    timeRemaining: timeLeft
  };

  const isRushModeActive = gameState === 'PLAYING' && timeLeft <= 10 && timeLeft > 0;

  return (
    <div className="min-h-screen bg-[#0E1114] text-slate-100 flex flex-col justify-between selection:bg-[#FF6600] selection:text-white relative overflow-x-hidden font-sans">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,102,0,0.25),rgba(255,255,255,0))]" />

      {/* =========================================================================
          SCREEN 1: TITLE SCREEN
         ========================================================================= */}
      {gameState === 'TITLE' && (
        <main className="relative z-10 flex-1 flex flex-col items-center justify-between p-4 sm:p-6 max-w-5xl mx-auto w-full">
          {/* Top Bar for Title screen */}
          <header className="w-full flex items-center justify-between gap-4 py-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-heading font-black tracking-wider text-xl text-white">
                MOJO <span className="text-[#FF6600]">RUSH</span>
              </span>
              <span className="text-slate-500 text-xs hidden sm:inline">· Drive-Thru Mini-Game</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleSound}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsLeaderboardOpen(true)}
                className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 rounded-lg flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Shift Records</span>
              </button>
            </div>
          </header>

          {/* Center Title Content Split */}
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-6">
            {/* Left Column: Brand, Pitch, Difficulty & CTA */}
            <div className="md:col-span-7 flex flex-col gap-4 text-left">
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#FF6600] uppercase">
                <Coffee className="w-4 h-4" />
                <span>Mojo Coffee Presents</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black font-heading tracking-tight text-white leading-none uppercase">
                MOJO <span className="text-[#FF6600]">RUSH</span>
              </h1>

              <p className="text-lg sm:text-xl font-bold text-amber-100/90 font-display">
                "Mix It Fast. Find Your Mojo!"
              </p>

              <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                Your coffee break just got competitive. Can you handle the 30-second Central Texas drive-thru rush? Mix signature frappes, iced lattes, and energy drinks before the clock strikes zero!
              </p>

              {/* Barista Name Input */}
              <div className="flex flex-col gap-1.5 pt-1">
                <label className="text-xs font-mono text-slate-400 font-semibold uppercase">
                  Barista Alias:
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  maxLength={18}
                  placeholder="Enter your name"
                  className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-hidden focus:border-[#FF6600] transition-colors"
                />
              </div>

              {/* Difficulty Selection */}
              <div className="flex flex-col gap-2 pt-2">
                <span className="text-xs font-mono text-slate-400 font-semibold uppercase">
                  Select Shift Difficulty:
                </span>
                <div className="grid grid-cols-3 gap-2 max-w-md">
                  {(['MORNING_RUSH', 'DRIVE_THRU_DASH', 'MOJO_MASTER'] as DifficultyLevel[]).map((level) => {
                    const cfg = DIFFICULTY_CONFIGS[level];
                    const isActive = difficulty === level;
                    return (
                      <button
                        key={level}
                        onClick={() => {
                          sound.playClick();
                          setDifficulty(level);
                        }}
                        className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          isActive
                            ? 'bg-[#FF6600]/15 border-[#FF6600] text-white shadow-md'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className={`text-xs font-bold font-heading uppercase ${isActive ? 'text-[#FF8533]' : 'text-slate-300'}`}>
                          {cfg.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono mt-1">
                          {cfg.scoreMultiplier}x Pts · {cfg.durationSeconds}s
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={startNewGame}
                  data-start="true"
                  className="py-3.5 px-8 bg-[#FF6600] hover:bg-[#FF8533] text-white text-base font-black font-heading uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-xl shadow-orange-600/30 active:scale-95 transition-all"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Start Game</span>
                </button>

                <button
                  onClick={() => setIsHowToPlayOpen(true)}
                  className="py-3.5 px-5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-sm font-bold rounded-xl flex items-center gap-2 border border-slate-700 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-orange-400" />
                  <span>How To Play</span>
                </button>
              </div>

              {/* Control Hint as flat inline text */}
              <div className="text-xs text-slate-500 font-mono pt-1">
                Press <span className="text-slate-300 font-bold">Space</span> or <span className="text-slate-300 font-bold">Enter</span> to Start
              </div>
            </div>

            {/* Right Column: Branded Visual Showcase */}
            <div className="md:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative w-full max-w-xs sm:max-w-sm aspect-square rounded-3xl overflow-hidden border-2 border-[#FF6600]/40 shadow-2xl bg-slate-900 group">
                <img
                  src={HERO_CUP_IMG}
                  alt="Mojo Coffee Hot Crema Cup Hero"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* Floating Badge */}
                <div className="absolute bottom-4 inset-x-4 p-3 bg-black/60 backdrop-blur-xs rounded-xl border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white uppercase font-heading">
                      Famous Soft-Serve Frappes
                    </div>
                    <div className="text-[11px] text-orange-300">
                      "Every 10th Coffee is Free"
                    </div>
                  </div>
                  <Coffee className="w-5 h-5 text-[#FF6600]" />
                </div>
              </div>
            </div>
          </div>

          {/* Title Footer with Authentic Links */}
          <footer className="w-full pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <a
                href="https://mojodrivethru.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF6600] flex items-center gap-1 transition-colors"
              >
                <span>Mojo Coffee Official</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://mojodrivethru.com/menu"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF6600] flex items-center gap-1 transition-colors"
              >
                <span>View Menu</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://mojodrivethru.com/locations"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF6600] flex items-center gap-1 transition-colors"
              >
                <span>Central Texas Locations</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="text-slate-500">
              Interactive Marketing Mini-Game Demo · Burnet, Texas
            </div>
          </footer>
        </main>
      )}

      {/* =========================================================================
          SCREEN 2: ACTIVE GAMEPLAY STATION
         ========================================================================= */}
      {gameState === 'PLAYING' && activeOrder && (
        <main className="relative z-10 flex-1 flex flex-col justify-between p-3 sm:p-5 max-w-4xl mx-auto w-full select-none">
          {/* Top Gameplay HUD */}
          <header className="w-full flex items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3 shadow-xl backdrop-blur-xs">
            {/* Score & Combo */}
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                  SCORE
                </span>
                <span className="text-2xl sm:text-3xl font-bold font-mono-tabular text-white leading-none">
                  {score}
                </span>
              </div>

              <div className="border-l border-slate-800 pl-4">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                  ORDERS
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono-tabular text-[#FF8533] leading-none">
                  {ordersCompleted}
                </span>
              </div>
            </div>

            {/* Mojo Moment Streak Pips */}
            <div className="hidden sm:flex flex-col items-center">
              <span className="text-[10px] font-mono tracking-wider text-amber-400 uppercase font-bold">
                MOJO MOMENT STREAK
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                {[1, 2, 3].map((pip) => {
                  const currentMod = currentStreak % 3;
                  const isFilled = currentStreak > 0 && (currentMod >= pip || currentMod === 0);
                  return (
                    <div
                      key={pip}
                      className={`w-3.5 h-3.5 rounded-full border transition-all ${
                        isFilled
                          ? 'bg-[#FF6600] border-amber-300 shadow-[0_0_8px_rgba(255,102,0,0.8)] scale-110'
                          : 'bg-slate-800 border-slate-700'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Timer & Controls */}
            <div className="flex items-center gap-3">
              <div className={`flex flex-col items-end ${timeLeft <= 5 ? 'animate-pulse text-red-400' : 'text-slate-100'}`}>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                  SHIFT CLOCK
                </span>
                <div className="flex items-center gap-1 font-mono-tabular font-black text-2xl sm:text-3xl leading-none">
                  <Clock className={`w-5 h-5 ${timeLeft <= 5 ? 'text-red-500 animate-spin' : 'text-[#FF6600]'}`} />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>

              {/* Utility buttons */}
              <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
                <button
                  onClick={toggleSound}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                  aria-label="Toggle sound"
                  tabIndex={-1}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setGameState('PAUSED')}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                  aria-label="Pause game"
                  tabIndex={-1}
                >
                  <Pause className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          {/* Transient Floating Banner Notice */}
          {bannerNotice && (
            <div className="w-full flex justify-center my-1 z-30">
              <div className="py-1 px-4 bg-gradient-to-r from-[#FF6600] to-amber-500 text-white font-black text-sm uppercase rounded-full shadow-lg shadow-orange-500/40 animate-bounce tracking-wider">
                {bannerNotice}
              </div>
            </div>
          )}

          {/* Central Playfield: Order Ticket + Cup Station */}
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 items-center my-auto py-2">
            {/* Left Ticket: Customer Drink Order */}
            <div className="md:col-span-5 bg-[#171B21] border border-orange-500/30 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3.5 h-3.5 rounded-full shadow-xs"
                    style={{ backgroundColor: activeOrder.carColor || '#FF6600' }}
                  />
                  <span className="text-xs font-mono font-semibold text-slate-300">
                    Drive-Thru Lane 1
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {activeOrder.customerName}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-[#FF6600] uppercase tracking-wider">
                  {activeOrder.recipe.category.replace('_', ' ')}
                </span>
                <h2 className="text-xl font-black font-heading text-white uppercase tracking-wide">
                  {activeOrder.recipe.name}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                  {activeOrder.recipe.description}
                </p>
              </div>

              {/* Recipe Steps Breakdown */}
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">
                  Assembly Recipe Sequence:
                </span>
                <div className="flex flex-col gap-1.5">
                  {activeOrder.recipe.requiredIngredients.map((ingId, idx) => {
                    const ing = INGREDIENTS[ingId];
                    const isDone = idx < activeOrder.currentStepIndex;
                    const isCurrent = idx === activeOrder.currentStepIndex;

                    return (
                      <div
                        key={idx}
                        className={`px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all ${
                          isDone
                            ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                            : isCurrent
                            ? 'bg-[#FF6600]/20 border border-[#FF6600] text-white font-bold shadow-xs'
                            : 'bg-slate-900/40 border border-slate-800 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] w-4 opacity-70">
                            {idx + 1}.
                          </span>
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: ing.color }}
                          />
                          <span>{ing.name}</span>
                        </div>

                        <div>
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : isCurrent ? (
                            <span className="text-[10px] uppercase font-mono text-[#FF8533] animate-pulse">
                              Pour Next →
                            </span>
                          ) : (
                            <span className="text-[10px] uppercase font-mono opacity-40">
                              Waiting
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: The Interactive Cup Station */}
            <div className="md:col-span-7 flex flex-col items-center justify-center p-2">
              <CoffeeCupCanvas
                recipe={activeOrder.recipe}
                ingredientsAdded={activeOrder.ingredientsAdded}
                isMojoMoment={isMojoMomentActive}
                isRushMode={isRushModeActive}
                hasMistake={hasMistakeShake}
              />
            </div>
          </div>

          {/* Bottom Ingredient Dispenser Bar */}
          <footer className="w-full bg-[#13171C] border border-slate-800 rounded-2xl p-3 shadow-2xl">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Tap Ingredient to Dispense:
              </span>
              <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                Shortcuts: [1] to [9], [0], [B], [S], [C], [W]
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {Object.values(INGREDIENTS).map((ing) => {
                const isNeeded = activeOrder.recipe.requiredIngredients.includes(ing.id);
                const isNextExpected =
                  activeOrder.recipe.requiredIngredients[activeOrder.currentStepIndex] === ing.id;

                return (
                  <button
                    key={ing.id}
                    onClick={() => handleSelectIngredient(ing.id)}
                    className={`relative p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 active:scale-95 transition-all text-center ${
                      isNextExpected
                        ? 'border-[#FF6600] bg-[#FF6600]/15 text-white shadow-md shadow-orange-500/20'
                        : isNeeded
                        ? 'border-slate-700 bg-slate-900/80 text-slate-200 hover:border-slate-500'
                        : 'border-slate-800/80 bg-slate-950/60 text-slate-400 hover:text-slate-300'
                    }`}
                    aria-label={`Add ${ing.name}`}
                  >
                    {/* Color dot */}
                    <div
                      className="w-3.5 h-3.5 rounded-full shadow-inner border border-white/20"
                      style={{ backgroundColor: ing.color }}
                    />

                    {/* Name */}
                    <span className="text-[11px] font-bold leading-tight line-clamp-1">
                      {ing.shortName}
                    </span>

                    {/* Shortcut indicator */}
                    <span className="text-[9px] font-mono px-1 py-0.2 bg-black/50 text-slate-400 rounded">
                      [{ing.shortcutKey}]
                    </span>
                  </button>
                );
              })}
            </div>
          </footer>
        </main>
      )}

      {/* =========================================================================
          SCREEN 3: PAUSED OVERLAY
         ========================================================================= */}
      {gameState === 'PAUSED' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-sm bg-[#13171C] border border-orange-500/40 rounded-2xl p-6 shadow-2xl text-slate-100 flex flex-col gap-4 text-center">
            <h3 className="text-2xl font-black font-heading uppercase tracking-wide text-white">
              Shift Paused
            </h3>
            <p className="text-xs text-slate-400">
              Clock is frozen. Take a breath and get ready to jump back into the drive-thru rush!
            </p>

            <div className="py-2 flex justify-around text-center border-y border-slate-800 font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">SCORE</span>
                <span className="text-xl font-bold text-white">{score}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">ORDERS</span>
                <span className="text-xl font-bold text-[#FF8533]">{ordersCompleted}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">TIME LEFT</span>
                <span className="text-xl font-bold text-amber-400">{timeLeft}s</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => setGameState('PLAYING')}
                className="py-3 px-4 bg-[#FF6600] hover:bg-[#FF8533] text-white font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95"
              >
                Resume Shift (Esc / P)
              </button>

              <button
                onClick={startNewGame}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart Round (R)</span>
              </button>

              <button
                onClick={() => setGameState('TITLE')}
                className="py-2.5 px-4 text-slate-500 hover:text-slate-300 text-xs font-semibold"
              >
                Exit to Title Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN 4: GAME OVER / FINAL RESULTS
         ========================================================================= */}
      {gameState === 'GAME_OVER' && (
        <main className="relative z-10 flex-1 flex flex-col items-center justify-between p-4 sm:p-6 max-w-4xl mx-auto w-full select-none">
          {/* Header */}
          <div className="text-center py-2">
            <span className="text-xs font-mono text-[#FF6600] font-bold tracking-widest uppercase">
              Drive-Thru Shift Finished
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-heading text-white uppercase tracking-tight">
              Mojo Rush Results
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              "Mix It Fast. Find Your Mojo!" Certified Texas Barista Performance.
            </p>
          </div>

          {/* Downloadable Canvas Score Card */}
          <div className="w-full my-3 flex justify-center">
            <ScoreCardCanvas
              stats={gameStats}
              playerName={playerName}
              achievementsUnlocked={unlockedAchievements}
            />
          </div>

          {/* Reward & Marketing Discovery Bar */}
          <div className="w-full max-w-2xl bg-[#14181E] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3 my-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">Drive-Thru Promotional Perk</h4>
                  <p className="text-xs text-slate-400">
                    {isRewardEligible(score, rewardConfig)
                      ? 'Congratulations! You unlocked the Mojo barista discount card!'
                      : `Score ${rewardConfig.minScoreRequired} pts to qualify for promotional perks.`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsRewardOpen(true)}
                className="py-2 px-3.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-all"
              >
                View Promo Perk
              </button>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md pt-2">
            <button
              onClick={startNewGame}
              data-start="true"
              className="flex-1 min-w-[160px] py-3.5 px-6 bg-[#FF6600] hover:bg-[#FF8533] text-white font-black font-heading text-base uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-orange-500/30 active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>

            <button
              onClick={() => setGameState('TITLE')}
              className="py-3.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl transition-colors"
            >
              Menu
            </button>
          </div>

          {/* Official Mojo Links */}
          <footer className="w-full pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 mt-4">
            <a
              href="https://mojodrivethru.com/menu"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF6600] flex items-center gap-1 transition-colors"
            >
              <span>Explore Menu</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://mojodrivethru.com/locations"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF6600] flex items-center gap-1 transition-colors"
            >
              <span>Find a Location</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setIsLeaderboardOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              High Scores
            </button>
          </footer>
        </main>
      )}

      {/* =========================================================================
          MODALS
         ========================================================================= */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
        onStartGame={startNewGame}
      />

      <RewardModal
        stats={gameStats}
        config={rewardConfig}
        isOpen={isRewardOpen}
        onClose={() => setIsRewardOpen(false)}
        onOpenManager={() => {
          setIsRewardOpen(false);
          setIsManagerOpen(true);
        }}
      />

      <ManagerSettingsModal
        config={rewardConfig}
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        onSave={handleSaveRewardConfig}
      />

      <LeaderboardModal
        scores={highScores}
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />
    </div>
  );
}
