import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  ChevronDown, 
  RefreshCw,
  Settings,
  LineChart,
  History,
  Loader2,
  ArrowDown,
  ExternalLink,
  Search,
  X as XIcon
} from 'lucide-react';
import { getCoinPrice, getOHLCV } from '../lib/coingecko';

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Token {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  balance?: string;
}

const tokens: Token[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    balance: '1.5'
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    balance: '0.05'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    logo: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    balance: '15.8'
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    logo: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
    balance: '2500'
  },
  {
    id: 'polkadot',
    name: 'Polkadot',
    symbol: 'DOT',
    logo: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png',
    balance: '150'
  },
  {
    id: 'chainlink',
    name: 'Chainlink',
    symbol: 'LINK',
    logo: 'https://cryptologos.cc/logos/chainlink-link-logo.png',
    balance: '100'
  },
  {
    id: 'avalanche-2',
    name: 'Avalanche',
    symbol: 'AVAX',
    logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.png',
    balance: '25'
  },
  {
    id: 'matic-network',
    name: 'Polygon',
    symbol: 'MATIC',
    logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    balance: '1000'
  },
  {
    id: 'uniswap',
    name: 'Uniswap',
    symbol: 'UNI',
    logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
    balance: '75'
  },
  {
    id: 'aave',
    name: 'Aave',
    symbol: 'AAVE',
    logo: 'https://cryptologos.cc/logos/aave-aave-logo.png',
    balance: '10'
  },
  {
    id: 'usd-coin',
    name: 'USD Coin',
    symbol: 'USDC',
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    balance: '5000'
  },
  {
    id: 'tether',
    name: 'Tether',
    symbol: 'USDT',
    logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    balance: '5000'
  },
  {
    id: 'dai',
    name: 'Dai',
    symbol: 'DAI',
    logo: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
    balance: '5000'
  },
  {
    id: 'binancecoin',
    name: 'BNB',
    symbol: 'BNB',
    logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    balance: '10'
  },
  {
    id: 'ripple',
    name: 'XRP',
    symbol: 'XRP',
    logo: 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
    balance: '10000'
  }
];

interface Transaction {
  type: 'BUY' | 'SELL';
  date: string;
  price: string;
  amount: string;
  total: string;
  maker: string;
  hash: string;
}

const recentTransactions: Transaction[] = [
  {
    type: 'BUY',
    date: '2024-03-19 14:32',
    price: '$3,245.67',
    amount: '1.5 ETH',
    total: '$4,868.51',
    maker: '0x7a2...3f9',
    hash: '0x1234...5678'
  },
  {
    type: 'SELL',
    date: '2024-03-19 14:30',
    price: '$3,244.12',
    amount: '0.8 ETH',
    total: '$2,595.30',
    maker: '0x3b1...8e2',
    hash: '0x8765...4321'
  },
  {
    type: 'BUY',
    date: '2024-03-19 14:28',
    price: '$3,243.89',
    amount: '2.2 ETH',
    total: '$7,136.56',
    maker: '0x9c4...2d7',
    hash: '0xabcd...efgh'
  }
];

export const SwapModal: React.FC<SwapModalProps> = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChart, setShowChart] = useState(true);
  const [showHistory, setShowHistory] = useState(true);
  const [fromAmount, setFromAmount] = useState('0.0');
  const [toAmount, setToAmount] = useState('0.0');
  const [fromToken, setFromToken] = useState<Token>(tokens[0]); // ETH
  const [toToken, setToToken] = useState<Token>(tokens[10]); // USDC
  const [showFromTokens, setShowFromTokens] = useState(false);
  const [showToTokens, setShowToTokens] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceData, setPriceData] = useState<any>(null);
  const [ohlcvData, setOhlcvData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [price, ohlcv] = await Promise.all([
            getCoinPrice(fromToken.id),
            getOHLCV(fromToken.id)
          ]);
          setPriceData(price);
          
          const chartData = {
            labels: ohlcv.map((d: any) => new Date(d.time).toLocaleTimeString()),
            datasets: [
              {
                fill: true,
                label: 'Price (USD)',
                data: ohlcv.map((d: any) => d.close),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
              }
            ]
          };
          setOhlcvData(chartData);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [isOpen, fromToken.id]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
      },
    },
  };

  const filteredTokens = tokens.filter(token => {
    const searchLower = searchQuery.toLowerCase();
    return (
      token.name.toLowerCase().includes(searchLower) ||
      token.symbol.toLowerCase().includes(searchLower)
    );
  });

  const handleFromTokenSelect = (token: Token) => {
    if (token.id === toToken.id) {
      setToToken(fromToken);
    }
    setFromToken(token);
    setShowFromTokens(false);
    setSearchQuery('');
  };

  const handleToTokenSelect = (token: Token) => {
    if (token.id === fromToken.id) {
      setFromToken(toToken);
    }
    setToToken(token);
    setShowToTokens(false);
    setSearchQuery('');
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isOpen) return null;

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
        <div className="flex flex-col h-full">
          {/* Token Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <img 
                  src={fromToken.logo}
                  alt={fromToken.symbol}
                  className="w-8 h-8"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">{fromToken.symbol}</h2>
                    <span className="text-white/60">{fromToken.name}</span>
                  </div>
                  {loading ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin text-white/40" />
                      <span className="text-white/40">Loading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`${
                        priceData?.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {priceData?.priceChange24h.toFixed(2)}% 24h
                      </span>
                      <span>${priceData?.price.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="h-8 w-px bg-white/10" />

              <div className="flex items-center gap-4 text-sm">
                <div>
                  <div className="text-white/60">Market Cap</div>
                  <div>${priceData?.marketCap?.toLocaleString()}</div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <div className="text-white/60">24h Volume</div>
                  <div>${priceData?.volume24h?.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setShowChart(!showChart)}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${
                  showChart ? 'text-blue-400' : 'text-white/60'
                }`}
              >
                <LineChart className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${
                  showHistory ? 'text-blue-400' : 'text-white/60'
                }`}
              >
                <History className="w-4 h-4" />
              </button>
              <div className="h-8 w-px bg-white/10" />
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
        
          <div className="flex flex-1 h-[calc(100%-73px)]">
            {/* Left Section: Chart and History */}
            <div className="flex-1 flex flex-col border-r border-white/10">
              {/* Chart Section */}
              {showChart && (
                <div className="p-4">
                  {loading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-white/40" />
                    </div>
                  ) : (
                    <div className="h-[300px]">
                      <Line data={ohlcvData} options={chartOptions} />
                    </div>
                  )}
                </div>
              )}

              {/* Transaction History */}
              {showHistory && (
                <div className="flex-1 p-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Recent Transactions</h3>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2 overflow-y-auto ai-chat-scrollbar max-h-[calc(100vh-600px)]">
                    {recentTransactions.map((tx, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              tx.type === 'BUY' 
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {tx.type}
                            </span>
                            <span className="text-sm text-white/60">{tx.date}</span>
                          </div>
                          <a
                            href={`https://etherscan.io/tx/${tx.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 hover:bg-white/10 rounded-md transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 text-white/40" />
                          </a>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <span className="text-white/60">Price:</span>{' '}
                            <span>{tx.price}</span>
                          </div>
                          <div>
                            <span className="text-white/60">Amount:</span>{' '}
                            <span>{tx.amount}</span>
                          </div>
                          <div>
                            <span className="text-white/60">Total:</span>{' '}
                            <span>{tx.total}</span>
                          </div>
                          <div>
                            <span className="text-white/60">Maker:</span>{' '}
                            <span className="font-mono">{tx.maker}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Section: Swap Interface */}
            <div className="w-[400px] p-4">
              <div className="space-y-3">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-sm text-white/60 mb-2">From</div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <button 
                        onClick={() => {
                          setShowFromTokens(true);
                          setShowToTokens(false);
                        }}
                        className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <img src={fromToken.logo} alt={fromToken.symbol} className="w-6 h-6" />
                        <span>{fromToken.symbol}</span>
                        <ChevronDown className="w-4 h-4 text-white/60" />
                      </button>

                      {showFromTokens && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowFromTokens(false)}
                          />
                          <div className="absolute top-full left-0 mt-2 w-64 p-2 glass rounded-lg z-20 border border-white/10">
                            <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg mb-2">
                              <Search className="w-4 h-4 text-white/40" />
                              <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search tokens..."
                                className="bg-transparent outline-none flex-1 text-sm"
                              />
                              {searchQuery && (
                                <button
                                  onClick={() => setSearchQuery('')}
                                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                  <XIcon className="w-4 h-4 text-white/60" />
                                </button>
                              )}
                            </div>
                            <div className="max-h-64 overflow-y-auto token-dropdown-scrollbar">
                              {filteredTokens.map((token) => (
                                <button
                                  key={token.id}
                                  onClick={() => handleFromTokenSelect(token)}
                                  className="w-full flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                  <img src={token.logo} alt={token.symbol} className="w-6 h-6" />
                                  <div className="flex-1 text-left">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">{token.symbol}</span>
                                      <span className="text-sm text-white/60">
                                        {token.balance}
                                      </span>
                                    </div>
                                    <div className="text-sm text-white/60">{token.name}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <input
                      type="text"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      className="flex-1 bg-transparent text-right outline-none text-xl"
                      placeholder="0.0"
                    />
                  </div>
                  <div className="text-sm text-white/40 mt-1">
                    Balance: {fromToken.balance} {fromToken.symbol}
                  </div>
                </div>

                <div className="flex justify-center -my-2 relative z-10">
                  <button 
                    onClick={handleSwapTokens}
                    className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-sm text-white/60 mb-2">To</div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <button 
                        onClick={() => {
                          setShowToTokens(true);
                          setShowFromTokens(false);
                        }}
                        className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <img src={toToken.logo} alt={toToken.symbol} className="w-6 h-6" />
                        <span>{toToken.symbol}</span>
                        <ChevronDown className="w-4 h-4 text-white/60" />
                      </button>

                      {showToTokens && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowToTokens(false)}
                          />
                          <div className="absolute top-full left-0 mt-2 w-64 p-2 glass rounded-lg z-20 border border-white/10">
                            <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg mb-2">
                              <Search className="w-4 h-4 text-white/40" />
                              <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search tokens..."
                                className="bg-transparent outline-none flex-1 text-sm"
                              />
                              {searchQuery && (
                                <button
                                  onClick={() => setSearchQuery('')}
                                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                  <XIcon className="w-4 h-4 text-white/60" />
                                </button>
                              )}
                            </div>
                            <div className="max-h-64 overflow-y-auto token-dropdown-scrollbar">
                              {filteredTokens.map((token) => (
                                <button
                                  key={token.id}
                                  onClick={() => handleToTokenSelect(token)}
                                  className="w-full flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                  <img src={token.logo} alt={token.symbol} className="w-6 h-6" />
                                  <div className="flex-1 text-left">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">{token.symbol}</span>
                                      <span className="text-sm text-white/60">
                                        {token.balance}
                                      </span>
                                    </div>
                                    <div className="text-sm text-white/60">{token.name}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <input
                      type="text"
                      value={toAmount}
                      onChange={(e) => setToAmount(e.target.value)}
                      className="flex-1 bg-transparent text-right outline-none text-xl"
                      placeholder="0.0"
                    />
                  </div>
                  <div className="text-sm text-white/40 mt-1">
                    Balance: {toToken.balance} {toToken.symbol}
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Rate</span>
                    <span>1 {fromToken.symbol} = {(priceData?.price || 0).toFixed(2)} {toToken.symbol}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Price Impact</span>
                    <span className="text-green-400">{'<'}0.01%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Network Fee</span>
                    <span>~$2.50</span>
                  </div>
                </div>

                <button className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 transition-colors rounded-xl font-medium">
                  Swap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}