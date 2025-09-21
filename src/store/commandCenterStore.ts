import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CommandHistory, FavoriteCommand, CommandTemplate, CommandCenterState } from '../types/commandCenter';

const defaultTemplates: CommandTemplate[] = [
  {
    id: 'swap-template',
    name: 'Token Swap',
    description: 'Swap one token for another',
    template: 'Swap {amount} {fromToken} for {toToken}',
    variables: [
      { name: 'amount', placeholder: 'Enter amount', type: 'number' },
      { name: 'fromToken', placeholder: 'From token', type: 'select', options: ['ETH', 'BTC', 'USDC', 'USDT'] },
      { name: 'toToken', placeholder: 'To token', type: 'select', options: ['ETH', 'BTC', 'USDC', 'USDT'] }
    ],
    category: 'trading'
  },
  {
    id: 'send-template',
    name: 'Send Tokens',
    description: 'Send tokens to an address',
    template: 'Send {amount} {token} to {recipient}',
    variables: [
      { name: 'amount', placeholder: 'Enter amount', type: 'number' },
      { name: 'token', placeholder: 'Token symbol', type: 'select', options: ['ETH', 'BTC', 'USDC', 'USDT'] },
      { name: 'recipient', placeholder: 'Recipient address', type: 'text' }
    ],
    category: 'trading'
  },
  {
    id: 'stake-template',
    name: 'Stake Tokens',
    description: 'Stake tokens for rewards',
    template: 'Stake {amount} {token} with {protocol}',
    variables: [
      { name: 'amount', placeholder: 'Enter amount', type: 'number' },
      { name: 'token', placeholder: 'Token to stake', type: 'select', options: ['ETH', 'SOL', 'DOT', 'ADA'] },
      { name: 'protocol', placeholder: 'Staking protocol', type: 'select', options: ['Lido', 'Rocket Pool', 'Coinbase'] }
    ],
    category: 'defi'
  },
  {
    id: 'dca-template',
    name: 'DCA Setup',
    description: 'Set up dollar-cost averaging',
    template: 'Create a DCA to purchase {amount} USDC worth of {token} on {frequency} basis',
    variables: [
      { name: 'amount', placeholder: 'Amount in USDC', type: 'number' },
      { name: 'token', placeholder: 'Target token', type: 'select', options: ['BTC', 'ETH', 'SOL', 'ADA'] },
      { name: 'frequency', placeholder: 'Frequency', type: 'select', options: ['daily', 'weekly', 'monthly'] }
    ],
    category: 'portfolio'
  }
  ,
  {
    id: 'price-check-template',
    name: 'Price Check',
    description: 'Check current price of any cryptocurrency',
    template: 'What is the {token} price?',
    variables: [
      { name: 'token', placeholder: 'Token name', type: 'select', options: ['Bitcoin', 'Ethereum', 'Solana', 'Cardano', 'Dogecoin'] }
    ],
    category: 'market'
  },
  {
    id: 'yield-template',
    name: 'Find Yield',
    description: 'Find best yield opportunities',
    template: 'Find best yield for my {token}',
    variables: [
      { name: 'token', placeholder: 'Token symbol', type: 'select', options: ['USDC', 'USDT', 'DAI', 'ETH', 'BTC'] }
    ],
    category: 'defi'
  }
];

const defaultFavorites: FavoriteCommand[] = [
  {
    id: 'btc-price',
    name: 'Bitcoin Price',
    command: 'What is the Bitcoin price?',
    icon: 'DollarSign',
    color: 'text-orange-400',
    category: 'market'
  },
  {
    id: 'eth-stake',
    name: 'Stake ETH',
    command: 'Stake ETH',
    icon: 'Landmark',
    color: 'text-blue-400',
    category: 'defi'
  },
  {
    id: 'trending',
    name: 'Trending Tokens',
    command: 'Show me trending tokens',
    icon: 'TrendingUp',
    color: 'text-green-400',
    category: 'market'
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    command: 'Build my portfolio',
    icon: 'BarChart2',
    color: 'text-purple-400',
    category: 'portfolio'
  }
];

interface CommandCenterStore extends CommandCenterState {
  addToHistory: (command: string, type: CommandHistory['type'], result?: string) => void;
  addToFavorites: (command: FavoriteCommand) => void;
  removeFromFavorites: (id: string) => void;
  addTemplate: (template: CommandTemplate) => void;
  removeTemplate: (id: string) => void;
  clearHistory: () => void;
  toggleHistory: () => void;
  toggleFavorites: () => void;
  toggleTemplates: () => void;
  setSelectedTemplate: (template: CommandTemplate | null) => void;
}

export const useCommandCenterStore = create<CommandCenterStore>()(
  persist(
    (set, get) => ({
      history: [],
      favorites: defaultFavorites,
      templates: defaultTemplates,
      showHistory: false,
      showFavorites: false,
      showTemplates: false,
      selectedTemplate: null,

      addToHistory: (command, type, result) => set((state) => ({
        history: [
          {
            id: Date.now().toString(),
            command,
            timestamp: new Date(),
            type,
            result
          },
          ...state.history.slice(0, 49) // Keep last 50 commands
        ]
      })),

      addToFavorites: (command) => set((state) => ({
        favorites: [...state.favorites, command]
      })),

      removeFromFavorites: (id) => set((state) => ({
        favorites: state.favorites.filter(fav => fav.id !== id)
      })),

      addTemplate: (template) => set((state) => ({
        templates: [...state.templates, template]
      })),

      removeTemplate: (id) => set((state) => ({
        templates: state.templates.filter(template => template.id !== id)
      })),

      clearHistory: () => set({ history: [] }),

      toggleHistory: () => set((state) => ({
        showHistory: !state.showHistory,
        showFavorites: false,
        showTemplates: false
      })),

      toggleFavorites: () => set((state) => ({
        showFavorites: !state.showFavorites,
        showHistory: false,
        showTemplates: false
      })),

      toggleTemplates: () => set((state) => ({
        showTemplates: !state.showTemplates,
        showHistory: false,
        showFavorites: false
      })),

      setSelectedTemplate: (template) => set({ selectedTemplate: template })
    }),
    {
      name: 'command-center-storage',
      partialize: (state) => ({
        history: state.history,
        favorites: state.favorites,
        templates: state.templates
      })
    }
  )
);