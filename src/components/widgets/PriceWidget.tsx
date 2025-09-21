import React, { useState, useEffect } from 'react';
import { getCoinPrice, searchCoins, getCoinInfo, getMultipleCoinsData } from '../../lib/coingecko';
import { CoinData, SearchResult } from '../../types';
import { PriceChart } from '../PriceChart';
import { Clock, Search, ChevronDown, AlertCircle, RefreshCw } from 'lucide-react';

// Price memory storage
interface PriceMemory {
  [coinId: string]: {
    price: number;
    priceChange24h: number;
    marketCap: number;
    volume24h: number;
    image: string;
    timestamp: number;
  };
}

// In-memory storage for last fetched prices
let priceMemory: PriceMemory = {};

// Save price to memory
const savePriceToMemory = (coinId: string, data: CoinData) => {
  priceMemory[coinId] = {
    price: data.price,
    priceChange24h: data.priceChange24h,
    marketCap: data.marketCap,
    volume24h: data.volume24h,
    image: data.image,
    timestamp: Date.now()
  };
};

// Get price from memory
const getPriceFromMemory = (coinId: string): CoinData | null => {
  const cached = priceMemory[coinId];
  if (!cached) return null;
  
  // Check if data is less than 5 minutes old
  const isStale = Date.now() - cached.timestamp > 5 * 60 * 1000;
  if (isStale) return null;
  
  return {
    id: coinId,
    price: cached.price,
    priceChange24h: cached.priceChange24h,
    marketCap: cached.marketCap,
    volume24h: cached.volume24h,
    image: cached.image,
    chartData: [] // Chart data not cached
  };
};

interface TopCoin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

const defaultCoins: TopCoin[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', thumb: '' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', thumb: '' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', thumb: '' }
];

export const MarketPulseWidget: React.FC = () => {
  const [selectedCoin, setSelectedCoin] = useState<TopCoin>(defaultCoins[0]);
  const [data, setData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [coinLogos, setCoinLogos] = useState<Record<string, string>>({});
  const [lastPriceUpdate, setLastPriceUpdate] = useState<Date | null>(null);
  const [realtimePrice, setRealtimePrice] = useState<number | null>(null);
  const [realtimePriceChange, setRealtimePriceChange] = useState<number | null>(null);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Fetch coin logos using CoinGecko API
  const fetchCoinLogos = async () => {
    try {
      const logoMap: Record<string, string> = {};
      
      // Try to fetch logos one by one with individual error handling
      for (const coin of defaultCoins) {
        try {
          const coinInfo = await getCoinInfo(coin.id);
          logoMap[coin.id] = coinInfo.image;
        } catch (error) {
          console.warn(`Could not fetch logo for ${coin.id}, using placeholder`);
          // Use placeholder image as fallback
          logoMap[coin.id] = `https://via.placeholder.com/32/4A90E2/FFFFFF?text=${coin.symbol.charAt(0)}`;
        }
      }
      
      setCoinLogos(logoMap);
    } catch (error) {
      console.warn('Error in fetchCoinLogos, using all placeholders:', error);
      // Set placeholder logos for all coins if everything fails
      const fallbackLogos = defaultCoins.reduce((acc, coin) => {
        acc[coin.id] = `https://via.placeholder.com/32/4A90E2/FFFFFF?text=${coin.symbol.charAt(0)}`;
        return acc;
      }, {} as Record<string, string>);
      setCoinLogos(fallbackLogos);
    }
  };

  useEffect(() => {
    fetchCoinLogos();
  }, []);

  // Real-time price fetching
  const fetchRealtimePrice = async (coinId: string) => {
    try {
      const coinData = await getCoinPrice(coinId);
      if (coinData) {
        // Save to memory
        savePriceToMemory(coinId, coinData);
        
        setRealtimePrice(coinData.price);
        setRealtimePriceChange(coinData.priceChange24h);
        
        // Update price history for mini sparkline
        setPriceHistory(prev => {
          const newHistory = [...prev, coinData.price];
          // Keep only last 20 price points
          return newHistory.slice(-20);
        });
        
        setLastPriceUpdate(new Date());
      }
    } catch (error) {
      console.error('Error fetching real-time price:', error);
      // Don't update state on error - keep showing last known good data
    }
  };

  // Start/stop real-time updates
  const toggleRealTime = () => {
    setIsRealTimeActive(!isRealTimeActive);
  };

  // Real-time price updates every 10 seconds when active
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRealTimeActive) {
      // Initial fetch
      fetchRealtimePrice(selectedCoin.id);
      
      // Set up interval for updates
      interval = setInterval(() => {
        fetchRealtimePrice(selectedCoin.id);
      }, 10000); // Update every 10 seconds
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRealTimeActive, selectedCoin.id]);

  // Reset real-time state when coin changes
  useEffect(() => {
    setRealtimePrice(null);
    setRealtimePriceChange(null);
    setPriceHistory([]);
    setIsRealTimeActive(false);
  }, [selectedCoin.id]);

  const fetchData = async (coinId: string, showRefreshState = false) => {
    // Try to get cached data first
    const cachedData = getPriceFromMemory(coinId);
    if (cachedData && !showRefreshState) {
      setData(cachedData);
      setRealtimePrice(cachedData.price);
      setRealtimePriceChange(cachedData.priceChange24h);
      setLastPriceUpdate(new Date(priceMemory[coinId].timestamp));
      setInitialDataLoaded(true);
      setLoading(false);
      setError(null);
      console.log('PriceWidget: Using cached data for:', coinId);
      return;
    }

    try {
      if (showRefreshState) {
        setRefreshing(true);
      }
      if (!initialDataLoaded) {
        setLoading(true);
      }
      console.log('PriceWidget: Fetching real data for:', coinId);
      const coinData = await getCoinPrice(coinId);
      console.log('PriceWidget: Received coin data:', coinData);
      if (coinData) {
        // Save to memory
        savePriceToMemory(coinId, coinData);
        
        setData(coinData);
        setRealtimePrice(coinData.price);
        setRealtimePriceChange(coinData.priceChange24h);
        setLastPriceUpdate(new Date());
        setInitialDataLoaded(true);
        
        // Initialize price history with current price
        if (!initialDataLoaded) {
          setPriceHistory([coinData.price]);
        }
        
        setError(null);
        console.log('PriceWidget: Successfully updated with real price:', coinData.price);
      } else {
        // Try to use last known price from memory
        const lastKnownData = priceMemory[coinId];
        if (lastKnownData) {
          console.log('PriceWidget: Using last known data for:', coinId);
          const fallbackData: CoinData = {
            id: coinId,
            price: lastKnownData.price,
            priceChange24h: lastKnownData.priceChange24h,
            marketCap: lastKnownData.marketCap,
            volume24h: lastKnownData.volume24h,
            image: lastKnownData.image,
            chartData: []
          };
          setData(fallbackData);
          setRealtimePrice(fallbackData.price);
          setRealtimePriceChange(fallbackData.priceChange24h);
          setLastPriceUpdate(new Date(lastKnownData.timestamp));
          setInitialDataLoaded(true);
          setError('Using cached data - API unavailable');
        } else {
          setError('No data available');
        }
      }
    } catch (err) {
      console.error('PriceWidget: Error fetching coin data:', err);
      
      // Try to use last known price from memory
      const lastKnownData = priceMemory[coinId];
      if (lastKnownData) {
        console.log('PriceWidget: Using last known data after error for:', coinId);
        const fallbackData: CoinData = {
          id: coinId,
          price: lastKnownData.price,
          priceChange24h: lastKnownData.priceChange24h,
          marketCap: lastKnownData.marketCap,
          volume24h: lastKnownData.volume24h,
          image: lastKnownData.image,
          chartData: []
        };
        setData(fallbackData);
        setRealtimePrice(fallbackData.price);
        setRealtimePriceChange(fallbackData.priceChange24h);
        setLastPriceUpdate(new Date(lastKnownData.timestamp));
        setInitialDataLoaded(true);
        setError('Using cached data - API error');
      } else {
        setError('Failed to load price data');
      }
    } finally {
      setLoading(false);
      if (showRefreshState) {
        setRefreshing(false);
      }
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      try {
        const results = await searchCoins(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching coins:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const selectCoin = (coin: SearchResult) => {
    setSelectedCoin({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      thumb: coin.thumb
    });
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
    setLoading(true);
  };

  useEffect(() => {
    fetchData(selectedCoin.id);
    // Refresh data every 30 seconds for better UX
    const interval = setInterval(() => fetchData(selectedCoin.id), 30 * 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, [selectedCoin.id]);

  if (error) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
        <p className="text-white/60 mb-4">{error}</p>
        <button
          onClick={() => fetchData(selectedCoin.id, true)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <img
                src={coinLogos[selectedCoin.id] || selectedCoin.thumb || `https://via.placeholder.com/32/4A90E2/FFFFFF?text=${selectedCoin.symbol.charAt(0)}`}
                alt={selectedCoin.name}
                className="w-8 h-8"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/32/4A90E2/FFFFFF?text=${selectedCoin.symbol.charAt(0)}`;
                }}
              />
              <div>
                <h3 className="font-semibold">{selectedCoin.name} ({selectedCoin.symbol})</h3>
                {data && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      ${(realtimePrice !== null ? realtimePrice : data.price).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                    <span className={`text-sm ${(realtimePriceChange || data.priceChange24h) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(realtimePriceChange !== null ? realtimePriceChange : data.priceChange24h).toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>

            <button
              onClick={() => fetchData(selectedCoin.id, true)}
              disabled={refreshing}
              className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${
                refreshing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={toggleRealTime}
              className={`p-2 rounded-lg transition-colors ${
                isRealTimeActive 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'hover:bg-white/10'
              }`}
              title={isRealTimeActive ? 'Stop real-time updates' : 'Start real-time updates'}
            >
              <div className={`w-2 h-2 rounded-full ${
                isRealTimeActive ? 'bg-green-400 animate-pulse' : 'bg-white/40'
              }`} />
            </button>
          </div>
            
          {(lastPriceUpdate || isRealTimeActive) && (
            <div className="text-xs text-white/40 mt-2">
              {isRealTimeActive ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Live: {lastPriceUpdate?.toLocaleTimeString()}</span>
                  {isRealTimeActive && priceHistory.length > 1 && (
                    <div className="ml-2 flex items-end gap-0.5 h-4">
                      {priceHistory.slice(-10).map((price, index) => {
                        const minPrice = Math.min(...priceHistory.slice(-10));
                        const maxPrice = Math.max(...priceHistory.slice(-10));
                        const range = maxPrice - minPrice;
                        const height = range > 0 ? ((price - minPrice) / range) * 12 + 2 : 7;
                        
                        return (
                          <div
                            key={index}
                            className="w-0.5 bg-blue-400 rounded-full transition-all"
                            style={{ height: `${height}px` }}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <span>Updated: {lastPriceUpdate?.toLocaleTimeString()}</span>
              )}
            </div>
          )}

          {showSearch && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowSearch(false)}
              />
              <div className="absolute top-full left-0 right-0 mt-2 p-2 glass rounded-lg z-20">
                <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg mb-2">
                  <Search className="w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search coins..."
                    className="bg-transparent outline-none flex-1"
                    autoFocus
                  />
                </div>

                <div className="space-y-1">
                  {searchQuery.length < 2 ? (
                    defaultCoins.map((coin) => (
                      <button
                        key={coin.id}
                        onClick={() => {
                          setSelectedCoin(coin);
                          setShowSearch(false);
                        }}
                        className={`w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors ${
                          selectedCoin.id === coin.id ? 'bg-white/10' : ''
                        }`}
                      >
                        <img
                          src={coinLogos[coin.id] || coin.thumb || `https://via.placeholder.com/32/4A90E2/FFFFFF?text=${coin.symbol.charAt(0)}`}
                          alt={coin.name}
                          className="w-6 h-6"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://via.placeholder.com/32/4A90E2/FFFFFF?text=${coin.symbol.charAt(0)}`;
                          }}
                        />
                        <span className="font-medium">{coin.name}</span>
                        <span className="text-sm text-white/60 ml-auto">
                          {coin.symbol}
                        </span>
                      </button>
                    ))
                  ) : searchResults.length > 0 ? (
                    searchResults.map((coin) => (
                      <button
                        key={coin.id}
                        onClick={() => selectCoin(coin)}
                        className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <img
                          src={coin.thumb || `https://via.placeholder.com/24/4A90E2/FFFFFF?text=${coin.symbol.charAt(0)}`}
                          alt={coin.name}
                          className="w-6 h-6"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://via.placeholder.com/24/4A90E2/FFFFFF?text=${coin.symbol.charAt(0)}`;
                          }}
                        />
                        <span className="font-medium">{coin.name}</span>
                        <span className="text-sm text-white/60 ml-auto">
                          {coin.symbol}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-4 text-sm text-white/40">
                      No results found
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Chart and Stats */}
      <div className="flex-1 flex flex-col p-4">
        {/* Chart */}
        <div className="flex-1">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mb-2" />
              <span className="text-sm text-white/60">Loading {selectedCoin.symbol} data...</span>
            </div>
          ) : data ? (
            <div className="h-[calc(100%-100px)]">
              <PriceChart data={data} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
              <span className="text-sm text-white/60">No data available</span>
            </div>
          )}
        </div>

        {/* Stats */}
        {data && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-sm text-white/60 mb-1">Market Cap</div>
              <div className="font-medium">
                ${new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  maximumFractionDigits: 1
                }).format(data.marketCap)}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-sm text-white/60 mb-1">Volume (24h)</div>
              <div className="font-medium">
                ${new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  maximumFractionDigits: 1
                }).format(data.volume24h)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};