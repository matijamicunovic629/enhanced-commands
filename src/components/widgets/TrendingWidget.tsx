import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { getTrendingCoins } from '../../lib/coingecko';
import { TrendingCoin } from '../../types';

export const TrendingWidget: React.FC = () => {
  const [coins, setCoins] = useState<TrendingCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (showRefreshState = false) => {
    try {
      if (showRefreshState) {
        setRefreshing(true);
      }
      const data = await getTrendingCoins();
      if (data && data.length > 0) {
        setCoins(data);
        setError(null);
      } else {
        setError('No trending data available');
      }
    } catch (err) {
      console.error('Error fetching trending coins:', err);
      setError('Unable to load trending data');
    } finally {
      setLoading(false);
      if (showRefreshState) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 2 minutes
    const interval = setInterval(() => fetchData(), 120000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchData(true);
  };

  if (loading) {
    return (
      <div className="p-2 h-full">
        <div className="animate-pulse space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[72px] bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2 h-full flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
        <p className="text-white/60 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-2 h-full flex flex-col">
      <div className="flex justify-end mb-2">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${
            refreshing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title="Refresh data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto ai-chat-scrollbar">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="p-2.5 rounded-xl bg-black/20 hover:bg-black/30 transition-all hover:scale-[1.02] group"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                <img
                  src={coin.thumb}
                  alt={coin.name}
                  className="w-8 h-8 rounded-full relative"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/32/4A90E2/FFFFFF?text=${coin.symbol.charAt(0)}`;
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-sm truncate">{coin.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-white/80">{coin.symbol}</span>
                      {coin.marketCapRank && (
                        <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] font-medium">
                          #{coin.marketCapRank}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      ${coin.priceUsd.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6
                      })}
                    </div>
                    {coin.volume > 0 && (
                      <div className="flex items-center gap-1 text-xs mt-0.5">
                        <span className="text-white/60">Vol:</span>
                        <span className="text-white/80">
                          ${new Intl.NumberFormat('en-US', {
                            notation: 'compact',
                            maximumFractionDigits: 1
                          }).format(coin.volume)}
                        </span>
                      </div>
                    )}
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