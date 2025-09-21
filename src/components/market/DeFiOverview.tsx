import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart2,
  Wallet,
  PieChart,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { getDeFiStats, getYieldData, DeFiStats, YieldData } from '../../lib/defillama';

export const DeFiOverview: React.FC = () => {
  const [defiStats, setDefiStats] = useState<DeFiStats | null>(null);
  const [yieldData, setYieldData] = useState<YieldData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stats, yields] = await Promise.all([
        getDeFiStats(),
        getYieldData()
      ]);
      setDefiStats(stats);
      setYieldData(yields);
      setError(null);
    } catch (err) {
      console.error('Error fetching DeFi data:', err);
      setError('Failed to load DeFi metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
        <p className="text-white/60">{error}</p>
      </div>
    );
  }

  if (loading || !defiStats) {
    return (
      <div className="p-6 h-full">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-white/5 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-96 bg-white/5 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto ai-chat-scrollbar">
      {/* Global Metrics */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-white/60">Total Value Locked</span>
          </div>
          <div className="text-2xl font-bold mb-1">
            ${(defiStats.totalTvl / 1e9).toFixed(2)}B
          </div>
          <div className={`flex items-center gap-1 text-sm ${
            defiStats.totalChange24h >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {defiStats.totalChange24h >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{Math.abs(defiStats.totalChange24h).toFixed(2)}%</span>
            <span className="text-white/60">24h</span>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-white/60">DeFi Market Cap</span>
          </div>
          <div className="text-2xl font-bold mb-1">
            ${(defiStats.defiMarketCap / 1e9).toFixed(2)}B
          </div>
          <div className="text-sm text-white/60">
            {((defiStats.defiMarketCap / defiStats.totalTvl) * 100).toFixed(1)}% TVL Ratio
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-4 h-4 text-green-400" />
            <span className="text-sm text-white/60">Category Distribution</span>
          </div>
          <div className="space-y-2">
            {defiStats.categories.slice(0, 3).map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <span>{cat.name}</span>
                <span>${(cat.tvl / 1e9).toFixed(2)}B</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Top Protocols */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Top Protocols by TVL</h3>
            <button
              onClick={fetchData}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {defiStats.protocols.map((protocol) => (
              <div
                key={protocol.name}
                className="flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <img
                  src={protocol.logo}
                  alt={protocol.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{protocol.name}</span>
                      <span className="ml-2 text-sm text-white/60">{protocol.category}</span>
                    </div>
                    <div className="text-right">
                      <div>${(protocol.tvl / 1e9).toFixed(2)}B</div>
                      <div className={`text-sm ${
                        protocol.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {protocol.change24h >= 0 ? '↑' : '↓'}
                        {Math.abs(protocol.change24h).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </div>
            ))}
          </div>
        </div>

        {/* Top Yields */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Top Yield Opportunities</h3>
            <a
              href="https://defillama.com/yields"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="space-y-3">
            {yieldData.map((pool) => (
              <div
                key={`${pool.protocol}-${pool.symbol}`}
                className="flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <img
                  src={pool.logo}
                  alt={pool.protocol}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{pool.protocol}</div>
                      <div className="text-sm text-white/60">
                        {pool.symbol} • {pool.chain}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400">{pool.apy.toFixed(2)}% APY</div>
                      <div className="text-sm text-white/60">
                        TVL: ${(pool.tvlUsd / 1e6).toFixed(2)}M
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};