import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Wallet, BarChart2, 
  RefreshCw, AlertCircle, DollarSign, ArrowRight,
  Shield, Activity, Globe, Users, Clock, Bell,
  ArrowUpDown, FileText, ExternalLink
} from 'lucide-react';

const DeFiMarketDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async (showRefreshState = false) => {
    try {
      if (showRefreshState) {
        setRefreshing(true);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching DeFi market data:', err);
      setError('Failed to load market data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchData(true);
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'transfer':
        return 'bg-blue-500/20 text-blue-400';
      case 'swap':
        return 'bg-purple-500/20 text-purple-400';
      case 'stake':
        return 'bg-green-500/20 text-green-400';
      case 'borrow':
        return 'bg-orange-500/20 text-orange-400';
      case 'repay':
        return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
    }
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case 'wallet':
        return <Wallet className="w-4 h-4 text-white/40" />;
      case 'exchange':
        return <ArrowUpDown className="w-4 h-4 text-white/40" />;
      case 'contract':
        return <FileText className="w-4 h-4 text-white/40" />;
    }
  };

  const renderTransactionStatus = (status: string) => (
    <span className={`px-2 py-0.5 rounded-full text-xs ${
      status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
    }`}>
      {status.toUpperCase()}
    </span>
  );

  if (error) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
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
    <div className="p-6 h-full overflow-y-auto ai-chat-scrollbar">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">DeFi Market Overview</h2>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${
            refreshing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white/60">Total Value Locked</span>
            </div>
            <div className="text-2xl font-bold mb-1">
              $48.5B
            </div>
            <div className="flex items-center gap-1 text-sm text-green-400">
              <TrendingUp className="w-4 h-4" />
              <span>2.5%</span>
              <span className="text-white/60">24h</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-white/60">DeFi Market Cap</span>
            </div>
            <div className="text-2xl font-bold mb-1">
              $25.8B
            </div>
            <div className="text-sm text-white/60">
              53.2% TVL Ratio
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-sm text-white/60">24h Volume</span>
            </div>
            <div className="text-2xl font-bold mb-1">
              $12.4B
            </div>
            <div className="text-sm text-white/60">
              25.6% of TVL
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white/60">Risk Level</span>
            </div>
            <div className="text-2xl font-bold mb-1">
              Medium
            </div>
            <div className="text-sm text-white/60">
              Based on market conditions
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-lg font-medium mb-4">Exchange Volume (24h)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">CEX Volume</span>
                </div>
                <div className="text-2xl font-bold">
                  $45.2B
                </div>
                <div className="text-sm text-white/60 mt-1">
                  78.5% of total
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span className="text-sm">DEX Volume</span>
                </div>
                <div className="text-2xl font-bold">
                  $12.4B
                </div>
                <div className="text-sm text-white/60 mt-1">
                  21.5% of total
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-lg font-medium mb-4">Stablecoin Market Supply</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                <img 
                  src="https://cryptologos.cc/logos/tether-usdt-logo.png" 
                  alt="USDT" 
                  className="w-8 h-8"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">USDT</span>
                    <span>$82.5B</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: '58.7%' }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                <img 
                  src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" 
                  alt="USDC" 
                  className="w-8 h-8"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">USDC</span>
                    <span>$45.2B</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: '32.2%' }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                <img 
                  src="https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png" 
                  alt="DAI" 
                  className="w-8 h-8"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">DAI</span>
                    <span>$12.8B</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: '9.1%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-6">
          <h3 className="text-lg font-medium mb-4">Top Protocols</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-white/60">
                  <th className="pb-4 font-medium">Protocol</th>
                  <th className="pb-4 font-medium">Category</th>
                  <th className="pb-4 font-medium text-right">TVL</th>
                  <th className="pb-4 font-medium text-right">24h Change</th>
                  <th className="pb-4 font-medium text-right">7d Change</th>
                  <th className="pb-4 font-medium text-right">Daily Users</th>
                  <th className="pb-4 font-medium text-right">Weekly Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {[
                  {
                    name: 'Aave',
                    category: 'Lending',
                    tvl: 5.2,
                    change24h: 2.5,
                    change7d: 8.2,
                    dailyUsers: 12500,
                    weeklyRevenue: 850000,
                    logo: 'https://cryptologos.cc/logos/aave-aave-logo.png'
                  },
                  {
                    name: 'Uniswap',
                    category: 'DEX',
                    tvl: 4.8,
                    change24h: 3.2,
                    change7d: 5.4,
                    dailyUsers: 45000,
                    weeklyRevenue: 1250000,
                    logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png'
                  },
                  {
                    name: 'Lido',
                    category: 'Liquid Staking',
                    tvl: 4.2,
                    change24h: 1.8,
                    change7d: 4.2,
                    dailyUsers: 8500,
                    weeklyRevenue: 950000,
                    logo: 'https://cryptologos.cc/logos/lido-dao-ldo-logo.png'
                  },
                  {
                    name: 'Curve',
                    category: 'DEX',
                    tvl: 3.8,
                    change24h: -1.2,
                    change7d: 2.8,
                    dailyUsers: 15000,
                    weeklyRevenue: 680000,
                    logo: 'https://cryptologos.cc/logos/curve-dao-token-crv-logo.png'
                  },
                  {
                    name: 'GMX',
                    category: 'Derivatives',
                    tvl: 2.5,
                    change24h: 4.5,
                    change7d: 12.4,
                    dailyUsers: 22000,
                    weeklyRevenue: 1450000,
                    logo: 'https://cryptologos.cc/logos/gmx-gmx-logo.png'
                  }
                ].map((protocol) => (
                  <tr key={protocol.name} className="hover:bg-white/5">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={protocol.logo} alt={protocol.name} className="w-8 h-8" />
                        <span className="font-medium">{protocol.name}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-1 rounded-full text-sm bg-white/10">
                        {protocol.category}
                      </span>
                    </td>
                    <td className="py-4 text-right font-medium">
                      ${protocol.tvl.toFixed(2)}B
                    </td>
                    <td className={`py-4 text-right ${
                      protocol.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {protocol.change24h >= 0 ? '+' : ''}{protocol.change24h.toFixed(2)}%
                    </td>
                    <td className={`py-4 text-right ${
                      protocol.change7d >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {protocol.change7d >= 0 ? '+' : ''}{protocol.change7d.toFixed(2)}%
                    </td>
                    <td className="py-4 text-right">
                      {protocol.dailyUsers.toLocaleString()}
                    </td>
                    <td className="py-4 text-right">
                      ${(protocol.weeklyRevenue / 1000).toFixed(1)}K
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[
            {
              protocol: 'Aave',
              asset: 'USDC',
              type: 'stablecoin',
              apy: 4.82,
              tvl: 520000000,
              logo: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png'
            },
            {
              protocol: 'Lido',
              asset: 'stETH',
              type: 'liquid-staking',
              apy: 3.75,
              tvl: 320000000,
              logo: 'https://assets.coingecko.com/coins/images/13573/small/Lido_DAO.png'
            },
            {
              protocol: 'Compound',
              asset: 'USDT',
              type: 'lending',
              apy: 4.12,
              tvl: 280000000,
              logo: 'https://assets.coingecko.com/coins/images/10775/small/COMP.png'
            }
          ].map((opportunity) => (
            <div key={opportunity.protocol} className="bg-white/5 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <img src={opportunity.logo} alt={opportunity.protocol} className="w-10 h-10" />
                <div>
                  <h4 className="font-medium">{opportunity.protocol}</h4>
                  <div className="text-sm text-white/60">{opportunity.type}</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-white/60 mb-1">APY</div>
                  <div className="text-2xl font-bold text-green-400">
                    {opportunity.apy.toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-white/60 mb-1">Asset</div>
                  <div className="font-medium">{opportunity.asset}</div>
                </div>
                <div>
                  <div className="text-sm text-white/60 mb-1">TVL</div>
                  <div className="font-medium">
                    ${(opportunity.tvl / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">Significant Transactions</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Clock className="w-4 h-4" />
                  <span>Auto-updates every minute</span>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${
                    refreshing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  hash: '0x742d...f44e',
                  type: 'transfer',
                  amount: 5200000,
                  token: 'USDC',
                  tokenLogo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
                  timestamp: '5 mins ago',
                  from: '0x1234...5678',
                  fromType: 'wallet',
                  to: 'Binance',
                  toType: 'exchange',
                  impact: 'high',
                  status: 'completed',
                  network: 'Ethereum',
                  networkLogo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
                },
                {
                  hash: '0x8Ba7...FF29',
                  type: 'swap',
                  amount: 2800000,
                  token: 'ETH',
                  tokenLogo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
                  timestamp: '12 mins ago',
                  from: '0x9876...4321',
                  fromType: 'wallet',
                  to: 'Uniswap V3',
                  toType: 'contract',
                  impact: 'medium',
                  status: 'completed',
                  network: 'Ethereum',
                  networkLogo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
                },
                {
                  hash: '0x3B4...a5d0',
                  type: 'stake',
                  amount: 1500000,
                  token: 'ETH',
                  tokenLogo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
                  timestamp: '25 mins ago',
                  from: '0xabcd...efgh',
                  fromType: 'wallet',
                  to: 'Lido',
                  toType: 'contract',
                  impact: 'medium',
                  status: 'completed',
                  network: 'Ethereum',
                  networkLogo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
                }
              ].map((tx) => (
                <div
                  key={tx.hash}
                  className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTransactionTypeColor(tx.type)}`}>
                        {tx.type.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-2">
                        <img src={tx.networkLogo} alt={tx.network} className="w-4 h-4" />
                        <span className="text-sm text-white/60">{tx.network}</span>
                      </div>
                      <span className="text-sm text-white/60">{tx.timestamp}</span>
                      <span className={`text-sm ${getImpactColor(tx.impact)}`}>
                        {tx.impact.toUpperCase()} IMPACT
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <img src={tx.tokenLogo} alt={tx.token} className="w-5 h-5" />
                        <span className="font-medium">
                          ${(tx.amount / 1000000).toFixed(2)}M
                        </span>
                        <span className="text-white/60">{tx.token}</span>
                      </div>
                      {renderTransactionStatus(tx.status)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      {getAddressTypeIcon(tx.fromType)}
                      <span className="text-white/60">{tx.from}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/40" />
                    <div className="flex items-center gap-1">
                      {getAddressTypeIcon(tx.toType)}
                      <span className="text-white/60">{tx.to}</span>
                    </div>
                    <a
                      href={`https://etherscan.io/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto p-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-white/40" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-lg font-medium mb-4">Emerging Sectors</h3>
            <div className="space-y-4">
              {[
                {
                  sector: 'Real World Assets',
                  growth: 45.8,
                  volume24h: 125000000,
                  description: 'Growing adoption of tokenized real-world assets'
                },
                {
                  sector: 'Liquid Staking',
                  growth: 32.4,
                  volume24h: 85000000,
                  description: 'Increased demand for liquid staking derivatives'
                },
                {
                  sector: 'Perpetuals',
                  growth: 28.5,
                  volume24h: 250000000,
                  description: 'Rising interest in decentralized perpetual trading'
                }
              ].map((metric) => (
                <div key={metric.sector} className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{metric.sector}</div>
                    <div className="flex items-center gap-1 text-green-400">
                      <TrendingUp className="w-4 h-4" />
                      <span>{metric.growth.toFixed(1)}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/60 mb-2">{metric.description}</p>
                  <div className="text-sm">
                    <span className="text-white/60">24h Volume:</span>{' '}
                    <span>${(metric.volume24h / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeFiMarketDashboard;