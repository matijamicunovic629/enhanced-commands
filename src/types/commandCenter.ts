export interface CommandHistory {
  id: string;
  command: string;
  timestamp: Date;
  type: 'transaction' | 'query' | 'navigation';
  result?: string;
}

export interface FavoriteCommand {
  id: string;
  name: string;
  command: string;
  icon: string;
  color: string;
  category: 'trading' | 'defi' | 'portfolio' | 'market';
}

export interface CommandTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: {
    name: string;
    placeholder: string;
    type: 'text' | 'number' | 'select';
    options?: string[];
  }[];
  category: 'trading' | 'defi' | 'portfolio' | 'market';
}

export interface TransactionCommand {
  type: 'swap' | 'send' | 'bridge' | 'stake' | 'lend';
  fromToken?: string;
  toToken?: string;
  amount?: string;
  recipient?: string;
  chain?: string;
}

export interface CommandCenterState {
  history: CommandHistory[];
  favorites: FavoriteCommand[];
  templates: CommandTemplate[];
  showHistory: boolean;
  showFavorites: boolean;
  showTemplates: boolean;
  selectedTemplate: CommandTemplate | null;
}