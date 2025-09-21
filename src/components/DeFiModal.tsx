import React, { useState } from 'react';
import { 
  X, Maximize2, Minimize2, Search, Filter, 
  MessageSquare, Share2, Heart, Play, Pause,
  Video, BarChart2, RefreshCw, Users, Bell,
  ChevronDown, ArrowRight, Plus, Lock, Globe,
  Settings, ExternalLink, TrendingUp, TrendingDown,
  DollarSign, LineChart, Shield, ShieldCheck, ShieldAlert,
  Wallet, Landmark, Coins, ArrowUpDown
} from 'lucide-react';

interface DeFiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Position {
  protocol: string;
  type: 'LENDING' | 'BORROWING' | 'STAKING' | 'POOL';
  amount: number;
  token: string;
  apy: number;
  rewards?: number;
  healthFactor?: number;
  poolShare?: number;
  pairToken?: string;
  logo: string;
  borrowed?: number;
  maxBorrow?: number;
  collateralFactor?: number;
}

interface Offering {
  protocol: string;
  type: 'LENDING' | 'BORROWING' | 'STAKING' | 'POOL';
  token: string;
  pairToken?: string;
  apy: number;
  tvl: number;
  rewards?: {
    token: string;
    apy: number;
  };
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  logo: string;
  description: string;
  requirements?: {
    minAmount?: number;
    lockupPeriod?: string;
    collateralRatio?: number;
  };
}

interface ModalState {
  type: 'deposit' | 'withdraw' | 'borrow' | 'repay' | null;
  position?: Position;
}

const positions: Position[] = [
  {
    protocol: 'Aave V3',
    type: 'LENDING',
    amount: 1875,
    token: 'USDC',
    apy: 8.15,
    logo: 'https://cryptologos.cc/logos/aave-aave-logo.png',
    collateralFactor: 0.85
  },
  {
    protocol: 'Compound V3',
    type: 'BORROWING',
    amount: 2500,
    token: 'ETH',
    apy: 3.5,
    borrowed: 1.5,
    maxBorrow: 2.0,
    healthFactor: 1.75,
    logo: 'https://cryptologos.cc/logos/compound-comp-logo.png'
  },
  {
    protocol: 'Lido',
    type: 'STAKING',
    amount: 3700,
    token: 'ETH',
    apy: 5.5,
    rewards: 2.5,
    logo: 'https://cryptologos.cc/logos/lido-dao-ldo-logo.png'
  },
  {
    protocol: 'Uniswap V3',
    type: 'POOL',
    amount: 3150,
    token: 'ETH',
    pairToken: 'USDC',
    apy: 12.45,
    poolShare: 0.015,
    logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png'
  },
  {
    protocol: 'Aave V3',
    type: 'BORROWING',
    amount: 5000,
    token: 'USDC',
    apy: 4.25,
    borrowed: 2500,
    maxBorrow: 4250,
    healthFactor: 1.45,
    logo: 'https://cryptologos.cc/logos/aave-aave-logo.png'
  }
];

const offerings: Offering[] = [
  {
    protocol: 'Aave V3',
    type: 'LENDING',
    token: 'USDC',
    apy: 8.15,
    tvl: 520000000,
    risk: 'LOW',
    logo: 'https://cryptologos.cc/logos/aave-aave-logo.png',
    description: 'Supply USDC to earn interest and use as collateral',
    requirements: {
      minAmount: 1,
      collateralRatio: 85
    }
  },
  {
    protocol: 'Compound V3',
    type: 'BORROWING',
    token: 'ETH',
    apy: 3.5,
    tvl: 480000000,
    risk: 'MEDIUM',
    logo: 'https://cryptologos.cc/logos/compound-comp-logo.png',
    description: 'Borrow ETH against your supplied collateral',
    requirements: {
      collateralRatio: 125
    }
  },
  {
    protocol: 'Lido',
    type: 'STAKING',
    token: 'ETH',
    apy: 5.5,
    tvl: 320000000,
    risk: 'LOW',
    logo: 'https://cryptologos.cc/logos/lido-dao-ldo-logo.png',
    description: 'Liquid staking solution for ETH 2.0',
    rewards: {
      token: 'LDO',
      apy: 2.5
    }
  },
  {
    protocol: 'Curve Finance',
    type: 'POOL',
    token: 'USDC',
    pairToken: 'USDT',
    apy: 12.45,
    tvl: 280000000,
    risk: 'MEDIUM',
    logo: 'https://cryptologos.cc/logos/curve-dao-token-crv-logo.png',
    description: 'Stable AMM for efficient stablecoin swaps',
    rewards: {
      token: 'CRV',
      apy: 4.2
    }
  },
  {
    protocol: 'Balancer',
    type: 'POOL',
    token: 'ETH',
    pairToken: 'WBTC',
    apy: 15.8,
    tvl: 180000000,
    risk: 'MEDIUM',
    logo: 'https://cryptologos.cc/logos/balancer-bal-logo.png',
    description: 'Weighted liquidity pools with customizable ratios',
    rewards: {
      token: 'BAL',
      apy: 5.8
    }
  },
  {
    protocol: 'Rocketpool',
    type: 'STAKING',
    token: 'ETH',
    apy: 5.8,
    tvl: 150000000,
    risk: 'LOW',
    logo: 'https://cryptologos.cc/logos/rocket-pool-rpl-logo.png',
    description: 'Decentralized ETH staking protocol',
    requirements: {
      minAmount: 0.01,
      lockupPeriod: '24h'
    }
  },
  {
    protocol: 'Maker',
    type: 'BORROWING',
    token: 'DAI',
    apy: 2.75,
    tvl: 420000000,
    risk: 'MEDIUM',
    logo: 'https://cryptologos.cc/logos/maker-mkr-logo.png',
    description: 'Borrow DAI stablecoin against your crypto collateral',
    requirements: {
      collateralRatio: 150
    }
  },
  {
    protocol: 'Aave V3',
    type: 'BORROWING',
    token: 'USDC',
    apy: 4.25,
    tvl: 380000000,
    risk: 'LOW',
    logo: 'https://cryptologos.cc/logos/aave-aave-logo.png',
    description: 'Borrow USDC against your supplied collateral',
    requirements: {
      collateralRatio: 85
    }
  }
];

export const DeFiModal: React.FC<DeFiModalProps> = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'explore'>('overview');
  const [selectedPositionType, setSelectedPositionType] = useState<Position['type'] | 'ALL'>('ALL');
  const [modalState, setModalState] = useState<ModalState>({ type: null });

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getTypeIcon = (type: Position['type']) => {
    switch (type) {
      case 'LENDING':
        return '💰';
      case 'BORROWING':
        return '🏦';
      case 'STAKING':
        return '🔒';
      case 'POOL':
        return '🌊';
    }
  };

  const getTypeColor = (type: Position['type']) => {
    switch (type) {
      case 'LENDING':
        return 'text-purple-400';
      case 'BORROWING':
        return 'text-red-400';
      case 'STAKING':
        return 'text-blue-400';
      case 'POOL':
        return 'text-green-400';
    }
  };

  const getRiskColor = (risk: Offering['risk']) => {
    switch (risk) {
      case 'LOW':
        return 'text-green-400';
      case 'MEDIUM':
        return 'text-yellow-400';
      case 'HIGH':
        return 'text-red-400';
    }
  };

  const handleAction = (type: 'deposit' | 'withdraw' | 'borrow' | 'repay', position: Position) => {
    setModalState({ type, position });
  };

  const renderPositions = () => (
    <div className="space-y-3">
      {positions
        .filter(p => selectedPositionType === 'ALL' || p.type === selectedPositionType)
        .map((position, index) => (
          <div
            key={index}
            className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={position.logo}
                  alt={position.protocol}
                  className="w-10 h-10"
                />
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{position.protocol}</h3>
                    <span className={`text-sm ${getTypeColor(position.type)}`}>
                      {position.type}
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="text-sm text-white/60">
                      {position.token}
                      {position.pairToken && `/${position.pairToken}`}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {position.type === 'BORROWING' ? (
                      <>
                        <div>
                          <span className="text-sm text-white/60">Borrowed</span>
                          <div className="text-lg">
                            {position.borrowed} {position.token}
                            <span className="text-sm text-white/60 ml-1">
                              (${(position.borrowed! * 3245.67).toLocaleString()})
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-white/60">Borrow Limit</span>
                          <div className="text-lg">
                            {position.maxBorrow} {position.token}
                            <span className="text-sm text-white/60 ml-1">
                              (${(position.maxBorrow! * 3245.67).toLocaleString()})
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-white/60">APY</span>
                          <div className="text-red-400">{position.apy}%</div>
                        </div>
                        <div>
                          <span className="text-sm text-white/60">Health Factor</span>
                          <div className={`${
                            position.healthFactor! >= 1.5 ? 'text-green-400' :
                            position.healthFactor! >= 1.1 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {position.healthFactor!.toFixed(2)}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="text-sm text-white/60">Amount</span>
                          <div className="text-lg">${position.amount.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-sm text-white/60">APY</span>
                          <div className="text-emerald-400">{position.apy}%</div>
                        </div>
                        {position.rewards && (
                          <div>
                            <span className="text-sm text-white/60">Rewards</span>
                            <div className="text-blue-400">+{position.rewards}% APR</div>
                          </div>
                        )}
                        {position.healthFactor && (
                          <div>
                            <span className="text-sm text-white/60">Health Factor</span>
                            <div className="text-green-400">{position.healthFactor}</div>
                          </div>
                        )}
                        {position.poolShare && (
                          <div>
                            <span className="text-sm text-white/60">Pool Share</span>
                            <div>{(position.poolShare * 100).toFixed(3)}%</div>
                          </div>
                        )}
                        {position.collateralFactor && (
                          <div>
                            <span className="text-sm text-white/60">Collateral Factor</span>
                            <div>{(position.collateralFactor * 100)}%</div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {position.type === 'BORROWING' ? (
                  <>
                    <button
                      onClick={() => handleAction('borrow', position)}
                      className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg text-sm"
                    >
                      Borrow More
                    </button>
                    <button
                      onClick={() => handleAction('repay', position)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-sm"
                    >
                      Repay
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleAction('deposit', position)}
                      className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg text-sm"
                    >
                      Deposit
                    </button>
                    <button
                      onClick={() => handleAction('withdraw', position)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-sm"
                    >
                      Withdraw
                    </button>
                  </>
                )}
              </div>
            </div>

            {position.type === 'BORROWING' && (
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/60">Borrow Utilization</span>
                  <span>{((position.borrowed! / position.maxBorrow!) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      (position.borrowed! / position.maxBorrow!) >= 0.8 ? 'bg-red-500' :
                      (position.borrowed! / position.maxBorrow!) >= 0.6 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${(position.borrowed! / position.maxBorrow!) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );

  const renderOfferings = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setSelectedPositionType('ALL')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            selectedPositionType === 'ALL'
              ? 'bg-white/10'
              : 'hover:bg-white/5'
          }`}
        >
          All Types
        </button>
        {(['LENDING', 'BORROWING', 'STAKING', 'POOL'] as Position['type'][]).map(type => (
          <button
            key={type}
            onClick={() => setSelectedPositionType(type)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              selectedPositionType === type
                ? 'bg-white/10'
                : 'hover:bg-white/5'
            }`}
          >
            {getTypeIcon(type)}
            <span>{type.charAt(0) + type.slice(1).toLowerCase()}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {offerings
          .filter(o => selectedPositionType === 'ALL' || o.type === selectedPositionType)
          .map((offering, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <img
                  src={offering.logo}
                  alt={offering.protocol}
                  className="w-10 h-10"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{offering.protocol}</h3>
                    <span className={`text-sm ${getTypeColor(offering.type)}`}>
                      {offering.type}
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="text-sm text-white/60">
                      {offering.token}
                      {offering.pairToken && `/${offering.pairToken}`}
                    </span>
                  </div>
                  
                  <p className="text-sm text-white/60 mb-2">
                    {offering.description}
                  </p>

                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-sm text-white/60">Base APY</span>
                      <div className={`${
                        offering.type === 'BORROWING' ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {offering.apy}%
                      </div>
                    </div>
                    {offering.rewards && (
                      <div>
                        <span className="text-sm text-white/60">
                          {offering.rewards.token} Rewards
                        </span>
                        <div className="text-blue-400">+{offering.rewards.apy}% APR</div>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-white/60">TVL</span>
                      <div>${(offering.tvl / 1000000).toFixed(1)}M</div>
                    </div>
                    <div>
                      <span className="text-sm text-white/60">Risk Level</span>
                      <div className={getRiskColor(offering.risk)}>{offering.risk}</div>
                    </div>
                    {offering.requirements?.minAmount && (
                      <div>
                        <span className="text-sm text-white/60">Min Amount</span>
                        <div>{offering.requirements.minAmount} {offering.token}</div>
                      </div>
                    )}
                    {offering.requirements?.lockupPeriod && (
                      <div>
                        <span className="text-sm text-white/60">Lock Period</span>
                        <div>{offering.requirements.lockupPeriod}</div>
                      </div>
                    )}
                    {offering.requirements?.collateralRatio && (
                      <div>
                        <span className="text-sm text-white/60">Collateral</span>
                        <div>{offering.requirements.collateralRatio}%</div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleAction(
                    offering.type === 'BORROWING' ? 'borrow' : 'deposit',
                    {
                      protocol: offering.protocol,
                      type: offering.type,
                      amount: 0,
                      token: offering.token,
                      apy: offering.apy,
                      logo: offering.logo
                    }
                  )}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg"
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedTab('overview')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedTab === 'overview'
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedTab('explore')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedTab === 'explore'
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                }`}
              >
                Explore
              </button>
            </div>
          </div>

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

        <div className="p-6 h-[calc(100%-73px)] overflow-y-auto">
          {selectedTab === 'overview' ? (
            <>
              {/* Global Metrics */}
              <div className="grid grid-cols-4 gap-6 mb-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-white/60">Total Value Locked</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    $9,555
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>+5.82%</span>
                    <span className="text-white/60">24h</span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart2 className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-white/60">Net APY</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    +5.82%
                  </div>
                  <div className="text-sm text-white/60">
                    Across all positions
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-white/60">Total Rewards</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    +$549.25
                  </div>
                  <div className="text-sm text-white/60">
                    Unclaimed rewards
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-white/60">Health Status</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    Healthy
                  </div>
                  <div className="text-sm text-white/60">
                    All positions safe
                  </div>
                </div>
              </div>

              {/* Position Type Filter */}
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setSelectedPositionType('ALL')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    selectedPositionType === 'ALL'
                      ? 'bg-white/10'
                      : 'hover:bg-white/5'
                  }`}
                >
                  All Types
                </button>
                {(['LENDING', 'BORROWING', 'STAKING', 'POOL'] as Position['type'][]).map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedPositionType(type)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                      selectedPositionType === type
                        ? 'bg-white/10'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {getTypeIcon(type)}
                    <span>{type.charAt(0) + type.slice(1).toLowerCase()}</span>
                  </button>
                ))}
              </div>

              {/* Positions */}
              {renderPositions()}

              {/* Protocol Statistics */}
              <div className="grid grid-cols-2 gap-6 mt-6">
                {/* Protocol Breakdown */}
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-lg font-medium mb-4">Protocol Breakdown</h3>
                  <div className="space-y-3">
                    {['Aave V3', 'Compound V3', 'Lido', 'Uniswap V3'].map((protocol) => {
                      const protocolPositions = positions.filter(p => p.protocol === protocol);
                      const totalValue = protocolPositions.reduce((sum, p) => sum + p.amount, 0);
                      const totalTVL = positions.reduce((sum, p) => sum + p.amount, 0);
                      
                      return (
                        <div key={protocol} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                          <img
                            src={protocolPositions[0]?.logo}
                            alt={protocol}
                            className="w-8 h-8"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{protocol}</span>
                              <span>${totalValue.toLocaleString()}</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 transition-all"
                                style={{ width: `${(totalValue / totalTVL) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Type Distribution */}
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-lg font-medium mb-4">Type Distribution</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {(['LENDING', 'BORROWING', 'STAKING', 'POOL'] as Position['type'][]).map((type) => {
                      const typePositions = positions.filter(p => p.type === type);
                      const totalValue = typePositions.reduce((sum, p) => sum + p.amount, 0);
                      const totalTVL = positions.reduce((sum, p) => sum + p.amount, 0);
                      
                      return (
                        <div key={type} className="p-4 bg-white/5 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(type)}
                              <span className="font-medium">{type}</span>
                            </div>
                            <span className="text-sm text-white/60">
                              {typePositions.length} positions
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/60">TVL Share</span>
                            <span>{((totalValue / totalTVL) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                            <div
                              className="h-full bg-blue-500 transition-all"
                              style={{ width: `${(totalValue / totalTVL) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : (
            renderOfferings()
          )}
        </div>
      </div>

      {modalState.type && modalState.position && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalState({ type: null })} />
          <div className="relative glass w-[400px] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium">
                {modalState.type === 'deposit' ? 'Deposit' :
                 modalState.type === 'withdraw' ? 'Withdraw' :
                 modalState.type === 'borrow' ? 'Borrow' : 'Repay'}
              </h3>
              <button
                onClick={() => setModalState({ type: null })}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <img
                  src={modalState.position.logo}
                  alt={modalState.position.protocol}
                  className="w-8 h-8"
                />
                <div>
                  <div className="font-medium">{modalState.position.protocol}</div>
                  <div className="text-sm text-white/60">
                    {modalState.position.token}
                    {modalState.position.pairToken && `/${modalState.position.pairToken}`}
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className={`${
                    modalState.type === 'borrow' || modalState.type === 'repay'
                      ? 'text-red-400'
                      : 'text-emerald-400'
                  }`}>
                    {modalState.position.apy}% APY
                  </div>
                  {modalState.position.rewards && (
                    <div className="text-sm text-blue-400">
                      +{modalState.position.rewards}% APR
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-sm text-white/60 mb-2">Amount</div>
                <input
                  type="text"
                  className="w-full bg-transparent text-2xl outline-none"
                  placeholder="0.00"
                />
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="text-white/60">
                    {modalState.type === 'borrow' 
                      ? `Available to borrow: ${
                          modalState.position.maxBorrow! - modalState.position.borrowed!
                        } ${modalState.position.token}`
                      : modalState.type === 'repay'
                      ? `Borrowed: ${modalState.position.borrowed} ${modalState.position.token}`
                      : `Balance: ${modalState.position.amount} ${modalState.position.token}`
                    }
                  </span>
                  <button className="text-blue-400">MAX</button>
                </div>
              </div>

              {modalState.type === 'borrow' && (
                <div className="p-3 bg-white/5 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Borrow APY</span>
                    <span className="text-red-400">{modalState.position.apy}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Health Factor</span>
                    <span className={`${
                      modalState.position.healthFactor! >= 1.5 ? 'text-green-400' :
                      modalState.position.healthFactor! >= 1.1 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {modalState.position.healthFactor!.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Liquidation at</span>
                    <span className="text-white/80">&lt; 1.0</span>
                  </div>
                </div>
              )}

              <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-xl font-medium">
                {modalState.type === 'deposit' ? 'Deposit' :
                 modalState.type === 'withdraw' ? 'Withdraw' :
                 modalState.type === 'borrow' ? 'Borrow' : 'Repay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};