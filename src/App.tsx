import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { Workspace } from './components/Workspace';
import { Header } from './components/Header';
import { RewardsModal } from './components/RewardsModal';
import { SettingsModal } from './components/SettingsModal';
import { DashboardModal } from './components/DashboardModal';
import { DeFiModal } from './components/DeFiModal';
import { SwapModal } from './components/SwapModal';
import { MarketDataModal } from './components/MarketDataModal';
import { ChatModal } from './components/ChatModal';
import { CartModal } from './components/CartModal';
import { SocialFeedModal } from './components/SocialFeedModal';
import { GamesModal } from './components/GamesModal';
import { LaunchpadModal } from './components/LaunchpadModal';
import AIAgentModal from './components/AIAgentModal';
import { WalletModal } from './components/WalletModal';
import { DCAModal } from './components/DCAModal';

export default function App() {
  const { 
    theme, 
    isRewardsOpen, 
    setIsRewardsOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    isDashboardOpen,
    setIsDashboardOpen,
    isDefiOpen,
    setIsDefiOpen,
    isSwapOpen,
    setIsSwapOpen,
    isMarketDataOpen,
    setIsMarketDataOpen,
    isChatOpen,
    setIsChatOpen,
    isCartOpen,
    setIsCartOpen,
    isSocialFeedOpen,
    setIsSocialFeedOpen,
    isGamesOpen,
    setIsGamesOpen,
    isLaunchpadOpen,
    setIsLaunchpadOpen,
    isAIAgentOpen,
    setIsAIAgentOpen,
    isWalletOpen,
    setIsWalletOpen,
    isDCAOpen,
    setIsDCAOpen
  } = useStore();

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <Header />
      <Workspace />
      
      {/* Modals */}
      <RewardsModal 
        isOpen={isRewardsOpen}
        onClose={() => setIsRewardsOpen(false)}
      />
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <DashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
      />
      <DeFiModal
        isOpen={isDefiOpen}
        onClose={() => setIsDefiOpen(false)}
      />
      <SwapModal
        isOpen={isSwapOpen}
        onClose={() => setIsSwapOpen(false)}
      />
      <MarketDataModal
        isOpen={isMarketDataOpen}
        onClose={() => setIsMarketDataOpen(false)}
      />
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
      <SocialFeedModal
        isOpen={isSocialFeedOpen}
        onClose={() => setIsSocialFeedOpen(false)}
      />
      <GamesModal
        isOpen={isGamesOpen}
        onClose={() => setIsGamesOpen(false)}
      />
      <LaunchpadModal
        isOpen={isLaunchpadOpen}
        onClose={() => setIsLaunchpadOpen(false)}
      />
      <AIAgentModal
        isOpen={isAIAgentOpen}
        onClose={() => setIsAIAgentOpen(false)}
      />
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
      />
      <DCAModal
        isOpen={isDCAOpen}
        onClose={() => setIsDCAOpen(false)}
      />
    </>
  );
}