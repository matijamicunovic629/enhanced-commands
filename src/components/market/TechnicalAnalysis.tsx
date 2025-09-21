import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ChevronDown, Settings, Maximize2, 
  Minimize2, RefreshCw, AlertCircle
} from 'lucide-react';
import { createChart, ColorType } from 'lightweight-charts';
import { getOHLCV } from '../../lib/coingecko';

interface CoinOption {
  id: string;
  symbol: string;
  name: string;
  thumb: string;
}

const defaultCoins: CoinOption[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', thumb: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', thumb: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', thumb: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', thumb: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', thumb: 'https://assets.coingecko.com/coins/images/975/small/cardano.png' }
];

export const TechnicalAnalysis: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  
  const [selectedCoin, setSelectedCoin] = useState<CoinOption>(defaultCoins[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const cleanupChart = () => {
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      candlestickSeriesRef.current = null;
    }
  };

  const initializeChart = () => {
    if (!containerRef.current) return;

    // Clean up previous chart
    cleanupChart();

    // Create new chart
    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#131722' },
        textColor: 'rgba(255, 255, 255, 0.6)',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.1)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Store references
    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    // Set up resize observer
    resizeObserverRef.current = new ResizeObserver(entries => {
      if (entries[0] && chartRef.current) {
        const { width, height } = entries[0].contentRect;
        chartRef.current.applyOptions({ width, height });
      }
    });

    resizeObserverRef.current.observe(containerRef.current);
  };

  const updateChartData = async () => {
    if (!candlestickSeriesRef.current) return;

    try {
      setLoading(true);
      const data = await getOHLCV(selectedCoin.id);
      
      if (candlestickSeriesRef.current) {
        // Format data for lightweight-charts
        const chartData = data.map(candle => ({
          time: candle.time / 1000, // Convert to seconds
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close
        }));

        candlestickSeriesRef.current.setData(chartData);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching OHLCV data:', err);
      setError('Failed to load chart data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeChart();
    updateChartData();

    return () => {
      cleanupChart();
    };
  }, [selectedCoin.id]);

  const handleCoinSelect = (coin: CoinOption) => {
    setSelectedCoin(coin);
    setShowSearch(false);
    setSearchQuery('');
    setLoading(true);
  };

  const handleRefresh = () => {
    updateChartData();
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Coin Selector */}
          <div className="relative">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <img
                src={selectedCoin.thumb}
                alt={selectedCoin.name}
                className="w-8 h-8"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{selectedCoin.name}</span>
                  <span className="text-white/60">{selectedCoin.symbol}</span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>

            {showSearch && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSearch(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-64 p-2 glass rounded-lg z-20">
                  <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg mb-2">
                    <Search className="w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search coins..."
                      className="bg-transparent outline-none flex-1"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-1">
                    {defaultCoins.map((coin) => (
                      <button
                        key={coin.id}
                        onClick={() => handleCoinSelect(coin)}
                        className={`w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors ${
                          selectedCoin.id === coin.id ? 'bg-white/10' : ''
                        }`}
                      >
                        <img
                          src={coin.thumb}
                          alt={coin.name}
                          className="w-6 h-6"
                        />
                        <span className="font-medium">{coin.name}</span>
                        <span className="text-sm text-white/60 ml-auto">
                          {coin.symbol}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div 
        ref={containerRef} 
        className={`flex-1 bg-[#131722] rounded-lg overflow-hidden relative ${
          isFullscreen ? 'fixed inset-0 z-50' : ''
        }`}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#131722]/80">
            <RefreshCw className="w-8 h-8 text-white/40 animate-spin" />
          </div>
        )}
        {error && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#131722]/80">
            <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
            <p className="text-white/60 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};