import React, { useEffect, useState } from 'react';
import { X, TrendingUp, TrendingDown, RefreshCw, ExternalLink, BarChart2, Search, Bot, ArrowRight, CheckCircle2, Wallet, ArrowLeftRight, Loader2, Newspaper, Clock, Calendar, DollarSign } from 'lucide-react';
import { getCoinPrice, getCoinInfo } from '../lib/coingecko';
import { getLatestNews } from '../lib/cryptonews';
import { CoinData } from '../types';
import { NewsItem } from '../types';
import { PriceChart } from './PriceChart';

interface QuickInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  coinId?: string | null;
  commandType?: 'price' | 'yield' | 'swap' | 'news' | 'dca' | 'trending';
  swapData?: {
    fromAmount: string;
    fromToken: string;
    toAmount: string;
    toToken: string;
  };
  dcaData?: {
    amount: string;
    token: string;
    frequency: string;
  };
}

interface Protocol {
  name: string;
  apy: number;
  tvl: number;
  risk: 'Low' | 'Medium' | 'High';
  description: string;
  logo: string;
}

const protocols: Protocol[] = [
  {
    name: 'Aave V3',
    apy: 4.12,
    tvl: 520000000,
    risk: 'Low',
    description: 'Leading lending protocol with strong security track record',
    logo: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png'
  },
  {
    name: 'Compound V3',
    apy: 3.89,
    tvl: 480000000,
    risk: 'Low',
    description: 'Established lending protocol with automated interest rates',
    logo: 'https://assets.coingecko.com/coins/images/10775/small/COMP.png'
  },
  {
    name: 'Curve Finance',
    apy: 5.34,
    tvl: 320000000,
    risk: 'Medium',
    description: 'Efficient stablecoin exchange and yield farming',
    logo: 'https://assets.coingecko.com/coins/images/12124/small/Curve.png'
  }
];

export const QuickInfoModal: React.FC<QuickInfoModalProps> = ({ 
  isOpen, 
  onClose, 
  query,
  coinId,
  commandType = 'price',
  swapData,
  dcaData
}) => {
  const [data, setData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [yieldStep, setYieldStep] = useState(1);
  const [yieldProgress, setYieldProgress] = useState(0);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [showYieldConfirmation, setShowYieldConfirmation] = useState(false);
  const [yieldTransactionProgress, setYieldTransactionProgress] = useState(0);
  const [yieldTransactionStatus, setYieldTransactionStatus] = useState('Initializing transaction...');
  const [depositAmount, setDepositAmount] = useState('3000');
  
  // Swap states
  const [swapStep, setSwapStep] = useState(1);
  const [swapProgress, setSwapProgress] = useState(0);
  const [showSwapConfirmation, setShowSwapConfirmation] = useState(false);
  const [swapTransactionProgress, setSwapTransactionProgress] = useState(0);
  const [swapTransactionStatus, setSwapTransactionStatus] = useState('Initializing transaction...');

  // News states
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);

  // Trending states
  const [trendingData, setTrendingData] = useState<any[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [trendingError, setTrendingError] = useState<string | null>(null);

  // DCA states
  const [dcaConfirmed, setDcaConfirmed] = useState(false);
  const [dcaLoading, setDcaLoading] = useState(false);

  useEffect(() => {
    if (isOpen && commandType === 'dca') {
      setLoading(false);
    } else if (isOpen && commandType === 'trending') {
      fetchTrendingData();
    } else if (isOpen && coinId && commandType === 'price') {
      fetchCoinData();
    } else if (isOpen && commandType === 'yield') {
      startYieldProcess();
    } else if (isOpen && commandType === 'swap') {
      startSwapProcess();
    } else if (isOpen && commandType === 'news') {
      fetchNewsData();
    }
  }, [isOpen, coinId, commandType]);

  const fetchTrendingData = async () => {
    try {
      setTrendingLoading(true);
      setTrendingError(null);
      setLoading(false); // Make sure main loading is false
      
      // Import getTrendingCoins dynamically to avoid circular imports
      const { getTrendingCoins } = await import('../lib/coingecko');
      const trending = await getTrendingCoins();
      console.log('QuickInfoModal: Trending data fetched:', trending);
      setTrendingData(trending);
    } catch (err) {
      console.error('Error fetching trending data:', err);
      setTrendingError('Failed to load trending tokens');
    } finally {
      setTrendingLoading(false);
    }
  };

  const handleDcaConfirm = () => {
    setDcaLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      setDcaLoading(false);
      setDcaConfirmed(true);
      
      // Hide DCA interface after a delay
      setTimeout(() => {
        onClose();
      }, 3000);
    }, 500);
  };

  const startSwapProcess = () => {
    setSwapStep(1);
    setSwapProgress(0);
    setLoading(true);
    
    const timer = setInterval(() => {
      setSwapProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setSwapStep(2);
            setLoading(false);
          }, 500);
          return 100;
        }
        return p + 1;
      });
    }, 30);
  };

  const fetchNewsData = async () => {
    try {
      setNewsLoading(true);
      setNewsError(null);
      const news = await getLatestNews();
      setNewsData(news);
    } catch (err) {
      console.error('Error fetching news:', err);
      setNewsError('Failed to load news');
    } finally {
      setNewsLoading(false);
    }
  };

  const handleSwapConfirm = () => {
    setShowSwapConfirmation(true);
    
    const stages = [
      { progress: 25, status: 'Preparing transaction...' },
      { progress: 50, status: 'Submitting to Uniswap V3...' },
      { progress: 75, status: 'Waiting for confirmation...' },
      { progress: 100, status: 'Transaction confirmed!' }
    ];

    let currentStage = 0;
    const timer = setInterval(() => {
      if (currentStage < stages.length) {
        setSwapTransactionProgress(stages[currentStage].progress);
        setSwapTransactionStatus(stages[currentStage].status);
        currentStage++;
      } else {
        clearInterval(timer);
      }
    }, 1500);
  };

  const startYieldProcess = () => {
    setYieldStep(1);
    setYieldProgress(0);
    setLoading(true);
    
    const timer = setInterval(() => {
      setYieldProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setYieldStep(2);
            setLoading(false);
          }, 500);
          return 100;
        }
        return p + 1;
      });
    }, 30);
  };

  const handleYieldConfirm = () => {
    if (!selectedProtocol) return;
    
    setYieldStep(3);
  };

  const handleDepositConfirm = () => {
    if (!selectedProtocol || !depositAmount) return;
    
    setShowYieldConfirmation(true);
    
    const stages = [
      { progress: 25, status: 'Preparing transaction...' },
      { progress: 50, status: 'Submitting to network...' },
      { progress: 75, status: 'Waiting for confirmation...' },
      { progress: 100, status: 'Transaction confirmed!' }
    ];

    let currentStage = 0;
    const timer = setInterval(() => {
      if (currentStage < stages.length) {
        setYieldTransactionProgress(stages[currentStage].progress);
        setYieldTransactionStatus(stages[currentStage].status);
        currentStage++;
      } else {
        clearInterval(timer);
      }
    }, 1500);
  };

  const fetchCoinData = async () => {
    if (!coinId) return;
    
    try {
      setLoading(true);
      setError(null);
      const coinData = await getCoinPrice(coinId);
      setData(coinData);
    } catch (err) {
      console.error('Error fetching coin data:', err);
      setError('Failed to fetch coin data');
    } finally {
      setLoading(false);
    }
  };

  const renderDCAInterface = () => {
    if (!dcaData) return null;
    
    // Use the actual dcaData values
    const dcaAmount = parseInt(dcaData.amount) || 10;
    const dcaToken = dcaData.token || 'ETH';
    const dcaFrequency = dcaData.frequency.charAt(0).toUpperCase() + dcaData.frequency.slice(1) || 'Daily';
    
    // Get token logo based on the actual token
    const getTokenLogo = (token: string) => {
      const tokenLogos: Record<string, string> = {
        'ETH': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
        'BTC': 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
        'SOL': 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
        'ADA': 'https://assets.coingecko.com/coins/images/975/small/cardano.png'
      };
      return tokenLogos[token] || `https://via.placeholder.com/40/4A90E2/FFFFFF?text=${token.charAt(0)}`;
    };
    
    const dcaTokenLogo = getTokenLogo(dcaToken);
    const dcaEstimatedMonthly = dcaFrequency.toLowerCase() === 'daily' ? dcaAmount * 30 : dcaAmount * 4;
    const dcaNextExecution = dcaFrequency.toLowerCase() === 'daily' ? 'Tomorrow' : 'Next Monday';

    return !dcaConfirmed ? (
      <div className="space-y-6">
        {/* From Token */}
        <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <img 
              src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png" 
              alt="USDC" 
              className="w-10 h-10"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/40/4A90E2/FFFFFF?text=USDC";
              }}
            />
            <div>
              <div className="text-sm text-white/60">From</div>
              <div className="text-xl font-medium">{dcaAmount} USDC</div>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-white/40" />
          <div className="flex items-center gap-3">
            <img 
              src={dcaTokenLogo} 
              alt={dcaToken} 
              className="w-10 h-10"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://via.placeholder.com/40/4A90E2/FFFFFF?text=${dcaToken}`;
              }}
            />
            <div>
              <div className="text-sm text-white/60">To</div>
              <div className="text-xl font-medium">{dcaToken}</div>
            </div>
          </div>
        </div>

        {/* Frequency */}
        <div className="p-4 bg-white/5 rounded-lg space-y-3">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-white/60" />
              <span className="text-white/60">Frequency</span>
            </div>
            <span className="font-medium">{dcaFrequency}</span>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-white/60" />
              <span className="text-white/60">Time</span>
            </div>
            <span className="font-medium">12:00 PM UTC</span>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-white/60" />
              <span className="text-white/60">Estimated Monthly</span>
            </div>
            <span className="font-medium">{dcaEstimatedMonthly} USDC</span>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleDcaConfirm}
          className="w-full mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg font-medium"
        >
          {dcaLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            'Confirm DCA Plan'
          )}
        </button>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-medium mb-4">Your {dcaToken} DCA plan has been scheduled</h3>
        <div className="bg-white/5 rounded-xl p-4 mb-6 max-w-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/60">Amount:</span>
            <span className="font-medium">{dcaAmount} USDC</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/60">Asset:</span>
            <span className="font-medium">{dcaToken}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/60">Frequency:</span>
            <span className="font-medium">{dcaFrequency}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60">Next execution:</span>
            <span className="font-medium">{dcaNextExecution}, 12:00 PM UTC</span>
          </div>
        </div>
        <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
          <span>View in DCA Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    );
  };

  const renderSwapStep1 = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0">
          <svg className="w-full h-full">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="8"
              strokeDasharray={`${swapProgress * 3.77} 377`}
              className="transform -rotate-90 transition-all duration-300"
            />
          </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Bot className="w-12 h-12 text-blue-500" />
        </div>
      </div>
      <h3 className="mt-8 text-xl font-medium">Finding Best Rate</h3>
      <p className="mt-2 text-white/60 text-center max-w-md">
        Scanning DEXs for the best USDC to ETH swap rate...
      </p>
    </div>
  );

  const renderSwapStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <img 
          src="https://assets.coingecko.com/coins/images/12504/small/uni.jpg"
          alt="Uniswap"
          className="w-12 h-12"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/48/4A90E2/FFFFFF?text=UNI";
          }}
        />
        <div>
          <h3 className="text-xl font-medium">Best Rate Found</h3>
          <p className="text-white/60">Uniswap V3 offers the best rate</p>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img 
              src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png"
              alt="USDC" 
              className="w-16 h-16"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/64/4A90E2/FFFFFF?text=USDC";
              }}
            />
            <div>
              <div className="text-base text-white/60">You pay</div>
              <div className="text-xl font-medium">100 USDC</div>
            </div>
          </div>
          <ArrowRight className="w-8 h-8 text-white/40" />
          <div className="flex items-center gap-3">
            <img 
              src="https://assets.coingecko.com/coins/images/279/small/ethereum.png"
              alt="ETH" 
              className="w-16 h-16"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/64/4A90E2/FFFFFF?text=ETH";
              }}
            />
            <div>
              <div className="text-base text-white/60">You receive</div>
              <div className="text-xl font-medium">0.0223 ETH</div>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6 bg-white/5 rounded-lg">
          <div className="flex justify-between">
            <span className="text-lg text-white/60">Rate</span>
            <span className="text-lg font-medium">1 ETH = 4,484.30 USDC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-lg text-white/60">Price Impact</span>
            <span className="text-lg font-medium text-green-400">0.1%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-lg text-white/60">Network Fee</span>
            <span className="text-lg font-medium text-green-400">Free</span>
          </div>
        </div>

        <button
          onClick={handleSwapConfirm}
          className="w-full mt-6 py-4 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-lg font-medium"
        >
          Confirm Swap
        </button>
      </div>
    </div>
  );

  const renderNews = () => (
    <div className="space-y-6">
      {newsLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-4 bg-white/10 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : newsError ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-white/60 mb-4">{newsError}</p>
          <button
            onClick={fetchNewsData}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {newsData.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white/90 group-hover:text-blue-400 transition-colors mb-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-white/60">{item.source}</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/60">{item.time}</span>
                    <span className="text-white/40">•</span>
                    <span className={`${
                      item.impact === 'HIGH' ? 'text-red-400' :
                      item.impact === 'MEDIUM' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {item.impact} IMPACT
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-blue-400 transition-colors flex-shrink-0" />
              </div>
            </a>
          ))}
          
          <div className="text-center pt-4">
            <div className="flex items-center justify-center gap-2 text-sm text-white/60">
              <Clock className="w-4 h-4" />
              <span>Auto-refreshes every 5 minutes</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTrending = () => (
    <div className="space-y-3">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium">Trending Cryptocurrencies</h3>
        <p className="text-sm text-white/60">Most popular tokens right now</p>
      </div>

      {trendingLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-2 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 bg-white/10 rounded-full" />
                <div className="flex-1">
                  <div className="h-3 bg-white/10 rounded w-3/4 mb-1" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
                <div className="h-4 bg-white/10 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : trendingError ? (
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-3">
            <X className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-sm text-white/60 mb-3">{trendingError}</p>
          <button
            onClick={fetchTrendingData}
            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-1.5 max-h-80 overflow-y-auto ai-chat-scrollbar">
          {trendingData.slice(0, 10).map((coin, index) => (
            <div
              key={coin.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1 text-white/60 w-6">
                <span className="text-sm font-medium">#{index + 1}</span>
              </div>
              <img
                src={coin.thumb}
                alt={coin.name}
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/24/4A90E2/FFFFFF?text=${coin.symbol.charAt(0)}`;
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-sm truncate">
                      {coin.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs text-white/80">{coin.symbol}</span>
                      {coin.marketCapRank && (
                        <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] font-medium">
                          Rank #{coin.marketCapRank}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      ${coin.priceUsd.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6
                      })}
                    </div>
                    {coin.volume > 0 && (
                      <div className="flex items-center gap-1 text-xs mt-0.5">
                        <span className="text-white/60">Vol:</span>
                        <span className="text-white/80">
                          ${new Intl.NumberFormat('en-US', {
                            notation: 'compact',
                            maximumFractionDigits: 1
                          }).format(coin.volume)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="text-center pt-2">
            <div className="flex items-center justify-center gap-2 text-xs text-white/60">
              <Clock className="w-4 h-4" />
              <span>Data refreshes every 2 minutes</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderYieldConfirmation = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
      {yieldTransactionProgress < 100 ? (
        <>
          <div className="w-full max-w-md mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-white/60">{yieldTransactionStatus}</span>
              <span className="text-sm text-white/60">{yieldTransactionProgress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${yieldTransactionProgress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 animate-pulse">
            <img 
              src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" 
              alt="USDC" 
              className="w-12 h-12"
            />
            <ArrowRight className="w-6 h-6 text-white/40" />
            <img 
              src={selectedProtocol?.logo} 
              alt={selectedProtocol?.name} 
              className="w-12 h-12"
            />
          </div>
          <p className="mt-4 text-white/60">
            Depositing {depositAmount} USDC into {selectedProtocol?.name}
          </p>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-medium mb-2">Transaction Successful!</h3>
          <p className="text-white/60 mb-6">
            {depositAmount} USDC has been successfully deposited into {selectedProtocol?.name}
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg"
          >
            Close
          </button>
        </>
      )}
    </div>
  );

  const handleRefresh = () => {
    fetchCoinData();
  };

  const renderYieldStep1 = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0">
          <svg className="w-full h-full">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="8"
              strokeDasharray={`${yieldProgress * 3.77} 377`}
              className="transform -rotate-90 transition-all duration-300"
            />
          </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Bot className="w-12 h-12 text-blue-500" />
        </div>
      </div>
      <h3 className="mt-8 text-xl font-medium">Observer Agent</h3>
      <p className="mt-2 text-white/60 text-center max-w-md">
        Analyzing market conditions and scanning protocols for the best USDC yield opportunities...
      </p>
    </div>
  );

  const renderYieldStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
          <Search className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h3 className="text-xl font-medium">Task Manager Agent</h3>
          <p className="text-white/60">Reviewing and analyzing yield opportunities</p>
        </div>
      </div>

      <div className="space-y-4">
        {protocols.map((protocol) => (
          <div
            key={protocol.name}
            onClick={() => setSelectedProtocol(protocol)}
            className={`p-4 rounded-xl transition-all cursor-pointer ${
              selectedProtocol?.name === protocol.name
                ? 'bg-blue-500/20 border border-blue-500/50'
                : 'bg-white/5 hover:bg-white/10 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-4 mb-2">
              <img 
                src={protocol.logo} 
                alt={protocol.name} 
                className="w-8 h-8 object-contain"
              />
              <div className="flex-1 flex items-center justify-between">
                <h4 className="font-medium">{protocol.name}</h4>
                <div className="text-lg font-semibold text-blue-400">
                  {protocol.apy}% APY
                </div>
              </div>
            </div>
            <p className="text-sm text-white/60 mb-2">{protocol.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-white/40">TVL:</span>{' '}
                <span className="text-white/80">
                  ${(protocol.tvl / 1000000).toFixed(1)}M
                </span>
              </div>
              <div>
                <span className="text-white/40">Risk:</span>{' '}
                <span className={`
                  ${protocol.risk === 'Low' ? 'text-green-400' : ''}
                  ${protocol.risk === 'Medium' ? 'text-yellow-400' : ''}
                  ${protocol.risk === 'High' ? 'text-red-400' : ''}
                `}>
                  {protocol.risk}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProtocol && (
        <button
          onClick={() => setYieldStep(3)}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors font-medium"
        >
          Continue with {selectedProtocol.name}
        </button>
      )}
    </div>
  );

  const renderYieldStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
          <Wallet className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <h3 className="text-xl font-medium">Deposit Amount</h3>
          <p className="text-white/60">How much USDC would you like to deposit?</p>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <img 
            src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" 
            alt="USDC" 
            className="w-10 h-10"
          />
          <div>
            <div className="text-sm text-white/60">Deposit into</div>
            <div className="text-lg font-medium">{selectedProtocol?.name}</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-sm text-white/60">Expected APY</div>
            <div className="text-lg font-medium text-green-400">
              {selectedProtocol?.apy}%
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Amount (USDC)</label>
            <div className="relative">
              <input
                type="text"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-2xl outline-none focus:border-white/20"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  onClick={() => setDepositAmount('1000')}
                  className="px-2 py-1 text-sm text-blue-400 hover:text-blue-300"
                >
                  1K
                </button>
                <button
                  onClick={() => setDepositAmount('5000')}
                  className="px-2 py-1 text-sm text-blue-400 hover:text-blue-300"
                >
                  5K
                </button>
                <button
                  onClick={() => setDepositAmount('10000')}
                  className="px-2 py-1 text-sm text-blue-400 hover:text-blue-300"
                >
                  10K
                </button>
              </div>
            </div>
            <div className="mt-1 text-sm text-white/40">
              Available: 15,000 USDC
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Expected Annual Yield</span>
              <span className="text-green-400">
                ~{depositAmount ? (parseFloat(depositAmount) * (selectedProtocol?.apy || 0) / 100).toFixed(2) : '0'} USDC
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Monthly Yield</span>
              <span className="text-green-400">
                ~{depositAmount ? ((parseFloat(depositAmount) * (selectedProtocol?.apy || 0) / 100) / 12).toFixed(2) : '0'} USDC
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Network Fee</span>
              <span>~$2.50</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setYieldStep(2)}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleDepositConfirm}
            disabled={!depositAmount || parseFloat(depositAmount) <= 0}
            className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
          >
            Deposit {depositAmount} USDC
          </button>
        </div>
      </div>
    </div>
  );

  const renderSwapConfirmation = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
      {swapTransactionProgress < 100 ? (
        <>
          <div className="w-full max-w-md mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-white/60">{swapTransactionStatus}</span>
              <span className="text-sm text-white/60">{swapTransactionProgress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${swapTransactionProgress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 animate-pulse">
            <img 
              src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png"
              alt="USDC" 
              className="w-12 h-12"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/48/4A90E2/FFFFFF?text=USDC";
              }}
            />
            <ArrowRight className="w-6 h-6 text-white/40" />
            <img 
              src="https://assets.coingecko.com/coins/images/279/small/ethereum.png"
              alt="ETH" 
              className="w-12 h-12"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/48/4A90E2/FFFFFF?text=ETH";
              }}
            />
          </div>
          <p className="mt-4 text-white/60">
            Swapping 100 USDC for 0.0223 ETH via Uniswap V3
          </p>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-medium mb-2">Swap Successful!</h3>
          <p className="text-white/60 mb-6">
            You've successfully swapped 100 USDC for 0.0223 ETH
          </p>
          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Rate Used</span>
                <span>1 ETH = 4,484.30 USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Price Impact</span>
                <span className="text-green-400">0.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Network Fee</span>
                <span className="text-green-400">Free</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg"
          >
            Close
          </button>
        </>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 mb-24 z-50 px-6">
      <div className="relative bg-gradient-to-b from-black/60 to-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 w-[800px] mx-auto shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            {commandType === 'dca' && (
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
            )}
            {commandType === 'price' && data?.image && (
              <img 
                src={data.image} 
                alt={coinId} 
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/32/4A90E2/FFFFFF?text=${coinId?.charAt(0).toUpperCase()}`;
                }}
              />
            )}
            {commandType === 'yield' && (
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Search className="w-5 h-5 text-blue-500" />
              </div>
            )}
            {commandType === 'swap' && (
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <ArrowLeftRight className="w-5 h-5 text-purple-500" />
              </div>
            )}
            {commandType === 'news' && (
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-blue-500" />
              </div>
            )}
            {commandType === 'trending' && (
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold">
                {commandType === 'dca' ? 'DCA Setup' :
                 commandType === 'yield' ? 'Yield Finder' :
                 commandType === 'swap' ? 'Token Swap' :
                 commandType === 'news' ? 'Market News' :
                 commandType === 'trending' ? 'Trending Tokens' :
                 data ? `${coinId?.charAt(0).toUpperCase()}${coinId?.slice(1)} Price` : 'Loading...'}
              </h2>
              <p className="text-xs text-white/60">"{query}"</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {commandType === 'price' && (
              <button
                onClick={handleRefresh}
                disabled={loading}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Triangle Pointer */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
          <div className="border-8 border-transparent border-t-white/10" />
        </div>
        {/* Content */}
        <div className="p-4">
          {commandType === 'yield' ? (
            showYieldConfirmation ? renderYieldConfirmation() : (
              yieldStep === 1 ? renderYieldStep1() : 
              yieldStep === 2 ? renderYieldStep2() : 
              renderYieldStep3()
            )
          ) : commandType === 'swap' ? (
            showSwapConfirmation ? renderSwapConfirmation() : (
              swapStep === 1 ? renderSwapStep1() : renderSwapStep2()
            )
          ) : commandType === 'news' ? (
            renderNews()
          ) : commandType === 'trending' ? (
            renderTrending()
          ) : commandType === 'dca' ? (
            renderDCAInterface()
          ) : commandType === 'price' && loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse space-y-4 w-full">
                <div className="h-8 bg-white/10 rounded w-1/2 mx-auto" />
                <div className="h-32 bg-white/10 rounded" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-16 bg-white/10 rounded" />
                  <div className="h-16 bg-white/10 rounded" />
                </div>
              </div>
            </div>
          ) : commandType === 'price' && error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-white/60 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : commandType === 'price' && data ? (
            <div className="space-y-6">
              {/* Price Display */}
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  ${data.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
                <div className={`flex items-center justify-center gap-2 text-lg ${
                  data.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {data.priceChange24h >= 0 ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                  <span>{data.priceChange24h >= 0 ? '+' : ''}{data.priceChange24h.toFixed(2)}%</span>
                  <span className="text-white/60">24h</span>
                </div>
              </div>

              {/* Chart */}
              <div className="h-[200px]">
                <PriceChart data={data} />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-white/60 mb-1">Market Cap</div>
                  <div className="text-xl font-medium">
                    ${new Intl.NumberFormat('en-US', {
                      notation: 'compact',
                      maximumFractionDigits: 1
                    }).format(data.marketCap)}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-white/60 mb-1">Volume (24h)</div>
                  <div className="text-xl font-medium">
                    ${new Intl.NumberFormat('en-US', {
                      notation: 'compact',
                      maximumFractionDigits: 1
                    }).format(data.volume24h)}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};