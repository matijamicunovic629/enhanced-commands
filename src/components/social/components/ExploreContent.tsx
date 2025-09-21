import React from 'react';
import { UserCheck, UserPlus } from 'lucide-react';
import { Trader } from '../types';

interface ExploreContentProps {
  traders: Trader[];
  followedTraders: string[];
  onFollow: (traderId: string) => void;
}

export const ExploreContent: React.FC<ExploreContentProps> = ({
  traders,
  followedTraders,
  onFollow
}) => {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="space-y-4">
        {traders.map((trader) => (
          <div 
            key={trader.id}
            className="bg-black/20 rounded-xl p-4 hover:bg-black/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={trader.avatar}
                  alt={trader.name}
                  className="w-12 h-12 rounded-full"
                />
                {trader.verified && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{trader.name}</span>
                  <span className="text-white/60">.{trader.domain}</span>
                </div>
                {trader.bio && (
                  <p className="text-white/60 text-sm mt-1">{trader.bio}</p>
                )}
                {trader.stats && (
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-green-400">{trader.stats.winRate}% Win Rate</span>
                    <span className="text-blue-400">{trader.stats.avgReturn}% Avg Return</span>
                    <span className="text-white/60">{trader.stats.followers.toLocaleString()} followers</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => onFollow(trader.id)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  followedTraders.includes(trader.id)
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {followedTraders.includes(trader.id) ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};