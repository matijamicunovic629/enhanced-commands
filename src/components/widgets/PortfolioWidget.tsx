import React from 'react';
import { TrendingUp } from 'lucide-react';

interface Position {
  protocol: string;
  type: 'LENDING' | 'STAKING';
  amount: number;
  token: string;
  apy: number;
  logo: string;
}

interface AllocationData {
  type: string;
  percentage: number;
  color: string;
}

export const PortfolioWidget: React.FC = () => {
  const portfolioValue = 15650.32;
  const dailyChange = 524.06;
  const dailyChangePercentage = 2.30;

  const positions: Position[] = [
    {
      protocol: 'Aave',
      type: 'LENDING',
      amount: 1000,
      token: 'USDC',
      apy: 4.5,
      logo: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png'
    },
    {
      protocol: 'Lido',
      type: 'STAKING',
      amount: 1.15,
      token: 'ETH',
      apy: 3.8,
      logo: 'https://assets.coingecko.com/coins/images/13573/small/Lido_DAO.png'
    },
    {
      protocol: 'Compound',
      type: 'LENDING',
      amount: 750,
      token: 'USDT',
      apy: 4.2,
      logo: 'https://assets.coingecko.com/coins/images/10775/small/COMP.png'
    }
  ];

  const allocation: AllocationData[] = [
    { type: 'Spot', percentage: 45, color: '#10B981' },
    { type: 'Staked', percentage: 30, color: '#3B82F6' },
    { type: 'Lending', percentage: 15, color: '#8B5CF6' },
    { type: 'LP', percentage: 10, color: '#F59E0B' }
  ];

  const createPieSegments = () => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    let currentAngle = 0;

    return allocation.map(item => {
      const angle = (item.percentage / 100) * 360;
      const length = (angle / 360) * circumference;
      const gap = 1;
      
      const segment = {
        offset: currentAngle,
        length: length - gap,
        color: item.color
      };
      
      currentAngle += length;
      return segment;
    });
  };

  const pieSegments = createPieSegments();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="p-2 h-full flex flex-col">
      <div className="flex items-baseline gap-2 mb-3">
        <div className="text-lg font-bold">
          {formatCurrency(portfolioValue)}
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-400">
          <TrendingUp className="w-3 h-3" />
          <span>{formatCurrency(dailyChange)}</span>
          <span>({dailyChangePercentage}%)</span>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative">
          <svg className="w-[120px] h-[120px] -rotate-90">
            {pieSegments.map((segment, index) => (
              <circle
                key={index}
                cx="60"
                cy="60"
                r="35"
                fill="none"
                stroke={segment.color}
                strokeWidth="28"
                strokeDasharray={`${segment.length} ${251.2 - segment.length}`}
                strokeDashoffset={-segment.offset}
                className="transition-all duration-1000 ease-out"
              />
            ))}
          </svg>
        </div>

        <div className="flex flex-col justify-center gap-1">
          {allocation.map(item => (
            <div key={item.type} className="flex items-center gap-1.5">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-white/80">{item.type}</span>
              <span className="text-xs text-white/60">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-xs font-medium mb-2">DeFi Positions</h3>
      <div className="space-y-1.5">
        {positions.map((position, index) => (
          <div
            key={index}
            className="p-2 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <img 
                  src={position.logo}
                  alt={position.protocol}
                  className="w-4 h-4"
                />
                <span className="text-xs font-medium">{position.protocol}</span>
                <span className={`px-1 py-0.5 rounded-full text-[10px] ${
                  position.type === 'LENDING' 
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {position.type}
                </span>
              </div>
              <div className="text-[10px] text-emerald-400">
                APY: {position.apy}%
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs">
                {position.type === 'LENDING' 
                  ? formatCurrency(position.amount)
                  : `${position.amount} ${position.token}`}
              </span>
              {position.type === 'LENDING' && (
                <span className="text-[10px] text-white/60">{position.token}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};