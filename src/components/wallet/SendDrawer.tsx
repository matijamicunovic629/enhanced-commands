import React, { useState } from 'react';
import { Search, ArrowRight, ChevronDown } from 'lucide-react';
import { Drawer } from '../common/Drawer';

interface SendDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  assets: {
    id: string;
    name: string;
    symbol: string;
    amount: number;
    logo: string;
  }[];
}

export const SendDrawer: React.FC<SendDrawerProps> = ({ isOpen, onClose, assets }) => {
  const [selectedAsset, setSelectedAsset] = useState(assets[0]);
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle send transaction
    onClose();
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Send Assets">
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
              <img src={selectedAsset.logo} alt={selectedAsset.name} className="w-8 h-8" />
              <div className="flex-1 text-left">
                <div className="font-medium">{selectedAsset.name}</div>
                <div className="text-sm text-white/60">
                  Balance: {selectedAsset.amount} {selectedAsset.symbol}
                </div>
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
                        <img src={asset.logo} alt={asset.name} className="w-6 h-6" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-sm text-white/60">
                            {asset.amount} {asset.symbol}
                          </div>
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
          <label className="block text-sm text-white/60 mb-2">Amount</label>
          <div className="relative">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-white/20"
            />
            <button
              type="button"
              onClick={() => setAmount(selectedAsset.amount.toString())}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-sm text-blue-400 hover:text-blue-300"
            >
              MAX
            </button>
          </div>
          <div className="mt-1 text-sm text-white/40">
            Available: {selectedAsset.amount} {selectedAsset.symbol}
          </div>
        </div>

        {/* Address Input */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Send To</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter wallet address or ENS name"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-white/20"
          />
        </div>

        {/* Preview */}
        {amount && address && (
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={selectedAsset.logo} alt={selectedAsset.name} className="w-8 h-8" />
                <div>
                  <div className="text-sm text-white/60">You send</div>
                  <div className="font-medium">
                    {amount} {selectedAsset.symbol}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/40" />
              <div>
                <div className="text-sm text-white/60">To</div>
                <div className="font-medium font-mono">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </div>
              </div>
            </div>
            <div className="text-sm text-white/60">
              Network Fee: ~$2.50
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!amount || !address}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
        >
          Send {selectedAsset.symbol}
        </button>
      </form>
    </Drawer>
  );
};