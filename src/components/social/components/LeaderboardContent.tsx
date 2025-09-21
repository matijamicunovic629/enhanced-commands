import React, { useState } from 'react';
import { Trophy, Medal, TrendingUp, Users, Filter, Search, RefreshCw, DollarSign } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  domain: string;
  avatar: string;
  verified: boolean;
  stats: {
    pnl7d: number;
    pnl30d: number;
    winRate7d: number;
    transactions7d: number;
    followers: number;
    trades: number;
    feesEarned: number;
  };
  change: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: '1',
    rank: 1,
    name: 'cryptowhale',
    domain: 'eth',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cryptowhale',
    verified: true,
    stats: {
      pnl7d: 450000,
      pnl30d: 2450000,
      winRate7d: 85,
      transactions7d: 145,
      followers: 45200,
      trades: 1250,
      feesEarned: 1486
    },
    change: 0
  },
  {
    id: '2',
    rank: 2,
    name: 'tradingmaster',
    domain: 'fcast.id',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tradingmaster',
    verified: true,
    stats: {
      pnl7d: 380000,
      pnl30d: 1850000,
      winRate7d: 82,
      transactions7d: 132,
      followers: 32100,
      trades: 980,
      feesEarned: 1114
    },
    change: 1
  },
  {
    id: '3',
    rank: 3,
    name: 'defiking',
    domain: 'lens',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=defiking',
    verified: true,
    stats: {
      pnl7d: 320000,
      pnl30d: 1250000,
      winRate7d: 78,
      transactions7d: 98,
      followers: 28500,
      trades: 850,
      feesEarned: 590.8
    },
    change: -1
  },
  {
    id: '4',
    rank: 4,
    name: 'alphatrader',
    domain: 'eth',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alphatrader',
    verified: true,
    stats: {
      pnl7d: 280000,
      pnl30d: 980000,
      winRate7d: 75,
      transactions7d: 87,
      followers: 21800,
      trades: 720,
      feesEarned: 576.64
    },
    change: 2
  },
  {
    id: '5',
    rank: 5,
    name: 'memequeen',
    domain: 'fcast.id',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=memequeen',
    verified: true,
    stats: {
      pnl7d: 250000,
      pnl30d: 750000,
      winRate7d: 73,
      transactions7d: 76,
      followers: 18900,
      trades: 650,
      feesEarned: 543.87
    },
    change: -2
  },
  {
    id: '6',
    rank: 6,
    name: 'yieldfarmer',
    domain: 'eth',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yieldfarmer',
    verified: true,
    stats: {
      pnl7d: 220000,
      pnl30d: 680000,
      winRate7d: 71,
      transactions7d: 65,
      followers: 15600,
      trades: 580,
      feesEarned: 431.09
    },
    change: 1
  },
  {
    id: '7',
    rank: 7,
    name: 'nftflip',
    domain: 'lens',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nftflip',
    verified: true,
    stats: {
      pnl7d: 180000,
      pnl30d: 520000,
      winRate7d: 69,
      transactions7d: 54,
      followers: 12800,
      trades: 450,
      feesEarned: 387.52
    },
    change: -1
  },
  {
    id: '8',
    rank: 8,
    name: 'moonshot',
    domain: 'eth',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=moonshot',
    verified: true,
    stats: {
      pnl7d: 150000,
      pnl30d: 420000,
      winRate7d: 68,
      transactions7d: 48,
      followers: 9500,
      trades: 380,
      feesEarned: 312.45
    },
    change: 0
  }
];

type TimeFrame = '24h' | '7d' | '30d' | 'all';
type SortBy = 'pnl7d' | 'pnl30d' | 'winRate7d' | 'transactions7d' | 'followers' | 'trades' | 'feesEarned';

export const LeaderboardContent: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('7d');
  const [sortBy, setSortBy] = useState<SortBy>('pnl7d');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-400';
      case 2:
        return 'text-gray-400';
      case 3:
        return 'text-amber-700';
      default:
        return 'text-white/60';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-700" />;
      default:
        return <span className="text-white/60">{rank}</span>;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header Controls */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search traders..."
                className="w-64 bg-white/5 pl-10 pr-4 py-2 rounded-lg outline-none placeholder:text-white/40"
              />
            </div>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${
              refreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(['24h', '7d', '30d', 'all'] as TimeFrame[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFrame(tf)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  timeFrame === tf ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                {tf === 'all' ? 'All Time' : tf}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {[
              { id: 'pnl7d', label: '7d PNL', icon: TrendingUp },
              { id: 'pnl30d', label: '30d PNL', icon: TrendingUp },
              { id: 'winRate7d', label: '7d Win Rate', icon: Trophy },
              { id: 'transactions7d', label: '7d TX', icon: RefreshCw },
              { id: 'feesEarned', label: 'Fees Earned', icon: DollarSign },
              { id: 'followers', label: 'Followers', icon: Users }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSortBy(id as SortBy)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  sortBy === id ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white/5 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-4 px-6 text-white/60">Rank</th>
              <th className="text-left py-4 px-6 text-white/60">Trader</th>
              <th className="text-right py-4 px-6 text-white/60">7d PNL</th>
              <th className="text-right py-4 px-6 text-white/60">30d PNL</th>
              <th className="text-right py-4 px-6 text-white/60">7d Win Rate</th>
              <th className="text-right py-4 px-6 text-white/60">7d TX</th>
              <th className="text-right py-4 px-6 text-white/60">Fees Earned</th>
              <th className="text-right py-4 px-6 text-white/60">Followers</th>
              <th className="text-right py-4 px-6 text-white/60">Total Trades</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {mockLeaderboard.map((entry) => (
              <tr 
                key={entry.id}
                className="hover:bg-white/5 transition-colors cursor-pointer"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    {getRankIcon(entry.rank)}
                    {entry.change !== 0 && (
                      <span className={`text-xs ${
                        entry.change > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {entry.change > 0 ? '↑' : '↓'}{Math.abs(entry.change)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={entry.avatar}
                        alt={entry.name}
                        className="w-10 h-10 rounded-full"
                      />
                      {entry.verified && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{entry.name}</div>
                      <div className="text-sm text-white/60">.{entry.domain}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-right font-medium text-green-400">
                  {formatNumber(entry.stats.pnl7d)}
                </td>
                <td className="py-4 px-6 text-right font-medium text-green-400">
                  {formatNumber(entry.stats.pnl30d)}
                </td>
                <td className="py-4 px-6 text-right">
                  {entry.stats.winRate7d}%
                </td>
                <td className="py-4 px-6 text-right">
                  {entry.stats.transactions7d.toLocaleString()}
                </td>
                <td className="py-4 px-6 text-right font-medium text-blue-400">
                  ${entry.stats.feesEarned.toFixed(2)}
                </td>
                <td className="py-4 px-6 text-right">
                  {entry.stats.followers.toLocaleString()}
                </td>
                <td className="py-4 px-6 text-right">
                  {entry.stats.trades.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};