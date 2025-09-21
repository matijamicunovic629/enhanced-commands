import React, { useState } from 'react';
import { X, Maximize2, Minimize2, TrendingUp, TrendingDown } from 'lucide-react';
import { Line } from 'react-chartjs-2';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Token {
  name: string;
  symbol: string;
  amount: number;
  value: number;
  change24h: number;
  allocation: number;
  logo: string;
}

const tokens: Token[] = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    amount: 0.125,
    value: 8405.73,
    change24h: 1.86,
    allocation: 54.56,
    logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    amount: 1.5,
    value: 4875.51,
    change24h: -2.14,
    allocation: 31.65,
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    amount: 15.8,
    value: 1250.32,
    change24h: 5.23,
    allocation: 8.12,
    logo: 'https://cryptologos.cc/logos/solana-sol-logo.png'
  },
  {
    name: 'Cardano',
    symbol: 'ADA',
    amount: 2500,
    value: 875.25,
    change24h: -0.95,
    allocation: 5.68,
    logo: 'https://cryptologos.cc/logos/cardano-ada-logo.png'
  },
  {
    name: 'Polkadot',
    symbol: 'DOT',
    amount: 150,
    value: 750.45,
    change24h: 3.12,
    allocation: 4.87,
    logo: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png'
  },
  {
    name: 'Chainlink',
    symbol: 'LINK',
    amount: 100,
    value: 650.80,
    change24h: 2.45,
    allocation: 4.22,
    logo: 'https://cryptologos.cc/logos/chainlink-link-logo.png'
  },
  {
    name: 'Avalanche',
    symbol: 'AVAX',
    amount: 25,
    value: 550.25,
    change24h: -1.75,
    allocation: 3.57,
    logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.png'
  },
  {
    name: 'Polygon',
    symbol: 'MATIC',
    amount: 1000,
    value: 450.60,
    change24h: 4.32,
    allocation: 2.93,
    logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png'
  }
];

const performanceData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Portfolio Value',
      data: [12000, 13500, 14200, 14800, 15200, 15406],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
};

const distributionData = {
  labels: ['Spot', 'Staked', 'Lending', 'LP'],
  datasets: [
    {
      data: [45, 30, 15, 10],
      backgroundColor: [
        '#10B981', // Spot - Green
        '#3B82F6', // Staked - Blue
        '#8B5CF6', // Lending - Purple
        '#F59E0B'  // LP - Orange
      ],
      borderWidth: 0
    }
  ]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)'
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)',
        callback: (value: number) => '$' + value.toLocaleString()
      }
    }
  }
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '75%',
  plugins: {
    legend: {
      display: false
    }
  }
};

export const DashboardModal: React.FC<DashboardModalProps> = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [selectedTab, setSelectedTab] = useState('tokens');

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
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-semibold">Portfolio Dashboard</h2>
          <div className="flex items-center gap-2">
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

        <div className="p-6 h-[calc(100%-73px)] overflow-y-auto ai-chat-scrollbar">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-6h2v2h-2zm0-8h2v6h-2z"/>
                  </svg>
                </div>
                <div className="text-sm text-white/60">Total Value</div>
              </div>
              <div className="text-2xl font-bold">$15,406,481</div>
              <div className="flex items-center gap-1 mt-1 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                <span>1.54%</span>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-sm text-white/60">PNL</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold">+$231,806</div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>1.54%</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {['24h', '7d', '1m', '6m', '1y', 'All'].map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                      selectedTimeframe === timeframe
                        ? 'bg-white/10'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 18v-2c0-1.1-.9-2-2-2h-2v2h2v2h2zm-2 2h-2v2h2v-2zm-4 0v2h-4v-2h4zm-6 0v2H7v-2h2zm-4 0v2H3v-2h2zm0-2H3v-2h2v2zm14-4h-2v-2h2v2zm-6-6h2v2h-2V8zm0 4h2v2h-2v-2zm-6 4H7v-2h2v2zm-4-4h2v2H3v-2zm0 0"/>
                  </svg>
                </div>
                <div className="text-sm text-white/60">DeFi Positions</div>
              </div>
              <div className="text-2xl font-bold">$6,932,916</div>
              <div className="text-sm text-white/60 mt-1">45% of portfolio</div>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div className="text-sm text-white/60">NFT Value</div>
              </div>
              <div className="text-2xl font-bold">$1,540,648</div>
              <div className="text-sm text-white/60 mt-1">10% of portfolio</div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Portfolio Performance</h3>
                <div className="flex items-center gap-2">
                  {['24h', '7d', '1m', '6m', '1y', 'All'].map((timeframe) => (
                    <button
                      key={timeframe}
                      onClick={() => setSelectedTimeframe(timeframe)}
                      className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                        selectedTimeframe === timeframe
                          ? 'bg-white/10'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      {timeframe}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[300px]">
                <Line data={performanceData} options={chartOptions} />
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Asset Distribution</h3>
              </div>
              <div className="flex items-center gap-12">
                <div className="relative w-[300px] h-[300px]">
                  <Line data={distributionData} options={doughnutOptions} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold">$15.4M</div>
                    <div className="text-sm text-white/60">Total Value</div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {distributionData.labels.map((label, index) => (
                    <div key={label} className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: distributionData.datasets[0].backgroundColor[index] }}
                      />
                      <div className="flex items-center gap-2">
                        <span>{label}</span>
                        <span className="text-white/60">
                          {distributionData.datasets[0].data[index]}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white/5 rounded-xl">
            <div className="flex items-center gap-2 p-2">
              {['tokens', 'defi', 'nfts'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                    selectedTab === tab
                      ? 'bg-white/10'
                      : 'hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-4">
              {selectedTab === 'tokens' && (
                <div className="space-y-3 max-h-[400px] overflow-y-auto ai-chat-scrollbar">
                  {tokens.map((token) => (
                    <div
                      key={token.symbol}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <img
                        src={token.logo}
                        alt={token.name}
                        className="w-8 h-8"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{token.name}</span>
                          <span className="text-white/60">{token.symbol}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span>{token.amount} {token.symbol}</span>
                          <span className="text-white/40">•</span>
                          <span>${token.value.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg">${token.value.toLocaleString()}</div>
                        <div className={`flex items-center gap-1 justify-end text-sm ${
                          token.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {token.change24h >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span>{Math.abs(token.change24h)}%</span>
                        </div>
                      </div>
                      <div className="w-32">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-white/60">Allocation</span>
                          <span>{token.allocation}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${token.allocation}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};