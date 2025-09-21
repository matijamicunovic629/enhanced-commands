import React from 'react';
import { ActionType, TradeItem } from '../types';
import { TradeCard } from './TradeCard';

interface FeedContentProps {
  selectedActionType: ActionType;
  onActionTypeChange: (type: ActionType) => void;
  trades: TradeItem[];
  onTokenClick: (trade: any) => void;
}

export const FeedContent: React.FC<FeedContentProps> = ({
  selectedActionType,
  onActionTypeChange,
  trades,
  onTokenClick
}) => {
  const actionTypes = [
    { id: 'all', label: 'All' },
    { id: 'swaps', label: 'Swaps' },
    { id: 'mints', label: 'Mints' },
    { id: 'virtuals', label: 'Virtuals' }
  ] as const;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-6">
        {actionTypes.map(type => (
          <button
            key={type.id}
            onClick={() => onActionTypeChange(type.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedActionType === type.id
                ? 'bg-blue-500 text-white dark:text-white'
                : 'bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {trades.map((trade) => (
          <TradeCard 
            key={trade.id} 
            trade={trade} 
            onTokenClick={onTokenClick}
          />
        ))}
      </div>
    </div>
  );
};