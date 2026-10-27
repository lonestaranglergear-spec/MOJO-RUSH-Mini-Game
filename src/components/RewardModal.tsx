import React from 'react';
import { RewardConfig, GameStats } from '../game/types';
import { Gift, ShieldCheck, Settings, X, ExternalLink } from 'lucide-react';

interface RewardModalProps {
  stats: GameStats;
  config: RewardConfig;
  isOpen: boolean;
  onClose: () => void;
  onOpenManager: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  stats,
  config,
  isOpen,
  onClose,
  onOpenManager
}) => {
  if (!isOpen) return null;

  const isEligible = config.enabled && stats.score >= config.minScoreRequired;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#14181D] border-2 border-[#FF6600]/80 rounded-2xl p-6 shadow-2xl text-slate-100 flex flex-col gap-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close reward modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#FF6600]/20 border border-[#FF6600]/40 flex items-center justify-center text-[#FF6600]">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading uppercase text-white tracking-wide">
              {isEligible ? "YOU'VE FOUND YOUR MOJO!" : 'MOJO DRIVE-THRU PERK'}
            </h3>
            <p className="text-xs text-slate-400">
              {isEligible
                ? 'Your high score unlocked a drive-thru promo concept'
                : `Score at least ${config.minScoreRequired} pts to unlock this perk`}
            </p>
          </div>
        </div>

        {/* Perk Card Box */}
        {isEligible ? (
          <div className="bg-[#1C222A] border border-orange-500/40 rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#FF6600] font-bold tracking-wider">
                  OFFICIAL DEMO PASS
                </span>
                <h4 className="text-lg font-bold text-white">{config.rewardTitle}</h4>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Rank</span>
                <p className="text-sm font-bold text-[#FF8533]">{stats.rank}</p>
              </div>
            </div>

            <div className="py-2">
              <p className="text-base font-semibold text-amber-200">
                {config.discountDescription}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                <strong className="text-slate-300">Eligible:</strong> {config.eligibleProducts}
              </p>
            </div>

            {/* Simulated Barcode / Drive-thru scan badge */}
            <div className="bg-white/95 rounded-lg p-3 text-slate-900 flex flex-col items-center justify-center">
              {/* Decorative barcode stripes */}
              <div className="flex items-center gap-[3px] h-9 mb-1">
                {[4, 2, 6, 1, 3, 5, 2, 4, 1, 6, 3, 2, 5, 1, 4, 2, 6, 3, 1, 5, 2, 4, 3].map((w, i) => (
                  <div
                    key={i}
                    className="bg-black h-full"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
              <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-slate-700">
                MOJO-PASS-{stats.score}-TX
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-5 text-center text-slate-400 text-sm">
            <p className="mb-2">Your current run scored <strong className="text-white">{stats.score} pts</strong>.</p>
            <p className="text-xs text-slate-500">
              Reach <strong>{config.minScoreRequired} pts</strong> on Morning Rush or Drive-Thru Dash to unlock this barista perk card!
            </p>
          </div>
        )}

        {/* Clear Compliance & Governance Disclaimer */}
        <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-300">Management Notice: </strong>
            {config.disclaimer}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={onOpenManager}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#FF6600] transition-colors"
            title="Configure reward parameters (Management demo)"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Manager Settings</span>
          </button>

          <a
            href="https://mojodrivethru.com/locations"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#FF6600] hover:text-[#FF8533] transition-colors"
          >
            <span>Find Mojo Locations</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
