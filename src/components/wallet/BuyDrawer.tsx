import React, { useState, useEffect } from 'react';
import { CreditCard, ChevronDown, Search } from 'lucide-react';
import { Drawer } from '../common/Drawer';
import { getCoinInfo } from '../../lib/coingecko';

interface BuyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  assets: {
    id: string;
    name: string;
    symbol: string;
    logo: string;
  }[];
}

export const BuyDrawer: React.FC<BuyDrawerProps> = ({ isOpen, onClose, assets }) => {
  const [selectedAsset, setSelectedAsset] = useState(assets[0]);
  const [amount, setAmount] = useState('');
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [assetLogos, setAssetLogos] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Fetch logos for assets when drawer opens
  useEffect(() => {
    if (isOpen && assets.length > 0) {
      const fetchLogos = async () => {
        setLoading(true);
        const logoPromises = assets.map(async (asset) => {
          try {
            // Map common symbols to CoinGecko IDs
            const symbolToId: Record<string, string> = {
              'ETH': 'ethereum',
              'BTC': 'bitcoin',
              'SOL': 'solana',
              'USDC': 'usd-coin',
              'USDT': 'tether',
              'DAI': 'dai',
              'AAVE': 'aave',
              'UNI': 'uniswap',
              'LINK': 'chainlink',
              'DOT': 'polkadot',
              'AVAX': 'avalanche-2',
              'MATIC': 'matic-network',
              'ADA': 'cardano',
              'DOGE': 'dogecoin',
              'SHIB': 'shiba-inu'
            };
            
            const coinId = symbolToId[asset.symbol] || asset.id.toLowerCase();
            const coinInfo = await getCoinInfo(coinId);
            
            return { symbol: asset.symbol, logo: coinInfo.image };
          } catch (error) {
            console.error(`Error fetching logo for ${asset.symbol}:`, error);
            return { symbol: asset.symbol, logo: `https://via.placeholder.com/32/4A90E2/FFFFFF?text=${asset.symbol.charAt(0)}` };
          }
        });
        
        const logos = await Promise.all(logoPromises);
        const logoMap = logos.reduce((acc, { symbol, logo }) => {
          acc[symbol] = logo;
          return acc;
        }, {} as Record<string, string>);
        
        setAssetLogos(logoMap);
        setLoading(false);
      };
      
      fetchLogos();
    }
  }, [isOpen, assets]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle buy transaction
    onClose();
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get logo for an asset
  const getAssetLogo = (asset: { symbol: string; logo: string }) => {
    return assetLogos[asset.symbol] || asset.logo;
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Buy Crypto">
      <form onSubmit={handleSubmit} className="space-y-6 p-4">
        {/* Asset Selector */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Asset</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAssetSelector(!showAssetSelector)}
              className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <img 
                src={getAssetLogo(selectedAsset)} 
                alt={selectedAsset.name} 
                className="w-8 h-8"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/32/4A90E2/FFFFFF?text=${selectedAsset.symbol.charAt(0)}`;
                }}
              />
              <div className="flex-1 text-left">
                <div className="font-medium">{selectedAsset.name}</div>
                <div className="text-sm text-white/60">{selectedAsset.symbol}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-white/40" />
            </button>

            {showAssetSelector && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowAssetSelector(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-2 p-2 glass rounded-lg z-20">
                  <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg mb-2">
                    <Search className="w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search assets..."
                      className="bg-transparent outline-none flex-1 text-sm"
                    />
                  </div>

                  <div className="max-h-48 overflow-y-auto">
                    {filteredAssets.map((asset) => (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => {
                          setSelectedAsset(asset);
                          setShowAssetSelector(false);
                        }}
                        className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <img 
                          src={getAssetLogo(asset)} 
                          alt={asset.name} 
                          className="w-6 h-6"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://via.placeholder.com/24/4A90E2/FFFFFF?text=${asset.symbol.charAt(0)}`;
                          }}
                        />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-sm text-white/60">{asset.symbol}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Amount (USD)</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-white/20"
          />
          <div className="flex items-center gap-2 mt-2">
            {[100, 500, 1000, 5000].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAmount(value.toString())}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm"
              >
                ${value}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Payment Method</label>
          <button
            type="button"
            className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium">Credit Card</div>
              <div className="text-sm text-white/60">Visa, Mastercard, etc.</div>
            </div>
            <ChevronDown className="w-4 h-4 text-white/40" />
          </button>
        </div>

        {/* Preview */}
        {amount && (
          <div className="p-4 bg-white/5 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Amount</span>
              <span>${parseFloat(amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Network Fee</span>
              <span>~$2.50</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Processing Fee (2.5%)</span>
              <span>${(parseFloat(amount) * 0.025).toFixed(2)}</span>
            </div>
            <div className="h-px bg-white/10 my-2" />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${(parseFloat(amount) * 1.025 + 2.5).toFixed(2)}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!amount}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
        >
          Buy {selectedAsset.symbol}
        </button>
      </form>
    </Drawer>
  );
};