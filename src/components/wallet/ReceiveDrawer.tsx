import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Copy, CheckCircle } from 'lucide-react';
import * as QRCode from 'qrcode';
import { Drawer } from '../common/Drawer';

interface ReceiveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  assets: {
    id: string;
    name: string;
    symbol: string;
    logo: string;
  }[];
  walletAddress: string;
}

export const ReceiveDrawer: React.FC<ReceiveDrawerProps> = ({ isOpen, onClose, assets, walletAddress }) => {
  const [selectedAsset, setSelectedAsset] = useState(assets[0]);
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && walletAddress) {
      QRCode.toDataURL(walletAddress, {
        width: 200,
        margin: 1,
        color: {
          dark: '#ffffff',
          light: '#00000000'
        }
      })
        .then(url => setQrCode(url))
        .catch(err => console.error('Error generating QR code:', err));
    }
  }, [isOpen, walletAddress]);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Receive Assets">
      <div className="space-y-6 p-4">
        {/* Asset Selector */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Asset</label>
          <div className="relative">
            <button
              onClick={() => setShowAssetSelector(!showAssetSelector)}
              className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <img src={selectedAsset.logo} alt={selectedAsset.name} className="w-8 h-8" />
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
                        onClick={() => {
                          setSelectedAsset(asset);
                          setShowAssetSelector(false);
                        }}
                        className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <img src={asset.logo} alt={asset.name} className="w-6 h-6" />
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

        {/* QR Code */}
        <div className="flex flex-col items-center">
          <div className="w-48 h-48 bg-white/5 rounded-xl p-4 mb-4">
            {qrCode && (
              <img
                src={qrCode}
                alt="Wallet QR Code"
                className="w-full h-full"
              />
            )}
          </div>
          <div className="text-sm text-white/60 mb-2">
            Only send {selectedAsset.symbol} to this address
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Wallet Address</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm">
              {walletAddress}
            </div>
            <button
              onClick={handleCopy}
              className="p-3 hover:bg-white/10 rounded-lg transition-colors"
            >
              {copied ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Network Info */}
        <div className="text-center text-sm text-white/60">
          This address supports receiving {selectedAsset.symbol} on the Ethereum network.
          <br />
          Sending assets from other networks may result in permanent loss.
        </div>
      </div>
    </Drawer>
  );
};