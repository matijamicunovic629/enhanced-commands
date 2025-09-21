import React, { useState } from 'react';
import { Bell, Maximize2, Minimize2, Wallet, ArrowUp, ArrowDown, Sun, Moon } from 'lucide-react';
import { SettingsModal } from './SettingsModal';
import { StarMenu } from './StarMenu';
import { MainMenu } from './MainMenu';
import { AccountMenu } from './AccountMenu';
import { TopbarStarredItems } from './TopbarStarredItems';
import { NotificationPanel } from './NotificationPanel';
import { WalletModal } from './WalletModal';
import { useStore } from '../store/useStore';

export const Header: React.FC = () => {
  const isSettingsOpen = useStore((state) => state.isSettingsOpen);
  const setIsSettingsOpen = useStore((state) => state.setIsSettingsOpen);
  const isTopbarVisible = useStore((state) => state.isTopbarVisible);
  const isTopbarBottom = useStore((state) => state.isTopbarBottom);
  const toggleTopbarVisibility = useStore((state) => state.toggleTopbarVisibility);
  const toggleTopbarPosition = useStore((state) => state.toggleTopbarPosition);
  const { theme, toggleTheme } = useStore();
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const renderToggleButton = () => (
    <button
      onClick={toggleTopbarVisibility}
      className={`fixed ${isTopbarBottom ? 'bottom-0' : 'top-0'} left-1/2 -translate-x-1/2 p-1 bg-black/40 backdrop-blur-xl border border-white/10 ${
        isTopbarBottom ? 'rounded-t-lg' : 'rounded-b-lg'
      } transition-all z-50 hover:bg-black/60 ${
        isTopbarVisible ? '' : `${isTopbarBottom ? '-translate-y-1' : 'translate-y-1'}`
      }`}
    >
      {isTopbarVisible ? (
        isTopbarBottom ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />
      ) : (
        isTopbarBottom ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <>
      <header 
        className={`fixed ${isTopbarBottom ? 'bottom-0' : 'top-0'} left-0 right-0 h-12 glass z-40 transition-all duration-300 ${
          isTopbarVisible ? '' : isTopbarBottom ? 'translate-y-full' : '-translate-y-full'
        }`}
      >
        <div className="h-full flex items-center justify-between">
          <div className="flex items-center gap-3 pl-4">
            <MainMenu />
            <div className="h-8 w-px bg-white/10" />
            <div className="h-6 w-auto relative">
              <img 
                src="https://i.imgur.com/5GS0TRU.png" 
                alt="Logo" 
                className="h-full w-auto object-contain"
              />
            </div>
          </div>

          <TopbarStarredItems />
          
          <div className="flex items-center space-x-4 pr-4">
            <StarMenu />
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-xs flex items-center justify-center">
                  2
                </span>
              </button>
              {isNotificationsOpen && (
                <NotificationPanel
                  isOpen={isNotificationsOpen}
                  onClose={() => setIsNotificationsOpen(false)}
                />
              )}
            </div>
            <button
              onClick={() => setIsWalletOpen(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Wallet className="w-4 h-4" />
            </button>
            <button 
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={toggleTopbarPosition}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isTopbarBottom ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
            <AccountMenu />
          </div>
        </div>
      </header>

      {renderToggleButton()}

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
      />
    </>
  );
};