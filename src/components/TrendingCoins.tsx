import React from 'react';
import { TrendingCoin } from '../types';
import { TrendingUp } from 'lucide-react';

interface TrendingCoinsProps {
  coins: TrendingCoin[];
}

export const TrendingCoins: React.FC<TrendingCoinsProps> = ({ coins }) => {
  return (
    <div className="mt-4 space-y-2 w-[800px] max-w-full">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-semibold">Trending Tokens</h2>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-white/5 transition-all hover:scale-[1.02] group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl group-hover:blur-2xl transition-all" />
              <img
                src={coin.thumb}
                alt={coin.name}
                className="w-12 h-12 rounded-full relative"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/48/4A90E2/FFFFFF?text=${coin.symbol.charAt(0)}`;
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg tracking-tight">{coin.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm text-white/80">{coin.symbol}</span>
                    {coin.marketCapRank && (
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-medium">
                        Rank #{coin.marketCapRank}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-medium">
                    ${coin.priceUsd.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6
                    })}
                  </div>
                  <div className="flex items-center gap-1 text-sm mt-0.5">
                    <span className="text-white/60">Vol:</span>
                    <span className="text-white/80">
                      ${new Intl.NumberFormat('en-US', {
                        notation: 'compact',
                        maximumFractionDigits: 1
                      }).format(coin.volume)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};