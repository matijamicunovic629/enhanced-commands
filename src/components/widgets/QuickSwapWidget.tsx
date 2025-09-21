import React, { useState } from 'react';
import { RefreshCw, ChevronDown, Search, X } from 'lucide-react';

interface Token {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  balance?: string;
}

const tokens: Token[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    balance: '1.5'
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    balance: '0.05'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    balance: '15.8'
  },
  {
    id: 'usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    logo: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    balance: '5000'
  },
  {
    id: 'usdt',
    name: 'Tether',
    symbol: 'USDT',
    logo: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    balance: '5000'
  }
];

interface TokenSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  selectedToken: Token;
  otherToken: Token;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedToken,
  otherToken
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredTokens = tokens.filter(token => {
    const searchLower = searchQuery.toLowerCase();
    return (
      token.id !== otherToken.id && (
        token.name.toLowerCase().includes(searchLower) ||
        token.symbol.toLowerCase().includes(searchLower)
      )
    );
  });

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        onClick={onClose}
      />
      <div className="absolute top-full left-0 mt-1 w-[180px] p-1.5 glass rounded-lg z-50 border border-white/10">
        <div className="flex items-center gap-1.5 p-1.5 bg-white/5 rounded-lg mb-1.5">
          <Search className="w-3 h-3 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tokens..."
            className="bg-transparent outline-none flex-1 text-xs"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-0.5 rounded-md hover:bg-white/10"
            >
              <X className="w-3 h-3 text-white/60" />
            </button>
          )}
        </div>
        <div className="max-h-48 overflow-y-auto token-dropdown-scrollbar">
          {filteredTokens.map((token) => (
            <button
              key={token.id}
              onClick={() => {
                onSelect(token);
                onClose();
              }}
              className="w-full flex items-center gap-2 p-1.5 hover:bg-white/5 rounded-lg transition-colors"
            >
              <img
                src={token.logo}
                alt={token.name}
                className="w-5 h-5"
              />
              <div className="flex-1 text-left">
                <div className="font-medium text-xs">{token.name}</div>
                <div className="text-[10px] text-white/60">
                  Balance: {token.balance} {token.symbol}
                </div>
              </div>
              {selectedToken.id === token.id && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export const QuickSwapWidget: React.FC = () => {
  const [fromAmount, setFromAmount] = useState('0.0');
  const [toAmount, setToAmount] = useState('0.0');
  const [fromToken, setFromToken] = useState<Token>(tokens[0]); // ETH
  const [toToken, setToToken] = useState<Token>(tokens[4]); // USDT
  const [showFromTokens, setShowFromTokens] = useState(false);
  const [showToTokens, setShowToTokens] = useState(false);

  const handleFromTokenSelect = (token: Token) => {
    if (token.id === toToken.id) {
      setToToken(fromToken);
    }
    setFromToken(token);
  };

  const handleToTokenSelect = (token: Token) => {
    if (token.id === fromToken.id) {
      setFromToken(toToken);
    }
    setToToken(token);
  };

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  return (
    <div className="p-2 h-full flex flex-col">
      <div className="space-y-1.5">
        <div className="bg-white/5 rounded-xl p-2">
          <div className="text-xs text-white/60 mb-1">From</div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => {
                  setShowFromTokens(true);
                  setShowToTokens(false);
                }}
                className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <img src={fromToken.logo} alt={fromToken.symbol} className="w-4 h-4" />
                <span className="text-xs">{fromToken.symbol}</span>
                <ChevronDown className="w-3 h-3 text-white/60" />
              </button>

              <TokenSelector
                isOpen={showFromTokens}
                onClose={() => setShowFromTokens(false)}
                onSelect={handleFromTokenSelect}
                selectedToken={fromToken}
                otherToken={toToken}
              />
            </div>
            <input
              type="text"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="flex-1 bg-transparent text-right outline-none text-sm"
              placeholder="0.0"
            />
          </div>
          <div className="text-[10px] text-white/40 mt-0.5">
            Balance: {fromToken.balance} {fromToken.symbol}
          </div>
        </div>

        <div className="flex justify-center -my-1 relative z-10">
          <button 
            onClick={handleSwapTokens}
            className="p-1 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white/5 rounded-xl p-2">
          <div className="text-xs text-white/60 mb-1">To</div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => {
                  setShowToTokens(true);
                  setShowFromTokens(false);
                }}
                className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <img src={toToken.logo} alt={toToken.symbol} className="w-4 h-4" />
                <span className="text-xs">{toToken.symbol}</span>
                <ChevronDown className="w-3 h-3 text-white/60" />
              </button>

              <TokenSelector
                isOpen={showToTokens}
                onClose={() => setShowToTokens(false)}
                onSelect={handleToTokenSelect}
                selectedToken={toToken}
                otherToken={fromToken}
              />
            </div>
            <input
              type="text"
              value={toAmount}
              onChange={(e) => setToAmount(e.target.value)}
              className="flex-1 bg-transparent text-right outline-none text-sm"
              placeholder="0.0"
            />
          </div>
          <div className="text-[10px] text-white/40 mt-0.5">
            Balance: {toToken.balance} {toToken.symbol}
          </div>
        </div>
      </div>

      <button className="mt-auto w-full py-1.5 px-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg font-medium text-xs">
        Swap
      </button>
    </div>
  );
};