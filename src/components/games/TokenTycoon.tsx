import React, { useState, useEffect } from 'react';
import { 
  Coins, TrendingUp, Users, Rocket, 
  BarChart2, Lock, Zap, Settings, 
  Plus, ArrowRight, ChevronDown, 
  ChevronUp, RefreshCw, Award, 
  AlertTriangle, Check, Clock,
  MessageSquare, X, Sun, Shield,
  Info, Bell, Globe, HelpCircle,
  BookOpen, Lightbulb, Star, Loader,
  Landmark, Flame, Sparkles, Gem,
  Layers, Cpu, Repeat, Droplet,
  Briefcase, Gauge, Maximize, Minimize,
  Shuffle, Aperture, Hexagon, Atom
} from 'lucide-react';
import { useStore } from '../../store/useStore';

// Game types
interface GameState {
  screen: 'menu' | 'game' | 'prestige' | 'tutorial';
  tokens: number;
  tvl: number;
  dexGold: number;
  clickPower: number;
  autoClickRate: number;
  lastTick: number;
  farms: Farm[];
  tokens_launched: Token[];
  dexes_launched: Dex[];
  upgrades: Upgrade[];
  achievements: Achievement[];
  stats: GameStats;
  notifications: Notification[];
  prestige: {
    level: number;
    multiplier: number;
    pendingReset: boolean;
  };
  unlocks: {
    chains: Chain[];
    features: Feature[];
  };
  events: GameEvent[];
  fomoMeter: number;
  activeChain: Chain;
  tutorialStep: number;
  tutorialCompleted: boolean;
  newsFlash: string | null;
  marketSentiment: 'bearish' | 'neutral' | 'bullish';
  lastMarketUpdate: number;
  hackingAttempts: number;
  hackingDefense: number;
  researchPoints: number;
  researchMultiplier: number;
}

interface Farm {
  id: string;
  name: string;
  icon: string;
  baseYield: number;
  currentYield: number;
  level: number;
  cost: number;
  owned: boolean;
  autoHarvestLevel: number;
  lastHarvest: number;
  pendingYield: number;
  chain: string;
  tier: 1 | 2 | 3;
  description: string;
}

interface Token {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  price: number;
  marketCap: number;
  priceHistory: number[];
  launchCost: number;
  passiveIncome: number;
  type: 'meme' | 'defi' | 'gaming' | 'ai' | 'privacy' | 'infrastructure' | 'metaverse' | 'social';
  chain: string;
  viralFactor: number;
  rugPullRisk: number;
  owned: boolean;
  tier: 1 | 2 | 3;
  description: string;
}

interface Dex {
  id: string;
  name: string;
  icon: string;
  tvlBoost: number;
  feeMultiplier: number;
  launchCost: number;
  chain: string;
  owned: boolean;
  tier: 1 | 2 | 3;
  description: string;
}

interface Upgrade {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  effect: {
    type: 'clickPower' | 'autoClickRate' | 'yieldMultiplier' | 'tokenLaunchDiscount' | 'dexLaunchBoost' | 'unlockChain' | 'unlockFeature' | 'rugPullProtection' | 'marketSentimentBoost' | 'hackingDefense' | 'researchMultiplier';
    value: number;
    target?: string;
  };
  purchased: boolean;
  visible: boolean;
  category: 'basic' | 'advanced' | 'prestige' | 'security' | 'research';
  requiredPrestigeLevel?: number;
  tier: 1 | 2 | 3;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'tvl' | 'tokens' | 'dexGold' | 'tokensLaunched' | 'dexesLaunched' | 'clickCount' | 'prestigeLevel' | 'farmsOwned' | 'upgradesPurchased' | 'hackingAttempts' | 'researchPoints';
    value: number;
  };
  reward: {
    type: 'dexGold' | 'clickPower' | 'autoClickRate' | 'yieldMultiplier' | 'researchPoints' | 'hackingDefense';
    value: number;
  };
  unlocked: boolean;
  tier: 1 | 2 | 3;
}

interface GameStats {
  clickCount: number;
  totalTVLGenerated: number;
  totalDexGoldEarned: number;
  tokensLaunched: number;
  dexesLaunched: number;
  farmsOwned: number;
  upgradesPurchased: number;
  achievementsUnlocked: number;
  prestigeCount: number;
  playTime: number;
  rugPulls: number;
  hackingAttemptsStopped: number;
  researchPointsEarned: number;
  marketCycles: number;
}

interface Notification {
  id: string;
  type: 'achievement' | 'event' | 'warning' | 'info' | 'security' | 'research';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

interface Chain {
  id: string;
  name: string;
  icon: string;
  color: string;
  tvlMultiplier: number;
  unlocked: boolean;
  requiredPrestigeLevel: number;
  description: string;
}

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requiredPrestigeLevel: number;
}

interface GameEvent {
  id: string;
  name: string;
  description: string;
  icon: string;
  effect: {
    type: 'yieldBoost' | 'tokenPriceBoost' | 'rugPullRisk' | 'tvlBoost' | 'dexGoldBoost' | 'hackingAttempt' | 'researchBoost';
    value: number;
    target?: string;
  };
  duration: number;
  startTime: number;
  active: boolean;
  severity?: 'low' | 'medium' | 'high';
}

// Tutorial steps
const tutorialSteps = [
  {
    title: "Welcome to Token Tycoon!",
    content: "In this game, you'll build your own DeFi empire from scratch. Let's learn the basics of how to play."
  },
  {
    title: "Understanding Resources",
    content: "There are three main resources: TVL (Total Value Locked), Tokens, and DEXGOLD. TVL is generated by clicking and is the foundation of your empire."
  },
  {
    title: "Generating TVL",
    content: "Click the TVL button to generate TVL. This is your primary way to get started. As you progress, you'll unlock ways to generate TVL automatically."
  },
  {
    title: "Converting Resources",
    content: "You can convert TVL to Tokens, and Tokens to DEXGOLD. Each conversion is a step up in value. DEXGOLD is used for premium upgrades and launching tokens and DEXes."
  },
  {
    title: "Yield Farms",
    content: "Farms generate Tokens automatically. Buy and upgrade farms to increase your passive Token generation."
  },
  {
    title: "Launching Tokens",
    content: "Spend DEXGOLD to launch tokens. Each token provides passive TVL generation. Be careful of rug pull risk!"
  },
  {
    title: "Creating DEXes",
    content: "DEXes boost your TVL generation based on your current TVL. They're expensive but provide scaling returns as your TVL grows."
  },
  {
    title: "Upgrades",
    content: "Buy upgrades to improve various aspects of your empire. Some upgrades increase click power, others boost yields or unlock new chains."
  },
  {
    title: "Chains",
    content: "Different blockchain networks offer different multipliers. Unlock new chains through upgrades or prestige to expand your empire."
  },
  {
    title: "Market Sentiment",
    content: "The market cycles between bearish, neutral, and bullish phases. Each phase affects token prices and rug pull risks differently."
  },
  {
    title: "Security & Research",
    content: "Protect your empire from hacking attempts and invest in research to boost your overall efficiency."
  },
  {
    title: "Prestige System",
    content: "Once you reach $1,000,000 TVL, you can prestige to reset your progress but gain permanent multipliers and unlock new features."
  },
  {
    title: "Ready to Play!",
    content: "You now know the basics of Token Tycoon. Click 'Start Playing' to begin your journey to becoming a DeFi tycoon!"
  }
];

// News flashes for the ticker
const newsFlashes = [
  "BREAKING: New meme token 'PEPE' surges 500% in 24 hours!",
  "ALERT: Major protocol exploit leads to $100M loss",
  "FOMO intensifies as Bitcoin breaks all-time high",
  "NEW: Revolutionary L2 solution promises 100x lower fees",
  "CAUTION: Regulatory crackdown on DeFi platforms expected",
  "BULLISH: Institutional investors pour billions into crypto",
  "LAUNCH: New NFT collection sells out in minutes",
  "MERGE: Two major DeFi protocols announce merger",
  "WARNING: Increased rug pull activity detected in new tokens",
  "ADOPTION: Major retailer now accepts crypto payments",
  "UPGRADE: Ethereum 2.0 transition date announced",
  "PARTNERSHIP: Gaming giant enters Web3 with new token",
  "AIRDROP: Protocol users rewarded with surprise token drop",
  "VOLATILITY: Market swings wildly after Fed announcement",
  "INNOVATION: AI-powered trading protocol raises $50M",
  "SECURITY: New zero-knowledge privacy solution unveiled",
  "METAVERSE: Virtual land prices reach new highs",
  "DEFI: Total Value Locked surpasses $100B across all chains",
  "REGULATION: New crypto-friendly bill introduced in Congress",
  "INFRASTRUCTURE: Major upgrade to blockchain scaling solution",
  "SOCIAL: Decentralized social media platform gains traction",
  "RESEARCH: Breakthrough in quantum-resistant cryptography",
  "GOVERNANCE: DAO votes to implement major protocol changes",
  "INTEROPERABILITY: New cross-chain bridge connects major L1s"
];

// Initial game data
const initialChains: Chain[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    icon: '🔷',
    color: '#627EEA',
    tvlMultiplier: 1,
    unlocked: true,
    requiredPrestigeLevel: 0,
    description: "The original smart contract platform. Secure but with higher gas fees."
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    icon: '🔵',
    color: '#28A0F0',
    tvlMultiplier: 1.2,
    unlocked: false,
    requiredPrestigeLevel: 1,
    description: "Ethereum L2 with lower fees and faster transactions."
  },
  {
    id: 'solana',
    name: 'Solana',
    icon: '🟣',
    color: '#9945FF',
    tvlMultiplier: 1.5,
    unlocked: false,
    requiredPrestigeLevel: 2,
    description: "High-performance blockchain with very low fees."
  },
  {
    id: 'base',
    name: 'Base',
    icon: '🔘',
    color: '#0052FF',
    tvlMultiplier: 1.3,
    unlocked: false,
    requiredPrestigeLevel: 1,
    description: "Coinbase's L2 solution built on Optimism."
  },
  {
    id: 'ton',
    name: 'TON',
    icon: '💎',
    color: '#0098EA',
    tvlMultiplier: 1.8,
    unlocked: false,
    requiredPrestigeLevel: 3,
    description: "Telegram's blockchain with massive user potential."
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    icon: '❄️',
    color: '#E84142',
    tvlMultiplier: 1.4,
    unlocked: false,
    requiredPrestigeLevel: 2,
    description: "Fast finality with subnets for customized blockchains."
  },
  {
    id: 'polygon',
    name: 'Polygon',
    icon: '🟪',
    color: '#8247E5',
    tvlMultiplier: 1.25,
    unlocked: false,
    requiredPrestigeLevel: 1,
    description: "Ethereum sidechain with a growing ecosystem."
  }
];

const initialFarms: Farm[] = [
  {
    id: 'eth-usdc',
    name: 'ETH-USDC LP',
    icon: '💰',
    baseYield: 1,
    currentYield: 1,
    level: 1,
    cost: 10,
    owned: true,
    autoHarvestLevel: 0,
    lastHarvest: Date.now(),
    pendingYield: 0,
    chain: 'ethereum',
    tier: 1,
    description: "Basic liquidity pool for ETH and USDC."
  },
  {
    id: 'wbtc-eth',
    name: 'WBTC-ETH LP',
    icon: '🔶',
    baseYield: 2,
    currentYield: 2,
    level: 0,
    cost: 50,
    owned: false,
    autoHarvestLevel: 0,
    lastHarvest: 0,
    pendingYield: 0,
    chain: 'ethereum',
    tier: 1,
    description: "Bitcoin and Ethereum liquidity pool with higher yield."
  },
  {
    id: 'usdc-usdt',
    name: 'USDC-USDT LP',
    icon: '💵',
    baseYield: 0.5,
    currentYield: 0.5,
    level: 0,
    cost: 30,
    owned: false,
    autoHarvestLevel: 0,
    lastHarvest: 0,
    pendingYield: 0,
    chain: 'ethereum',
    tier: 1,
    description: "Stablecoin pair with lower but consistent yield."
  },
  {
    id: 'eth-arb',
    name: 'ETH-ARB LP',
    icon: '🔷',
    baseYield: 3,
    currentYield: 3,
    level: 0,
    cost: 200,
    owned: false,
    autoHarvestLevel: 0,
    lastHarvest: 0,
    pendingYield: 0,
    chain: 'arbitrum',
    tier: 2,
    description: "Arbitrum's native token paired with ETH."
  },
  {
    id: 'sol-usdc',
    name: 'SOL-USDC LP',
    icon: '🟣',
    baseYield: 4,
    currentYield: 4,
    level: 0,
    cost: 300,
    owned: false,
    autoHarvestLevel: 0,
    lastHarvest: 0,
    pendingYield: 0,
    chain: 'solana',
    tier: 2,
    description: "Solana's high-performance liquidity pool."
  },
  {
    id: 'avax-usdc',
    name: 'AVAX-USDC LP',
    icon: '❄️',
    baseYield: 3.5,
    currentYield: 3.5,
    level: 0,
    cost: 250,
    owned: false,
    autoHarvestLevel: 0,
    lastHarvest: 0,
    pendingYield: 0,
    chain: 'avalanche',
    tier: 2,
    description: "Avalanche liquidity pool with solid returns."
  },
  {
    id: 'matic-eth',
    name: 'MATIC-ETH LP',
    icon: '🟪',
    baseYield: 2.5,
    currentYield: 2.5,
    level: 0,
    cost: 180,
    owned: false,
    autoHarvestLevel: 0,
    lastHarvest: 0,
    pendingYield: 0,
    chain: 'polygon',
    tier: 2,
    description: "Polygon's native token paired with ETH."
  },
  {
    id: 'ton-usdt',
    name: 'TON-USDT LP',
    icon: '💎',
    baseYield: 5,
    currentYield: 5,
    level: 0,
    cost: 500,
    owned: false,
    autoHarvestLevel: 0,
    lastHarvest: 0,
    pendingYield: 0,
    chain: 'ton',
    tier: 3,
    description: "High-yield pool on Telegram's blockchain."
  },
  {
    id: 'eth-base',
    name: 'ETH-BASE LP',
    icon: '🔘',
    baseYield: 3.2,
    currentYield: 3.2,
    level: 0,
    cost: 220,
    owned: false,
    autoHarvestLevel: 0,
    lastHarvest: 0,
    pendingYield: 0,
    chain: 'base',
    tier: 2,
    description: "Base's native token paired with ETH."
  },
  {
    id: 'tri-stables',
    name: 'Tri-Stablecoin LP',
    icon: '🔱',
    baseYield: 2.8,
    currentYield: 2.8,
    level: 0,
    cost: 400,
    owned: false,
    autoHarvestLevel: 0,
    lastHarvest: 0,
    pendingYield: 0,
    chain: 'ethereum',
    tier: 3,
    description: "Advanced stablecoin pool with USDC, USDT, and DAI."
  }
];

const initialTokens: Token[] = [
  {
    id: 'dexgold',
    name: 'DexGold',
    symbol: 'DEXGOLD',
    icon: '🪙',
    price: 1,
    marketCap: 1000000,
    priceHistory: [1],
    launchCost: 0,
    passiveIncome: 0,
    type: 'defi',
    chain: 'ethereum',
    viralFactor: 0,
    rugPullRisk: 0,
    owned: true,
    tier: 1,
    description: "The native token of the DexFin platform."
  },
  {
    id: 'pepe-finance',
    name: 'Pepe Finance',
    symbol: 'PEPEFIN',
    icon: '🐸',
    price: 0.01,
    marketCap: 500000,
    priceHistory: [0.01],
    launchCost: 100,
    passiveIncome: 5,
    type: 'meme',
    chain: 'ethereum',
    viralFactor: 0.8,
    rugPullRisk: 0.2,
    owned: false,
    tier: 1,
    description: "The OG meme token with DeFi capabilities."
  },
  {
    id: 'degen-token',
    name: 'Degen Token',
    symbol: 'DEGEN',
    icon: '🎮',
    price: 0.05,
    marketCap: 1000000,
    priceHistory: [0.05],
    launchCost: 200,
    passiveIncome: 10,
    type: 'gaming',
    chain: 'ethereum',
    viralFactor: 0.6,
    rugPullRisk: 0.1,
    owned: false,
    tier: 1,
    description: "For the true degens - high risk, high reward."
  },
  {
    id: 'ai-protocol',
    name: 'AI Protocol',
    symbol: 'AIPR',
    icon: '🤖',
    price: 0.1,
    marketCap: 2000000,
    priceHistory: [0.1],
    launchCost: 500,
    passiveIncome: 25,
    type: 'ai',
    chain: 'ethereum',
    viralFactor: 0.7,
    rugPullRisk: 0.05,
    owned: false,
    tier: 2,
    description: "AI-powered DeFi protocol with predictive analytics."
  },
  {
    id: 'privacy-coin',
    name: 'Privacy Shield',
    symbol: 'SHIELD',
    icon: '🛡️',
    price: 0.2,
    marketCap: 3000000,
    priceHistory: [0.2],
    launchCost: 750,
    passiveIncome: 35,
    type: 'privacy',
    chain: 'ethereum',
    viralFactor: 0.5,
    rugPullRisk: 0.08,
    owned: false,
    tier: 2,
    description: "Zero-knowledge privacy solution for transactions."
  },
  {
    id: 'meta-realm',
    name: 'Meta Realm',
    symbol: 'REALM',
    icon: '🌐',
    price: 0.15,
    marketCap: 2500000,
    priceHistory: [0.15],
    launchCost: 600,
    passiveIncome: 30,
    type: 'metaverse',
    chain: 'ethereum',
    viralFactor: 0.65,
    rugPullRisk: 0.12,
    owned: false,
    tier: 2,
    description: "Virtual world with tokenized land and assets."
  },
  {
    id: 'social-token',
    name: 'Social Chain',
    symbol: 'SOCIAL',
    icon: '👥',
    price: 0.08,
    marketCap: 1500000,
    priceHistory: [0.08],
    launchCost: 400,
    passiveIncome: 20,
    type: 'social',
    chain: 'ethereum',
    viralFactor: 0.75,
    rugPullRisk: 0.15,
    owned: false,
    tier: 1,
    description: "Decentralized social media platform token."
  },
  {
    id: 'infra-protocol',
    name: 'Infra Protocol',
    symbol: 'INFRA',
    icon: '🏗️',
    price: 0.25,
    marketCap: 4000000,
    priceHistory: [0.25],
    launchCost: 1000,
    passiveIncome: 50,
    type: 'infrastructure',
    chain: 'ethereum',
    viralFactor: 0.4,
    rugPullRisk: 0.03,
    owned: false,
    tier: 3,
    description: "Core infrastructure for cross-chain interoperability."
  },
  {
    id: 'arb-meme',
    name: 'Arbitrum Doge',
    symbol: 'ARBDOGE',
    icon: '🐕',
    price: 0.003,
    marketCap: 300000,
    priceHistory: [0.003],
    launchCost: 150,
    passiveIncome: 8,
    type: 'meme',
    chain: 'arbitrum',
    viralFactor: 0.9,
    rugPullRisk: 0.25,
    owned: false,
    tier: 1,
    description: "The first meme coin on Arbitrum with viral potential."
  },
  {
    id: 'sol-defi',
    name: 'Solana Finance',
    symbol: 'SOLFIN',
    icon: '☀️',
    price: 0.12,
    marketCap: 2200000,
    priceHistory: [0.12],
    launchCost: 550,
    passiveIncome: 28,
    type: 'defi',
    chain: 'solana',
    viralFactor: 0.6,
    rugPullRisk: 0.07,
    owned: false,
    tier: 2,
    description: "High-speed DeFi protocol built on Solana."
  },
  {
    id: 'base-game',
    name: 'Base Games',
    symbol: 'BGAME',
    icon: '🎯',
    price: 0.07,
    marketCap: 1200000,
    priceHistory: [0.07],
    launchCost: 350,
    passiveIncome: 18,
    type: 'gaming',
    chain: 'base',
    viralFactor: 0.7,
    rugPullRisk: 0.14,
    owned: false,
    tier: 2,
    description: "Gaming platform built on Base with play-to-earn mechanics."
  },
  {
    id: 'ton-social',
    name: 'TON Connect',
    symbol: 'CONNECT',
    icon: '📱',
    price: 0.3,
    marketCap: 5000000,
    priceHistory: [0.3],
    launchCost: 1200,
    passiveIncome: 60,
    type: 'social',
    chain: 'ton',
    viralFactor: 0.85,
    rugPullRisk: 0.1,
    owned: false,
    tier: 3,
    description: "Social platform integrated with Telegram's ecosystem."
  },
  {
    id: 'avax-ai',
    name: 'Avalanche AI',
    symbol: 'AVAI',
    icon: '🧠',
    price: 0.18,
    marketCap: 3200000,
    priceHistory: [0.18],
    launchCost: 800,
    passiveIncome: 40,
    type: 'ai',
    chain: 'avalanche',
    viralFactor: 0.55,
    rugPullRisk: 0.06,
    owned: false,
    tier: 2,
    description: "AI prediction markets on Avalanche."
  },
  {
    id: 'poly-meta',
    name: 'Polygon Worlds',
    symbol: 'PWORLD',
    icon: '🌍',
    price: 0.09,
    marketCap: 1800000,
    priceHistory: [0.09],
    launchCost: 450,
    passiveIncome: 22,
    type: 'metaverse',
    chain: 'polygon',
    viralFactor: 0.6,
    rugPullRisk: 0.13,
    owned: false,
    tier: 2,
    description: "Metaverse platform built on Polygon's scalable infrastructure."
  },
  {
    id: 'quantum-secure',
    name: 'Quantum Secure',
    symbol: 'QSEC',
    icon: '🔒',
    price: 0.4,
    marketCap: 8000000,
    priceHistory: [0.4],
    launchCost: 2000,
    passiveIncome: 100,
    type: 'privacy',
    chain: 'ethereum',
    viralFactor: 0.3,
    rugPullRisk: 0.02,
    owned: false,
    tier: 3,
    description: "Quantum-resistant cryptography for the blockchain era."
  }
];

const initialDexes: Dex[] = [
  {
    id: 'uniswap-clone',
    name: 'UniClone',
    icon: '🦄',
    tvlBoost: 1.2,
    feeMultiplier: 1.1,
    launchCost: 1000,
    chain: 'ethereum',
    owned: false,
    tier: 1,
    description: "Automated market maker with liquidity pools."
  },
  {
    id: 'sushi-clone',
    name: 'SushiClone',
    icon: '🍣',
    tvlBoost: 1.3,
    feeMultiplier: 1.2,
    launchCost: 2000,
    chain: 'ethereum',
    owned: false,
    tier: 1,
    description: "Fork of Uniswap with additional yield farming features."
  },
  {
    id: 'arb-swap',
    name: 'ArbSwap',
    icon: '🔄',
    tvlBoost: 1.4,
    feeMultiplier: 1.25,
    launchCost: 2500,
    chain: 'arbitrum',
    owned: false,
    tier: 2,
    description: "Low-fee DEX built specifically for Arbitrum."
  },
  {
    id: 'sol-dex',
    name: 'SolDEX',
    icon: '⚡',
    tvlBoost: 1.5,
    feeMultiplier: 1.3,
    launchCost: 3000,
    chain: 'solana',
    owned: false,
    tier: 2,
    description: "High-speed DEX with central limit order book."
  },
  {
    id: 'base-swap',
    name: 'BaseSwap',
    icon: '🔘',
    tvlBoost: 1.35,
    feeMultiplier: 1.2,
    launchCost: 2200,
    chain: 'base',
    owned: false,
    tier: 2,
    description: "Official DEX for the Base ecosystem."
  },
  {
    id: 'ton-exchange',
    name: 'TON Exchange',
    icon: '💎',
    tvlBoost: 1.6,
    feeMultiplier: 1.4,
    launchCost: 4000,
    chain: 'ton',
    owned: false,
    tier: 3,
    description: "Integrated with Telegram for seamless trading."
  },
  {
    id: 'avax-trade',
    name: 'AVAX Trade',
    icon: '❄️',
    tvlBoost: 1.45,
    feeMultiplier: 1.3,
    launchCost: 2800,
    chain: 'avalanche',
    owned: false,
    tier: 2,
    description: "Fast-finality DEX on Avalanche."
  },
  {
    id: 'poly-swap',
    name: 'PolySwap',
    icon: '🟪',
    tvlBoost: 1.3,
    feeMultiplier: 1.15,
    launchCost: 2100,
    chain: 'polygon',
    owned: false,
    tier: 2,
    description: "Low-cost trading on Polygon."
  },
  {
    id: 'omni-dex',
    name: 'OmniDEX',
    icon: '🌈',
    tvlBoost: 2.0,
    feeMultiplier: 1.5,
    launchCost: 10000,
    chain: 'ethereum',
    owned: false,
    tier: 3,
    description: "Cross-chain DEX aggregator with optimal routing."
  }
];

const initialUpgrades: Upgrade[] = [
  {
    id: 'click-power-1',
    name: 'Better Clicking',
    description: 'Double your click power',
    icon: '👆',
    cost: 50,
    effect: {
      type: 'clickPower',
      value: 2
    },
    purchased: false,
    visible: true,
    category: 'basic',
    tier: 1
  },
  {
    id: 'auto-click-1',
    name: 'Auto Clicker',
    description: 'Generate 1 TVL per second automatically',
    icon: '⏱️',
    cost: 100,
    effect: {
      type: 'autoClickRate',
      value: 1
    },
    purchased: false,
    visible: true,
    category: 'basic',
    tier: 1
  },
  {
    id: 'yield-boost-1',
    name: 'Yield Optimizer',
    description: 'Increase all farm yields by 50%',
    icon: '📈',
    cost: 200,
    effect: {
      type: 'yieldMultiplier',
      value: 1.5
    },
    purchased: false,
    visible: true,
    category: 'basic',
    tier: 1
  },
  {
    id: 'token-discount',
    name: 'Token Launch Discount',
    description: 'Reduce token launch costs by 20%',
    icon: '🏷️',
    cost: 500,
    effect: {
      type: 'tokenLaunchDiscount',
      value: 0.8
    },
    purchased: false,
    visible: true,
    category: 'advanced',
    tier: 1
  },
  {
    id: 'dex-boost',
    name: 'DEX Efficiency',
    description: 'Increase DEX TVL boost by 20%',
    icon: '🔄',
    cost: 800,
    effect: {
      type: 'dexLaunchBoost',
      value: 1.2
    },
    purchased: false,
    visible: true,
    category: 'advanced',
    tier: 1
  },
  {
    id: 'unlock-arbitrum',
    name: 'Arbitrum Expansion',
    description: 'Unlock Arbitrum chain for deployment',
    icon: '🔵',
    cost: 5000,
    effect: {
      type: 'unlockChain',
      value: 1,
      target: 'arbitrum'
    },
    purchased: false,
    visible: true,
    category: 'advanced',
    tier: 2
  },
  {
    id: 'unlock-dao',
    name: 'DAO Governance',
    description: 'Unlock DAO voting for passive bonuses',
    icon: '🏛️',
    cost: 10000,
    effect: {
      type: 'unlockFeature',
      value: 1,
      target: 'dao'
    },
    purchased: false,
    visible: true,
    category: 'advanced',
    tier: 2
  },
  {
    id: 'prestige-click',
    name: 'Prestige Clicking',
    description: '5x click power after prestige',
    icon: '✨',
    cost: 1000,
    effect: {
      type: 'clickPower',
      value: 5
    },
    purchased: false,
    visible: false,
    category: 'prestige',
    requiredPrestigeLevel: 1,
    tier: 2
  },
  {
    id: 'click-power-2',
    name: 'Advanced Clicking',
    description: '5x click power',
    icon: '👆',
    cost: 2000,
    effect: {
      type: 'clickPower',
      value: 5
    },
    purchased: false,
    visible: true,
    category: 'basic',
    tier: 2
  },
  {
    id: 'auto-click-2',
    name: 'Enhanced Auto Clicker',
    description: 'Generate 5 more TVL per second',
    icon: '⏱️',
    cost: 3000,
    effect: {
      type: 'autoClickRate',
      value: 5
    },
    purchased: false,
    visible: true,
    category: 'basic',
    tier: 2
  },
  {
    id: 'yield-boost-2',
    name: 'Advanced Yield Optimizer',
    description: 'Increase all farm yields by 100%',
    icon: '📈',
    cost: 5000,
    effect: {
      type: 'yieldMultiplier',
      value: 2
    },
    purchased: false,
    visible: true,
    category: 'basic',
    tier: 2
  },
  {
    id: 'token-discount-2',
    name: 'Premium Token Discount',
    description: 'Reduce token launch costs by 40%',
    icon: '🏷️',
    cost: 8000,
    effect: {
      type: 'tokenLaunchDiscount',
      value: 0.6
    },
    purchased: false,
    visible: true,
    category: 'advanced',
    tier: 2
  },
  {
    id: 'dex-boost-2',
    name: 'DEX Supercharger',
    description: 'Increase DEX TVL boost by 50%',
    icon: '🔄',
    cost: 12000,
    effect: {
      type: 'dexLaunchBoost',
      value: 1.5
    },
    purchased: false,
    visible: true,
    category: 'advanced',
    tier: 2
  },
  {
    id: 'unlock-solana',
    name: 'Solana Integration',
    description: 'Unlock Solana chain for deployment',
    icon: '🟣',
    cost: 15000,
    effect: {
      type: 'unlockChain',
      value: 1,
      target: 'solana'
    },
    purchased: false,
    visible: true,
    category: 'advanced',
    tier: 2
  },
  {
    id: 'unlock-base',
    name: 'Base Expansion',
    description: 'Unlock Base chain for deployment',
    icon: '🔘',
    cost: 12000,
    effect: {
      type: 'unlockChain',
      value: 1,
      target: 'base'
    },
    purchased: false,
    visible: true,
    category: 'advanced',
    tier: 2
  },
  {
    id: 'unlock-polygon',
    name: 'Polygon Integration',
    description: 'Unlock Polygon chain for deployment',
    icon: '🟪',
    cost: 10000,
    effect: {
      type: 'unlockChain',
      value: 1,
      target: 'polygon'
    },
    purchased: false,
    visible: true,
    category: 'advanced',
    tier: 2
  },
  {
    id: 'unlock-avalanche',
    name: 'Avalanche Integration',
    description: 'Unlock Avalanche chain for deployment',
    icon: '❄️',
    cost: 14000,
    effect: {
      type: 'unlockChain',
      value: 1,
      target: 'avalanche'
    },
    purchased: false,
    visible: true,
    category: 'advanced',
    tier: 2
  },
  {
    id: 'unlock-ton',
    name: 'TON Integration',
    description: 'Unlock TON chain for deployment',
    icon: '💎',
    cost: 25000,
    effect: {
      type: 'unlockChain',
      value: 1,
      target: 'ton'
    },
    purchased: false,
    visible: true,
    category: 'advanced',
    tier: 3
  },
  {
    id: 'basic-security',
    name: 'Basic Security',
    description: 'Reduce rug pull risk by 30%',
    icon: '🔒',
    cost: 1500,
    effect: {
      type: 'rugPullProtection',
      value: 0.7
    },
    purchased: false,
    visible: true,
    category: 'security',
    tier: 1
  },
  {
    id: 'advanced-security',
    name: 'Advanced Security',
    description: 'Reduce rug pull risk by 50%',
    icon: '🔐',
    cost: 5000,
    effect: {
      type: 'rugPullProtection',
      value: 0.5
    },
    purchased: false,
    visible: true,
    category: 'security',
    tier: 2
  },
  {
    id: 'market-analyst',
    name: 'Market Analyst',
    description: 'Improve market sentiment effects by 20%',
    icon: '📊',
    cost: 3000,
    effect: {
      type: 'marketSentimentBoost',
      value: 1.2
    },
    purchased: false,
    visible: true,
    category: 'advanced',
    tier: 2
  },
  {
    id: 'firewall',
    name: 'Basic Firewall',
    description: 'Increase hacking defense by 5 points',
    icon: '🔥',
    cost: 2000,
    effect: {
      type: 'hackingDefense',
      value: 5
    },
    purchased: false,
    visible: true,
    category: 'security',
    tier: 1
  },
  {
    id: 'advanced-firewall',
    name: 'Advanced Firewall',
    description: 'Increase hacking defense by 15 points',
    icon: '🛡️',
    cost: 7000,
    effect: {
      type: 'hackingDefense',
      value: 15
    },
    purchased: false,
    visible: true,
    category: 'security',
    tier: 2
  },
  {
    id: 'research-lab',
    name: 'Research Lab',
    description: 'Unlock research capabilities',
    icon: '🔬',
    cost: 5000,
    effect: {
      type: 'researchMultiplier',
      value: 1
    },
    purchased: false,
    visible: true,
    category: 'research',
    tier: 2
  },
  {
    id: 'advanced-lab',
    name: 'Advanced Lab',
    description: 'Double research point generation',
    icon: '🧪',
    cost: 12000,
    effect: {
      type: 'researchMultiplier',
      value: 2
    },
    purchased: false,
    visible: true,
    category: 'research',
    tier: 3
  },
  {
    id: 'click-power-3',
    name: 'Quantum Clicking',
    description: '10x click power',
    icon: '⚡',
    cost: 20000,
    effect: {
      type: 'clickPower',
      value: 10
    },
    purchased: false,
    visible: true,
    category: 'basic',
    tier: 3
  },
  {
    id: 'auto-click-3',
    name: 'Quantum Auto Clicker',
    description: 'Generate 20 more TVL per second',
    icon: '⚙️',
    cost: 25000,
    effect: {
      type: 'autoClickRate',
      value: 20
    },
    purchased: false,
    visible: true,
    category: 'basic',
    tier: 3
  },
  {
    id: 'yield-boost-3',
    name: 'Quantum Yield Optimizer',
    description: 'Increase all farm yields by 200%',
    icon: '📈',
    cost: 30000,
    effect: {
      type: 'yieldMultiplier',
      value: 3
    },
    purchased: false,
    visible: true,
    category: 'basic',
    tier: 3
  }
];

const initialFeatures: Feature[] = [
  {
    id: 'dao',
    name: 'DAO Governance',
    description: 'Automate some game functions through DAO voting',
    icon: '🏛️',
    unlocked: false,
    requiredPrestigeLevel: 1
  },
  {
    id: 'nft',
    name: 'NFT Marketplace',
    description: 'Launch and trade NFTs for passive bonuses',
    icon: '🖼️',
    unlocked: false,
    requiredPrestigeLevel: 2
  },
  {
    id: 'lending',
    name: 'Lending Protocol',
    description: 'Earn interest on your tokens',
    icon: '💸',
    unlocked: false,
    requiredPrestigeLevel: 1
  },
  {
    id: 'research',
    name: 'Research Lab',
    description: 'Research new technologies for powerful bonuses',
    icon: '🔬',
    unlocked: false,
    requiredPrestigeLevel: 1
  },
  {
    id: 'security',
    name: 'Security Center',
    description: 'Protect your assets from hacks and exploits',
    icon: '🛡️',
    unlocked: false,
    requiredPrestigeLevel: 1
  },
  {
    id: 'derivatives',
    name: 'Derivatives Platform',
    description: 'Trade futures and options for additional income',
    icon: '📊',
    unlocked: false,
    requiredPrestigeLevel: 2
  },
  {
    id: 'bridge',
    name: 'Cross-Chain Bridge',
    description: 'Transfer assets between different blockchains',
    icon: '🌉',
    unlocked: false,
    requiredPrestigeLevel: 2
  }
];

const initialAchievements: Achievement[] = [
  {
    id: 'first-click',
    name: 'First Click',
    description: 'Click to generate TVL for the first time',
    icon: '👆',
    requirement: {
      type: 'clickCount',
      value: 1
    },
    reward: {
      type: 'dexGold',
      value: 10
    },
    unlocked: false,
    tier: 1
  },
  {
    id: 'tvl-milestone-1',
    name: 'TVL Milestone I',
    description: 'Reach 1,000 TVL',
    icon: '💰',
    requirement: {
      type: 'tvl',
      value: 1000
    },
    reward: {
      type: 'clickPower',
      value: 1.5
    },
    unlocked: false,
    tier: 1
  },
  {
    id: 'token-launcher',
    name: 'Token Launcher',
    description: 'Launch your first token',
    icon: '🚀',
    requirement: {
      type: 'tokensLaunched',
      value: 1
    },
    reward: {
      type: 'dexGold',
      value: 50
    },
    unlocked: false,
    tier: 1
  },
  {
    id: 'dex-creator',
    name: 'DEX Creator',
    description: 'Launch your first DEX',
    icon: '🦄',
    requirement: {
      type: 'dexesLaunched',
      value: 1
    },
    reward: {
      type: 'yieldMultiplier',
      value: 1.2
    },
    unlocked: false,
    tier: 1
  },
  {
    id: 'prestige-1',
    name: 'First Prestige',
    description: 'Prestige for the first time',
    icon: '✨',
    requirement: {
      type: 'prestigeLevel',
      value: 1
    },
    reward: {
      type: 'clickPower',
      value: 2
    },
    unlocked: false,
    tier: 2
  },
  {
    id: 'tvl-milestone-2',
    name: 'TVL Milestone II',
    description: 'Reach 100,000 TVL',
    icon: '💰',
    requirement: {
      type: 'tvl',
      value: 100000
    },
    reward: {
      type: 'autoClickRate',
      value: 2
    },
    unlocked: false,
    tier: 2
  },
  {
    id: 'token-empire',
    name: 'Token Empire',
    description: 'Launch 5 different tokens',
    icon: '👑',
    requirement: {
      type: 'tokensLaunched',
      value: 5
    },
    reward: {
      type: 'dexGold',
      value: 500
    },
    unlocked: false,
    tier: 2
  },
  {
    id: 'dex-network',
    name: 'DEX Network',
    description: 'Launch 3 different DEXes',
    icon: '🌐',
    requirement: {
      type: 'dexesLaunched',
      value: 3
    },
    reward: {
      type: 'yieldMultiplier',
      value: 1.5
    },
    unlocked: false,
    tier: 2
  },
  {
    id: 'farm-collector',
    name: 'Farm Collector',
    description: 'Own 5 different farms',
    icon: '🚜',
    requirement: {
      type: 'farmsOwned',
      value: 5
    },
    reward: {
      type: 'yieldMultiplier',
      value: 1.3
    },
    unlocked: false,
    tier: 2
  },
  {
    id: 'upgrade-master',
    name: 'Upgrade Master',
    description: 'Purchase 10 different upgrades',
    icon: '⚙️',
    requirement: {
      type: 'upgradesPurchased',
      value: 10
    },
    reward: {
      type: 'dexGold',
      value: 1000
    },
    unlocked: false,
    tier: 2
  },
  {
    id: 'security-expert',
    name: 'Security Expert',
    description: 'Stop 5 hacking attempts',
    icon: '🛡️',
    requirement: {
      type: 'hackingAttempts',
      value: 5
    },
    reward: {
      type: 'hackingDefense',
      value: 10
    },
    unlocked: false,
    tier: 2
  },
  {
    id: 'researcher',
    name: 'Researcher',
    description: 'Earn 100 research points',
    icon: '🔬',
    requirement: {
      type: 'researchPoints',
      value: 100
    },
    reward: {
      type: 'researchPoints',
      value: 50
    },
    unlocked: false,
    tier: 2
  },
  {
    id: 'tvl-milestone-3',
    name: 'TVL Milestone III',
    description: 'Reach 10,000,000 TVL',
    icon: '💰',
    requirement: {
      type: 'tvl',
      value: 10000000
    },
    reward: {
      type: 'clickPower',
      value: 10
    },
    unlocked: false,
    tier: 3
  },
  {
    id: 'token-mogul',
    name: 'Token Mogul',
    description: 'Launch 10 different tokens',
    icon: '🏆',
    requirement: {
      type: 'tokensLaunched',
      value: 10
    },
    reward: {
      type: 'dexGold',
      value: 5000
    },
    unlocked: false,
    tier: 3
  },
  {
    id: 'dex-monopoly',
    name: 'DEX Monopoly',
    description: 'Launch 5 different DEXes',
    icon: '🏛️',
    requirement: {
      type: 'dexesLaunched',
      value: 5
    },
    reward: {
      type: 'yieldMultiplier',
      value: 2
    },
    unlocked: false,
    tier: 3
  },
  {
    id: 'prestige-3',
    name: 'Prestige Master',
    description: 'Reach prestige level 3',
    icon: '🌟',
    requirement: {
      type: 'prestigeLevel',
      value: 3
    },
    reward: {
      type: 'clickPower',
      value: 5
    },
    unlocked: false,
    tier: 3
  }
];

// Initial game state
const initialGameState: GameState = {
  screen: 'menu',
  tokens: 0,
  tvl: 0,
  dexGold: 100,
  clickPower: 1,
  autoClickRate: 0,
  lastTick: Date.now(),
  farms: initialFarms,
  tokens_launched: initialTokens.filter(t => t.owned),
  dexes_launched: initialDexes.filter(d => d.owned),
  upgrades: initialUpgrades,
  achievements: initialAchievements,
  stats: {
    clickCount: 0,
    totalTVLGenerated: 0,
    totalDexGoldEarned: 0,
    tokensLaunched: 0,
    dexesLaunched: 0,
    farmsOwned: 1,
    upgradesPurchased: 0,
    achievementsUnlocked: 0,
    prestigeCount: 0,
    playTime: 0,
    rugPulls: 0,
    hackingAttemptsStopped: 0,
    researchPointsEarned: 0,
    marketCycles: 0
  },
  notifications: [],
  prestige: {
    level: 0,
    multiplier: 1,
    pendingReset: false
  },
  unlocks: {
    chains: initialChains,
    features: initialFeatures
  },
  events: [],
  fomoMeter: 50,
  activeChain: initialChains[0],
  tutorialStep: 0,
  tutorialCompleted: false,
  newsFlash: newsFlashes[Math.floor(Math.random() * newsFlashes.length)],
  marketSentiment: 'neutral',
  lastMarketUpdate: Date.now(),
  hackingAttempts: 0,
  hackingDefense: 1,
  researchPoints: 0,
  researchMultiplier: 1
};

// Helper functions
const formatNumber = (num: number): string => {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
};

const getRandomEvent = (): GameEvent => {
  const events = [
    {
      id: 'bull-market',
      name: 'Bull Market',
      description: 'Market sentiment is extremely positive!',
      icon: '🐂',
      effect: {
        type: 'tokenPriceBoost',
        value: 1.5
      },
      duration: 60000, // 1 minute for testing
      startTime: Date.now(),
      active: true,
      severity: 'low' as const
    },
    {
      id: 'defi-summer',
      name: 'DeFi Summer',
      description: 'Everyone is farming yield!',
      icon: '☀️',
      effect: {
        type: 'yieldBoost',
        value: 2
      },
      duration: 60000,
      startTime: Date.now(),
      active: true,
      severity: 'low' as const
    },
    {
      id: 'sec-crackdown',
      name: 'SEC Crackdown',
      description: 'Regulatory concerns are affecting the market!',
      icon: '🚨',
      effect: {
        type: 'rugPullRisk',
        value: 1.5
      },
      duration: 60000,
      startTime: Date.now(),
      active: true,
      severity: 'medium' as const
    },
    {
      id: 'whale-buying',
      name: 'Whale Buying',
      description: 'Large investors are entering the market!',
      icon: '🐋',
      effect: {
        type: 'tvlBoost',
        value: 1.8
      },
      duration: 60000,
      startTime: Date.now(),
      active: true,
      severity: 'low' as const
    },
    {
      id: 'hacking-attempt',
      name: 'Hacking Attempt',
      description: 'Someone is trying to exploit your protocol!',
      icon: '🔓',
      effect: {
        type: 'hackingAttempt',
        value: 1
      },
      duration: 30000,
      startTime: Date.now(),
      active: true,
      severity: 'high' as const
    },
    {
      id: 'research-breakthrough',
      name: 'Research Breakthrough',
      description: 'Your team has made a significant discovery!',
      icon: '💡',
      effect: {
        type: 'researchBoost',
        value: 3
      },
      duration: 45000,
      startTime: Date.now(),
      active: true,
      severity: 'low' as const
    }
  ];

  return events[Math.floor(Math.random() * events.length)];
};

// Main component
export const TokenTycoon: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Try to load saved game from localStorage
    const savedGame = localStorage.getItem('tokenTycoonSave');
    if (savedGame) {
      try {
        const parsedGame = JSON.parse(savedGame);
        // Make sure the lastTick is updated to now to prevent huge time jumps
        parsedGame.lastTick = Date.now();
        return parsedGame;
      } catch (e) {
        console.error("Error loading saved game:", e);
        return initialGameState;
      }
    }
    return initialGameState;
  });
  
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [selectedDex, setSelectedDex] = useState<Dex | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showChainSelector, setShowChainSelector] = useState(false);
  const [eventCountdown, setEventCountdown] = useState<number | null>(null);
  const [gameTime, setGameTime] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
  } | null>(null);
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [newsIndex, setNewsIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'farms' | 'tokens' | 'dexes' | 'upgrades' | 'research'>('farms');
  const [filterTier, setFilterTier] = useState<1 | 2 | 3 | null>(null);
  const [filterChain, setFilterChain] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  
  // New state for token launch feedback
  const [launchingToken, setLaunchingToken] = useState<string | null>(null);
  const [launchingDex, setLaunchingDex] = useState<string | null>(null);
  const [launchResult, setLaunchResult] = useState<{
    tokenId: string;
    success: boolean;
    message: string;
    icon: string;
  } | null>(null);

  // Save game to localStorage
  useEffect(() => {
    const saveGame = () => {
      try {
        localStorage.setItem('tokenTycoonSave', JSON.stringify(gameState));
      } catch (e) {
        console.error("Error saving game:", e);
      }
    };

    // Save every 10 seconds
    const saveInterval = setInterval(saveGame, 10000);
    
    // Also save when component unmounts
    return () => {
      clearInterval(saveInterval);
      saveGame();
    };
  }, [gameState]);

  // Rotate news headlines
  useEffect(() => {
    const newsInterval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        newsFlash: newsFlashes[Math.floor(Math.random() * newsFlashes.length)]
      }));
    }, 15000);
    
    return () => clearInterval(newsInterval);
  }, []);

  // Game loop
  useEffect(() => {
    const gameLoop = setInterval(() => {
      setGameState(prevState => {
        // Skip game loop if in tutorial
        if (prevState.screen === 'tutorial') return prevState;
        
        const now = Date.now();
        const deltaTime = (now - prevState.lastTick) / 1000; // in seconds
        
        // Auto-click generation
        const autoClickAmount = prevState.autoClickRate * deltaTime;
        
        // Farm yield calculation
        const updatedFarms = prevState.farms.map(farm => {
          if (!farm.owned) return farm;
          
          // Apply yield modifiers
          let yieldMultiplier = 1;
          
          // Apply chain multiplier
          const farmChain = prevState.unlocks.chains.find(c => c.id === farm.chain);
          if (farmChain) {
            yieldMultiplier *= farmChain.tvlMultiplier;
          }
          
          // Apply event modifiers
          prevState.events.forEach(event => {
            if (event.active && event.effect.type === 'yieldBoost') {
              yieldMultiplier *= event.effect.value;
            }
          });
          
          // Apply market sentiment
          if (prevState.marketSentiment === 'bullish') {
            yieldMultiplier *= 1.2;
          } else if (prevState.marketSentiment === 'bearish') {
            yieldMultiplier *= 0.8;
          }
          
          // Calculate new yield
          const baseYield = farm.baseYield * farm.level;
          const newYield = baseYield * yieldMultiplier;
          
          // Auto-harvest if enabled
          let pendingYield = farm.pendingYield + (newYield * deltaTime);
          let harvestedYield = 0;
          
          if (farm.autoHarvestLevel > 0 && pendingYield >= 10) {
            harvestedYield = pendingYield;
            pendingYield = 0;
          }
          
          return {
            ...farm,
            currentYield: newYield,
            pendingYield,
            lastHarvest: now
          };
        });
        
        // Token passive income
        const tokenPassiveIncome = prevState.tokens_launched.reduce((sum, token) => {
          // Apply modifiers
          let incomeMultiplier = 1;
          
          // Apply chain multiplier
          const tokenChain = prevState.unlocks.chains.find(c => c.id === token.chain);
          if (tokenChain) {
            incomeMultiplier *= tokenChain.tvlMultiplier;
          }
          
          // Apply event modifiers
          prevState.events.forEach(event => {
            if (event.active && event.effect.type === 'tokenPriceBoost') {
              incomeMultiplier *= event.effect.value;
            }
          });
          
          // Apply market sentiment
          if (prevState.marketSentiment === 'bullish') {
            incomeMultiplier *= 1.5;
          } else if (prevState.marketSentiment === 'bearish') {
            incomeMultiplier *= 0.7;
          }
          
          return sum + (token.passiveIncome * incomeMultiplier * deltaTime);
        }, 0);
        
        // DEX passive income
        const dexPassiveIncome = prevState.dexes_launched.reduce((sum, dex) => {
          // Apply modifiers
          let incomeMultiplier = 1;
          
          // Apply chain multiplier
          const dexChain = prevState.unlocks.chains.find(c => c.id === dex.chain);
          if (dexChain) {
            incomeMultiplier *= dexChain.tvlMultiplier;
          }
          
          // Apply market sentiment
          if (prevState.marketSentiment === 'bullish') {
            incomeMultiplier *= 1.3;
          } else if (prevState.marketSentiment === 'bearish') {
            incomeMultiplier *= 0.9;
          }
          
          return sum + (dex.tvlBoost * prevState.tvl * 0.01 * incomeMultiplier * deltaTime);
        }, 0);
        
        // Update events
        const updatedEvents = prevState.events.map(event => {
          const timeRemaining = event.duration - (now - event.startTime);
          if (timeRemaining <= 0) {
            return { ...event, active: false };
          }
          return event;
        });
        
        // Random chance for new event
        let newEvents = [...updatedEvents.filter(e => e.active)];
        if (Math.random() < 0.01 && newEvents.length < 2) {
          const newEvent = getRandomEvent();
          
          // Handle hacking attempt
          if (newEvent.effect.type === 'hackingAttempt') {
            // Check if defense is successful
            const defenseSuccessful = Math.random() * 100 < prevState.hackingDefense;
            
            if (defenseSuccessful) {
              // Create notification for successful defense
              const notification: Notification = {
                id: `hacking-defense-${Date.now()}`,
                type: 'security',
                title: 'Hacking Attempt Blocked!',
                message: 'Your security systems successfully blocked a hacking attempt.',
                timestamp: Date.now(),
                read: false
              };
              
              return {
                ...prevState,
                tvl: prevState.tvl + autoClickAmount + tokenPassiveIncome + dexPassiveIncome,
                tokens: prevState.tokens + 0, // No harvested yield during hacking attempt
                lastTick: now,
                farms: updatedFarms,
                events: newEvents,
                notifications: [notification, ...prevState.notifications],
                stats: {
                  ...prevState.stats,
                  totalTVLGenerated: prevState.stats.totalTVLGenerated + autoClickAmount + tokenPassiveIncome + dexPassiveIncome,
                  playTime: prevState.stats.playTime + deltaTime,
                  hackingAttemptsStopped: prevState.stats.hackingAttemptsStopped + 1
                }
              };
            } else {
              // Hacking attempt successful - lose some TVL
              const tvlLoss = prevState.tvl * 0.1; // Lose 10% of TVL
              
              // Create notification for failed defense
              const notification: Notification = {
                id: `hacking-success-${Date.now()}`,
                type: 'security',
                title: 'Hacking Attempt Successful!',
                message: `Your protocol was hacked! You lost ${formatNumber(tvlLoss)} TVL.`,
                timestamp: Date.now(),
                read: false
              };
              
              return {
                ...prevState,
                tvl: Math.max(0, prevState.tvl - tvlLoss + autoClickAmount + tokenPassiveIncome + dexPassiveIncome),
                tokens: prevState.tokens + 0, // No harvested yield during hacking attempt
                lastTick: now,
                farms: updatedFarms,
                events: newEvents,
                notifications: [notification, ...prevState.notifications],
                hackingAttempts: prevState.hackingAttempts + 1,
                stats: {
                  ...prevState.stats,
                  totalTVLGenerated: prevState.stats.totalTVLGenerated + autoClickAmount + tokenPassiveIncome + dexPassiveIncome,
                  playTime: prevState.stats.playTime + deltaTime
                }
              };
            }
          } else {
            newEvents.push(newEvent);
          }
        }
        
        // Check for achievements
        const updatedAchievements = prevState.achievements.map(achievement => {
          if (achievement.unlocked) return achievement;
          
          let requirementMet = false;
          
          switch (achievement.requirement.type) {
            case 'tvl':
              requirementMet = prevState.tvl >= achievement.requirement.value;
              break;
            case 'tokens':
              requirementMet = prevState.tokens >= achievement.requirement.value;
              break;
            case 'dexGold':
              requirementMet = prevState.dexGold >= achievement.requirement.value;
              break;
            case 'tokensLaunched':
              requirementMet = prevState.stats.tokensLaunched >= achievement.requirement.value;
              break;
            case 'dexesLaunched':
              requirementMet = prevState.stats.dexesLaunched >= achievement.requirement.value;
              break;
            case 'clickCount':
              requirementMet = prevState.stats.clickCount >= achievement.requirement.value;
              break;
            case 'prestigeLevel':
              requirementMet = prevState.prestige.level >= achievement.requirement.value;
              break;
            case 'farmsOwned':
              requirementMet = prevState.stats.farmsOwned >= achievement.requirement.value;
              break;
            case 'upgradesPurchased':
              requirementMet = prevState.stats.upgradesPurchased >= achievement.requirement.value;
              break;
            case 'hackingAttempts':
              requirementMet = prevState.stats.hackingAttemptsStopped >= achievement.requirement.value;
              break;
            case 'researchPoints':
              requirementMet = prevState.researchPoints >= achievement.requirement.value;
              break;
          }
          
          if (requirementMet) {
            // Create notification
            const notification: Notification = {
              id: `achievement-${achievement.id}-${Date.now()}`,
              type: 'achievement',
              title: 'Achievement Unlocked!',
              message: `${achievement.name}: ${achievement.description}`,
              timestamp: Date.now(),
              read: false
            };
            
            // Apply reward
            let rewardValue = achievement.reward.value;
            
            return { ...achievement, unlocked: true };
          }
          
          return achievement;
        });
        
        // Update FOMO meter
        let newFomoMeter = prevState.fomoMeter;
        if (Math.random() < 0.1) {
          // Random fluctuation
          newFomoMeter += (Math.random() * 10) - 5;
          // Clamp between 0 and 100
          newFomoMeter = Math.max(0, Math.min(100, newFomoMeter));
        }
        
        // Calculate total yield from farms that were auto-harvested
        const totalHarvestedYield = updatedFarms.reduce((sum, farm) => {
          if (farm.autoHarvestLevel > 0 && farm.pendingYield >= 10) {
            return sum + farm.pendingYield;
          }
          return sum;
        }, 0);
        
        // Update market sentiment (changes every 2-5 minutes)
        let updatedMarketSentiment = prevState.marketSentiment;
        let updatedLastMarketUpdate = prevState.lastMarketUpdate;
        let updatedMarketCycles = prevState.stats.marketCycles;
        
        const marketUpdateInterval = 2 * 60 * 1000 + Math.random() * 3 * 60 * 1000; // 2-5 minutes
        if (now - prevState.lastMarketUpdate > marketUpdateInterval) {
          // Change market sentiment
          const sentiments: ('bearish' | 'neutral' | 'bullish')[] = ['bearish', 'neutral', 'bullish'];
          // Avoid same sentiment twice in a row
          const availableSentiments = sentiments.filter(s => s !== prevState.marketSentiment);
          updatedMarketSentiment = availableSentiments[Math.floor(Math.random() * availableSentiments.length)];
          updatedLastMarketUpdate = now;
          updatedMarketCycles = prevState.stats.marketCycles + 1;
          
          // Create notification
          const notification: Notification = {
            id: `market-${updatedMarketSentiment}-${Date.now()}`,
            type: 'info',
            title: 'Market Sentiment Changed',
            message: `The market has turned ${updatedMarketSentiment}!`,
            timestamp: Date.now(),
            read: false
          };
          
          prevState.notifications.unshift(notification);
        }
        
        // Generate research points if research lab is unlocked
        let newResearchPoints = prevState.researchPoints;
        const researchUpgrade = prevState.upgrades.find(u => u.id === 'research-lab' && u.purchased);
        
        if (researchUpgrade) {
          // Base research generation is 0.1 points per second
          const baseResearch = 0.1 * deltaTime;
          // Apply research multiplier
          const researchGain = baseResearch * prevState.researchMultiplier;
          newResearchPoints += researchGain;
        }
        
        // Update game state
        return {
          ...prevState,
          tvl: prevState.tvl + autoClickAmount + tokenPassiveIncome + dexPassiveIncome,
          tokens: prevState.tokens + totalHarvestedYield,
          lastTick: now,
          farms: updatedFarms,
          events: newEvents,
          achievements: updatedAchievements,
          fomoMeter: newFomoMeter,
          marketSentiment: updatedMarketSentiment,
          lastMarketUpdate: updatedLastMarketUpdate,
          researchPoints: newResearchPoints,
          stats: {
            ...prevState.stats,
            totalTVLGenerated: prevState.stats.totalTVLGenerated + autoClickAmount + tokenPassiveIncome + dexPassiveIncome,
            playTime: prevState.stats.playTime + deltaTime,
            marketCycles: updatedMarketCycles
          }
        };
      });
      
      // Update game time
      setGameTime(prev => prev + 1);
      
      // Update event countdown if there's an active event
      setEventCountdown(prev => {
        const activeEvent = gameState.events.find(e => e.active);
        if (activeEvent) {
          const timeRemaining = activeEvent.duration - (Date.now() - activeEvent.startTime);
          return Math.max(0, Math.floor(timeRemaining / 1000));
        }
        return null;
      });
    }, 100); // 10 times per second
    
    return () => clearInterval(gameLoop);
  }, []);
  
  // Handle click to generate TVL
  const handleClick = () => {
    setGameState(prevState => {
      const clickAmount = prevState.clickPower * prevState.prestige.multiplier;
      
      // Check for first click achievement
      let updatedAchievements = [...prevState.achievements];
      const firstClickAchievement = updatedAchievements.find(a => a.id === 'first-click');
      
      if (firstClickAchievement && !firstClickAchievement.unlocked) {
        updatedAchievements = updatedAchievements.map(a => 
          a.id === 'first-click' 
            ? { ...a, unlocked: true } 
            : a
        );
        
        // Add notification
        const notification: Notification = {
          id: `achievement-first-click-${Date.now()}`,
          type: 'achievement',
          title: 'Achievement Unlocked!',
          message: `${firstClickAchievement.name}: ${firstClickAchievement.description}`,
          timestamp: Date.now(),
          read: false
        };
        
        return {
          ...prevState,
          tvl: prevState.tvl + clickAmount,
          dexGold: prevState.dexGold + firstClickAchievement.reward.value,
          achievements: updatedAchievements,
          notifications: [notification, ...prevState.notifications],
          stats: {
            ...prevState.stats,
            clickCount: prevState.stats.clickCount + 1,
            totalTVLGenerated: prevState.stats.totalTVLGenerated + clickAmount,
            achievementsUnlocked: prevState.stats.achievementsUnlocked + 1
          }
        };
      }
      
      return {
        ...prevState,
        tvl: prevState.tvl + clickAmount,
        stats: {
          ...prevState.stats,
          clickCount: prevState.stats.clickCount + 1,
          totalTVLGenerated: prevState.stats.totalTVLGenerated + clickAmount
        }
      };
    });
  };
  
  // Handle farm harvest
  const handleHarvest = (farmId: string) => {
    setGameState(prevState => {
      const farm = prevState.farms.find(f => f.id === farmId);
      if (!farm) return prevState;
      
      return {
        ...prevState,
        tokens: prevState.tokens + farm.pendingYield,
        farms: prevState.farms.map(f => 
          f.id === farmId ? { ...f, pendingYield: 0, lastHarvest: Date.now() } : f
        )
      };
    });
  };
  
  // Handle farm upgrade
  const handleUpgradeFarm = (farmId: string) => {
    setGameState(prevState => {
      const farm = prevState.farms.find(f => f.id === farmId);
      if (!farm) return prevState;
      
      const upgradeCost = farm.cost * Math.pow(1.5, farm.level);
      if (prevState.tokens < upgradeCost) return prevState;
      
      return {
        ...prevState,
        tokens: prevState.tokens - upgradeCost,
        farms: prevState.farms.map(f => 
          f.id === farmId ? { 
            ...f, 
            level: f.level + 1,
            cost: f.cost * 1.5
          } : f
        )
      };
    });
  };
  
  // Handle farm purchase
  const handleBuyFarm = (farmId: string) => {
    setGameState(prevState => {
      const farm = prevState.farms.find(f => f.id === farmId);
      if (!farm || farm.owned || prevState.tokens < farm.cost) return prevState;
      
      return {
        ...prevState,
        tokens: prevState.tokens - farm.cost,
        farms: prevState.farms.map(f => 
          f.id === farmId ? { ...f, owned: true } : f
        ),
        stats: {
          ...prevState.stats,
          farmsOwned: prevState.stats.farmsOwned + 1
        }
      };
    });
  };
  
  // Handle token launch
  const handleLaunchToken = (tokenId: string) => {
    // Set the launching token to show loading state
    setLaunchingToken(tokenId);
    
    // Simulate network delay for better feedback
    setTimeout(() => {
      setGameState(prevState => {
        const token = initialTokens.find(t => t.id === tokenId);
        if (!token || prevState.dexGold < token.launchCost) {
          setLaunchingToken(null);
          return prevState;
        }
        
        // Apply token launch discount if upgrade purchased
        const tokenLaunchDiscount = prevState.upgrades.find(u => 
          u.purchased && u.effect.type === 'tokenLaunchDiscount'
        );
        
        const discountMultiplier = tokenLaunchDiscount ? tokenLaunchDiscount.effect.value : 1;
        const finalCost = token.launchCost * discountMultiplier;
        
        // Check for rug pull risk
        let rugPulled = false;
        let rugPullRisk = token.rugPullRisk;
        
        // Apply rug pull protection from upgrades
        const rugPullProtection = prevState.upgrades.filter(u => 
          u.purchased && u.effect.type === 'rugPullProtection'
        );
        
        rugPullProtection.forEach(upgrade => {
          rugPullRisk *= upgrade.effect.value;
        });
        
        // Apply event modifiers
        prevState.events.forEach(event => {
          if (event.active && event.effect.type === 'rugPullRisk') {
            rugPullRisk *= event.effect.value;
          }
        });
        
        // Apply market sentiment
        if (prevState.marketSentiment === 'bearish') {
          rugPullRisk *= 1.5; // Higher risk during bear markets
        } else if (prevState.marketSentiment === 'bullish') {
          rugPullRisk *= 0.7; // Lower risk during bull markets
        }
        
        if (Math.random() < rugPullRisk) {
          rugPulled = true;
          
          // Create notification
          const notification: Notification = {
            id: `rugpull-${token.id}-${Date.now()}`,
            type: 'warning',
            title: 'Rug Pull!',
            message: `Your ${token.name} token was a rug pull! You lost your investment.`,
            timestamp: Date.now(),
            read: false
          };
          
          // Set launch result for feedback
          setLaunchResult({
            tokenId: token.id,
            success: false,
            message: `Rug Pull! Your ${token.name} token was a scam!`,
            icon: '❌'
          });
          
          setTimeout(() => {
            setLaunchResult(null);
            setLaunchingToken(null);
          }, 3000);
          
          return {
            ...prevState,
            dexGold: prevState.dexGold - finalCost,
            notifications: [notification, ...prevState.notifications],
            stats: {
              ...prevState.stats,
              rugPulls: prevState.stats.rugPulls + 1
            }
          };
        }
        
        // Successfully launched token
        const newToken = {
          ...token,
          owned: true,
          chain: prevState.activeChain.id
        };
        
        // Create notification
        const notification: Notification = {
          id: `token-launch-${token.id}-${Date.now()}`,
          type: 'info',
          title: 'Token Launched!',
          message: `You successfully launched ${token.name} (${token.symbol})!`,
          timestamp: Date.now(),
          read: false
        };
        
        // Set launch result for feedback
        setLaunchResult({
          tokenId: token.id,
          success: true,
          message: `Success! ${token.name} (${token.symbol}) launched!`,
          icon: '🚀'
        });
        
        setTimeout(() => {
          setLaunchResult(null);
          setLaunchingToken(null);
        }, 3000);
        
        // Check for token launcher achievement
        let updatedAchievements = [...prevState.achievements];
        const tokenLauncherAchievement = updatedAchievements.find(a => a.id === 'token-launcher');
        
        if (tokenLauncherAchievement && !tokenLauncherAchievement.unlocked && prevState.stats.tokensLaunched === 0) {
          updatedAchievements = updatedAchievements.map(a => 
            a.id === 'token-launcher' 
              ? { ...a, unlocked: true } 
              : a
          );
          
          // Add achievement notification
          const achievementNotification: Notification = {
            id: `achievement-token-launcher-${Date.now()}`,
            type: 'achievement',
            title: 'Achievement Unlocked!',
            message: `${tokenLauncherAchievement.name}: ${tokenLauncherAchievement.description}`,
            timestamp: Date.now(),
            read: false
          };
          
          return {
            ...prevState,
            dexGold: prevState.dexGold - finalCost + tokenLauncherAchievement.reward.value,
            tokens_launched: [...prevState.tokens_launched, newToken],
            notifications: [notification, achievementNotification, ...prevState.notifications],
            achievements: updatedAchievements,
            stats: {
              ...prevState.stats,
              tokensLaunched: prevState.stats.tokensLaunched + 1,
              achievementsUnlocked: prevState.stats.achievementsUnlocked + 1
            }
          };
        }
        
        // Check for token empire achievement
        const tokenEmpireAchievement = updatedAchievements.find(a => a.id === 'token-empire');
        if (tokenEmpireAchievement && !tokenEmpireAchievement.unlocked && prevState.stats.tokensLaunched === 4) {
          updatedAchievements = updatedAchievements.map(a => 
            a.id === 'token-empire' 
              ? { ...a, unlocked: true } 
              : a
          );
          
          // Add achievement notification
          const achievementNotification: Notification = {
            id: `achievement-token-empire-${Date.now()}`,
            type: 'achievement',
            title: 'Achievement Unlocked!',
            message: `${tokenEmpireAchievement.name}: ${tokenEmpireAchievement.description}`,
            timestamp: Date.now(),
            read: false
          };
          
          return {
            ...prevState,
            dexGold: prevState.dexGold - finalCost + tokenEmpireAchievement.reward.value,
            tokens_launched: [...prevState.tokens_launched, newToken],
            notifications: [notification, achievementNotification, ...prevState.notifications],
            achievements: updatedAchievements,
            stats: {
              ...prevState.stats,
              tokensLaunched: prevState.stats.tokensLaunched + 1,
              achievementsUnlocked: prevState.stats.achievementsUnlocked + 1
            }
          };
        }
        
        // Check for token mogul achievement
        const tokenMogulAchievement = updatedAchievements.find(a => a.id === 'token-mogul');
        if (tokenMogulAchievement && !tokenMogulAchievement.unlocked && prevState.stats.tokensLaunched === 9) {
          updatedAchievements = updatedAchievements.map(a => 
            a.id === 'token-mogul' 
              ? { ...a, unlocked: true } 
              : a
          );
          
          // Add achievement notification
          const achievementNotification: Notification = {
            id: `achievement-token-mogul-${Date.now()}`,
            type: 'achievement',
            title: 'Achievement Unlocked!',
            message: `${tokenMogulAchievement.name}: ${tokenMogulAchievement.description}`,
            timestamp: Date.now(),
            read: false
          };
          
          return {
            ...prevState,
            dexGold: prevState.dexGold - finalCost + tokenMogulAchievement.reward.value,
            tokens_launched: [...prevState.tokens_launched, newToken],
            notifications: [notification, achievementNotification, ...prevState.notifications],
            achievements: updatedAchievements,
            stats: {
              ...prevState.stats,
              tokensLaunched: prevState.stats.tokensLaunched + 1,
              achievementsUnlocked: prevState.stats.achievementsUnlocked + 1
            }
          };
        }
        
        return {
          ...prevState,
          dexGold: prevState.dexGold - finalCost,
          tokens_launched: [...prevState.tokens_launched, newToken],
          notifications: [notification, ...prevState.notifications],
          stats: {
            ...prevState.stats,
            tokensLaunched: prevState.stats.tokensLaunched + 1
          }
        };
      });
    }, 1500); // 1.5 second delay for feedback
  };
  
  // Handle DEX launch
  const handleLaunchDex = (dexId: string) => {
    // Set the launching DEX to show loading state
    setLaunchingDex(dexId);
    
    // Simulate network delay for better feedback
    setTimeout(() => {
      setGameState(prevState => {
        const dex = initialDexes.find(d => d.id === dexId);
        if (!dex || prevState.dexGold < dex.launchCost) {
          setLaunchingDex(null);
          return prevState;
        }
        
        // Apply DEX launch boost if upgrade purchased
        const dexLaunchBoost = prevState.upgrades.find(u => 
          u.purchased && u.effect.type === 'dexLaunchBoost'
        );
        
        const boostMultiplier = dexLaunchBoost ? dexLaunchBoost.effect.value : 1;
        const boostedDex = {
          ...dex,
          tvlBoost: dex.tvlBoost * boostMultiplier,
          owned: true,
          chain: prevState.activeChain.id
        };
        
        // Create notification
        const notification: Notification = {
          id: `dex-launch-${dex.id}-${Date.now()}`,
          type: 'info',
          title: 'DEX Launched!',
          message: `You successfully launched ${dex.name}!`,
          timestamp: Date.now(),
          read: false
        };
        
        // Set launch result for feedback
        setLaunchResult({
          tokenId: dex.id,
          success: true,
          message: `Success! ${dex.name} DEX launched!`,
          icon: dex.icon
        });
        
        setTimeout(() => {
          setLaunchResult(null);
          setLaunchingDex(null);
        }, 3000);
        
        // Check for DEX creator achievement
        let updatedAchievements = [...prevState.achievements];
        const dexCreatorAchievement = updatedAchievements.find(a => a.id === 'dex-creator');
        
        if (dexCreatorAchievement && !dexCreatorAchievement.unlocked && prevState.stats.dexesLaunched === 0) {
          updatedAchievements = updatedAchievements.map(a => 
            a.id === 'dex-creator' 
              ? { ...a, unlocked: true } 
              : a
          );
          
          // Add achievement notification
          const achievementNotification: Notification = {
            id: `achievement-dex-creator-${Date.now()}`,
            type: 'achievement',
            title: 'Achievement Unlocked!',
            message: `${dexCreatorAchievement.name}: ${dexCreatorAchievement.description}`,
            timestamp: Date.now(),
            read: false
          };
          
          // Apply yield multiplier reward
          const updatedFarms = prevState.farms.map(farm => ({
            ...farm,
            currentYield: farm.currentYield * dexCreatorAchievement.reward.value
          }));
          
          return {
            ...prevState,
            dexGold: prevState.dexGold - dex.launchCost,
            dexes_launched: [...prevState.dexes_launched, boostedDex],
            farms: updatedFarms,
            notifications: [notification, achievementNotification, ...prevState.notifications],
            achievements: updatedAchievements,
            stats: {
              ...prevState.stats,
              dexesLaunched: prevState.stats.dexesLaunched + 1,
              achievementsUnlocked: prevState.stats.achievementsUnlocked + 1
            }
          };
        }
        
        // Check for DEX network achievement
        const dexNetworkAchievement = updatedAchievements.find(a => a.id === 'dex-network');
        if (dexNetworkAchievement && !dexNetworkAchievement.unlocked && prevState.stats.dexesLaunched === 2) {
          updatedAchievements = updatedAchievements.map(a => 
            a.id === 'dex-network' 
              ? { ...a, unlocked: true } 
              : a
          );
          
          // Add achievement notification
          const achievementNotification: Notification = {
            id: `achievement-dex-network-${Date.now()}`,
            type: 'achievement',
            title: 'Achievement Unlocked!',
            message: `${dexNetworkAchievement.name}: ${dexNetworkAchievement.description}`,
            timestamp: Date.now(),
            read: false
          };
          
          // Apply yield multiplier reward
          const updatedFarms = prevState.farms.map(farm => ({
            ...farm,
            currentYield: farm.currentYield * dexNetworkAchievement.reward.value
          }));
          
          return {
            ...prevState,
            dexGold: prevState.dexGold - dex.launchCost,
            dexes_launched: [...prevState.dexes_launched, boostedDex],
            farms: updatedFarms,
            notifications: [notification, achievementNotification, ...prevState.notifications],
            achievements: updatedAchievements,
            stats: {
              ...prevState.stats,
              dexesLaunched: prevState.stats.dexesLaunched + 1,
              achievementsUnlocked: prevState.stats.achievementsUnlocked + 1
            }
          };
        }
        
        // Check for DEX monopoly achievement
        const dexMonopolyAchievement = updatedAchievements.find(a => a.id === 'dex-monopoly');
        if (dexMonopolyAchievement && !dexMonopolyAchievement.unlocked && prevState.stats.dexesLaunched === 4) {
          updatedAchievements = updatedAchievements.map(a => 
            a.id === 'dex-monopoly' 
              ? { ...a, unlocked: true } 
              : a
          );
          
          // Add achievement notification
          const achievementNotification: Notification = {
            id: `achievement-dex-monopoly-${Date.now()}`,
            type: 'achievement',
            title: 'Achievement Unlocked!',
            message: `${dexMonopolyAchievement.name}: ${dexMonopolyAchievement.description}`,
            timestamp: Date.now(),
            read: false
          };
          
          // Apply yield multiplier reward
          const updatedFarms = prevState.farms.map(farm => ({
            ...farm,
            currentYield: farm.currentYield * dexMonopolyAchievement.reward.value
          }));
          
          return {
            ...prevState,
            dexGold: prevState.dexGold - dex.launchCost,
            dexes_launched: [...prevState.dexes_launched, boostedDex],
            farms: updatedFarms,
            notifications: [notification, achievementNotification, ...prevState.notifications],
            achievements: updatedAchievements,
            stats: {
              ...prevState.stats,
              dexesLaunched: prevState.stats.dexesLaunched + 1,
              achievementsUnlocked: prevState.stats.achievementsUnlocked + 1
            }
          };
        }
        
        return {
          ...prevState,
          dexGold: prevState.dexGold - dex.launchCost,
          dexes_launched: [...prevState.dexes_launched, boostedDex],
          notifications: [notification, ...prevState.notifications],
          stats: {
            ...prevState.stats,
            dexesLaunched: prevState.stats.dexesLaunched + 1
          }
        };
      });
    }, 1500); // 1.5 second delay for feedback
  };
  
  // Handle upgrade purchase
  const handleBuyUpgrade = (upgradeId: string) => {
    setGameState(prevState => {
      const upgrade = prevState.upgrades.find(u => u.id === upgradeId);
      if (!upgrade || upgrade.purchased || prevState.dexGold < upgrade.cost) return prevState;
      
      let updatedState = {
        ...prevState,
        dexGold: prevState.dexGold - upgrade.cost,
        upgrades: prevState.upgrades.map(u => 
          u.id === upgradeId ? { ...u, purchased: true } : u
        ),
        stats: {
          ...prevState.stats,
          upgradesPurchased: prevState.stats.upgradesPurchased + 1
        }
      };
      
      // Apply upgrade effect
      switch (upgrade.effect.type) {
        case 'clickPower':
          updatedState.clickPower *= upgrade.effect.value;
          break;
        case 'autoClickRate':
          updatedState.autoClickRate += upgrade.effect.value;
          break;
        case 'unlockChain':
          if (upgrade.effect.target) {
            updatedState.unlocks.chains = updatedState.unlocks.chains.map(chain => 
              chain.id === upgrade.effect.target ? { ...chain, unlocked: true } : chain
            );
          }
          break;
        case 'unlockFeature':
          if (upgrade.effect.target) {
            updatedState.unlocks.features = updatedState.unlocks.features.map(feature => 
              feature.id === upgrade.effect.target ? { ...feature, unlocked: true } : feature
            );
          }
          break;
        case 'hackingDefense':
          updatedState.hackingDefense += upgrade.effect.value;
          break;
        case 'researchMultiplier':
          updatedState.researchMultiplier *= upgrade.effect.value;
          break;
      }
      
      // Create notification
      const notification: Notification = {
        id: `upgrade-${upgrade.id}-${Date.now()}`,
        type: 'info',
        title: 'Upgrade Purchased!',
        message: `You purchased ${upgrade.name}: ${upgrade.description}`,
        timestamp: Date.now(),
        read: false
      };
      
      updatedState.notifications = [notification, ...updatedState.notifications];
      
      // Check for upgrade master achievement
      if (updatedState.stats.upgradesPurchased === 10) {
        const upgradeMasterAchievement = updatedState.achievements.find(a => a.id === 'upgrade-master');
        
        if (upgradeMasterAchievement && !upgradeMasterAchievement.unlocked) {
          const updatedAchievements = updatedState.achievements.map(a => 
            a.id === 'upgrade-master' 
              ? { ...a, unlocked: true } 
              : a
          );
          
          // Add achievement notification
          const achievementNotification: Notification = {
            id: `achievement-upgrade-master-${Date.now()}`,
            type: 'achievement',
            title: 'Achievement Unlocked!',
            message: `${upgradeMasterAchievement.name}: ${upgradeMasterAchievement.description}`,
            timestamp: Date.now(),
            read: false
          };
          
          updatedState.achievements = updatedAchievements;
          updatedState.notifications = [achievementNotification, ...updatedState.notifications];
          updatedState.dexGold += upgradeMasterAchievement.reward.value;
          updatedState.stats.achievementsUnlocked += 1;
        }
      }
      
      return updatedState;
    });
  };
  
  // Handle prestige
  const handlePrestige = () => {
    setGameState(prevState => {
      if (prevState.tvl < 1000000) return prevState;
      
      const newPrestigeLevel = prevState.prestige.level + 1;
      const newMultiplier = 1 + (newPrestigeLevel * 0.5);
      
      // Unlock prestige upgrades
      const updatedUpgrades = prevState.upgrades.map(upgrade => {
        if (upgrade.category === 'prestige' && upgrade.requiredPrestigeLevel && upgrade.requiredPrestigeLevel <= newPrestigeLevel) {
          return { ...upgrade, visible: true };
        }
        return upgrade;
      });
      
      // Unlock chains based on prestige level
      const updatedChains = prevState.unlocks.chains.map(chain => {
        if (chain.requiredPrestigeLevel <= newPrestigeLevel) {
          return { ...chain, unlocked: true };
        }
        return chain;
      });
      
      // Create notification
      const notification: Notification = {
        id: `prestige-${Date.now()}`,
        type: 'achievement',
        title: 'Prestige Achieved!',
        message: `You've prestiged to level ${newPrestigeLevel}! Your multiplier is now ${newMultiplier}x.`,
        timestamp: Date.now(),
        read: false
      };
      
      // Check for prestige achievement
      let updatedAchievements = [...initialGameState.achievements];
      const prestigeAchievement = prevState.achievements.find(a => a.id === 'prestige-1');
      
      if (prestigeAchievement && !prestigeAchievement.unlocked && newPrestigeLevel === 1) {
        updatedAchievements = updatedAchievements.map(a => 
          a.id === 'prestige-1' 
            ? { ...a, unlocked: true } 
            : a
        );
        
        // Add achievement notification
        const achievementNotification: Notification = {
          id: `achievement-prestige-1-${Date.now()}`,
          type: 'achievement',
          title: 'Achievement Unlocked!',
          message: `${prestigeAchievement.name}: ${prestigeAchievement.description}`,
          timestamp: Date.now(),
          read: false
        };
        
        return {
          ...initialGameState,
          screen: 'game',
          prestige: {
            level: newPrestigeLevel,
            multiplier: newMultiplier,
            pendingReset: false
          },
          clickPower: initialGameState.clickPower * prestigeAchievement.reward.value,
          dexGold: initialGameState.dexGold + 100, // Bonus DEXGOLD for prestiging
          upgrades: updatedUpgrades,
          achievements: updatedAchievements,
          unlocks: {
            ...initialGameState.unlocks,
            chains: updatedChains
          },
          notifications: [notification, achievementNotification],
          stats: {
            ...initialGameState.stats,
            prestigeCount: prevState.stats.prestigeCount + 1,
            achievementsUnlocked: 1
          },
          tutorialCompleted: true
        };
      }
      
      // Check for prestige master achievement
      const prestigeMasterAchievement = prevState.achievements.find(a => a.id === 'prestige-3');
      if (prestigeMasterAchievement && !prestigeMasterAchievement.unlocked && newPrestigeLevel === 3) {
        updatedAchievements = updatedAchievements.map(a => 
          a.id === 'prestige-3' 
            ? { ...a, unlocked: true } 
            : a
        );
        
        // Add achievement notification
        const achievementNotification: Notification = {
          id: `achievement-prestige-3-${Date.now()}`,
          type: 'achievement',
          title: 'Achievement Unlocked!',
          message: `${prestigeMasterAchievement.name}: ${prestigeMasterAchievement.description}`,
          timestamp: Date.now(),
          read: false
        };
        
        return {
          ...initialGameState,
          screen: 'game',
          prestige: {
            level: newPrestigeLevel,
            multiplier: newMultiplier,
            pendingReset: false
          },
          clickPower: initialGameState.clickPower * prestigeMasterAchievement.reward.value,
          dexGold: initialGameState.dexGold + 500, // Bigger bonus for prestige 3
          upgrades: updatedUpgrades,
          achievements: updatedAchievements,
          unlocks: {
            ...initialGameState.unlocks,
            chains: updatedChains
          },
          notifications: [notification, achievementNotification],
          stats: {
            ...initialGameState.stats,
            prestigeCount: prevState.stats.prestigeCount + 1,
            achievementsUnlocked: 1
          },
          tutorialCompleted: true
        };
      }
      
      return {
        ...initialGameState,
        screen: 'game',
        prestige: {
          level: newPrestigeLevel,
          multiplier: newMultiplier,
          pendingReset: false
        },
        dexGold: initialGameState.dexGold + 100 * newPrestigeLevel, // Bonus DEXGOLD scales with prestige level
        upgrades: updatedUpgrades,
        unlocks: {
          ...initialGameState.unlocks,
          chains: updatedChains
        },
        notifications: [notification],
        stats: {
          ...initialGameState.stats,
          prestigeCount: prevState.stats.prestigeCount + 1
        },
        tutorialCompleted: true
      };
    });
  };
  
  // Handle chain selection
  const handleSelectChain = (chainId: string) => {
    setGameState(prevState => {
      const chain = prevState.unlocks.chains.find(c => c.id === chainId);
      if (!chain || !chain.unlocked) return prevState;
      
      return {
        ...prevState,
        activeChain: chain,
        showChainSelector: false
      };
    });
  };
  
  // Convert TVL to tokens
  const handleConvertTVL = () => {
    setGameState(prevState => {
      if (prevState.tvl < 100) return prevState;
      
      const conversionRate = 0.1; // 10:1 ratio
      const tokensGained = prevState.tvl * conversionRate;
      
      return {
        ...prevState,
        tvl: 0,
        tokens: prevState.tokens + tokensGained
      };
    });
  };
  
  // Convert tokens to DexGold
  const handleConvertTokens = () => {
    setGameState(prevState => {
      if (prevState.tokens < 100) return prevState;
      
      const conversionRate = 0.01; // 100:1 ratio
      const dexGoldGained = prevState.tokens * conversionRate;
      
      return {
        ...prevState,
        tokens: 0,
        dexGold: prevState.dexGold + dexGoldGained,
        stats: {
          ...prevState.stats,
          totalDexGoldEarned: prevState.stats.totalDexGoldEarned + dexGoldGained
        }
      };
    });
  };
  
  // Start game
  const handleStartGame = () => {
    setGameState(prevState => ({
      ...prevState,
      screen: prevState.tutorialCompleted ? 'game' : 'tutorial'
    }));
  };
  
  // Start tutorial
  const handleStartTutorial = () => {
    setGameState(prevState => ({
      ...prevState,
      screen: 'tutorial',
      tutorialStep: 0
    }));
  };
  
  // Next tutorial step
  const handleNextTutorialStep = () => {
    setGameState(prevState => {
      if (prevState.tutorialStep >= tutorialSteps.length - 1) {
        return {
          ...prevState,
          screen: 'game',
          tutorialCompleted: true
        };
      }
      
      return {
        ...prevState,
        tutorialStep: prevState.tutorialStep + 1
      };
    });
  };
  
  // Skip tutorial
  const handleSkipTutorial = () => {
    setGameState(prevState => ({
      ...prevState,
      screen: 'game',
      tutorialCompleted: true
    }));
  };
  
  // Reset game
  const handleResetGame = () => {
    localStorage.removeItem('tokenTycoonSave');
    setGameState(initialGameState);
  };
  
  // Open modal
  const openModal = (title: string, content: React.ReactNode) => {
    setModalContent({ title, content });
    setIsModalOpen(true);
  };
  
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };
  
  // Get market sentiment icon and color
  const getMarketSentimentInfo = () => {
    switch (gameState.marketSentiment) {
      case 'bullish':
        return { icon: <TrendingUp className="w-4 h-4 text-green-400" />, color: 'text-green-400', description: 'Bullish market: Higher token income, lower rug pull risk' };
      case 'bearish':
        return { icon: <TrendingDown className="w-4 h-4 text-red-400" />, color: 'text-red-400', description: 'Bearish market: Lower token income, higher rug pull risk' };
      default:
        return { icon: <ArrowRight className="w-4 h-4 text-white/60" />, color: 'text-white/60', description: 'Neutral market: Normal conditions' };
    }
  };
  
  // Render farm card
  const renderFarmCard = (farm: Farm) => {
    const isActiveChain = farm.chain === gameState.activeChain.id;
    
    return (
      <div 
        key={farm.id}
        className={`p-4 rounded-xl ${
          isActiveChain 
            ? 'bg-white/5 hover:bg-white/10' 
            : 'bg-white/5 opacity-50'
        } transition-all`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-2xl">{farm.icon}</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{farm.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  farm.tier === 1 ? 'bg-blue-500/20 text-blue-400' :
                  farm.tier === 2 ? 'bg-purple-500/20 text-purple-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  Tier {farm.tier}
                </span>
              </div>
              <div className="text-xs text-white/60">
                Level {farm.level} • {formatNumber(farm.currentYield)}/s
              </div>
            </div>
          </div>
          
          {!farm.owned ? (
            <button
              onClick={() => handleBuyFarm(farm.id)}
              disabled={gameState.tokens < farm.cost || !isActiveChain}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                gameState.tokens >= farm.cost && isActiveChain
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-white/10 cursor-not-allowed'
              } transition-colors`}
            >
              Buy for {formatNumber(farm.cost)} Tokens
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleHarvest(farm.id)}
                disabled={farm.pendingYield < 1}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  farm.pendingYield >= 1
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-white/10 cursor-not-allowed'
                } transition-colors`}
              >
                Harvest {formatNumber(farm.pendingYield)}
              </button>
              
              <button
                onClick={() => handleUpgradeFarm(farm.id)}
                disabled={gameState.tokens < farm.cost * Math.pow(1.5, farm.level)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  gameState.tokens >= farm.cost * Math.pow(1.5, farm.level)
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-white/10 cursor-not-allowed'
                } transition-colors`}
              >
                Upgrade ({formatNumber(farm.cost * Math.pow(1.5, farm.level))})
              </button>
            </div>
          )}
        </div>
        
        <div className="text-xs text-white/60 mb-2">{farm.description}</div>
        
        {farm.owned && (
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/60">Pending Yield</span>
              <span>{formatNumber(farm.pendingYield)} Tokens</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${Math.min(100, (farm.pendingYield / 100) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render token card
  const renderTokenCard = (token: Token) => {
    const isActiveChain = token.chain === gameState.activeChain.id;
    const isLaunching = launchingToken === token.id;
    const showLaunchResult = launchResult && launchResult.tokenId === token.id;
    
    return (
      <div 
        key={token.id}
        className={`p-4 rounded-xl ${
          token.owned
            ? 'bg-white/5 hover:bg-white/10'
            : isActiveChain
              ? 'bg-white/5 hover:bg-white/10 cursor-pointer'
              : 'bg-white/5 opacity-50'
        } transition-all relative`}
        onClick={() => !token.owned && isActiveChain && !isLaunching && !showLaunchResult && handleLaunchToken(token.id)}
      >
        {/* Launch Result Overlay */}
        {showLaunchResult && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl z-10 animate-fade-in">
            <div className="text-center">
              <div className="text-4xl mb-2">{launchResult.icon}</div>
              <div className={`text-lg font-bold ${launchResult.success ? 'text-green-400' : 'text-red-400'}`}>
                {launchResult.success ? 'Success!' : 'Failed!'}
              </div>
              <div className="text-sm text-white/80 mt-1">{launchResult.message}</div>
            </div>
          </div>
        )}
        
        {/* Loading Overlay */}
        {isLaunching && !showLaunchResult && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl z-10">
            <div className="text-center">
              <Loader className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
              <div className="text-sm text-white/80">Launching token...</div>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="text-2xl">{token.icon}</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{token.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  token.tier === 1 ? 'bg-blue-500/20 text-blue-400' :
                  token.tier === 2 ? 'bg-purple-500/20 text-purple-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  Tier {token.tier}
                </span>
              </div>
              <div className="text-xs text-white/60">{token.symbol}</div>
            </div>
          </div>
          
          {token.owned ? (
            <div className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs">
              Launched
            </div>
          ) : (
            <div className="text-right">
              <div className="text-sm font-medium">
                {formatNumber(token.launchCost)} DEXGOLD
              </div>
              <div className="text-xs text-white/60">
                to launch
              </div>
            </div>
          )}
        </div>
        
        <div className="text-xs text-white/60 mb-2">{token.description}</div>
        
        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="text-xs text-white/60">Price</div>
            <div>${formatNumber(token.price)}</div>
          </div>
          <div>
            <div className="text-xs text-white/60">Market Cap</div>
            <div>${formatNumber(token.marketCap)}</div>
          </div>
          <div>
            <div className="text-xs text-white/60">Passive</div>
            <div className="text-green-400">+{formatNumber(token.passiveIncome)}/s</div>
          </div>
        </div>
        
        {token.owned && (
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/60">Viral Factor</span>
              <span className="text-blue-400">{(token.viralFactor * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${token.viralFactor * 100}%` }}
              />
            </div>
          </div>
        )}
        
        {!token.owned && (
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/60">Rug Pull Risk</span>
              <span className="text-red-400">{(token.rugPullRisk * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all"
                style={{ width: `${token.rugPullRisk * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render DEX card
  const renderDexCard = (dex: Dex) => {
    const isActiveChain = dex.chain === gameState.activeChain.id;
    const isLaunching = launchingDex === dex.id;
    const showLaunchResult = launchResult && launchResult.tokenId === dex.id;
    
    return (
      <div 
        key={dex.id}
        className={`p-4 rounded-xl ${
          dex.owned
            ? 'bg-white/5 hover:bg-white/10'
            : isActiveChain
              ? 'bg-white/5 hover:bg-white/10 cursor-pointer'
              : 'bg-white/5 opacity-50'
        } transition-all relative`}
        onClick={() => !dex.owned && isActiveChain && !isLaunching && !showLaunchResult && handleLaunchDex(dex.id)}
      >
        {/* Launch Result Overlay */}
        {showLaunchResult && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl z-10 animate-fade-in">
            <div className="text-center">
              <div className="text-4xl mb-2">{launchResult.icon}</div>
              <div className="text-lg font-bold text-green-400">Success!</div>
              <div className="text-sm text-white/80 mt-1">{launchResult.message}</div>
            </div>
          </div>
        )}
        
        {/* Loading Overlay */}
        {isLaunching && !showLaunchResult && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl z-10">
            <div className="text-center">
              <Loader className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
              <div className="text-sm text-white/80">Launching DEX...</div>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="text-2xl">{dex.icon}</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{dex.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  dex.tier === 1 ? 'bg-blue-500/20 text-blue-400' :
                  dex.tier === 2 ? 'bg-purple-500/20 text-purple-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  Tier {dex.tier}
                </span>
              </div>
              <div className="text-xs text-white/60">DEX</div>
            </div>
          </div>
          
          {dex.owned ? (
            <div className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs">
              Launched
            </div>
          ) : (
            <div className="text-right">
              <div className="text-sm font-medium">
                {formatNumber(dex.launchCost)} DEXGOLD
              </div>
              <div className="text-xs text-white/60">
                to launch
              </div>
            </div>
          )}
        </div>
        
        <div className="text-xs text-white/60 mb-2">{dex.description}</div>
        
        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="text-xs text-white/60">TVL Boost</div>
            <div className="text-green-400">+{((dex.tvlBoost - 1) * 100).toFixed(0)}%</div>
          </div>
          <div>
            <div className="text-xs text-white/60">Fee Multiplier</div>
            <div className="text-blue-400">{dex.feeMultiplier.toFixed(1)}x</div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render upgrade card
  const renderUpgradeCard = (upgrade: Upgrade) => {
    if (!upgrade.visible) return null;
    
    // Determine icon based on upgrade type
    let iconComponent;
    switch (upgrade.effect.type) {
      case 'clickPower':
        iconComponent = <Zap className="w-5 h-5" />;
        break;
      case 'autoClickRate':
        iconComponent = <RefreshCw className="w-5 h-5" />;
        break;
      case 'yieldMultiplier':
        iconComponent = <TrendingUp className="w-5 h-5" />;
        break;
      case 'tokenLaunchDiscount':
        iconComponent = <Coins className="w-5 h-5" />;
        break;
      case 'dexLaunchBoost':
        iconComponent = <BarChart2 className="w-5 h-5" />;
        break;
      case 'unlockChain':
        iconComponent = <Globe className="w-5 h-5" />;
        break;
      case 'unlockFeature':
        iconComponent = <MessageSquare className="w-5 h-5" />;
        break;
      case 'rugPullProtection':
        iconComponent = <Shield className="w-5 h-5" />;
        break;
      case 'marketSentimentBoost':
        iconComponent = <TrendingUp className="w-5 h-5" />;
        break;
      case 'hackingDefense':
        iconComponent = <Shield className="w-5 h-5" />;
        break;
      case 'researchMultiplier':
        iconComponent = <Cpu className="w-5 h-5" />;
        break;
      default:
        iconComponent = <Settings className="w-5 h-5" />;
    }
    
    return (
      <div 
        key={upgrade.id}
        className={`p-4 rounded-xl ${
          upgrade.purchased
            ? 'bg-green-500/20'
            : gameState.dexGold >= upgrade.cost
              ? 'bg-white/5 hover:bg-white/10 cursor-pointer'
              : 'bg-white/5 opacity-50'
        } transition-all`}
        onClick={() => !upgrade.purchased && gameState.dexGold >= upgrade.cost && handleBuyUpgrade(upgrade.id)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-lg ${
              upgrade.purchased ? 'bg-green-500/20' : 'bg-white/10'
            } flex items-center justify-center`}>
              {iconComponent}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{upgrade.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  upgrade.tier === 1 ? 'bg-blue-500/20 text-blue-400' :
                  upgrade.tier === 2 ? 'bg-purple-500/20 text-purple-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  Tier {upgrade.tier}
                </span>
              </div>
              <div className="text-xs text-white/60">{upgrade.description}</div>
            </div>
          </div>
          
          {upgrade.purchased ? (
            <div className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs">
              Purchased
            </div>
          ) : (
            <div className="text-right">
              <div className="text-sm font-medium">
                {formatNumber(upgrade.cost)} DEXGOLD
              </div>
            </div>
          )}
        </div>
        
        {upgrade.category === 'prestige' && (
          <div className="mt-2 text-xs text-yellow-400">
            Prestige Upgrade (Level {upgrade.requiredPrestigeLevel})
          </div>
        )}
      </div>
    );
  };
  
  // Render achievement card
  const renderAchievementCard = (achievement: Achievement) => {
    return (
      <div 
        key={achievement.id}
        className={`p-4 rounded-xl ${
          achievement.unlocked
            ? 'bg-green-500/20'
            : 'bg-white/5 opacity-70'
        } transition-all`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg ${
            achievement.unlocked ? 'bg-green-500/20' : 'bg-white/10'
          } flex items-center justify-center text-2xl`}>
            {achievement.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{achievement.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                achievement.tier === 1 ? 'bg-blue-500/20 text-blue-400' :
                achievement.tier === 2 ? 'bg-purple-500/20 text-purple-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                Tier {achievement.tier}
              </span>
            </div>
            <div className="text-xs text-white/60">{achievement.description}</div>
            
            <div className="mt-2 flex items-center justify-between">
              <div className="text-xs text-white/60">
                Reward: {formatNumber(achievement.reward.value)} {achievement.reward.type === 'dexGold' ? 'DEXGOLD' : ''}
              </div>
              {achievement.unlocked ? (
                <div className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
                  Unlocked
                </div>
              ) : (
                <div className="px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-xs">
                  Locked
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render notification
  const renderNotification = (notification: Notification) => {
    let bgColor = 'bg-white/5';
    let icon = <Info className="w-5 h-5 text-blue-400" />;
    
    switch (notification.type) {
      case 'achievement':
        bgColor = 'bg-green-500/10';
        icon = <Award className="w-5 h-5 text-green-400" />;
        break;
      case 'warning':
        bgColor = 'bg-red-500/10';
        icon = <AlertTriangle className="w-5 h-5 text-red-400" />;
        break;
      case 'event':
        bgColor = 'bg-yellow-500/10';
        icon = <Clock className="w-5 h-5 text-yellow-400" />;
        break;
      case 'security':
        bgColor = 'bg-purple-500/10';
        icon = <Shield className="w-5 h-5 text-purple-400" />;
        break;
      case 'research':
        bgColor = 'bg-blue-500/10';
        icon = <Cpu className="w-5 h-5 text-blue-400" />;
        break;
    }
    
    return (
      <div 
        key={notification.id}
        className={`p-3 rounded-lg ${bgColor} ${
          notification.read ? 'opacity-70' : ''
        } mb-2`}
      >
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <div className="font-medium">{notification.title}</div>
          <div className="text-xs text-white/40 ml-auto">
            {new Date(notification.timestamp).toLocaleTimeString()}
          </div>
        </div>
        <div className="text-sm text-white/80">
          {notification.message}
        </div>
      </div>
    );
  };
  
  // Render help guide
  const renderHelpGuide = () => (
    <div className="absolute top-20 right-4 w-96 p-4 glass rounded-xl border border-white/10 max-h-[80vh] overflow-y-auto z-20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <h3 className="font-medium">Token Tycoon Guide</h3>
        </div>
        <button
          onClick={() => setShowHelpGuide(false)}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-blue-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-blue-400" />
            <span className="font-medium">Getting Started</span>
          </div>
          <ul className="space-y-1 text-sm text-white/80">
            <li>• Click the TVL button to generate Total Value Locked</li>
            <li>• Convert TVL to Tokens when you have enough</li>
            <li>• Use Tokens to buy and upgrade Farms</li>
            <li>• Convert Tokens to DEXGOLD for premium features</li>
          </ul>
        </div>
        
        <div className="p-3 rounded-lg bg-green-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-4 h-4 text-green-400" />
            <span className="font-medium">Resources</span>
          </div>
          <ul className="space-y-1 text-sm text-white/80">
            <li>• <span className="text-blue-400">TVL</span>: Basic resource, generated by clicking</li>
            <li>• <span className="text-green-400">Tokens</span>: Mid-tier resource, from farms and TVL conversion</li>
            <li>• <span className="text-yellow-400">DEXGOLD</span>: Premium resource for tokens, DEXes, and upgrades</li>
            <li>• <span className="text-purple-400">Research Points</span>: Advanced resource for special upgrades</li>
          </ul>
        </div>
        
        <div className="p-3 rounded-lg bg-purple-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Rocket className="w-4 h-4 text-purple-400" />
            <span className="font-medium">Launching Assets</span>
          </div>
          <ul className="space-y-1 text-sm text-white/80">
            <li>• Launch tokens to generate passive TVL</li>
            <li>• Watch out for rug pull risk on tokens!</li>
            <li>• Launch DEXes to boost your TVL generation</li>
            <li>• Different chains have different multipliers</li>
            <li>• Higher tier tokens and DEXes provide better returns</li>
          </ul>
        </div>
        
        <div className="p-3 rounded-lg bg-orange-500/10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span className="font-medium">Market Sentiment</span>
          </div>
          <ul className="space-y-1 text-sm text-white/80">
            <li>• <span className="text-green-400">Bullish</span>: Higher token income, lower rug pull risk</li>
            <li>• <span className="text-white/60">Neutral</span>: Normal conditions</li>
            <li>• <span className="text-red-400">Bearish</span>: Lower token income, higher rug pull risk</li>
            <li>• Market sentiment changes periodically</li>
            <li>• Adapt your strategy to current market conditions</li>
          </ul>
        </div>
        
        <div className="p-3 rounded-lg bg-red-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-red-400" />
            <span className="font-medium">Security & Research</span>
          </div>
          <ul className="space-y-1 text-sm text-white/80">
            <li>• Protect against hacking attempts with security upgrades</li>
            <li>• Higher hacking defense means better protection</li>
            <li>• Research points unlock powerful bonuses</li>
            <li>• Invest in research multipliers to accelerate progress</li>
          </ul>
        </div>
        
        <div className="p-3 rounded-lg bg-yellow-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="font-medium">Prestige System</span>
          </div>
          <ul className="space-y-1 text-sm text-white/80">
            <li>• Reach $1,000,000 TVL to prestige</li>
            <li>• Each prestige level gives permanent multipliers</li>
            <li>• Unlocks new chains and features</li>
            <li>• Resets your progress but keeps achievements</li>
            <li>• Higher prestige levels unlock more powerful upgrades</li>
          </ul>
        </div>
        
        <div className="p-3 rounded-lg bg-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-white" />
            <span className="font-medium">Tips & Tricks</span>
          </div>
          <ul className="space-y-1 text-sm text-white/80">
            <li>• Balance your investments across different assets</li>
            <li>• Prioritize Auto Clicker early for passive income</li>
            <li>• Upgrade farms to level 5+ for best efficiency</li>
            <li>• Launch tokens on chains with higher multipliers</li>
            <li>• Complete achievements for bonus rewards</li>
            <li>• Invest in security during bear markets</li>
            <li>• Launch tokens aggressively during bull markets</li>
            <li>• Higher tier assets cost more but yield better returns</li>
          </ul>
        </div>
      </div>
    </div>
  );
  
  // Render game menu
  const renderGameMenu = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="text-6xl mb-6">🪙</div>
      <h1 className="text-4xl font-bold mb-2">Token Tycoon</h1>
      <p className="text-white/60 max-w-md mb-8">
        Build your DeFi empire from a simple yield farm to a multi-chain ecosystem
      </p>
      
      {gameState.prestige.level > 0 && (
        <div className="mb-6 px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-400">
          Prestige Level: {gameState.prestige.level} • Multiplier: {gameState.prestige.multiplier}x
        </div>
      )}
      
      <div className="space-y-4">
        <button
          onClick={handleStartGame}
          className="w-64 px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors text-lg font-medium"
        >
          {gameState.tutorialCompleted ? 'Continue Building' : 'Start Building'}
        </button>
        
        {!gameState.tutorialCompleted && (
          <button
            onClick={handleStartTutorial}
            className="w-64 px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-lg font-medium"
          >
            How to Play
          </button>
        )}
        
        <button
          onClick={() => openModal('Reset Game', (
            <div className="text-center">
              <p className="text-white/80 mb-6">Are you sure you want to reset your game? This will delete all progress and cannot be undone.</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleResetGame();
                    closeModal();
                  }}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                >
                  Reset Game
                </button>
              </div>
            </div>
          ))}
          className="w-64 px-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-sm"
        >
          Reset Game
        </button>
      </div>
      
      {gameState.prestige.level > 0 && (
        <div className="mt-4 text-sm text-white/60">
          You've prestiged {gameState.prestige.level} time{gameState.prestige.level !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
  
  // Render tutorial
  const renderTutorial = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
        <BookOpen className="w-8 h-8 text-blue-400" />
      </div>
      
      <h2 className="text-2xl font-bold mb-4">{tutorialSteps[gameState.tutorialStep].title}</h2>
      <p className="text-white/80 max-w-md mb-8">
        {tutorialSteps[gameState.tutorialStep].content}
      </p>
      
      <div className="flex items-center gap-4 mb-8">
        {tutorialSteps.map((_, index) => (
          <div 
            key={index}
            className={`w-2.5 h-2.5 rounded-full ${
              index === gameState.tutorialStep 
                ? 'bg-blue-500' 
                : index < gameState.tutorialStep 
                  ? 'bg-green-500' 
                  : 'bg-white/20'
            }`}
          />
        ))}
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={handleSkipTutorial}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          Skip Tutorial
        </button>
        <button
          onClick={handleNextTutorialStep}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          {gameState.tutorialStep === tutorialSteps.length - 1 ? 'Start Playing' : 'Next'}
        </button>
      </div>
    </div>
  );
  
  // Render game UI
  const renderGameUI = () => (
    <div className="h-full flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          {/* TVL */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-xs text-white/60">TVL</div>
              <div className="text-lg font-bold">${formatNumber(gameState.tvl)}</div>
            </div>
          </div>
          
          {/* Tokens */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Coins className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-xs text-white/60">Tokens</div>
              <div className="text-lg font-bold">{formatNumber(gameState.tokens)}</div>
            </div>
          </div>
          
          {/* DexGold */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Coins className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-xs text-white/60">DEXGOLD</div>
              <div className="text-lg font-bold">{formatNumber(gameState.dexGold)}</div>
            </div>
          </div>
          
          {/* Research Points */}
          {gameState.upgrades.find(u => u.id === 'research-lab' && u.purchased) && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-xs text-white/60">Research</div>
                <div className="text-lg font-bold">{formatNumber(gameState.researchPoints)}</div>
              </div>
            </div>
          )}
          
          {/* Market Sentiment */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              {getMarketSentimentInfo().icon}
            </div>
            <div>
              <div className="text-xs text-white/60">Market</div>
              <div className={`text-lg font-bold capitalize ${getMarketSentimentInfo().color}`}>
                {gameState.marketSentiment}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Chain Selector */}
          <div className="relative">
            <button
              onClick={() => setShowChainSelector(!showChainSelector)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              style={{ backgroundColor: `${gameState.activeChain.color}20` }}
            >
              <span>{gameState.activeChain.icon}</span>
              <span>{gameState.activeChain.name}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showChainSelector && (
              <div className="absolute top-full right-0 mt-1 w-48 p-2 glass rounded-lg z-10">
                {gameState.unlocks.chains.map(chain => (
                  <button
                    key={chain.id}
                    onClick={() => handleSelectChain(chain.id)}
                    disabled={!chain.unlocked}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      chain.unlocked
                        ? 'hover:bg-white/10'
                        : 'opacity-50 cursor-not-allowed'
                    } ${chain.id === gameState.activeChain.id ? 'bg-white/10' : ''}`}
                    style={{ backgroundColor: chain.id === gameState.activeChain.id ? `${chain.color}20` : '' }}
                  >
                    <span>{chain.icon}</span>
                    <span className="flex-1 text-left">{chain.name}</span>
                    {!chain.unlocked && (
                      <Lock className="w-4 h-4 text-white/40" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Help Guide */}
          <button
            onClick={() => setShowHelpGuide(!showHelpGuide)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          
          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {gameState.notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-xs flex items-center justify-center">
                {gameState.notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
          
          {/* Achievements */}
          <button
            onClick={() => setShowAchievements(!showAchievements)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Award className="w-5 h-5" />
          </button>
          
          {/* Stats */}
          <button
            onClick={() => setShowStats(!showStats)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <BarChart2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* News Ticker */}
      <div className="bg-black/20 border-b border-white/10 py-1 px-4 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee">
          📰 {gameState.newsFlash} • {gameState.newsFlash} • {gameState.newsFlash}
        </div>
      </div>
      
      {/* Main Game Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Active Events */}
        {gameState.events.filter(e => e.active).length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <h3 className="font-medium">Active Events</h3>
              {eventCountdown !== null && (
                <div className="ml-auto text-sm text-yellow-400">
                  {Math.floor(eventCountdown / 60)}:{(eventCountdown % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {gameState.events.filter(e => e.active).map(event => (
                <div
                  key={event.id}
                  className={`px-3 py-1.5 rounded-lg bg-white/5 text-sm ${
                    event.severity === 'high' ? 'border border-red-500/50' :
                    event.severity === 'medium' ? 'border border-yellow-500/50' :
                    ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{event.icon}</span>
                    <span>{event.name}</span>
                    {event.severity === 'high' && (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* FOMO Meter */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium">FOMO Meter</span>
            </div>
            <span className="text-sm text-white/60">{gameState.fomoMeter.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
              style={{ width: `${gameState.fomoMeter}%` }}
            />
          </div>
        </div>
        
        {/* Security Status */}
        {gameState.hackingDefense > 1 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">Security Level</span>
              </div>
              <span className="text-sm text-white/60">{gameState.hackingDefense.toFixed(1)}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                style={{ width: `${Math.min(100, gameState.hackingDefense * 2)}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Main Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* TVL Clicker */}
          <div className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer" onClick={handleClick}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-blue-400" />
                <h3 className="font-medium">Generate TVL</h3>
              </div>
              <div className="text-sm text-white/60">
                +{formatNumber(gameState.clickPower * gameState.prestige.multiplier)} per click
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-blue-500/20 hover:bg-blue-500/30 flex items-center justify-center transition-all transform active:scale-95">
                <BarChart2 className="w-12 h-12 text-blue-400" />
              </div>
            </div>
            
            <div className="mt-3 text-center text-sm text-white/60">
              Click to generate TVL
            </div>
          </div>
          
          {/* Conversions */}
          <div className="p-4 rounded-xl bg-white/5">
            <h3 className="font-medium mb-3">Conversions</h3>
            
            <div className="space-y-3">
              <button
                onClick={handleConvertTVL}
                disabled={gameState.tvl < 100}
                className={`w-full py-2 rounded-lg text-sm font-medium ${
                  gameState.tvl >= 100
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-white/10 cursor-not-allowed'
                } transition-colors`}
              >
                Convert TVL to Tokens
              </button>
              
              <div className="text-xs text-center text-white/60">
                {formatNumber(gameState.tvl)} TVL → {formatNumber(gameState.tvl * 0.1)} Tokens
              </div>
              
              <button
                onClick={handleConvertTokens}
                disabled={gameState.tokens < 100}
                className={`w-full py-2 rounded-lg text-sm font-medium ${
                  gameState.tokens >= 100
                    ? 'bg-yellow-500 hover:bg-yellow-600'
                    : 'bg-white/10 cursor-not-allowed'
                } transition-colors`}
              >
                Convert Tokens to DEXGOLD
              </button>
              
              <div className="text-xs text-center text-white/60">
                {formatNumber(gameState.tokens)} Tokens → {formatNumber(gameState.tokens * 0.01)} DEXGOLD
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4 border-b border-white/10">
          <button
            onClick={() => setActiveTab('farms')}
            className={`px-4 py-2 transition-colors ${
              activeTab === 'farms'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Farms
          </button>
          <button
            onClick={() => setActiveTab('tokens')}
            className={`px-4 py-2 transition-colors ${
              activeTab === 'tokens'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Tokens
          </button>
          <button
            onClick={() => setActiveTab('dexes')}
            className={`px-4 py-2 transition-colors ${
              activeTab === 'dexes'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            DEXes
          </button>
          <button
            onClick={() => setActiveTab('upgrades')}
            className={`px-4 py-2 transition-colors ${
              activeTab === 'upgrades'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Upgrades
          </button>
          {gameState.upgrades.find(u => u.id === 'research-lab' && u.purchased) && (
            <button
              onClick={() => setActiveTab('research')}
              className={`px-4 py-2 transition-colors ${
                activeTab === 'research'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Research
            </button>
          )}
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-4 mb-4">
          {/* Tier Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/60">Tier:</span>
            <button
              onClick={() => setFilterTier(null)}
              className={`px-2 py-1 rounded-lg text-xs ${
                filterTier === null ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterTier(1)}
              className={`px-2 py-1 rounded-lg text-xs ${
                filterTier === 1 ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/5'
              }`}
            >
              Tier 1
            </button>
            <button
              onClick={() => setFilterTier(2)}
              className={`px-2 py-1 rounded-lg text-xs ${
                filterTier === 2 ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-white/5'
              }`}
            >
              Tier 2
            </button>
            <button
              onClick={() => setFilterTier(3)}
              className={`px-2 py-1 rounded-lg text-xs ${
                filterTier === 3 ? 'bg-yellow-500/20 text-yellow-400' : 'hover:bg-white/5'
              }`}
            >
              Tier 3
            </button>
          </div>
          
          {/* Chain Filter (for tokens and dexes) */}
          {(activeTab === 'tokens' || activeTab === 'dexes') && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60">Chain:</span>
              <button
                onClick={() => setFilterChain(null)}
                className={`px-2 py-1 rounded-lg text-xs ${
                  filterChain === null ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                All
              </button>
              {gameState.unlocks.chains.filter(c => c.unlocked).map(chain => (
                <button
                  key={chain.id}
                  onClick={() => setFilterChain(chain.id)}
                  className={`px-2 py-1 rounded-lg text-xs ${
                    filterChain === chain.id ? `bg-white/10` : 'hover:bg-white/5'
                  }`}
                  style={{ backgroundColor: filterChain === chain.id ? `${chain.color}20` : '' }}
                >
                  {chain.icon} {chain.name}
                </button>
              ))}
            </div>
          )}
          
          {/* Category Filter (for upgrades) */}
          {activeTab === 'upgrades' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60">Category:</span>
              <button
                onClick={() => setFilterCategory(null)}
                className={`px-2 py-1 rounded-lg text-xs ${
                  filterCategory === null ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterCategory('basic')}
                className={`px-2 py-1 rounded-lg text-xs ${
                  filterCategory === 'basic' ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/5'
                }`}
              >
                Basic
              </button>
              <button
                onClick={() => setFilterCategory('advanced')}
                className={`px-2 py-1 rounded-lg text-xs ${
                  filterCategory === 'advanced' ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-white/5'
                }`}
              >
                Advanced
              </button>
              <button
                onClick={() => setFilterCategory('security')}
                className={`px-2 py-1 rounded-lg text-xs ${
                  filterCategory === 'security' ? 'bg-green-500/20 text-green-400' : 'hover:bg-white/5'
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setFilterCategory('research')}
                className={`px-2 py-1 rounded-lg text-xs ${
                  filterCategory === 'research' ? 'bg-yellow-500/20 text-yellow-400' : 'hover:bg-white/5'
                }`}
              >
                Research
              </button>
              {gameState.prestige.level > 0 && (
                <button
                  onClick={() => setFilterCategory('prestige')}
                  className={`px-2 py-1 rounded-lg text-xs ${
                    filterCategory === 'prestige' ? 'bg-pink-500/20 text-pink-400' : 'hover:bg-white/5'
                  }`}
                >
                  Prestige
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Farms Section */}
        {activeTab === 'farms' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Yield Farms</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {gameState.farms
                .filter(farm => filterTier === null || farm.tier === filterTier)
                .map(farm => renderFarmCard(farm))}
            </div>
          </div>
        )}
        
        {/* Tokens Section */}
        {activeTab === 'tokens' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Tokens</h3>
              <div className="text-sm text-white/60">
                {gameState.tokens_launched.length}/{initialTokens.length} Launched
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {initialTokens
                .filter(t => t.id !== 'dexgold')
                .filter(t => filterTier === null || t.tier === filterTier)
                .filter(t => filterChain === null || t.chain === filterChain || (t.owned && t.chain === gameState.activeChain.id))
                .map(token => renderTokenCard(token))}
            </div>
          </div>
        )}
        
        {/* DEXes Section */}
        {activeTab === 'dexes' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">DEXes</h3>
              <div className="text-sm text-white/60">
                {gameState.dexes_launched.length}/{initialDexes.length} Launched
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {initialDexes
                .filter(d => filterTier === null || d.tier === filterTier)
                .filter(d => filterChain === null || d.chain === filterChain || (d.owned && d.chain === gameState.activeChain.id))
                .map(dex => renderDexCard(dex))}
            </div>
          </div>
        )}
        
        {/* Upgrades Section */}
        {activeTab === 'upgrades' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Upgrades</h3>
              <div className="text-sm text-white/60">
                {gameState.upgrades.filter(u => u.purchased).length}/{gameState.upgrades.filter(u => u.visible).length} Purchased
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {gameState.upgrades
                .filter(u => u.visible)
                .filter(u => filterTier === null || u.tier === filterTier)
                .filter(u => filterCategory === null || u.category === filterCategory)
                .map(upgrade => renderUpgradeCard(upgrade))}
            </div>
          </div>
        )}
        
        {/* Research Section */}
        {activeTab === 'research' && gameState.upgrades.find(u => u.id === 'research-lab' && u.purchased) && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Research Lab</h3>
              <div className="text-sm text-white/60">
                Generating {formatNumber(0.1 * gameState.researchMultiplier)} research points/s
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-white/5 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium">Research Progress</h3>
                  <div className="text-sm text-white/60">
                    Unlocking new technologies through research
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">Research Points</span>
                    <span>{formatNumber(gameState.researchPoints)}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                      style={{ width: `${Math.min(100, (gameState.researchPoints % 1000) / 10)}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">Research Multiplier</span>
                    <span className="text-purple-400">{gameState.researchMultiplier.toFixed(1)}x</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {gameState.upgrades
                .filter(u => u.visible && u.category === 'research')
                .filter(u => filterTier === null || u.tier === filterTier)
                .map(upgrade => renderUpgradeCard(upgrade))}
            </div>
          </div>
        )}
        
        {/* Prestige Section */}
        <div className="mb-6">
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium">Prestige</h3>
                  <div className="text-xs text-white/60">Reset with permanent bonuses</div>
                </div>
              </div>
              
              <button
                onClick={() => setGameState(prev => ({ ...prev, prestige: { ...prev.prestige, pendingReset: true } }))}
                disabled={gameState.tvl < 1000000}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  gameState.tvl >= 1000000
                    ? 'bg-purple-500 hover:bg-purple-600'
                    : 'bg-white/10 cursor-not-allowed'
                } transition-colors`}
              >
                Prestige
              </button>
            </div>
            
            <div className="text-sm text-white/80 mb-3">
              Prestige to reset your progress but gain permanent bonuses. Each prestige level increases your multiplier and unlocks new features.
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div>
                <div className="text-white/60">Current Level</div>
                <div className="font-medium">{gameState.prestige.level}</div>
              </div>
              <div>
                <div className="text-white/60">Multiplier</div>
                <div className="font-medium">{gameState.prestige.multiplier}x</div>
              </div>
              <div>
                <div className="text-white/60">Required TVL</div>
                <div className="font-medium">$1,000,000</div>
              </div>
              <div>
                <div className="text-white/60">Progress</div>
                <div className="font-medium">{Math.min(100, (gameState.tvl / 1000000 * 100)).toFixed(1)}%</div>
              </div>
            </div>
            
            <div className="mt-2">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                  style={{ width: `${Math.min(100, (gameState.tvl / 1000000 * 100))}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Help Guide */}
      {showHelpGuide && renderHelpGuide()}
      
      {/* Notifications Panel */}
      {showNotifications && (
        <div className="absolute top-20 right-4 w-80 p-4 glass rounded-xl border border-white/10 max-h-[80vh] overflow-y-auto z-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Notifications</h3>
            <button
              onClick={() => setShowNotifications(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {gameState.notifications.length === 0 ? (
            <div className="text-center text-white/60 py-4">
              No notifications yet
            </div>
          ) : (
            <div className="space-y-2">
              {gameState.notifications.map(notification => renderNotification(notification))}
            </div>
          )}
        </div>
      )}
      
      {/* Achievements Panel */}
      {showAchievements && (
        <div className="absolute top-20 right-4 w-96 p-4 glass rounded-xl border border-white/10 max-h-[80vh] overflow-y-auto z-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Achievements</h3>
            <button
              onClick={() => setShowAchievements(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {gameState.achievements.map(achievement => renderAchievementCard(achievement))}
          </div>
        </div>
      )}
      
      {/* Stats Panel */}
      {showStats && (
        <div className="absolute top-20 right-4 w-96 p-4 glass rounded-xl border border-white/10 max-h-[80vh] overflow-y-auto z-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Game Statistics</h3>
            <button
              onClick={() => setShowStats(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="font-medium">Play Time</span>
              </div>
              <div className="text-lg">
                {Math.floor(gameState.stats.playTime / 3600)}h {Math.floor((gameState.stats.playTime % 3600) / 60)}m {Math.floor(gameState.stats.playTime % 60)}s
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="font-medium">Economy</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-white/60">Total TVL Generated</span>
                  <span>${formatNumber(gameState.stats.totalTVLGenerated)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Total DEXGOLD Earned</span>
                  <span>{formatNumber(gameState.stats.totalDexGoldEarned)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Click Power</span>
                  <span>{formatNumber(gameState.clickPower * gameState.prestige.multiplier)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Auto-Click Rate</span>
                  <span>{formatNumber(gameState.autoClickRate)}/s</span>
                </div>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="w-4 h-4 text-purple-400" />
                <span className="font-medium">Launches</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-white/60">Tokens Launched</span>
                  <span>{gameState.stats.tokensLaunched}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">DEXes Launched</span>
                  <span>{gameState.stats.dexesLaunched}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Farms Owned</span>
                  <span>{gameState.stats.farmsOwned}</span>
                </div>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-green-400" />
                <span className="font-medium">Progress</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-white/60">Click Count</span>
                  <span>{gameState.stats.clickCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Upgrades Purchased</span>
                  <span>{gameState.stats.upgradesPurchased}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Achievements Unlocked</span>
                  <span>{gameState.stats.achievementsUnlocked}/{gameState.achievements.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Prestige Count</span>
                  <span>{gameState.stats.prestigeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Market Cycles</span>
                  <span>{gameState.stats.marketCycles}</span>
                </div>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="font-medium">Security & Research</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-white/60">Hacking Defense</span>
                  <span>{gameState.hackingDefense.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Hacking Attempts Stopped</span>
                  <span>{gameState.stats.hackingAttemptsStopped}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Research Points</span>
                  <span>{formatNumber(gameState.researchPoints)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Research Multiplier</span>
                  <span>{gameState.researchMultiplier.toFixed(1)}x</span>
                </div>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="font-medium">Risks</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-white/60">Rug Pulls</span>
                  <span>{gameState.stats.rugPulls}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Hacking Attempts</span>
                  <span>{gameState.hackingAttempts}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Prestige Confirmation */}
      {gameState.prestige.pendingReset && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-30">
          <div className="p-6 glass rounded-xl border border-purple-500/20 w-[500px]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Confirm Prestige</h3>
              <p className="text-white/60">
                You are about to prestige to level {gameState.prestige.level + 1}. This will reset your progress but give you permanent bonuses.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-white/5 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60">New Prestige Level</span>
                <span className="font-medium">{gameState.prestige.level + 1}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60">New Multiplier</span>
                <span className="font-medium">{1 + ((gameState.prestige.level + 1) * 0.5)}x</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Unlocks</span>
                <span className="font-medium">New chains & features</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                onClick={() => setGameState(prev => ({ ...prev, prestige: { ...prev.prestige, pendingReset: false } }))}
                className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePrestige}
                className="px-6 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors"
              >
                Confirm Prestige
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal */}
      {isModalOpen && modalContent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-30">
          <div className="p-6 glass rounded-xl border border-white/10 w-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{modalContent.title}</h3>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div>{modalContent.content}</div>
          </div>
        </div>
      )}
    </div>
  );
  
  // Main render
  return (
    <div className="h-full">
      {gameState.screen === 'menu' && renderGameMenu()}
      {gameState.screen === 'tutorial' && renderTutorial()}
      {gameState.screen === 'game' && renderGameUI()}
    </div>
  );
};