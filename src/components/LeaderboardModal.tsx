import React from 'react';
import { HighScoreEntry } from '../game/types';
import { Trophy, Award, X, Sparkles } from 'lucide-react';

interface LeaderboardModalProps {
  scores: HighScoreEntry[];
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  scores,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-[#13171C] border border-orange-500/40 rounded-2xl p-6 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[85vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          aria-label="Close high scores"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading uppercase text-white tracking-wide">
              Mojo Shift High Scores
            </h3>
            <p className="text-xs text-slate-400">Top virtual baristas across Central Texas</p>
          </div>
        </div>

        {/* Score List */}
        <div className="overflow-y-auto flex flex-col gap-2 pr-1 divide-y divide-slate-800/80">
          {scores.map((entry, index) => {
            const isTop3 = index < 3;
            const rankBadge = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;

            return (
              <div
                key={entry.id || index}
                className={`pt-2 pb-1.5 flex items-center justify-between gap-3 ${
                  isTop3 ? 'bg-slate-900/40 px-2 rounded-lg' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-bold w-6 text-center text-slate-400">
                    {rankBadge}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-100">{entry.name}</span>
                      {entry.isBackendScore && (
                        <span className="text-[10px] text-orange-400 bg-orange-950/60 px-1.5 py-0.2 rounded font-mono">
                          Live
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span className="text-amber-400 font-medium">{entry.rank}</span>
                      <span>·</span>
                      <span>{entry.ordersCompleted} orders</span>
                      <span>·</span>
                      <span className="text-slate-500">{entry.date}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono-tabular font-bold text-lg text-white">
                    {entry.score}
                  </div>
                  <div className="text-[10px] uppercase text-slate-500 font-mono">
                    pts
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Scores stored across browser and server shift records.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
