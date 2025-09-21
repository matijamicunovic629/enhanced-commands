// Transaction types
export enum TransactionType {
  SEND = 'SEND',
  RECEIVE = 'RECEIVE',
  SWAP = 'SWAP',
  NFT_PURCHASE = 'NFT_PURCHASE',
  NFT_SALE = 'NFT_SALE',
  STAKE = 'STAKE',
  UNSTAKE = 'UNSTAKE',
  LEND = 'LEND',
  BORROW = 'BORROW',
  REPAY = 'REPAY',
  CLAIM = 'CLAIM'
}

export interface Token {
  symbol: string;
  logo: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  timestamp: Date;
  token?: Token;
  fromToken?: Token;
  toToken?: Token;
  amount: number;
  fromAmount?: number;
  toAmount?: number;
  value?: number;
  to?: string;
  from?: string;
  collection?: string;
  tokenId?: string;
  protocol?: string;
  protocolLogo?: string;
  status: 'confirmed' | 'pending' | 'failed';
  hash: string;
  fee: number;
}

// DeFi position types
export type DeFiPositionType = 'LENDING' | 'BORROWING' | 'STAKING' | 'LIQUIDITY';

export interface DeFiReward {
  token: string;
  amount: number;
  value: number;
}

export interface DeFiPosition {
  id: string;
  protocol: string;
  type: DeFiPositionType;
  token: Token;
  amount: number;
  value: number;
  apy: number;
  protocolLogo: string;
  rewards?: DeFiReward;
  startDate: Date;
  healthFactor?: number;
  collateralRatio?: number;
}

// DeFi statistics
export interface DeFiStats {
  totalValueLocked: number;
  totalBorrowed: number;
  netWorth: number;
  dailyYield: number;
  averageApy: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  distribution: {
    lending: number;
    borrowing: number;
    staking: number;
    liquidity: number;
  };
  topPerforming: {
    protocol: string;
    apy: number;
  };
  rewardsEarned: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}