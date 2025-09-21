// Mock data for DeFi statistics and yield opportunities
const mockProtocols = [
  {
    name: 'Aave',
    tvl: 5200000000,
    change24h: 2.5,
    category: 'Lending',
    logo: 'https://cryptologos.cc/logos/aave-aave-logo.png'
  },
  {
    name: 'Curve',
    tvl: 3800000000,
    change24h: -1.2,
    category: 'DEX',
    logo: 'https://cryptologos.cc/logos/curve-dao-token-crv-logo.png'
  },
  {
    name: 'Lido',
    tvl: 3200000000,
    change24h: 4.8,
    category: 'Liquid Staking',
    logo: 'https://cryptologos.cc/logos/lido-dao-ldo-logo.png'
  },
  {
    name: 'Uniswap',
    tvl: 3100000000,
    change24h: 1.5,
    category: 'DEX',
    logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png'
  },
  {
    name: 'MakerDAO',
    tvl: 2800000000,
    change24h: -0.8,
    category: 'CDP',
    logo: 'https://cryptologos.cc/logos/maker-mkr-logo.png'
  },
  {
    name: 'Compound',
    tvl: 2400000000,
    change24h: 1.2,
    category: 'Lending',
    logo: 'https://cryptologos.cc/logos/compound-comp-logo.png'
  },
  {
    name: 'Balancer',
    tvl: 1800000000,
    change24h: 3.2,
    category: 'DEX',
    logo: 'https://cryptologos.cc/logos/balancer-bal-logo.png'
  },
  {
    name: 'GMX',
    tvl: 1200000000,
    change24h: 5.4,
    category: 'Derivatives',
    logo: 'https://cryptologos.cc/logos/gmx-gmx-logo.png'
  },
  {
    name: 'Convex',
    tvl: 1100000000,
    change24h: -2.1,
    category: 'Yield',
    logo: 'https://cryptologos.cc/logos/convex-finance-cvx-logo.png'
  },
  {
    name: 'Frax',
    tvl: 950000000,
    change24h: 0.8,
    category: 'CDP',
    logo: 'https://cryptologos.cc/logos/frax-frax-logo.png'
  }
];

const mockYieldPools = [
  {
    protocol: 'Aave',
    symbol: 'USDC',
    chain: 'Ethereum',
    apy: 4.82,
    tvlUsd: 520000000,
    logo: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png'
  },
  {
    protocol: 'Curve',
    symbol: '3pool',
    chain: 'Ethereum',
    apy: 3.95,
    tvlUsd: 480000000,
    logo: 'https://assets.coingecko.com/coins/images/12124/small/Curve.png'
  },
  {
    protocol: 'Lido',
    symbol: 'stETH',
    chain: 'Ethereum',
    apy: 3.75,
    tvlUsd: 320000000,
    logo: 'https://assets.coingecko.com/coins/images/13573/small/Lido_DAO.png'
  },
  {
    protocol: 'Compound',
    symbol: 'USDT',
    chain: 'Ethereum',
    apy: 4.12,
    tvlUsd: 280000000,
    logo: 'https://assets.coingecko.com/coins/images/10775/small/COMP.png'
  },
  {
    protocol: 'Balancer',
    symbol: 'ETH/USDC',
    chain: 'Ethereum',
    apy: 5.84,
    tvlUsd: 180000000,
    logo: 'https://assets.coingecko.com/coins/images/11683/small/Balancer.png'
  },
  {
    protocol: 'GMX',
    symbol: 'GLP',
    chain: 'Arbitrum',
    apy: 15.2,
    tvlUsd: 150000000,
    logo: 'https://assets.coingecko.com/coins/images/18323/small/arbit.png'
  },
  {
    protocol: 'Convex',
    symbol: 'cvxCRV',
    chain: 'Ethereum',
    apy: 8.45,
    tvlUsd: 120000000,
    logo: 'https://assets.coingecko.com/coins/images/15585/small/convex.png'
  },
  {
    protocol: 'Frax',
    symbol: 'frxETH',
    chain: 'Ethereum',
    apy: 4.25,
    tvlUsd: 95000000,
    logo: 'https://assets.coingecko.com/coins/images/13422/small/frax_logo.png'
  },
  {
    protocol: 'Stargate',
    symbol: 'USDC',
    chain: 'Arbitrum',
    apy: 5.12,
    tvlUsd: 85000000,
    logo: 'https://assets.coingecko.com/coins/images/24413/small/STG_LOGO.png'
  },
  {
    protocol: 'Sushiswap',
    symbol: 'ETH/USDC',
    chain: 'Ethereum',
    apy: 6.84,
    tvlUsd: 75000000,
    logo: 'https://assets.coingecko.com/coins/images/12271/small/512x512_Logo_no_chop.png'
  }
];

// Interfaces
export interface DeFiStats {
  totalTvl: number;
  totalChange24h: number;
  defiMarketCap: number;
  categories: {
    name: string;
    tvl: number;
    change24h: number;
  }[];
  protocols: {
    name: string;
    tvl: number;
    change24h: number;
    category: string;
    logo: string;
  }[];
}

export interface YieldData {
  protocol: string;
  symbol: string;
  chain: string;
  apy: number;
  tvlUsd: number;
  logo: string;
}

// Mock implementation of getDeFiStats
export async function getDeFiStats(): Promise<DeFiStats> {
  // Calculate totals and category stats
  const totalTvl = mockProtocols.reduce((sum, p) => sum + p.tvl, 0);
  const totalChange24h = mockProtocols.reduce((sum, p) => sum + p.change24h, 0) / mockProtocols.length;

  // Process categories
  const categoriesMap = mockProtocols.reduce((acc: Record<string, any>, p) => {
    if (!acc[p.category]) {
      acc[p.category] = { name: p.category, tvl: 0, change24h: 0, count: 0 };
    }
    acc[p.category].tvl += p.tvl;
    acc[p.category].change24h += p.change24h;
    acc[p.category].count += 1;
    return acc;
  }, {});

  const categories = Object.values(categoriesMap)
    .map((cat: any) => ({
      name: cat.name,
      tvl: cat.tvl,
      change24h: cat.change24h / cat.count
    }))
    .sort((a: any, b: any) => b.tvl - a.tvl)
    .slice(0, 5);

  return {
    totalTvl,
    totalChange24h,
    defiMarketCap: totalTvl * 1.2, // Rough estimate
    categories,
    protocols: mockProtocols
  };
}

// Mock implementation of getYieldData
export async function getYieldData(): Promise<YieldData[]> {
  // Add artificial delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockYieldPools;
}