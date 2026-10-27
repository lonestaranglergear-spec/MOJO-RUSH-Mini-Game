import React, { useState } from 'react';
import { RewardConfig } from '../game/types';
import { Settings, Save, RotateCcw, X } from 'lucide-react';
import { INITIAL_REWARD_CONFIG } from '../game/recipes';

interface ManagerSettingsModalProps {
  config: RewardConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newConfig: RewardConfig) => void;
}

export const ManagerSettingsModal: React.FC<ManagerSettingsModalProps> = ({
  config,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<RewardConfig>(config);
  const [saveToast, setSaveToast] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    setFormData(INITIAL_REWARD_CONFIG);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-[#13171C] border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100 flex flex-col gap-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          aria-label="Close settings"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-slate-200">
          <Settings className="w-5 h-5 text-[#FF6600]" />
          <h3 className="text-lg font-bold font-heading uppercase tracking-wide">
            Mojo Manager Reward Controls
          </h3>
        </div>

        <p className="text-xs text-slate-400">
          Configure marketing reward rules for promotional campaigns. This simulates how Mojo Coffee store leadership can set seasonal promotions based on mini-game scores.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          {/* Enabled Toggle */}
          <label className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800 cursor-pointer">
            <span className="font-semibold text-slate-300">Enable Promo Reward</span>
            <input
              type="checkbox"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="w-5 h-5 rounded accent-[#FF6600] cursor-pointer"
            />
          </label>

          {/* Min Score Required */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Minimum Score Threshold:
            </label>
            <input
              type="number"
              min={100}
              max={1000}
              step={25}
              value={formData.minScoreRequired}
              onChange={(e) => setFormData({ ...formData, minScoreRequired: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
            />
          </div>

          {/* Reward Title */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Reward Headline:
            </label>
            <input
              type="text"
              value={formData.rewardTitle}
              onChange={(e) => setFormData({ ...formData, rewardTitle: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
            />
          </div>

          {/* Discount Description */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Perk Offer / Discount:
            </label>
            <input
              type="text"
              value={formData.discountDescription}
              onChange={(e) => setFormData({ ...formData, discountDescription: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
            />
          </div>

          {/* Eligible Products */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Eligible Menu Products:
            </label>
            <input
              type="text"
              value={formData.eligibleProducts}
              onChange={(e) => setFormData({ ...formData, eligibleProducts: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800 gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="submit"
              className="py-2.5 px-4 bg-[#FF6600] hover:bg-[#FF8533] text-white font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{saveToast ? 'Saved!' : 'Save Config'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
