import React, { useState } from 'react';
import { 
  X, Maximize2, Minimize2, Search, Filter, 
  MessageSquare, Share2, Heart, Play, Pause,
  Video, BarChart2, RefreshCw, Users, Bell,
  ChevronDown, ArrowRight, Plus, Lock, Globe,
  Settings, ExternalLink, TrendingUp, TrendingDown,
  DollarSign, LineChart
} from 'lucide-react';
import { LeaderboardContent } from './components/LeaderboardContent';
import { FeedContent } from './components/FeedContent';
import { RallyingContent } from './components/RallyingContent';
import { ExploreContent } from './components/ExploreContent';
import { mockTraders, mockRallyingTokens, mockSwaps, mockMints, mockVirtuals } from './data/mockData';
import { useStore } from '../../store/useStore';

interface SocialFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SocialFeedModal: React.FC<SocialFeedModalProps> = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<'feed' | 'rallying' | 'explore' | 'notifications' | 'leaderboard'>('feed');
  const [selectedActionType, setSelectedActionType] = useState<'all' | 'swaps' | 'mints' | 'virtuals'>('all');
  const [followedTraders, setFollowedTraders] = useState<string[]>([]);
  const setIsSwapOpen = useStore((state) => state.setIsSwapOpen);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleFollow = (traderId: string) => {
    setFollowedTraders(prev => 
      prev.includes(traderId) 
        ? prev.filter(id => id !== traderId)
        : [...prev, traderId]
    );
  };

  const handleTokenClick = (trade: any) => {
    if (trade.amount > 0) {
      onClose();
      setTimeout(() => {
        setIsSwapOpen(true);
      }, 100);
    }
  };

  const getFilteredTrades = () => {
    switch (selectedActionType) {
      case 'swaps':
        return mockSwaps;
      case 'mints':
        return mockMints;
      case 'virtuals':
        return mockVirtuals;
      default:
        return [...mockSwaps, ...mockMints, ...mockVirtuals].sort((a, b) => {
          const aTime = a.timestamp.includes('now') ? 0 : parseInt(a.timestamp);
          const bTime = b.timestamp.includes('now') ? 0 : parseInt(b.timestamp);
          return aTime - bTime;
        });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative glass border border-white/10 shadow-lg transition-all duration-300 ease-in-out flex ${
          isFullscreen
            ? 'w-full h-full rounded-none'
            : 'w-[90%] h-[90%] rounded-xl'
        }`}
      >
        {/* Left Navigation */}
        <div className="w-64 border-r border-white/10">
          <div className="p-4 space-y-2">
            <button
              onClick={() => setActiveNavItem('feed')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                activeNavItem === 'feed' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Feed</span>
            </button>
            <button
              onClick={() => setActiveNavItem('rallying')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                activeNavItem === 'rallying' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Rallying</span>
            </button>
            <button
              onClick={() => setActiveNavItem('explore')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                activeNavItem === 'explore' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <Search className="w-5 h-5" />
              <span>Explore</span>
            </button>
            <button
              onClick={() => setActiveNavItem('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                activeNavItem === 'notifications' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </button>
            <button
              onClick={() => setActiveNavItem('leaderboard')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                activeNavItem === 'leaderboard' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <BarChart2 className="w-5 h-5" />
              <span>Leaderboard</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-xl font-semibold capitalize">{activeNavItem}</h2>
            <div className="flex items-center gap-2">
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
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto ai-chat-scrollbar">
            {activeNavItem === 'feed' && (
              <FeedContent
                selectedActionType={selectedActionType}
                onActionTypeChange={setSelectedActionType}
                trades={getFilteredTrades()}
                onTokenClick={handleTokenClick}
              />
            )}
            {activeNavItem === 'rallying' && (
              <RallyingContent tokens={mockRallyingTokens} />
            )}
            {activeNavItem === 'explore' && (
              <ExploreContent
                traders={mockTraders}
                followedTraders={followedTraders}
                onFollow={handleFollow}
              />
            )}
            {activeNavItem === 'notifications' && (
              <div className="max-w-3xl mx-auto p-4">
                <div className="text-center text-white/60">
                  No new notifications
                </div>
              </div>
            )}
            {activeNavItem === 'leaderboard' && <LeaderboardContent />}
          </div>
        </div>
      </div>
    </div>
  );
};