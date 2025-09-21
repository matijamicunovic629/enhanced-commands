import React, { useState } from 'react';
import { 
  X, Maximize2, Minimize2, TrendingUp, TrendingDown, 
  DollarSign, BarChart2, LineChart, Search, Filter,
  RefreshCw, ChevronDown, Globe, Activity, Rocket,
  ArrowUpDown, Wallet, Newspaper, Bell, BarChart,
  Calendar, Rss, Menu, LayoutDashboard
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { MarketOverview } from './market/MarketOverview';
import { TrendingMarkets } from './market/TrendingMarkets';
import { DexExplorer } from './market/DexExplorer';
import { DeFiOverview } from './market/DeFiOverview';
import { MarketNews } from './market/MarketNews';
import { MarketAlerts } from './market/MarketAlerts';
import { TechnicalAnalysis } from './market/TechnicalAnalysis';
import { MarketCalendar } from './market/MarketCalendar';
import { MarketFeed } from './market/MarketFeed';
import { MarketCap } from './market/MarketCap';
import DeFiMarketDashboard from './market/DeFiMarketDashboard';

interface MarketDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MarketDataView = 'overview' | 'market-cap' | 'trending' | 'dex' | 'defi' | 'defi-dashboard' | 'news' | 'alerts' | 'technical' | 'calendar' | 'feed';

const views = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'market-cap', label: 'Market Cap', icon: DollarSign },
  { id: 'trending', label: 'Trending', icon: Rocket },
  { id: 'dex', label: 'DEX Explorer', icon: ArrowUpDown },
  { id: 'defi', label: 'DeFi Overview', icon: Wallet },
  { id: 'defi-dashboard', label: 'DeFi Dashboard', icon: LayoutDashboard },
  { id: 'news', label: 'Market News', icon: Newspaper },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'technical', label: 'Technical', icon: BarChart },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'feed', label: 'Feed', icon: Rss }
] as const;

export const MarketDataModal: React.FC<MarketDataModalProps> = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const marketDataView = useStore((state) => state.marketDataView);
  const setMarketDataView = useStore((state) => state.setMarketDataView);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderContent = () => {
    switch (marketDataView) {
      case 'overview':
        return <MarketOverview />;
      case 'market-cap':
        return <MarketCap />;
      case 'trending':
        return <TrendingMarkets />;
      case 'dex':
        return <DexExplorer />;
      case 'defi':
        return <DeFiOverview />;
      case 'defi-dashboard':
        return <DeFiMarketDashboard />;
      case 'news':
        return <MarketNews />;
      case 'alerts':
        return <MarketAlerts />;
      case 'technical':
        return <TechnicalAnalysis />;
      case 'calendar':
        return <MarketCalendar />;
      case 'feed':
        return <MarketFeed />;
      default:
        return <MarketOverview />;
    }
  };

  if (!isOpen) return null;

  const currentView = views.find(v => v.id === marketDataView);
  const IconComponent = currentView?.icon || BarChart2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative glass border border-white/10 shadow-lg transition-all duration-300 ease-in-out ${
          isFullscreen
            ? 'w-full h-full rounded-none'
            : 'w-[90%] h-[90%] rounded-xl'
        }`}
      >
        {/* Main Content */}
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{currentView?.label}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-56 py-2 glass border border-white/10 rounded-xl z-30">
                      {views.map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => {
                            setMarketDataView(id);
                            setShowMenu(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition-colors ${
                            marketDataView === id ? 'bg-white/10' : ''
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

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
          <div className="flex-1 overflow-y-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};