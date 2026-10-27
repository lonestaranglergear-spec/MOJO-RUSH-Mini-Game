import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameStats } from '../game/types';
import { Download, Share2, Check, Copy } from 'lucide-react';

interface ScoreCardCanvasProps {
  stats: GameStats;
  playerName: string;
  achievementsUnlocked: string[];
}

export const ScoreCardCanvas: React.FC<ScoreCardCanvasProps> = ({
  stats,
  playerName,
  achievementsUnlocked
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Draw card onto high-res canvas
  const renderCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1200;
    const height = 675;
    canvas.width = width;
    canvas.height = height;

    // 1. Deep charcoal/black gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#111417');
    bgGrad.addColorStop(0.5, '#171B20');
    bgGrad.addColorStop(1, '#0D0F12');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle coffee texture / diagonal mesh lines
    ctx.strokeStyle = 'rgba(255, 102, 0, 0.04)';
    ctx.lineWidth = 1;
    for (let i = -width; i < width * 2; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.stroke();
    }

    // Outer border with warm Texas orange accent
    ctx.strokeStyle = '#FF6600';
    ctx.lineWidth = 6;
    ctx.strokeRect(24, 24, width - 48, height - 48);

    // Inner subtle hairline border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.strokeRect(36, 36, width - 72, height - 72);

    // Corner decorative brackets
    const bracketSize = 28;
    ctx.fillStyle = '#FF6600';
    // Top-left
    ctx.fillRect(24, 24, bracketSize, 6);
    ctx.fillRect(24, 24, 6, bracketSize);
    // Top-right
    ctx.fillRect(width - 24 - bracketSize, 24, bracketSize, 6);
    ctx.fillRect(width - 30, 24, 6, bracketSize);
    // Bottom-left
    ctx.fillRect(24, height - 30, bracketSize, 6);
    ctx.fillRect(24, height - 24 - bracketSize, 6, bracketSize);
    // Bottom-right
    ctx.fillRect(width - 24 - bracketSize, height - 30, bracketSize, 6);
    ctx.fillRect(width - 30, height - 24 - bracketSize, 6, bracketSize);

    // 2. Top Header Brand Lockup
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FF6600';
    ctx.font = '700 20px "Space Mono", monospace';
    ctx.fillText('MOJO COFFEE · CENTRAL TEXAS', 70, 85);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 48px "Oswald", "Outfit", sans-serif';
    ctx.fillText('MOJO RUSH: 30-SECOND CHALLENGE', 70, 140);

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('"Mix It Fast. Find Your Mojo!" · mojodrivethru.com', 70, 172);

    // 3. Central Performance Rank & Score Spotlight
    // Rank Box
    const rankColors: Record<string, string> = {
      'MOJO LEGEND': '#F59E0B',
      'RUSH MASTER': '#FF6600',
      'MOJO REGULAR': '#38BDF8',
      'COFFEE ROOKIE': '#10B981'
    };
    const accent = rankColors[stats.rank] || '#FF6600';

    // Left Box: Rank Badge & Player
    ctx.fillStyle = '#1A1E24';
    ctx.fillRect(70, 210, 480, 360);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(70, 210, 480, 360);

    ctx.fillStyle = '#6B7280';
    ctx.font = '700 14px "Space Mono", monospace';
    ctx.fillText('CERTIFIED BARISTA RANK', 100, 250);

    ctx.fillStyle = accent;
    ctx.font = '900 44px "Oswald", "Outfit", sans-serif';
    ctx.fillText(stats.rank, 100, 305);

    ctx.fillStyle = '#E5E7EB';
    ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Barista: ${playerName || 'Mojo Racer'}`, 100, 350);

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '400 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Mode: ${stats.difficulty.replace('_', ' ')}`, 100, 385);

    // Achievements Mini Badges
    ctx.fillStyle = '#6B7280';
    ctx.font = '700 13px "Space Mono", monospace';
    ctx.fillText('UNLOCKED BADGES', 100, 440);

    const badgeList = achievementsUnlocked.length > 0
      ? achievementsUnlocked.map(a => a.replace(/_/g, ' ')).slice(0, 3).join(' · ')
      : 'First Shift Completed';
    ctx.fillStyle = '#F3F4F6';
    ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`⭐ ${badgeList}`, 100, 475);

    // Date
    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    ctx.fillStyle = '#6B7280';
    ctx.font = '14px "Space Mono", monospace';
    ctx.fillText(`Issued: ${dateStr}`, 100, 530);

    // Right Box: High Score & Numerical Metrics
    ctx.fillStyle = '#1A1E24';
    ctx.fillRect(580, 210, 550, 360);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(580, 210, 550, 360);

    // Big Score
    ctx.fillStyle = '#6B7280';
    ctx.font = '700 15px "Space Mono", monospace';
    ctx.fillText('FINAL SCORE', 620, 255);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 86px "Space Mono", monospace';
    ctx.fillText(String(stats.score), 620, 340);

    // Metrics Row
    const metricsY = 410;

    // Stat 1: Orders
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ORDERS BUILT', 620, metricsY);
    ctx.fillStyle = '#FF6600';
    ctx.font = '700 28px "Space Mono", monospace';
    ctx.fillText(`${stats.ordersCompleted}`, 620, metricsY + 36);

    // Stat 2: Accuracy
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ACCURACY', 780, metricsY);
    ctx.fillStyle = '#10B981';
    ctx.font = '700 28px "Space Mono", monospace';
    ctx.fillText(`${stats.accuracyPercentage}%`, 780, metricsY + 36);

    // Stat 3: Best Streak
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('MAX STREAK', 940, metricsY);
    ctx.fillStyle = '#F59E0B';
    ctx.font = '700 28px "Space Mono", monospace';
    ctx.fillText(`${stats.maxStreak}x`, 940, metricsY + 36);

    // Challenge callout bar
    ctx.fillStyle = '#222831';
    ctx.fillRect(620, 480, 470, 60);
    ctx.fillStyle = '#FF8533';
    ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CHALLENGE A FRIEND:', 640, 515);
    ctx.fillStyle = '#D1D5DB';
    ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Think you can serve Texas faster? Find your Mojo!', 805, 515);

    // 4. Footer Note
    ctx.fillStyle = '#4B5563';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Official Mojo Coffee Drive-Thru Marketing Demo · Every 10th Coffee is Free Loyalty Program', 70, 615);

    try {
      const dataUrl = canvas.toDataURL('image/png');
      setDownloadUrl(dataUrl);
    } catch {
      // Ignored in headless or restricted canvas
    }
  }, [stats, playerName, achievementsUnlocked]);

  useEffect(() => {
    renderCard();
  }, [renderCard]);

  const handleDownload = () => {
    if (!downloadUrl && canvasRef.current) {
      try {
        const url = canvasRef.current.toDataURL('image/png');
        setDownloadUrl(url);
      } catch {
        setShareFeedback('Canvas generation issue');
        return;
      }
    }

    if (downloadUrl) {
      const link = document.createElement('a');
      link.download = `mojo-rush-${stats.score}-${stats.rank.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = downloadUrl;
      link.click();
      setShareFeedback('Score Card Downloaded! ☕');
      setTimeout(() => setShareFeedback(null), 3500);
    }
  };

  const handleShare = async () => {
    const shareText = `☕ I scored ${stats.score} as a ${stats.rank} in MOJO RUSH! Can you beat my drive-thru shift? Check out Mojo Coffee at https://mojodrivethru.com/ #MojoRush`;

    if (navigator.share) {
      try {
        // Try sharing the image file if supported
        if (canvasRef.current && canvasRef.current.toBlob) {
          canvasRef.current.toBlob(async (blob) => {
            if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], 'mojo-rush.png', { type: 'image/png' })] })) {
              const file = new File([blob], 'mojo-rush.png', { type: 'image/png' });
              await navigator.share({
                title: 'Mojo Rush Score Card',
                text: shareText,
                files: [file]
              });
              setShareFeedback('Shared successfully!');
              return;
            } else {
              await navigator.share({
                title: 'Mojo Rush Score Card',
                text: shareText,
                url: 'https://mojodrivethru.com/'
              });
              setShareFeedback('Shared successfully!');
            }
          });
          return;
        }
      } catch {
        // Share cancelled or declined by user
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      setIsCopied(true);
      setShareFeedback('Score copied to clipboard! Ready to paste into Instagram or Messages.');
      setTimeout(() => {
        setIsCopied(false);
        setShareFeedback(null);
      }, 4000);
    } catch {
      setShareFeedback('Could not copy. Please use the Download button below.');
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Canvas element (hidden or responsive preview) */}
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-700/80 shadow-2xl bg-slate-900/60 p-2">
        <canvas
          ref={canvasRef}
          className="w-full h-auto rounded-lg shadow-inner block"
          style={{ aspectRatio: '1200/675' }}
        />
      </div>

      {/* Share / Download Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
        <button
          onClick={handleDownload}
          className="flex-1 min-w-[160px] py-3 px-4 bg-[#FF6600] hover:bg-[#FF8533] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all text-sm uppercase tracking-wider"
          aria-label="Download Score Card PNG"
        >
          <Download className="w-4 h-4" />
          <span>Download Score Card</span>
        </button>

        <button
          onClick={handleShare}
          className="flex-1 min-w-[140px] py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-xl flex items-center justify-center gap-2 border border-slate-600 active:scale-95 transition-all text-sm tracking-wide"
          aria-label="Share Result"
        >
          {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          <span>{isCopied ? 'Copied Link' : 'Share Result'}</span>
        </button>
      </div>

      {/* Status Feedback Toast */}
      {shareFeedback && (
        <div className="text-xs text-orange-400 bg-orange-950/40 border border-orange-500/30 px-3 py-1.5 rounded-lg text-center animate-fade-in font-medium">
          {shareFeedback}
        </div>
      )}
    </div>
  );
};
