import React, { useState } from 'react';
import { RefreshCw, MessageSquare, Repeat2, Heart, Share2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface Tweet {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  timestamp: string;
  stats: {
    replies: number;
    retweets: number;
    likes: number;
  };
}

const mockTweets: Tweet[] = [
  {
    id: '1',
    author: {
      name: 'Vitalik Buterin',
      handle: 'VitalikButerin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vitalik',
      verified: true
    },
    content: 'Layer 2 scaling solutions are the future of Ethereum. The ecosystem is growing stronger every day. 🚀',
    timestamp: '2h ago',
    stats: {
      replies: 245,
      retweets: 1205,
      likes: 3890
    }
  },
  {
    id: '2',
    author: {
      name: 'CZ Binance',
      handle: 'cz_binance',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cz',
      verified: true
    },
    content: 'Markets are cyclical. Stay #SAFU and keep building. 📈',
    timestamp: '4h ago',
    stats: {
      replies: 182,
      retweets: 892,
      likes: 2450
    }
  },
  {
    id: '3',
    author: {
      name: 'DeFi Pulse',
      handle: 'defipulse',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=defi',
      verified: true
    },
    content: 'Total Value Locked in DeFi hits new ATH! $50B and growing. The DeFi summer is back! 🌞',
    timestamp: '6h ago',
    stats: {
      replies: 156,
      retweets: 734,
      likes: 1890
    }
  },
  {
    id: '4',
    author: {
      name: 'Crypto Analyst',
      handle: 'cryptoanalyst',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=analyst',
      verified: true
    },
    content: 'Bitcoin forming a strong support at $67k. Next target: $70k. Watch this level closely! 📊',
    timestamp: '8h ago',
    stats: {
      replies: 134,
      retweets: 567,
      likes: 1654
    }
  },
  {
    id: '5',
    author: {
      name: 'NFT Collector',
      handle: 'nftcollector',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=collector',
      verified: true
    },
    content: 'Just aped into the new @BoredApeYC collection! This is going to be huge! 🦍',
    timestamp: '10h ago',
    stats: {
      replies: 98,
      retweets: 432,
      likes: 1234
    }
  },
  {
    id: '6',
    author: {
      name: 'DeFi Developer',
      handle: 'defidev',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=developer',
      verified: true
    },
    content: 'Just deployed a new yield farming protocol on Arbitrum. Gas fees < $0.1! 🌾',
    timestamp: '12h ago',
    stats: {
      replies: 76,
      retweets: 345,
      likes: 987
    }
  }
];

export const TwitterWidget: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>(mockTweets);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const tweetsPerPage = 3;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, we would fetch new tweets here
      setError(null);
    } catch (err) {
      setError('Failed to load tweets');
    } finally {
      setRefreshing(false);
    }
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

  const totalPages = Math.ceil(tweets.length / tweetsPerPage);
  const displayedTweets = tweets.slice(page * tweetsPerPage, (page + 1) * tweetsPerPage);

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-white/60">
          Latest tweets from crypto influencers
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-white/60">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`p-1 rounded-lg hover:bg-white/10 transition-colors ${
              refreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Refresh tweets"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto ai-chat-scrollbar">
        {displayedTweets.map((tweet) => (
          <div
            key={tweet.id}
            className="p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
          >
            <div className="flex items-start gap-2">
              <img
                src={tweet.author.avatar}
                alt={tweet.author.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs font-medium">{tweet.author.name}</span>
                  {tweet.author.verified && (
                    <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  )}
                  <span className="text-[11px] text-white/60">@{tweet.author.handle}</span>
                  <span className="text-[11px] text-white/40">·</span>
                  <span className="text-[11px] text-white/60">{tweet.timestamp}</span>
                </div>

                <p className="text-xs text-white/90 mb-2">{tweet.content}</p>

                <div className="flex items-center gap-4 text-[11px] text-white/60">
                  <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{tweet.stats.replies}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-green-400 transition-colors">
                    <Repeat2 className="w-3.5 h-3.5" />
                    <span>{tweet.stats.retweets}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                    <Heart className="w-3.5 h-3.5" />
                    <span>{tweet.stats.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};