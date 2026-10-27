import React from 'react';
import { Coffee, Zap, Sparkles, X, Play, Clock, Flame } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
  onStartGame
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#13171C] border border-orange-500/50 rounded-2xl p-6 shadow-2xl text-slate-100 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          aria-label="Close tutorial"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <span className="text-xs font-mono text-[#FF6600] font-bold uppercase tracking-wider">
            Virtual Barista Training
          </span>
          <h3 className="text-2xl font-black font-heading uppercase text-white tracking-wide">
            How To Play Mojo Rush
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            "Your coffee break just got competitive." Master the Mojo drive-thru in 30 seconds!
          </p>
        </div>

        {/* 3 Step Tutorial Cards */}
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3 p-3 bg-slate-900/70 border border-slate-800 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-[#FF6600] flex items-center justify-center font-bold font-mono text-sm shrink-0">
              1
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Coffee className="w-4 h-4 text-orange-400" />
                Read the Order Ticket
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Each incoming car orders a signature Mojo drink. Look at the sequence of ingredients displayed on the ticket.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-900/70 border border-slate-800 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-mono text-sm shrink-0">
              2
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Tap Ingredients in Order
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Tap the exact ingredient buttons (or press keyboard numbers 1–9) from bottom to top. Watch the cup fill with liquid, ice, and whipped cream!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-900/70 border border-slate-800 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 text-yellow-300 flex items-center justify-center font-bold font-mono text-sm shrink-0">
              3
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                Trigger "Mojo Moments" & Combos
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Serve 3 consecutive drinks without any mistakes to trigger a <strong>MOJO MOMENT</strong>! Earn +30 combo bonuses, golden auras, and climb to <strong>MOJO LEGEND</strong> rank.
              </p>
            </div>
          </div>
        </div>

        {/* Scoring & Penalties */}
        <div className="p-3 bg-orange-950/20 border border-orange-500/30 rounded-xl text-xs flex flex-col gap-1.5">
          <div className="font-bold text-[#FF8533] uppercase flex items-center gap-1 font-mono text-[11px]">
            <Flame className="w-3.5 h-3.5" />
            Scoring Rules
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
            <div>• Correct Step: <strong>+10 pts</strong></div>
            <div>• Completed Drink: <strong>+50 pts</strong></div>
            <div>• Perfect Pour: <strong>+25 pts</strong></div>
            <div>• Mojo Moment: <strong>+30 pts</strong></div>
          </div>
          <div className="text-[10px] text-red-300 mt-1">
            ⚠️ Warning: Incorrect ingredients deduct 2-4 seconds off your shift timer!
          </div>
        </div>

        {/* Start Game CTA */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
          >
            Back
          </button>
          <button
            onClick={() => {
              onClose();
              onStartGame();
            }}
            data-start="true"
            className="py-2.5 px-5 bg-[#FF6600] hover:bg-[#FF8533] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Clock In & Play</span>
          </button>
        </div>
      </div>
    </div>
  );
};
