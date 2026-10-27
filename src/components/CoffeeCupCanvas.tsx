import React from 'react';
import { DrinkRecipe, Ingredient } from '../game/types';
import { INGREDIENTS } from '../game/recipes';

interface CoffeeCupCanvasProps {
  recipe: DrinkRecipe;
  ingredientsAdded: string[];
  isMojoMoment: boolean;
  isRushMode: boolean;
  hasMistake: boolean;
}

export const CoffeeCupCanvas: React.FC<CoffeeCupCanvasProps> = ({
  recipe,
  ingredientsAdded,
  isMojoMoment,
  isRushMode,
  hasMistake
}) => {
  const totalRequired = recipe.requiredIngredients.length;
  const currentCount = ingredientsAdded.length;
  const fillPercentage = totalRequired > 0 ? Math.min(100, Math.round((currentCount / totalRequired) * 100)) : 0;

  const hasIce = ingredientsAdded.includes('ice_cubes');
  const hasWhip = ingredientsAdded.includes('whipped_cream');
  const hasCaramelDrizzle = ingredientsAdded.includes('caramel');
  const hasStrawberryDrizzle = ingredientsAdded.includes('strawberry_syrup');
  const hasChocDrizzle = ingredientsAdded.includes('dark_chocolate');

  // Compute layered colors
  const liquidLayers = ingredientsAdded.map((id) => {
    const item = INGREDIENTS[id];
    return item ? item.color : '#4A2810';
  });

  const isHot = recipe.cupType === 'hot_cup';

  return (
    <div
      className={`relative w-64 h-80 flex flex-col items-center justify-end select-none transition-transform duration-200 ${
        hasMistake ? 'animate-bounce' : ''
      }`}
    >
      {/* Mojo Moment / Rush Mode Particle & Halo Aura */}
      {isMojoMoment && (
        <div className="absolute inset-0 -m-6 rounded-3xl bg-gradient-to-t from-[#FF6600]/30 via-[#F59E0B]/20 to-transparent blur-xl animate-pulse pointer-events-none" />
      )}
      {isRushMode && (
        <div className="absolute -top-4 text-xs font-bold tracking-wider px-3 py-1 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-full uppercase shadow-lg shadow-red-500/30 animate-pulse pointer-events-none">
          ⚡ 2X RUSH BONUS ACTIVE! ⚡
        </div>
      )}

      {/* Steam effect for hot drinks */}
      {isHot && (
        <div className="absolute -top-10 flex gap-4 pointer-events-none z-10">
          <div className="w-2 h-8 rounded-full bg-white/30 blur-[2px] animate-steam-1" />
          <div className="w-2.5 h-10 rounded-full bg-white/40 blur-[2px] animate-steam-2" />
          <div className="w-2 h-7 rounded-full bg-white/30 blur-[2px] animate-steam-3" />
        </div>
      )}

      {/* Whipped Cream Top if added */}
      {hasWhip && (
        <div className="relative z-20 -mb-5 flex flex-col items-center pointer-events-none transition-all duration-300 scale-95 sm:scale-100">
          <div className="w-20 h-10 bg-white rounded-t-full shadow-md relative flex items-center justify-center">
            <div className="w-12 h-6 bg-slate-50 rounded-t-full absolute -top-3 shadow-inner" />
            <div className="w-5 h-5 bg-white rounded-full absolute -top-5" />

            {/* Drizzles on Whip */}
            {hasCaramelDrizzle && (
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="w-16 h-1 bg-[#D97706] rounded-full rotate-12 opacity-90 shadow-sm" />
                <div className="w-14 h-1 bg-[#D97706] rounded-full -rotate-12 opacity-90 shadow-sm" />
              </div>
            )}
            {hasStrawberryDrizzle && (
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="w-16 h-1 bg-[#DC2626] rounded-full rotate-24 opacity-90" />
                <div className="w-12 h-1 bg-[#DC2626] rounded-full -rotate-18 opacity-90" />
              </div>
            )}
            {hasChocDrizzle && (
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="w-16 h-1.5 bg-[#3B1808] rounded-full rotate-6 opacity-90" />
                <div className="w-14 h-1.5 bg-[#3B1808] rounded-full -rotate-20 opacity-90" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Cup Body */}
      <div
        className={`relative w-48 h-64 rounded-b-3xl border-4 overflow-hidden shadow-2xl flex flex-col justify-end transition-all ${
          isMojoMoment
            ? 'border-[#FF6600] shadow-[0_0_30px_rgba(255,102,0,0.6)]'
            : 'border-slate-700/80 bg-slate-900/40 backdrop-blur-xs'
        }`}
        style={{
          clipPath: 'polygon(6% 0%, 94% 0%, 86% 100%, 14% 100%)'
        }}
      >
        {/* Cup Rim highlight */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-b from-white/20 to-transparent z-20 pointer-events-none" />

        {/* Empty state guideline */}
        {ingredientsAdded.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 text-xs text-center px-4 pointer-events-none">
            <span className="text-2xl mb-1 opacity-70">☕</span>
            <span className="font-semibold tracking-wide text-slate-400">Cup is Ready</span>
            <span className="text-[11px] text-slate-500">Tap ingredients below</span>
          </div>
        )}

        {/* Liquid Layer Container */}
        <div
          className="w-full transition-all duration-300 ease-out relative flex flex-col-reverse"
          style={{ height: `${fillPercentage}%` }}
        >
          {liquidLayers.map((color, idx) => (
            <div
              key={idx}
              className="w-full flex-1 transition-all duration-300 relative border-t border-white/10"
              style={{
                backgroundColor: color,
                opacity: 0.95
              }}
            >
              {/* Subtle liquid surface shimmer on top layer */}
              {idx === liquidLayers.length - 1 && (
                <div className="absolute top-0 inset-x-0 h-1 bg-white/40 animate-pulse" />
              )}
            </div>
          ))}

          {/* Floating Ice Cubes if iced */}
          {hasIce && (
            <div className="absolute inset-0 pointer-events-none flex flex-wrap gap-2 p-3 items-center justify-around z-10">
              <div className="w-5 h-5 bg-sky-100/70 rounded-md border border-white/80 shadow-xs rotate-12 backdrop-blur-xs" />
              <div className="w-6 h-6 bg-sky-100/60 rounded-md border border-white/80 shadow-xs -rotate-12 backdrop-blur-xs" />
              <div className="w-5 h-5 bg-sky-100/70 rounded-md border border-white/80 shadow-xs rotate-45 backdrop-blur-xs" />
            </div>
          )}
        </div>

        {/* Drive-thru Cup Sleeve / Brand Badge */}
        <div className="absolute top-1/3 inset-x-4 py-2 bg-gradient-to-r from-[#241A14] via-[#3E2723] to-[#241A14] border-y border-[#FF6600]/40 flex flex-col items-center justify-center shadow-lg z-10 pointer-events-none">
          <div className="text-[10px] tracking-[0.2em] font-extrabold text-[#FF6600] uppercase font-heading">
            MOJO COFFEE
          </div>
          <div className="text-[8px] tracking-wider text-slate-300 font-medium">
            CENTRAL TEXAS
          </div>
        </div>

        {/* Glass reflection / shine */}
        <div className="absolute top-0 right-2 w-4 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-20" />
      </div>

      {/* Progress Pill / Layer count */}
      <div className="mt-3 flex items-center gap-2 text-xs font-mono-tabular">
        <span className="text-slate-400">Fill:</span>
        <span className={`font-bold ${fillPercentage === 100 ? 'text-emerald-400' : 'text-orange-400'}`}>
          {currentCount}/{totalRequired} ({fillPercentage}%)
        </span>
      </div>
    </div>
  );
};
