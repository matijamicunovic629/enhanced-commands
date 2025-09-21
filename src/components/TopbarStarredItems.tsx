import React from 'react';
import * as Icons from 'lucide-react';
import { useStore } from '../store/useStore';

export const TopbarStarredItems: React.FC = () => {
  const { 
    menuItems, 
    setIsAIAgentOpen, 
    setIsSwapOpen,
    setIsDefiOpen,
    setIsDashboardOpen,
    setIsMarketDataOpen,
    setIsChatOpen,
    setIsCartOpen,
    setIsSocialFeedOpen,
    setIsGamesOpen,
    setIsLaunchpadOpen,
    setIsRewardsOpen,
    setIsWalletOpen
  } = useStore();
  const starredItems = menuItems.filter((item) => item.isStarred);

  const handleItemClick = (itemId: string) => {
    if (itemId === 'ai') {
      setIsAIAgentOpen(true);
    } else if (itemId === 'swap') {
      setIsSwapOpen(true);
    } else if (itemId === 'defi') {
      setIsDefiOpen(true);
    } else if (itemId === 'dashboard') {
      setIsDashboardOpen(true);
    } else if (itemId === 'market-data') {
      setIsMarketDataOpen(true);
    } else if (itemId === 'chat') {
      setIsChatOpen(true);
    } else if (itemId === 'cart') {
      setIsCartOpen(true);
    } else if (itemId === 'social') {
      setIsSocialFeedOpen(true);
    } else if (itemId === 'games') {
      setIsGamesOpen(true);
    } else if (itemId === 'launchpad') {
      setIsLaunchpadOpen(true);
    } else if (itemId === 'rewards') {
      setIsRewardsOpen(true);
    } else if (itemId === 'wallet') {
      setIsWalletOpen(true);
    }
  };

  if (starredItems.length === 0) return null;

  return (
    <div className="flex-1 flex items-center justify-center gap-2">
      {starredItems.map((item) => {
        const IconComponent = Icons[item.icon as keyof typeof Icons];
        return (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-lg transition-colors text-sm"
          >
            <IconComponent className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};