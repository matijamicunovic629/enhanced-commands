import { Trader, TradeItem, RallyingToken } from '../types';

export const mockTraders: Trader[] = [
  {
    id: '1',
    name: 'supertaster',
    domain: 'fcast.id',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supertaster',
    verified: true,
    bio: 'DeFi degen | NFT collector | Full-time trader',
    stats: {
      winRate: 78,
      avgReturn: 25.4,
      followers: 12500
    }
  },
  {
    id: '2',
    name: 'satoshi69',
    domain: 'eth',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=satoshi69',
    verified: true,
    bio: 'Meme coin specialist | Early $MAXIS holder',
    stats: {
      winRate: 82,
      avgReturn: 45.8,
      followers: 8900
    }
  },
  {
    id: '3',
    name: 'nftwhale',
    domain: 'eth',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nftwhale',
    verified: true,
    bio: 'NFT trader | BAYC holder | Web3 enthusiast',
    stats: {
      winRate: 71,
      avgReturn: 32.1,
      followers: 5600
    }
  }
];

export const mockRallyingTokens: RallyingToken[] = [
  {
    id: '1',
    name: 'CHILLGUY',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=chillguy',
    marketCap: 407200000,
    change: 87.8,
    followers: [
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader1' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader2' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader3' }
    ],
    otherFollowers: '17k'
  },
  {
    id: '2',
    name: 'BASED',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=based',
    marketCap: 325600000,
    change: 65.4,
    followers: [
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader4' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader5' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader6' }
    ],
    otherFollowers: '12k'
  },
  {
    id: '3',
    name: 'WOJAK',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=wojak',
    marketCap: 245800000,
    change: 45.2,
    followers: [
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader7' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader8' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader9' }
    ],
    otherFollowers: '9k'
  },
  {
    id: '4',
    name: 'CHAD',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=chad',
    marketCap: 198400000,
    change: 38.9,
    followers: [
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader10' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader11' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader12' }
    ],
    otherFollowers: '7.5k'
  },
  {
    id: '5',
    name: 'FROGGE',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=frogge',
    marketCap: 156700000,
    change: 32.6,
    followers: [
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader13' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader14' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader15' }
    ],
    otherFollowers: '5.8k'
  },
  {
    id: '6',
    name: 'MOONBOY',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=moonboy',
    marketCap: 134200000,
    change: 28.4,
    followers: [
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader16' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader17' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader18' }
    ],
    otherFollowers: '4.2k'
  },
  {
    id: '7',
    name: 'WAGMI',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=wagmi',
    marketCap: 112500000,
    change: 25.7,
    followers: [
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader19' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader20' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader21' }
    ],
    otherFollowers: '3.9k'
  },
  {
    id: '8',
    name: 'NGMI',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=ngmi',
    marketCap: 98600000,
    change: 22.3,
    followers: [
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader22' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader23' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader24' }
    ],
    otherFollowers: '3.1k'
  },
  {
    id: '9',
    name: 'COPIUM',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=copium',
    marketCap: 87400000,
    change: 19.8,
    followers: [
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader25' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader26' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader27' }
    ],
    otherFollowers: '2.8k'
  },
  {
    id: '10',
    name: 'GIGABRAIN',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=gigabrain',
    marketCap: 76300000,
    change: 17.5,
    followers: [
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader28' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader29' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader30' }
    ],
    otherFollowers: '2.4k'
  }
];

export const mockSwaps: TradeItem[] = [
  {
    id: '1',
    trader: {
      name: 'supertaster',
      domain: 'fcast.id',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supertaster',
      verified: true
    },
    type: 'SWAP',
    timestamp: 'now',
    platform: 'Interface',
    trades: [
      {
        protocol: {
          name: 'Ethereum',
          symbol: 'ETH',
          logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
        },
        amount: -0.06,
        price: 199.97
      },
      {
        protocol: {
          name: 'Autistic Based Maxis',
          symbol: 'MAXIS',
          logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=maxis'
        },
        amount: 414.9,
        price: 195.45
      }
    ]
  },
  {
    id: '2',
    trader: {
      name: 'satoshi69',
      domain: 'eth',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=satoshi69',
      verified: true
    },
    type: 'SWAP',
    timestamp: '1m',
    platform: 'Rainbow',
    trades: [
      {
        protocol: {
          name: 'clank.fun',
          symbol: 'CLANKFUN',
          logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=clank'
        },
        amount: -50,
        price: 1.011
      },
      {
        protocol: {
          name: 'maicrotrader by Virtuals',
          symbol: 'MAICRO',
          logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=maicro'
        },
        amount: 134.1,
        price: 967.72
      }
    ]
  },
  {
    id: '3',
    trader: {
      name: 'defiking',
      domain: 'lens',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=defiking',
      verified: true
    },
    type: 'SWAP',
    timestamp: '5m',
    platform: 'Uniswap',
    trades: [
      {
        protocol: {
          name: 'USD Coin',
          symbol: 'USDC',
          logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
        },
        amount: -5000,
        price: 1.00
      },
      {
        protocol: {
          name: 'Pepe',
          symbol: 'PEPE',
          logo: 'https://cryptologos.cc/logos/pepe-pepe-logo.png'
        },
        amount: 42000000,
        price: 0.000119
      }
    ]
  },
  {
    id: '4',
    trader: {
      name: 'alphatrader',
      domain: 'eth',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alphatrader',
      verified: true
    },
    type: 'SWAP',
    timestamp: '10m',
    platform: 'Uniswap',
    trades: [
      {
        protocol: {
          name: 'USD Coin',
          symbol: 'USDC',
          logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
        },
        amount: -10000,
        price: 1.00
      },
      {
        protocol: {
          name: 'Solana',
          symbol: 'SOL',
          logo: 'https://cryptologos.cc/logos/solana-sol-logo.png'
        },
        amount: 89.25,
        price: 112.05
      }
    ]
  }
];

export const mockMints: TradeItem[] = [
  {
    id: 'm1',
    trader: {
      name: 'nftwhale',
      domain: 'eth',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nftwhale',
      verified: true
    },
    type: 'MINT',
    timestamp: '5m',
    platform: 'OpenSea',
    trades: [
      {
        protocol: {
          name: 'Bored Ape Yacht Club',
          symbol: 'BAYC',
          logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=bayc'
        },
        amount: 1,
        price: 80.5
      }
    ]
  }
];

export const mockVirtuals: TradeItem[] = [
  {
    id: 'v1',
    trader: {
      name: 'satoshi69',
      domain: 'eth',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=satoshi69',
      verified: true
    },
    type: 'VIRTUAL',
    timestamp: '3m',
    platform: 'Rainbow',
    trades: [
      {
        protocol: {
          name: 'Breakout Bro by Virtuals',
          symbol: 'BOB',
          logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=bob'
        },
        amount: -250000,
        price: 273.40
      },
      {
        protocol: {
          name: 'Ribbita by Virtuals',
          symbol: 'TIBBIR',
          logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=ribbita'
        },
        amount: 37993,
        price: 262.97
      }
    ]
  }
];