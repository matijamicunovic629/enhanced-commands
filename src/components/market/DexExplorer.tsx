import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, AlertCircle, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { getTrendingPools, getNewPools, getTopPools, formatNumber, formatAge, TokenPool, Network } from '../../lib/geckoTerminal';

const networks: Network[] = [
  { id: 'eth', name: 'Ethereum', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { id: 'base', name: 'Base', logo: 'https://cryptologos.cc/logos/base-logo.png' },
  { id: 'solana', name: 'Solana', logo: 'https://cryptologos.cc/logos/solana-sol-logo.png' }
];

export const DexExplorer: React.FC = () => {
  const [network, setNetwork] = useState<string>('eth');
  const [pools, setPools] = useState<TokenPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'trending' | 'new' | 'top'>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);

  const fetchPools = async (showRefreshState = false) => {
    try {
      if (showRefreshState) {
        setRefreshing(true);
      }
      setLoading(true);
      
      let data: TokenPool[];
      switch (view) {
        case 'trending':
          data = await getTrendingPools(network);
          break;
        case 'new':
          data = await getNewPools(network);
          break;
        case 'top':
          data = await getTopPools(network);
          break;
        default:
          data = await getTrendingPools(network);
      }
      
      setPools(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching pools:', err);
      setError('Failed to load pool data');
    } finally {
      setLoading(false);
      if (showRefreshState) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchPools();
    // Refresh every 30 seconds
    const interval = setInterval(() => fetchPools(), 30000);
    return () => clearInterval(interval);
  }, [network, view]);

  const handleRefresh = () => {
    fetchPools(true);
  };

  const handleNetworkChange = (newNetwork: string) => {
    setNetwork(newNetwork);
    setShowNetworkSelector(false);
    setLoading(true);
  };

  const selectedNetwork = networks.find(n => n.id === network);

  const filteredPools = pools.filter(pool => {
    const searchLower = searchQuery.toLowerCase();
    const baseToken = pool.included?.tokens.find(t => 
      t.id === pool.relationships.base_token.data.id
    );
    const quoteToken = pool.included?.tokens.find(t => 
      t.id === pool.relationships.quote_token.data.id
    );
    
    return (
      pool.attributes.name.toLowerCase().includes(searchLower) ||
      baseToken?.attributes.symbol.toLowerCase().includes(searchLower) ||
      quoteToken?.attributes.symbol.toLowerCase().includes(searchLower)
    );
  });

  if (error) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
        <p className="text-white/60 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Network Selector */}
          <div className="relative">
            <button
              onClick={() => setShowNetworkSelector(!showNetworkSelector)}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              {selectedNetwork && (
                <img 
                  src={selectedNetwork.logo} 
                  alt={selectedNetwork.name}
                  className="w-5 h-5"
                />
              )}
              <span>{selectedNetwork?.name}</span>
              <svg
                className={`w-4 h-4 transition-transform ${showNetworkSelector ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {showNetworkSelector && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNetworkSelector(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-48 py-2 glass rounded-lg z-20">
                  {networks.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleNetworkChange(n.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors ${
                        network === n.id ? 'bg-white/10' : ''
                      }`}
                    >
                      <img src={n.logo} alt={n.name} className="w-5 h-5" />
                      <span>{n.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('trending')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                view === 'trending' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              Trending
            </button>
            <button
              onClick={() => setView('new')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                view === 'new' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              New
            </button>
            <button
              onClick={() => setView('top')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                view === 'top' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              Top
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pools..."
              className="w-64 bg-white/5 pl-10 pr-4 py-2 rounded-lg outline-none placeholder:text-white/40"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${
              refreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pools List */}
      <div className="overflow-x-auto market-cap-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="text-left text-white/60">
              <th className="py-3 px-4 whitespace-nowrap">Pool</th>
              <th className="py-3 px-4 whitespace-nowrap">Price</th>
              <th className="py-3 px-4 whitespace-nowrap">24h %</th>
              <th className="py-3 px-4 whitespace-nowrap">Volume (24h)</th>
              <th className="py-3 px-4 whitespace-nowrap">TVL</th>
              <th className="py-3 px-4 whitespace-nowrap">Transactions (24h)</th>
              <th className="py-3 px-4 whitespace-nowrap">Age</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              // Loading skeletons
              [...Array(10)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-4">
                    <div className="h-8 w-32 bg-white/10 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-24 bg-white/10 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-16 bg-white/10 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-28 bg-white/10 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-28 bg-white/10 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-20 bg-white/10 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-16 bg-white/10 rounded" />
                  </td>
                </tr>
              ))
            ) : filteredPools.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <Search className="w-12 h-12 text-white/40 mb-4 mx-auto" />
                  <p className="text-lg font-medium mb-2">No pools found</p>
                  <p className="text-white/60">
                    Try adjusting your search or filter criteria
                  </p>
                </td>
              </tr>
            ) : (
              filteredPools.map((pool) => {
                const baseToken = pool.included?.tokens.find(t => 
                  t.id === pool.relationships.base_token.data.id
                );
                const quoteToken = pool.included?.tokens.find(t => 
                  t.id === pool.relationships.quote_token.data.id
                );
                
                const priceChange24h = parseFloat(pool.attributes.price_change_percentage?.h24 || '0');
                const volume24h = parseFloat(pool.attributes.volume_usd?.h24 || '0');
                const transactions24h = pool.attributes.transactions?.h24 || 0;
                const tvl = parseFloat(pool.attributes.reserve_in_usd || '0');
                
                return (
                  <tr key={pool.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {baseToken?.attributes.logo_url ? (
                            <img
                              src={baseToken.attributes.logo_url}
                              alt={baseToken.attributes.symbol}
                              className="w-8 h-8 rounded-full ring-2 ring-[#0a0a0c]"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-[#0a0a0c]">
                              <span className="text-xs font-medium">{baseToken?.attributes.symbol.charAt(0)}</span>
                            </div>
                          )}
                          {quoteToken?.attributes.logo_url ? (
                            <img
                              src={quoteToken.attributes.logo_url}
                              alt={quoteToken.attributes.symbol}
                              className="w-8 h-8 rounded-full ring-2 ring-[#0a0a0c]"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-[#0a0a0c]">
                              <span className="text-xs font-medium">{quoteToken?.attributes.symbol.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {baseToken?.attributes.symbol}/{quoteToken?.attributes.symbol}
                          </div>
                          <div className="text-sm text-white/60">
                            {pool.attributes.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      ${formatNumber(pool.attributes.base_token_price_usd || '0')}
                    </td>
                    <td className="py-4 px-4">
                      <div className={`flex items-center gap-1 ${
                        priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {priceChange24h >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span>{Math.abs(priceChange24h).toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">${formatNumber(volume24h)}</td>
                    <td className="py-4 px-4">${formatNumber(tvl)}</td>
                    <td className="py-4 px-4">{formatNumber(transactions24h)}</td>
                    <td className="py-4 px-4 text-white/60">
                      {formatAge(pool.attributes.pool_created_at)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};