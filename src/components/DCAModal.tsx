import React, { useState } from 'react';
import { X, Calendar, Clock, DollarSign, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

interface DCAModalProps {
  isOpen: boolean;
  onClose: () => void;
  dcaData: {
    amount: string;
    token: string;
    frequency: string;
  };
}

export const DCAModal: React.FC<DCAModalProps> = ({ isOpen, onClose, dcaData }) => {
  const [dcaConfirmed, setDcaConfirmed] = useState(false);
  const [dcaLoading, setDcaLoading] = useState(false);

  const handleDcaConfirm = () => {
    setDcaLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      setDcaLoading(false);
      setDcaConfirmed(true);
      
      // Hide DCA interface after a delay
      setTimeout(() => {
        onClose();
        setDcaConfirmed(false);
      }, 3000);
    }, 1500);
  };

  if (!isOpen) return null;

  // Parse DCA data
  const dcaAmount = parseInt(dcaData.amount) || 10;
  const dcaToken = dcaData.token || 'ETH';
  const dcaFrequency = dcaData.frequency.charAt(0).toUpperCase() + dcaData.frequency.slice(1) || 'Daily';
  
  // Get token logo based on the actual token
  const getTokenLogo = (token: string) => {
    const tokenLogos: Record<string, string> = {
      'ETH': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      'BTC': 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
      'SOL': 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
      'ADA': 'https://assets.coingecko.com/coins/images/975/small/cardano.png'
    };
    return tokenLogos[token] || `https://via.placeholder.com/40/4A90E2/FFFFFF?text=${token.charAt(0)}`;
  };
  
  const dcaTokenLogo = getTokenLogo(dcaToken);
  const dcaEstimatedMonthly = dcaFrequency.toLowerCase() === 'daily' ? dcaAmount * 30 : dcaAmount * 4;
  const dcaNextExecution = dcaFrequency.toLowerCase() === 'daily' ? 'Tomorrow' : 'Next Monday';

  return (
    <div className="fixed inset-x-0 bottom-0 mb-24 z-50 px-6">
      <div className="relative bg-gradient-to-b from-black/60 to-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-[800px] mx-auto shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">DCA Setup</h2>
              <p className="text-sm text-white/60">Dollar-Cost Averaging Plan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {!dcaConfirmed ? (
            <>
              {/* Token Exchange Visual */}
              <div className="flex justify-between items-center p-6 bg-white/5 rounded-xl">
                <div className="flex items-center gap-4">
                  <img 
                    src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png" 
                    alt="USDC" 
                    className="w-12 h-12"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/48/4A90E2/FFFFFF?text=USDC";
                    }}
                  />
                  <div>
                    <div className="text-sm text-white/60">From</div>
                    <div className="text-2xl font-bold">{dcaAmount} USDC</div>
                  </div>
                </div>
                <ArrowRight className="w-8 h-8 text-white/40" />
                <div className="flex items-center gap-4">
                  <img 
                    src={dcaTokenLogo} 
                    alt={dcaToken} 
                    className="w-12 h-12"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/48/4A90E2/FFFFFF?text=${dcaToken}`;
                    }}
                  />
                  <div>
                    <div className="text-sm text-white/60">To</div>
                    <div className="text-2xl font-bold">{dcaToken}</div>
                  </div>
                </div>
              </div>

              {/* DCA Details */}
              <div className="bg-white/5 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <span className="text-white/60">Frequency</span>
                  </div>
                  <span className="text-xl font-medium">{dcaFrequency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-400" />
                    <span className="text-white/60">Execution Time</span>
                  </div>
                  <span className="text-xl font-medium">12:00 PM UTC</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-purple-400" />
                    <span className="text-white/60">Estimated Monthly</span>
                  </div>
                  <span className="text-xl font-medium">{dcaEstimatedMonthly} USDC</span>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleDcaConfirm}
                disabled={dcaLoading}
                className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors text-lg font-medium"
              >
                {dcaLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Setting up DCA...</span>
                  </div>
                ) : (
                  'Confirm DCA Plan'
                )}
              </button>
            </>
          ) : (
            /* Success State */
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">DCA Plan Created!</h3>
                <p className="text-white/60">Your {dcaToken} DCA plan has been scheduled successfully</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 max-w-md mx-auto">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Amount:</span>
                    <span className="font-medium">{dcaAmount} USDC</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Asset:</span>
                    <span className="font-medium">{dcaToken}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Frequency:</span>
                    <span className="font-medium">{dcaFrequency}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Next execution:</span>
                    <span className="font-medium">{dcaNextExecution}, 12:00 PM UTC</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                <span>View in DCA Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>

        {/* Triangle Pointer */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
          <div className="border-8 border-transparent border-t-white/10" />
        </div>
      </div>
    </div>
  );
};