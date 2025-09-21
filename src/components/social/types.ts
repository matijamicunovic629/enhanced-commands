// Types for social feed components
export interface Trader {
  id: string;
  name: string;
  domain: string;
  avatar: string;
  verified: boolean;
  bio?: string;
  stats?: {
    winRate: number;
    avgReturn: number;
    followers: number;
  };
}

export interface Trade {
  protocol: {
    name: string;
    symbol: string;
    logo: string;
  };
  amount: number;
  price: number;
}

export interface TradeItem {
  id: string;
  trader: Trader;
  type: 'SWAP' | 'MINT' | 'VIRTUAL';
  timestamp: string;
  platform: string;
  trades: Trade[];
}

export interface RallyingToken {
  id: string;
  name: string;
  avatar: string;
  marketCap: number;
  change: number;
  followers: { avatar: string; }[];
  otherFollowers: string;
}

export type ActionType = 'all' | 'swaps' | 'mints' | 'virtuals';
export type NavItem = 'feed' | 'rallying' | 'explore' | 'notifications' | 'leaderboard';