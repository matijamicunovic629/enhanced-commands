import React from 'react';
import { Settings, Copy } from 'lucide-react';
import { TradeItem } from '../types';

interface TradeCardProps {
  trade: TradeItem;
  onTokenClick: (trade: any) => void;
}

export const TradeCard: React.FC<TradeCardProps> = ({ trade, onTokenClick }) => {
  return (
    <div className="bg-black/5 dark:bg-black/20 rounded-xl p-4 hover:bg-black/10 dark:hover:bg-black/30 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={trade.trader.avatar}
              alt={trade.trader.name}
              className="w-10 h-10 rounded-full"
            />
            {trade.trader.verified && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 dark:text-white">{trade.trader.name}</span>
              <span className="text-gray-600 dark:text-white/60">.{trade.trader.domain}</span>
              <span className="text-gray-400 dark:text-white/40">•</span>
              <span className="text-gray-600 dark:text-white/60">{trade.timestamp}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className={`${
                trade.type === 'SWAP' ? 'text-blue-500 dark:text-blue-400' :
                trade.type === 'MINT' ? 'text-green-500 dark:text-green-400' :
                'text-purple-500 dark:text-purple-400'
              }`}>
                {trade.type === 'SWAP' ? 'Swapped' :
                 trade.type === 'MINT' ? 'Minted' :
                 'Virtual Trade'}
              </span>
              <span className="text-gray-600 dark:text-white/60">on</span>
              <span className="text-gray-800 dark:text-white/80">{trade.platform}</span>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors">
          <Settings className="w-4 h-4 text-gray-600 dark:text-white/60" />
        </button>
      </div>

      <div className="space-y-2">
        {trade.trades.map((t, i) => (
          <div 
            key={i} 
            className={`flex items-center justify-between p-3 bg-black/10 dark:bg-black/40 rounded-lg ${
              t.amount > 0 ? 'cursor-pointer hover:bg-black/20 dark:hover:bg-black/60' : ''
            }`}
            onClick={() => onTokenClick(t)}
          >
            <div className="flex items-center gap-3">
              <img
                src={t.protocol.logo}
                alt={t.protocol.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{t.protocol.name}</div>
                <div className="text-sm text-gray-600 dark:text-white/60">{t.protocol.symbol}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-medium ${t.amount > 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                {t.amount > 0 ? '+' : ''}{t.amount} {t.protocol.symbol}
              </div>
              <div className="text-sm text-gray-600 dark:text-white/60">
                ${t.price.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {trade.type === 'SWAP' && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => onTokenClick(trade.trades[1])}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-sm text-white"
          >
            <Copy className="w-4 h-4" />
            <span>Copy Trade</span>
          </button>
        </div>
      )}
    </div>
  );
};