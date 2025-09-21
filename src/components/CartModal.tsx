import React, { useState, useEffect } from 'react';
import { X, Maximize2, Minimize2, ShoppingCart, Search, Plus, Minus, Trash2, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { useStore } from '../store/useStore';
import { getCoinPrice } from '../lib/coingecko';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  category: string;
  logo: string;
  chartData: {
    labels: string[];
    datasets: {
      data: number[];
      borderColor: string;
      borderWidth: number;
      fill: boolean;
      backgroundColor: string;
      tension: number;
    }[];
  };
}

// Mock chart data generator
const generateMockChartData = (basePrice: number, volatility: number = 0.1) => {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const prices = Array.from({ length: 24 }, (_, i) => {
    const randomFactor = 1 + (Math.random() * 2 - 1) * volatility;
    return basePrice * randomFactor;
  });

  return {
    labels: hours,
    datasets: [{
      data: prices,
      borderColor: '#10B981',
      borderWidth: 2,
      fill: true,
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4
    }]
  };
};

// Mock cryptocurrency data
const mockCoins: CoinData[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 67245.80,
    category: 'Layer 1',
    logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    chartData: generateMockChartData(67245.80)
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3245.67,
    category: 'Layer 1',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    chartData: generateMockChartData(3245.67)
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    price: 110.25,
    category: 'Layer 1',
    logo: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    chartData: generateMockChartData(110.25)
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    price: 0.65,
    category: 'Layer 1',
    logo: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
    chartData: generateMockChartData(0.65)
  },
  {
    id: 'dogecoin',
    name: 'Dogecoin',
    symbol: 'DOGE',
    price: 0.15,
    category: 'Meme',
    logo: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png',
    chartData: generateMockChartData(0.15)
  },
  {
    id: 'shiba-inu',
    name: 'Shiba Inu',
    symbol: 'SHIB',
    price: 0.00002,
    category: 'Meme',
    logo: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png',
    chartData: generateMockChartData(0.00002)
  },
  {
    id: 'uniswap',
    name: 'Uniswap',
    symbol: 'UNI',
    price: 7.50,
    category: 'DeFi',
    logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
    chartData: generateMockChartData(7.50)
  },
  {
    id: 'aave',
    name: 'Aave',
    symbol: 'AAVE',
    price: 95.00,
    category: 'DeFi',
    logo: 'https://cryptologos.cc/logos/aave-aave-logo.png',
    chartData: generateMockChartData(95.00)
  },
  {
    id: 'usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    price: 1.00,
    category: 'Stablecoin',
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    chartData: generateMockChartData(1.00, 0.001)
  },
  {
    id: 'tether',
    name: 'Tether',
    symbol: 'USDT',
    price: 1.00,
    category: 'Stablecoin',
    logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    chartData: generateMockChartData(1.00, 0.001)
  }
];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: false
    }
  },
  scales: {
    x: {
      display: false
    },
    y: {
      display: false
    }
  },
  elements: {
    point: {
      radius: 0
    }
  }
};

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet');
  const [realtimePrices, setRealtimePrices] = useState<Record<string, number>>({});
  const [priceChanges, setPriceChanges] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  } = useStore();

  const categories = ['All', 'Layer 1', 'DeFi', 'Meme', 'Stablecoin'];
  
  const filteredCoins = mockCoins.filter(coin => {
    const matchesCategory = selectedCategory === 'All' || coin.category === selectedCategory;
    const matchesSearch = 
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Fetch realtime prices for cart items
  useEffect(() => {
    if (!isOpen || cartItems.length === 0) return;

    const fetchPrices = async () => {
      setLoading(true);
      try {
        const pricePromises = cartItems.map(item => getCoinPrice(item.id));
        const prices = await Promise.all(pricePromises);
        
        const newPrices: Record<string, number> = {};
        const newChanges: Record<string, number> = {};
        
        prices.forEach((price, index) => {
          const item = cartItems[index];
          if (price) {
            newPrices[item.id] = price.price;
            newChanges[item.id] = price.priceChange24h;
          }
        });

        setRealtimePrices(newPrices);
        setPriceChanges(newChanges);
      } catch (error) {
        console.error('Error fetching realtime prices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    // Update prices every 30 seconds
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, [isOpen, cartItems]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      // Use realtime price if available, otherwise use static price
      const price = realtimePrices[item.id] || item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const renderTokenGrid = () => {
    if (filteredCoins.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <Search className="w-12 h-12 text-white/40 mb-4" />
          <p className="text-lg font-medium mb-2">No tokens found</p>
          <p className="text-white/60">
            Try adjusting your search or filter criteria
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4 p-4 h-[calc(100%-89px)] overflow-y-auto ai-chat-scrollbar">
        {filteredCoins.map((coin) => (
          <div
            key={coin.id}
            className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img src={coin.logo} alt={coin.name} className="w-8 h-8" />
                <div>
                  <div className="font-medium">{coin.name}</div>
                  <div className="text-sm text-white/60">{coin.symbol}</div>
                </div>
              </div>
              <div className="px-2 py-1 rounded-full text-xs font-medium bg-white/10">
                {coin.category}
              </div>
            </div>

            <div className="h-[100px] mb-3">
              <Line data={coin.chartData} options={chartOptions} />
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl font-bold">
                ${coin.price.toFixed(2)}
              </div>
            </div>

            <button
              onClick={() => addToCart({
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol,
                price: coin.price,
                logo: coin.logo,
                category: coin.category
              })}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderCheckout = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-xl font-semibold">Checkout</h2>
        <button
          onClick={() => setShowCheckout(false)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img src={item.logo} alt={item.name} className="w-8 h-8" />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-white/60">
                        {item.quantity} × ${(realtimePrices[item.id] || item.price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="font-medium">
                    ${((realtimePrices[item.id] || item.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Payment Method</h3>
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod('wallet')}
                className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
                  paymentMethod === 'wallet'
                    ? 'bg-blue-500'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">Crypto Wallet</div>
                    <div className="text-sm text-white/60">
                      Pay with your connected wallet
                    </div>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5" />
              </button>

              <button
                onClick={() => setPaymentMethod('card')}
                className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
                  paymentMethod === 'card'
                    ? 'bg-blue-500'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">Credit Card</div>
                    <div className="text-sm text-white/60">
                      Pay with Visa, Mastercard, etc.
                    </div>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mb-8">
            <div className="p-4 bg-white/5 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60">Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Network Fee</span>
                <span>~$2.50</span>
              </div>
              <div className="h-px bg-white/10 my-2" />
              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span>${(calculateTotal() + 2.50).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              // Handle payment
              clearCart();
              onClose();
            }}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors font-medium"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative glass border border-white/10 shadow-lg transition-all duration-300 ease-in-out ${
          isFullscreen
            ? 'w-full h-full rounded-none'
            : 'w-[90%] h-[90%] rounded-xl'
        }`}
      >
        {showCheckout ? renderCheckout() : (
          <div className="flex h-full">
            {/* Left Side - Token Grid */}
            <div className="flex-1 flex flex-col border-r border-white/10">
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-white/10'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tokens..."
                    className="w-full bg-white/5 pl-10 pr-4 py-2 rounded-lg outline-none placeholder:text-white/40"
                  />
                </div>
              </div>

              {renderTokenGrid()}
            </div>

            {/* Right Side - Cart */}
            <div className="w-[400px] flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto ai-chat-scrollbar">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingCart className="w-12 h-12 text-white/40 mb-4" />
                    <p className="text-lg font-medium mb-2">Your cart is empty</p>
                    <p className="text-white/60">
                      Add some tokens to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {loading && (
                      <div className="text-sm text-white/60 text-center mb-3">
                        Updating prices...
                      </div>
                    )}
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-3 bg-white/5 rounded-lg"
                      >
                        <img src={item.logo} alt={item.name} className="w-10 h-10" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{item.name}</div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 hover:bg-white/10 rounded-md transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-white/10 rounded-md transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-white/10 rounded-md transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">
                                  ${(realtimePrices[item.id] || item.price).toFixed(2)}
                                </span>
                                {priceChanges[item.id] !== undefined && (
                                  <span className={`text-sm flex items-center gap-0.5 ${
                                    priceChanges[item.id] >= 0 ? 'text-green-400' : 'text-red-400'
                                  }`}>
                                    {priceChanges[item.id] >= 0 ? (
                                      <TrendingUp className="w-3 h-3" />
                                    ) : (
                                      <TrendingDown className="w-3 h-3" />
                                    )}
                                    {Math.abs(priceChanges[item.id]).toFixed(2)}%
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-white/60">
                                Total: ${((realtimePrices[item.id] || item.price) * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg">Total</span>
                  <span className="text-2xl font-bold">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={clearCart}
                    className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={() => setShowCheckout(true)}
                    disabled={cartItems.length === 0}
                    className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};