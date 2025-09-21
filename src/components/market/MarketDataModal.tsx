// Update the views array to include the new dashboard
const views = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'market-cap', label: 'Market Cap', icon: DollarSign },
  { id: 'trending', label: 'Trending', icon: Rocket },
  { id: 'dex', label: 'DEX Explorer', icon: ArrowUpDown },
  { id: 'defi', label: 'DeFi Overview', icon: Wallet },
  { id: 'defi-dashboard', label: 'DeFi Dashboard', icon: LayoutDashboard }, // Add this line
  { id: 'news', label: 'Market News', icon: Newspaper },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'technical', label: 'Technical', icon: BarChart },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'feed', label: 'Feed', icon: Rss }
] as const;

// Update the renderContent function to include the new dashboard
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
      return <DeFiMarketDashboard />; // Add this line
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