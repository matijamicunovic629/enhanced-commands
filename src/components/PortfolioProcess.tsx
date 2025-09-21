import React, { useState, useEffect } from 'react';
import { Bot, ArrowRight, CheckCircle2, X } from 'lucide-react';

interface PortfolioProcessProps {
  onClose: () => void;
}

interface Stock {
  symbol: string;
  name: string;
  price: number;
  logo: string;
  shares: number;
  allocation: number;
}

const stocks: Stock[] = [
  {
    symbol: 'bNVDA',
    name: 'NVIDIA Corporation',
    price: 137.71,
    logo: 'https://tse3.mm.bing.net/th?id=OIP.VDjRmvfcZB4-Jm5iE3ScOgAAAA&w=474&h=474&c=7',
    shares: 12.10,
    allocation: 1666.67
  },
  {
    symbol: 'bCOIN',
    name: 'Coinbase Global Inc',
    price: 295.48,
    logo: 'https://tse1.mm.bing.net/th?id=OIP.lb0gmGG0L1Di_7udYGe44wHaHh&w=474&h=474&c=7',
    shares: 5.64,
    allocation: 1666.67
  },
  {
    symbol: 'bTSLA',
    name: 'Tesla Inc',
    price: 426.50,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png',
    shares: 3.91,
    allocation: 1666.67
  }
];

export const PortfolioProcess: React.FC<PortfolioProcessProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionProgress, setTransactionProgress] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState('Initializing transaction...');

  useEffect(() => {
    if (step === 1) {
      const timer = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(timer);
            setTimeout(() => setStep(2), 500);
            return 100;
          }
          return p + 1;
        });
      }, 30);
      return () => clearInterval(timer);
    }
  }, [step]);

  useEffect(() => {
    if (showConfirmation) {
      const stages = [
        { progress: 25, status: 'Preparing transactions...' },
        { progress: 50, status: 'Submitting orders...' },
        { progress: 75, status: 'Waiting for confirmation...' },
        { progress: 100, status: 'Portfolio allocation complete!' }
      ];

      let currentStage = 0;
      const timer = setInterval(() => {
        if (currentStage < stages.length) {
          setTransactionProgress(stages[currentStage].progress);
          setTransactionStatus(stages[currentStage].status);
          currentStage++;
        } else {
          clearInterval(timer);
        }
      }, 1500);

      return () => clearInterval(timer);
    }
  }, [showConfirmation]);

  const renderStep1 = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0">
          <svg className="w-full h-full">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="8"
              strokeDasharray={`${progress * 3.77} 377`}
              className="transform -rotate-90 transition-all duration-300"
            />
          </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Bot className="w-12 h-12 text-blue-500" />
        </div>
      </div>
      <h3 className="mt-8 text-xl font-medium">Analyzing Market Prices</h3>
      <div className="mt-6 space-y-4 w-full max-w-md">
        {stocks.map((stock) => (
          <div 
            key={stock.symbol}
            className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <img src={stock.logo} alt={stock.symbol} className="w-8 h-8" />
              <span className="font-medium">${stock.symbol}</span>
            </div>
            <div className="text-lg font-medium">
              ${stock.price} USDC
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-white/60 text-center">
        Calculating optimal portfolio allocation...
      </p>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
          <Bot className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h3 className="text-xl font-medium">Portfolio Allocation</h3>
          <p className="text-white/60">Review your portfolio allocation</p>
        </div>
      </div>

      <div className="flex-1 bg-white/5 rounded-xl p-6">
        <div className="space-y-6">
          {stocks.map((stock) => (
            <div
              key={stock.symbol}
              className="flex justify-between items-center p-4 bg-white/5 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <img 
                  src={stock.logo} 
                  alt={stock.name} 
                  className="w-10 h-10"
                />
                <div>
                  <div className="text-sm text-white/60">You get</div>
                  <div className="text-xl font-medium">{stock.shares.toFixed(2)} ${stock.symbol}</div>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-white/40" />
              <div>
                <div className="text-sm text-white/60">Cost</div>
                <div className="text-xl font-medium">{stock.allocation.toFixed(2)} USDC</div>
              </div>
            </div>
          ))}

          <div className="p-4 bg-white/5 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-white/60">Total Investment</span>
              <span className="font-medium">5000 USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Network Fee</span>
              <span className="font-medium">~$2.50</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowConfirmation(true)}
          className="w-full mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg font-medium"
        >
          Confirm Portfolio Allocation
        </button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
      {transactionProgress < 100 ? (
        <>
          <div className="w-full max-w-md mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-white/60">{transactionStatus}</span>
              <span className="text-sm text-white/60">{transactionProgress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${transactionProgress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 animate-pulse">
            <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" alt="USDC" className="w-12 h-12" />
            <ArrowRight className="w-6 h-6 text-white/40" />
            <div className="flex items-center gap-2">
              {stocks.map((stock) => (
                <img key={stock.symbol} src={stock.logo} alt={stock.symbol} className="w-12 h-12" />
              ))}
            </div>
          </div>
          <p className="mt-4 text-white/60">
            Allocating 5000 USDC across selected stocks...
          </p>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-medium mb-2">Portfolio Allocation Complete!</h3>
          <div className="space-y-2 mb-6">
            {stocks.map((stock) => (
              <p key={stock.symbol} className="text-white/60">
                ${stock.symbol}: {stock.allocation.toFixed(2)} USDC → {stock.shares.toFixed(2)} shares
              </p>
            ))}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg"
          >
            Close
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= s ? 'bg-blue-500' : 'bg-white/10'
                }`}>
                  {step > s ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span>{s}</span>
                  )}
                </div>
                {s < 2 && (
                  <div className={`w-12 h-0.5 ${
                    step > s ? 'bg-blue-500' : 'bg-white/10'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {showConfirmation ? renderConfirmation() : (
        <div className="h-[calc(100%-60px)]">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
        </div>
      )}
    </div>
  );
};