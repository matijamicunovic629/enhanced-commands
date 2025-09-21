import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { RallyingToken } from '../types';

interface RallyingContentProps {
  tokens: RallyingToken[];
}

export const RallyingContent: React.FC<RallyingContentProps> = ({ tokens }) => {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="space-y-4">
        {tokens.map((token, index) => (
          <div key={token.id} className="bg-black/20 rounded-xl p-4 hover:bg-black/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 text-white/60 font-medium">
                  {index + 1}
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={token.avatar}
                    alt={token.name}
                    className="w-12 h-12 rounded-xl"
                  />
                  <div>
                    <div className="font-medium text-lg">{token.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex -space-x-2">
                        {token.followers.map((follower, i) => (
                          <img
                            key={i}
                            src={follower.avatar}
                            alt="Follower"
                            className="w-6 h-6 rounded-full border-2 border-[#0a0a0c]"
                          />
                        ))}
                      </div>
                      <span className="text-sm text-white/60">& {token.otherFollowers} others</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-medium">
                  ${(token.marketCap / 1000000).toFixed(1)}M
                </div>
                <div className={`flex items-center gap-1 justify-end ${
                  token.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {token.change >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{Math.abs(token.change).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};