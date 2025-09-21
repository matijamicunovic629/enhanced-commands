import React, { useState, useEffect } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { getLatestNews } from '../../lib/cryptonews';
import { NewsItem } from '../../types';

export const MarketNewsWidget: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
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
      <div className="p-4 h-full flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
        <p className="text-white/60">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 h-full">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-4">
              <div className="h-5 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-4 bg-white/10 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(news.length / itemsPerPage);
  const displayedNews = news.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-white/60">
            Auto-refreshes every 5 minutes
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-white/60">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto ai-chat-scrollbar">
        {displayedNews.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors group relative"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white/90 truncate pr-6 group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-sm">
                  <span className="text-white/60">{item.source}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/60">{item.time}</span>
                  <span className="text-white/40">•</span>
                  <span className={getImpactColor(item.impact)}>
                    {item.impact} IMPACT
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-blue-400 transition-colors" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};