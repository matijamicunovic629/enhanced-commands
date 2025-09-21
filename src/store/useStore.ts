import { create } from 'zustand';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  isStarred: boolean;
}

interface WidgetPosition {
  x: number;
  y: number;
}

interface WidgetSize {
  width: number;
  height: number;
}

interface Widget {
  id: string;
  type: string;
  position: WidgetPosition;
  size: WidgetSize;
}

export interface Wallpaper {
  id: string;
  name: string;
  type: 'CITY' | 'NATURE' | 'ABSTRACT';
  thumbnail: string;
  url: string;
}

const wallpapersList: Wallpaper[] = [
  {
    id: 'city-1',
    name: 'Night City',
    type: 'CITY',
    thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&q=80',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80'
  },
  {
    id: 'city-2',
    name: 'Downtown',
    type: 'CITY',
    thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80',
    url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80'
  },
  {
    id: 'nature-1',
    name: 'Mountains',
    type: 'NATURE',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80'
  },
  {
    id: 'nature-2',
    name: 'Forest',
    type: 'NATURE',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80'
  },
  {
    id: 'abstract-1',
    name: 'Waves',
    type: 'ABSTRACT',
    thumbnail: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80',
    url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80'
  },
  {
    id: 'abstract-2',
    name: 'Gradient',
    type: 'ABSTRACT',
    thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80'
  }
];

interface BadgeIcon {
  icon: keyof typeof import('lucide-react');
  color: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: BadgeIcon;
  xpAmount: number;
  earnedDate?: string;
  isFlashBadge?: boolean;
}

interface RewardsState {
  currentTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  xp: number;
  xpToNextLevel: number;
  weeklyXP: number[];
  badges: Badge[];
  activeChallenges: {
    id: string;
    title: string;
    description: string;
    xpReward: number;
    progress: number;
    total: number;
    endsIn: string;
  }[];
  perks: {
    id: string;
    name: string;
    description: string;
    tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
    isActive: boolean;
  }[];
}

interface GameStats {
  triviaStats: {
    gamesPlayed: number;
    tokensEarned: number;
    highScore: number;
    accuracy: number;
    bestStreak: number;
  };
  arenaStats: {
    battlesPlayed: number;
    tokensEarned: number;
    wins: number;
    winRate: number;
    bestStreak: number;
  };
  miningStats: {
    gamesPlayed: number;
    tokensEarned: number;
    highestLevel: number;
    banditsDefeated: number;
    nodesMined: number;
  };
  tycoonStats: {
    gamesPlayed: number;
    tokensEarned: number;
    highestTvl: number;
    prestigeLevel: number;
    dexesCreated: number;
  };
  totalTokens: number;
  claimedTokens: number;
  lastClaimDate: string | null;
}

interface StoreState {
  // Menu Items
  menuItems: MenuItem[];
  toggleStarMenuItem: (id: string) => void;

  // Modal States
  isAIAgentOpen: boolean;
  setIsAIAgentOpen: (isOpen: boolean) => void;
  isSwapOpen: boolean;
  setIsSwapOpen: (isOpen: boolean) => void;
  isDefiOpen: boolean;
  setIsDefiOpen: (isOpen: boolean) => void;
  isDashboardOpen: boolean;
  setIsDashboardOpen: (isOpen: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
  isMarketDataOpen: boolean;
  setIsMarketDataOpen: (isOpen: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isSocialFeedOpen: boolean;
  setIsSocialFeedOpen: (isOpen: boolean) => void;
  isGamesOpen: boolean;
  setIsGamesOpen: (isOpen: boolean) => void;
  isLaunchpadOpen: boolean;
  setIsLaunchpadOpen: (isOpen: boolean) => void;
  isRewardsOpen: boolean;
  setIsRewardsOpen: (isOpen: boolean) => void;
  isWalletOpen: boolean;
  setIsWalletOpen: (isOpen: boolean) => void;
  isDCAOpen: boolean;
  setIsDCAOpen: (isOpen: boolean) => void;

  // Market Data View
  marketDataView: 'overview' | 'market-cap' | 'trending' | 'dex' | 'defi' | 'defi-dashboard' | 'news' | 'alerts' | 'technical' | 'calendar' | 'feed';
  setMarketDataView: (view: 'overview' | 'market-cap' | 'trending' | 'dex' | 'defi' | 'defi-dashboard' | 'news' | 'alerts' | 'technical' | 'calendar' | 'feed') => void;

  // Widgets
  widgets: Widget[];
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  widgetVisibility: Record<string, boolean>;
  toggleWidgetVisibility: (type: string) => void;
  resetWidgetVisibility: () => void;

  // Cart
  cartItems: any[];
  addToCart: (item: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  // Game Stats
  gameStats: GameStats;
  updateGameStats: (stats: Partial<GameStats>) => void;
  claimTokens: (amount: number) => void;

  // Appearance
  currentWallpaper: Wallpaper;
  setWallpaper: (wallpaper: Wallpaper) => void;

  // Topbar control
  isTopbarVisible: boolean;
  isTopbarBottom: boolean;
  toggleTopbarVisibility: () => void;
  toggleTopbarPosition: () => void;

  // Rewards
  rewards: RewardsState;
  addXP: (amount: number) => void;
  completeBadge: (badgeId: string) => void;
  updateChallengeProgress: (challengeId: string, progress: number) => void;

  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const useStore = create<StoreState>((set) => ({
  // Menu Items
  menuItems: [
    { id: 'ai', label: 'AI Agent', icon: 'Bot', isStarred: false },
    { id: 'swap', label: 'Swap', icon: 'ArrowLeftRight', isStarred: false },
    { id: 'defi', label: 'DeFi', icon: 'Wallet', isStarred: false },
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', isStarred: false },
    { id: 'market-data', label: 'Market Data', icon: 'LineChart', isStarred: false },
    { id: 'launchpad', label: 'Launchpad', icon: 'Rocket', isStarred: false },
    { id: 'chat', label: 'Chat', icon: 'MessageSquare', isStarred: false },
    { id: 'cart', label: 'Cart', icon: 'ShoppingCart', isStarred: false },
    { id: 'social', label: 'Social Feed', icon: 'Users', isStarred: false },
    { id: 'games', label: 'Games', icon: 'Gamepad2', isStarred: false },
    { id: 'rewards', label: 'Rewards', icon: 'Trophy', isStarred: false },
    { id: 'wallet', label: 'Wallet', icon: 'Wallet', isStarred: false },
    { id: 'dca', label: 'DCA', icon: 'Calendar', isStarred: false }
  ],
  toggleStarMenuItem: (id) => set((state) => ({
    menuItems: state.menuItems.map((item) =>
      item.id === id ? { ...item, isStarred: !item.isStarred } : item
    ),
  })),

  // Modal States
  isAIAgentOpen: false,
  setIsAIAgentOpen: (isOpen) => set({ isAIAgentOpen: isOpen }),
  isSwapOpen: false,
  setIsSwapOpen: (isOpen) => set({ isSwapOpen: isOpen }),
  isDefiOpen: false,
  setIsDefiOpen: (isOpen) => set({ isDefiOpen: isOpen }),
  isDashboardOpen: false,
  setIsDashboardOpen: (isOpen) => set({ isDashboardOpen: isOpen }),
  isSettingsOpen: false,
  setIsSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
  isMarketDataOpen: false,
  setIsMarketDataOpen: (isOpen) => set({ isMarketDataOpen: isOpen }),
  isChatOpen: false,
  setIsChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
  isCartOpen: false,
  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  isSocialFeedOpen: false,
  setIsSocialFeedOpen: (isOpen) => set({ isSocialFeedOpen: isOpen }),
  isGamesOpen: false,
  setIsGamesOpen: (isOpen) => set({ isGamesOpen: isOpen }),
  isLaunchpadOpen: false,
  setIsLaunchpadOpen: (isOpen) => set({ isLaunchpadOpen: isOpen }),
  isRewardsOpen: false,
  setIsRewardsOpen: (isOpen) => set({ isRewardsOpen: isOpen }),
  isWalletOpen: false,
  setIsWalletOpen: (isOpen) => set({ isWalletOpen: isOpen }),
  isDCAOpen: false,
  setIsDCAOpen: (isOpen) => set({ isDCAOpen: isOpen }),

  // Market Data View
  marketDataView: 'overview',
  setMarketDataView: (view) => set({ marketDataView: view }),

  // Widgets
  widgets: [
    {
      id: 'portfolio',
      type: 'Portfolio Overview',
      position: { x: 20, y: 20 },
      size: { width: 360, height: 540 }
    },
    {
      id: 'market-news',
      type: 'Market News',
      position: { x: 400, y: 20 },
      size: { width: 360, height: 360 }
    },
    {
      id: 'market-pulse',
      type: 'Market Pulse',
      position: { x: 20, y: 580 },
      size: { width: 360, height: 486 }
    },
    {
      id: 'fear-greed',
      type: 'Fear & Greed Index',
      position: { x: 400, y: 400 },
      size: { width: 360, height: 270 }
    },
    {
      id: 'quick-swap',
      type: 'Quick Swap',
      position: { x: 780, y: 20 },
      size: { width: 324, height: 315 }
    },
    {
      id: 'price-converter',
      type: 'Price Converter',
      position: { x: 780, y: 355 },
      size: { width: 324, height: 360 }
    },
    {
      id: 'trending',
      type: 'Trending',
      position: { x: 1124, y: 20 },
      size: { width: 360, height: 315 }
    },
    {
      id: 'twitter',
      type: 'Twitter Feed',
      position: { x: 1124, y: 355 },
      size: { width: 360, height: 540 }
    },
    {
      id: 'direct-messages',
      type: 'Direct Messages',
      position: { x: 780, y: 735 },
      size: { width: 324, height: 360 }
    }
  ],
  updateWidget: (id, updates) => set((state) => ({
    widgets: state.widgets.map((widget) =>
      widget.id === id ? { ...widget, ...updates } : widget
    ),
  })),
  widgetVisibility: {
    'Portfolio Overview': true,
    'Market News': true,
    'Market Pulse': true,
    'Fear & Greed Index': true,
    'Quick Swap': true,
    'Price Converter': true,
    'Trending': true,
    'Ask Anything': true,
    'Twitter Feed': true,
    'Direct Messages': true
  },
  toggleWidgetVisibility: (type) => set((state) => ({
    widgetVisibility: {
      ...state.widgetVisibility,
      [type]: !state.widgetVisibility[type]
    }
  })),
  resetWidgetVisibility: () => set((state) => ({
    widgetVisibility: Object.keys(state.widgetVisibility).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {})
  })),

  // Cart
  cartItems: [],
  addToCart: (item) => set((state) => {
    const existingItem = state.cartItems.find(i => i.id === item.id);
    if (existingItem) {
      return {
        cartItems: state.cartItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      };
    }
    return {
      cartItems: [...state.cartItems, { ...item, quantity: 1 }]
    };
  }),
  removeFromCart: (id) => set((state) => ({
    cartItems: state.cartItems.filter(item => item.id !== id)
  })),
  updateQuantity: (id, quantity) => set((state) => ({
    cartItems: state.cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
    )
  })),
  clearCart: () => set({ cartItems: [] }),

  // Game Stats
  gameStats: {
    triviaStats: {
      gamesPlayed: 15,
      tokensEarned: 1850,
      highScore: 9,
      accuracy: 78,
      bestStreak: 5
    },
    arenaStats: {
      battlesPlayed: 12,
      tokensEarned: 1400,
      wins: 8,
      winRate: 66.7,
      bestStreak: 3
    },
    miningStats: {
      gamesPlayed: 8,
      tokensEarned: 1250,
      highestLevel: 12,
      banditsDefeated: 87,
      nodesMined: 156
    },
    tycoonStats: {
      gamesPlayed: 5,
      tokensEarned: 850,
      highestTvl: 2400000,
      prestigeLevel: 2,
      dexesCreated: 4
    },
    totalTokens: 3250,
    claimedTokens: 0,
    lastClaimDate: null
  },
  updateGameStats: (stats) => set((state) => ({
    gameStats: {
      ...state.gameStats,
      ...stats
    }
  })),
  claimTokens: (amount) => set((state) => ({
    gameStats: {
      ...state.gameStats,
      totalTokens: 0,
      claimedTokens: state.gameStats.claimedTokens + amount,
      lastClaimDate: new Date().toISOString(),
      triviaStats: {
        ...state.gameStats.triviaStats,
        tokensEarned: 0
      },
      arenaStats: {
        ...state.gameStats.arenaStats,
        tokensEarned: 0
      },
      miningStats: {
        ...state.gameStats.miningStats,
        tokensEarned: 0
      },
      tycoonStats: {
        ...state.gameStats.tycoonStats,
        tokensEarned: 0
      }
    }
  })),

  // Appearance
  currentWallpaper: wallpapersList[0],
  setWallpaper: (wallpaper) => set({ currentWallpaper: wallpaper }),

  // Topbar control
  isTopbarVisible: true,
  isTopbarBottom: false,
  toggleTopbarVisibility: () => set(state => ({ isTopbarVisible: !state.isTopbarVisible })),
  toggleTopbarPosition: () => set(state => ({ isTopbarBottom: !state.isTopbarBottom })),

  // Rewards
  rewards: {
    currentTier: 'Bronze',
    xp: 15000,
    xpToNextLevel: 10000,
    weeklyXP: [1200, 800, 1500, 950, 1100, 750, 1400],
    badges: [
      {
        id: 'first-deposit',
        name: 'First Deposit',
        description: 'Make your first deposit into DeFi protocols',
        image: 'https://api.dicebear.com/7.x/shapes/svg?seed=deposit&backgroundColor=0891b2',
        icon: {
          icon: 'Wallet',
          color: 'text-cyan-500'
        },
        xpAmount: 500,
        earnedDate: '2024-03-15'
      },
      {
        id: 'first-swap',
        name: 'First Swap',
        description: 'Complete your first token swap',
        image: 'https://api.dicebear.com/7.x/shapes/svg?seed=swap&backgroundColor=8b5cf6',
        icon: {
          icon: 'ArrowLeftRight',
          color: 'text-purple-500'
        },
        xpAmount: 300,
        earnedDate: '2024-03-16'
      },
      {
        id: 'daily-login',
        name: '7-Day Streak',
        description: 'Log in for 7 consecutive days',
        image: 'https://api.dicebear.com/7.x/shapes/svg?seed=streak&backgroundColor=059669',
        icon: {
          icon: 'Calendar',
          color: 'text-emerald-500'
        },
        xpAmount: 1000,
        earnedDate: '2024-03-18'
      },
      {
        id: 'first-game',
        name: 'Game Master',
        description: 'Play your first game',
        image: 'https://api.dicebear.com/7.x/shapes/svg?seed=game&backgroundColor=db2777',
        icon: {
          icon: 'Gamepad2',
          color: 'text-pink-500'
        },
        xpAmount: 200,
        earnedDate: null
      },
      {
        id: 'first-command',
        name: 'AI Explorer',
        description: 'Use your first DeFi Agent command',
        image: 'https://api.dicebear.com/7.x/shapes/svg?seed=ai&backgroundColor=6366f1',
        icon: {
          icon: 'Bot',
          color: 'text-indigo-500'
        },
        xpAmount: 250,
        earnedDate: null
      },
      {
        id: 'first-alert',
        name: 'Alert Pioneer',
        description: 'Set up your first market alert',
        image: 'https://api.dicebear.com/7.x/shapes/svg?seed=alert&backgroundColor=f43f5e',
        icon: {
          icon: 'Bell',
          color: 'text-rose-500'
        },
        xpAmount: 200,
        earnedDate: null
      },
      {
        id: 'flash-multiply',
        name: 'Multiply It',
        description: 'Play Multiplier game',
        image: 'https://api.dicebear.com/7.x/shapes/svg?seed=multiply&backgroundColor=f59e0b',
        icon: {
          icon: 'ArrowLeftRight',
          color: 'text-amber-500'
        },
        xpAmount: 150,
        isFlashBadge: true
      }
    ],
    activeChallenges: [
      // Trading Challenges
      {
        id: 'weekly-trades',
        title: 'Trading Master',
        description: 'Complete 10 trades this week',
        xpReward: 500,
        progress: 7,
        total: 10,
        endsIn: '2d 12h'
      },
      {
        id: 'trading-volume',
        title: 'Volume Champion',
        description: 'Reach $10,000 in trading volume',
        xpReward: 750,
        progress: 6500,
        total: 10000,
        endsIn: '3d'
      },
      
      // Game Challenges
      {
        id: 'trivia-master',
        title: 'Trivia Master',
        description: 'Score 8/10 or higher in Crypto Trivia',
        xpReward: 400,
        progress: 6,
        total: 8,
        endsIn: '1d 8h'
      },
      {
        id: 'arena-warrior',
        title: 'Arena Warrior',
        description: 'Win 5 battles in Meme Arena',
        xpReward: 600,
        progress: 3,
        total: 5,
        endsIn: '2d'
      },
      
      // AI Agent Challenges
      {
        id: 'ai-commands',
        title: 'AI Commander',
        description: 'Use 5 different AI Agent commands',
        xpReward: 450,
        progress: 2,
        total: 5,
        endsIn: '4d'
      },
      {
        id: 'voice-master',
        title: 'Voice Master',
        description: 'Complete 3 voice commands successfully',
        xpReward: 300,
        progress: 1,
        total: 3,
        endsIn: '3d'
      },
      
      // Alert Challenges
      {
        id: 'alert-setup',
        title: 'Alert Sentinel',
        description: 'Set up 3 different types of alerts',
        xpReward: 350,
        progress: 1,
        total: 3,
        endsIn: '5d'
      },
      {
        id: 'price-alerts',
        title: 'Price Guardian',
        description: 'Create price alerts for 5 different tokens',
        xpReward: 400,
        progress: 2,
        total: 5,
        endsIn: '4d'
      },
      
      // Social Challenges
      {
        id: 'social-engagement',
        title: 'Community Leader',
        description: 'Engage with 5 community posts',
        xpReward: 300,
        progress: 3,
        total: 5,
        endsIn: '3d 8h'
      },
      {
        id: 'follow-traders',
        title: 'Network Builder',
        description: 'Follow 10 top traders',
        xpReward: 250,
        progress: 4,
        total: 10,
        endsIn: '2d'
      },
      
      // DeFi Challenges
      {
        id: 'defi-explorer',
        title: 'DeFi Explorer',
        description: 'Try 3 different DeFi protocols',
        xpReward: 800,
        progress: 1,
        total: 3,
        endsIn: '5d'
      },
      {
        id: 'yield-seeker',
        title: 'Yield Seeker',
        description: 'Find and stake in a pool with >5% APY',
        xpReward: 600,
        progress: 0,
        total: 1,
        endsIn: '6d'
      }
    ],
    perks: [
      {
        id: 'reduced-fees',
        name: 'Reduced Trading Fees',
        description: '25% off trading fees',
        tier: 'Bronze',
        isActive: true
      },
      {
        id: 'premium-charts',
        name: 'Premium Charts',
        description: 'Access to advanced charting',
        tier: 'Silver',
        isActive: false
      },
      {
        id: 'priority-support',
        name: 'Priority Support',
        description: '24/7 priority customer support',
        tier: 'Gold',
        isActive: false
      },
      {
        id: 'exclusive-events',
        name: 'Exclusive Events',
        description: 'Access to exclusive events',
        tier: 'Platinum',
        isActive: false
      },
      {
        id: 'custom-badge',
        name: 'Custom Badge',
        description: 'Create your own badge',
        tier: 'Diamond',
        isActive: false
      }
    ]
  },
  addXP: (amount) => set((state) => ({
    rewards: {
      ...state.rewards,
      xp: state.rewards.xp + amount,
      weeklyXP: [
        ...state.rewards.weeklyXP.slice(1),
        state.rewards.weeklyXP[state.rewards.weeklyXP.length - 1] + amount
      ]
    }
  })),
  completeBadge: (badgeId) => set((state) => ({
    rewards: {
      ...state.rewards,
      badges: state.rewards.badges.map(badge =>
        badge.id === badgeId
          ? { ...badge, earnedDate: new Date().toISOString().split('T')[0] }
          : badge
      )
    }
  })),
  updateChallengeProgress: (challengeId, progress) => set((state) => ({
    rewards: {
      ...state.rewards,
      activeChallenges: state.rewards.activeChallenges.map(challenge =>
        challenge.id === challengeId
          ? { ...challenge, progress: Math.min(progress, challenge.total) }
          : challenge
      )
    }
  })),

  // Theme
  theme: 'dark',
  toggleTheme: () => set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}));

export { useStore };
export const wallpapers = wallpapersList;