import React, { useState, useEffect } from 'react';
import { ChevronDown, RefreshCw, Search, X } from 'lucide-react';
import { getCoinPrice, searchCoins } from '../../lib/coingecko';

interface Currency {
  id: string;
  symbol: string;
  name: string;
  logo: string;
}

interface CurrencySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (currency: Currency) => void;
  selectedCurrency: Currency;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedCurrency
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const results = await searchCoins(searchQuery);
        setSearchResults(results.map(coin => ({
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          logo: coin.thumb
        })));
      } catch (error) {
        console.error('Error searching coins:', error);
      } finally {
        setLoading(false);
      }
    };

    handleSearch();
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        onClick={onClose}
      />
      <div className="absolute top-full left-0 mt-1 w-full p-1.5 glass rounded-lg z-50">
        <div className="flex items-center gap-1.5 p-1.5 bg-white/5 rounded-lg mb-1.5">
          <Search className="w-3 h-3 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coins..."
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
        <div className="max-h-48 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-3">
              <div className="animate-spin">
                <RefreshCw className="w-3 h-3 text-white/40" />
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((currency) => (
              <button
                key={currency.id}
                onClick={() => {
                  onSelect(currency);
                  onClose();
                }}
                className="w-full flex items-center gap-2 p-1.5 hover:bg-white/5 rounded-lg transition-colors"
              >
                <img
                  src={currency.logo}
                  alt={currency.name}
                  className="w-5 h-5"
                />
                <div className="flex-1 text-left">
                  <div className="font-medium text-xs">{currency.name}</div>
                  <div className="text-[10px] text-white/60">{currency.symbol}</div>
                </div>
                {selectedCurrency.id === currency.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
              </button>
            ))
          ) : searchQuery.length >= 2 ? (
            <div className="text-center py-3 text-xs text-white/40">
              No results found
            </div>
          ) : (
            <div className="text-center py-3 text-xs text-white/40">
              Type to search coins
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const PriceConverterWidget: React.FC = () => {
  const [fromAmount, setFromAmount] = useState('0');
  const [toAmount, setToAmount] = useState('0');
  const [fromCurrency, setFromCurrency] = useState<Currency>({
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
  });
  const [toCurrency, setToCurrency] = useState<Currency>({
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'
  });
  const [rate, setRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [showFromSelector, setShowFromSelector] = useState(false);
  const [showToSelector, setShowToSelector] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateRate = async () => {
    setLoading(true);
    const [fromData, toData] = await Promise.all([
      getCoinPrice(fromCurrency.id),
      getCoinPrice(toCurrency.id)
    ]);

    if (fromData && toData) {
      const newRate = toData.price / fromData.price;
      setRate(newRate);
      setLastUpdated(new Date().toLocaleTimeString());

      if (fromAmount !== '0') {
        const newToAmount = (parseFloat(fromAmount) * newRate).toString();
        setToAmount(newToAmount);
      }
    }
    setLoading(false);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (rate && value) {
      const newToAmount = (parseFloat(value) * rate).toString();
      setToAmount(newToAmount);
    } else {
      setToAmount('0');
    }
  };

  const handleToAmountChange = (value: string) => {
    setToAmount(value);
    if (rate && value) {
      const newFromAmount = (parseFloat(value) / rate).toString();
      setFromAmount(newFromAmount);
    } else {
      setFromAmount('0');
    }
  };

  useEffect(() => {
    updateRate();
    const interval = setInterval(updateRate, 10000);
    return () => clearInterval(interval);
  }, [fromCurrency.id, toCurrency.id]);

  return (
    <div className="p-2 h-full flex flex-col">
      <div className="space-y-2">
        <div className="bg-white/5 rounded-xl p-2">
          <div className="text-xs text-white/60 mb-1">You have</div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => {
                  setShowFromSelector(true);
                  setShowToSelector(false);
                }}
                className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <img src={fromCurrency.logo} alt={fromCurrency.symbol} className="w-4 h-4" />
                <span className="text-xs">{fromCurrency.symbol}</span>
                <ChevronDown className="w-3 h-3 text-white/60" />
              </button>
              <CurrencySelector
                isOpen={showFromSelector}
                onClose={() => setShowFromSelector(false)}
                onSelect={setFromCurrency}
                selectedCurrency={fromCurrency}
              />
            </div>
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => handleFromAmountChange(e.target.value)}
              className="flex-1 bg-transparent text-right outline-none text-sm"
              placeholder="0.00"
              min="0"
            />
          </div>
        </div>

        <div className="flex justify-center -my-1 relative z-[1]">
          <button 
            onClick={updateRate}
            className={`p-1 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors ${
              loading ? 'opacity-50' : ''
            }`}
            disabled={loading}
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="bg-white/5 rounded-xl p-2">
          <div className="text-xs text-white/60 mb-1">You get</div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => {
                  setShowToSelector(true);
                  setShowFromSelector(false);
                }}
                className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <img src={toCurrency.logo} alt={toCurrency.symbol} className="w-4 h-4" />
                <span className="text-xs">{toCurrency.symbol}</span>
                <ChevronDown className="w-3 h-3 text-white/60" />
              </button>
              <CurrencySelector
                isOpen={showToSelector}
                onClose={() => setShowToSelector(false)}
                onSelect={setToCurrency}
                selectedCurrency={toCurrency}
              />
            </div>
            <input
              type="number"
              value={toAmount}
              onChange={(e) => handleToAmountChange(e.target.value)}
              className="flex-1 bg-transparent text-right outline-none text-sm"
              placeholder="0.00"
              min="0"
            />
          </div>
        </div>

        <div className="text-center mt-1">
          <div className="text-[10px] text-white/40">
            Last updated: {lastUpdated} • Rate refreshes every 10 seconds
          </div>
          <div className="text-[10px] text-white/60 mt-0.5">
            1 {fromCurrency.symbol} = {rate?.toFixed(8)} {toCurrency.symbol}
          </div>
        </div>
      </div>
    </div>
  );
};