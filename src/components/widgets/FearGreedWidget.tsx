import React, { useEffect, useState } from 'react';
import { HelpCircle, AlertCircle, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { getFearGreedIndex, FearGreedData } from '../../lib/fearGreed';

export const FearGreedWidget: React.FC = () => {
  const [data, setData] = useState<FearGreedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (showRefreshState = false) => {
    try {
      if (showRefreshState) {
        setRefreshing(true);
      }
      const result = await getFearGreedIndex();
      if (result) {
        setData(result);
        setError(null);
      } else {
        setError('No data available');
      }
    } catch (err) {
      console.error('Error fetching Fear & Greed Index:', err);
      setError('Failed to load Fear & Greed Index');
    } finally {
      setLoading(false);
      if (showRefreshState) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchData(true);
  };

  const getColor = (value: number) => {
    if (value <= 25) return '#EF4444'; // Extreme Fear (Red)
    if (value <= 45) return '#FB923C'; // Fear (Orange)
    if (value <= 55) return '#FBBF24'; // Neutral (Yellow)
    if (value <= 75) return '#34D399'; // Greed (Green)
    return '#10B981'; // Extreme Greed (Emerald)
  };

  if (error) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center text-center">
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

  const fearGreedValue = data?.value || 0;
  const change = data ? fearGreedValue - data.previousClose : 0;
  const color = getColor(fearGreedValue);

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-end mb-4">
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
      </div>

      <div className="flex-1 flex items-center justify-center -mt-2">
        <div className="flex items-center gap-8">
          <div className="relative">
            <svg className="w-32 h-32 -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="12"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke={color}
                strokeWidth="12"
                strokeDasharray={`${(fearGreedValue / 100) * 352} 352`}
                className={`transition-all duration-1000 ease-out ${loading ? 'opacity-50' : ''}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">
                {loading ? '...' : fearGreedValue}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2">
            <div className="text-lg font-medium" style={{ color }}>
              {loading ? 'Loading...' : data?.valueClassification}
            </div>
            
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-white/60">24h Change:</span>
              <div className={`flex items-center gap-0.5 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {change >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(change)}</span>
              </div>
            </div>

            {data && (
              <div className="text-xs text-white/40">
                Updated: {new Date(parseInt(data.timestamp) * 1000).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};