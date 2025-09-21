import React, { useState, useEffect } from 'react';
import { ExternalLink, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { getLatestNews } from '../../lib/cryptonews';
import { NewsItem } from '../../types';

export const MarketNews: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Market' | 'Regulatory' | 'Technology' | 'DeFi'>('All');

  const fetchNews = async () => {
    try {
      setLoading(true);
      const newsData = await getLatestNews();
      setNews(newsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // Refresh news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'HIGH':
        return 'text-red-400';
      case 'MEDIUM':
        return 'text-yellow-400';
      default:
        return 'text-green-400';
    }
  };

  if (error) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
        <p className="text-white/60">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedCategory === 'All' ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedCategory('Market')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedCategory === 'Market' ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            Market
          </button>
          <button
            onClick={() => setSelectedCategory('Regulatory')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedCategory === 'Regulatory' ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            Regulatory
          </button>
          <button
            onClick={() => setSelectedCategory('Technology')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedCategory === 'Technology' ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            Technology
          </button>
          <button
            onClick={() => setSelectedCategory('DeFi')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedCategory === 'DeFi' ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            DeFi
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Clock className="w-4 h-4" />
            <span>Auto-refreshes every 5 minutes</span>
          </div>
          <button
            onClick={fetchNews}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-4">
              <div className="h-5 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-4 bg-white/10 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 space-y-4 overflow-y-auto ai-chat-scrollbar">
          {news.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white/90 group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <span className="text-white/60">{item.source}</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/60">{item.time}</span>
                    <span className="text-white/40">•</span>
                    <span className={getImpactColor(item.impact)}>
                      {item.impact} IMPACT
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-blue-400 transition-colors flex-shrink-0" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};