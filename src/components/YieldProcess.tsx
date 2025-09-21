import React, { useState, useEffect } from 'react';
import { Bot, Search, ArrowRight, CheckCircle2, X } from 'lucide-react';

interface YieldProcessProps {
  onClose: () => void;
}

interface Protocol {
  name: string;
  apy: number;
  tvl: number;
  risk: 'Low' | 'Medium' | 'High';
  description: string;
  logo: string;
}

const protocols: Protocol[] = [
  {
    name: 'Aave V3',
    apy: 4.12,
    tvl: 520000000,
    risk: 'Low',
    description: 'Leading lending protocol with strong security track record',
    logo: 'https://cryptologos.cc/logos/aave-aave-logo.png'
  },
  {
    name: 'Compound V3',
    apy: 3.89,
    tvl: 480000000,
    risk: 'Low',
    description: 'Established lending protocol with automated interest rates',
    logo: 'https://cryptologos.cc/logos/compound-comp-logo.png'
  },
  {
    name: 'Curve Finance',
    apy: 5.34,
    tvl: 320000000,
    risk: 'Medium',
    description: 'Efficient stablecoin exchange and yield farming',
    logo: 'https://cryptologos.cc/logos/curve-dao-token-crv-logo.png'
  }
];

export const YieldProcess: React.FC<YieldProcessProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
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
        { progress: 25, status: 'Preparing transaction...' },
        { progress: 50, status: 'Submitting to network...' },
        { progress: 75, status: 'Waiting for confirmation...' },
        { progress: 100, status: 'Transaction confirmed!' }
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
      <h3 className="mt-8 text-xl font-medium">Observer Agent</h3>
      <p className="mt-2 text-white/60 text-center max-w-md">
        Analyzing market conditions and scanning protocols for the best USDC yield opportunities...
      </p>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
          <Search className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h3 className="text-xl font-medium">Task Manager Agent</h3>
          <p className="text-white/60">Reviewing and analyzing yield opportunities</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        {protocols.map((protocol) => (
          <div
            key={protocol.name}
            onClick={() => setSelectedProtocol(protocol)}
            className={`p-4 rounded-xl transition-all cursor-pointer ${
              selectedProtocol?.name === protocol.name
                ? 'bg-blue-500/20 border border-blue-500/50'
                : 'bg-white/5 hover:bg-white/10 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-4 mb-2">
              <img 
                src={protocol.logo} 
                alt={protocol.name} 
                className="w-8 h-8 object-contain"
              />
              <div className="flex-1 flex items-center justify-between">
                <h4 className="font-medium">{protocol.name}</h4>
                <div className="text-lg font-semibold text-blue-400">
                  {protocol.apy}% APY
                </div>
              </div>
            </div>
            <p className="text-sm text-white/60 mb-2">{protocol.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-white/40">TVL:</span>{' '}
                <span className="text-white/80">
                  ${(protocol.tvl / 1000000).toFixed(1)}M
                </span>
              </div>
              <div>
                <span className="text-white/40">Risk:</span>{' '}
                <span className={`
                  ${protocol.risk === 'Low' ? 'text-green-400' : ''}
                  ${protocol.risk === 'Medium' ? 'text-yellow-400' : ''}
                  ${protocol.risk === 'High' ? 'text-red-400' : ''}
                `}>
                  {protocol.risk}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => selectedProtocol && setStep(3)}
          disabled={!selectedProtocol}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
          <Bot className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <h3 className="text-xl font-medium">Executor Agent</h3>
          <p className="text-white/60">Ready to execute yield strategy</p>
        </div>
      </div>

      <div className="flex-1 bg-white/5 rounded-xl p-6">
        <h4 className="text-lg font-medium mb-4">Transaction Summary</h4>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <img 
                src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" 
                alt="USDC" 
                className="w-8 h-8"
              />
              <div>
                <div className="text-sm text-white/60">Amount</div>
                <div className="text-lg font-medium">3,000 USDC</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-white/40" />
            <div className="flex items-center gap-3">
              <img 
                src={selectedProtocol?.logo} 
                alt={selectedProtocol?.name} 
                className="w-8 h-8"
              />
              <div className="text-right">
                <div className="text-sm text-white/60">Protocol</div>
                <div className="text-lg font-medium">{selectedProtocol?.name}</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-white/60">Expected APY</span>
              <span className="text-blue-400 font-medium">
                {selectedProtocol?.apy}%
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-white/60">Gas Fee (estimated)</span>
              <span className="font-medium">~$2.50</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Protocol Risk</span>
              <span className={`font-medium
                ${selectedProtocol?.risk === 'Low' ? 'text-green-400' : ''}
                ${selectedProtocol?.risk === 'Medium' ? 'text-yellow-400' : ''}
                ${selectedProtocol?.risk === 'High' ? 'text-red-400' : ''}
              `}>
                {selectedProtocol?.risk}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowConfirmation(true)}
          className="w-full mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg font-medium"
        >
          Confirm Deposit
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
            <img 
              src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" 
              alt="USDC" 
              className="w-12 h-12"
            />
            <ArrowRight className="w-6 h-6 text-white/40" />
            <img 
              src={selectedProtocol?.logo} 
              alt={selectedProtocol?.name} 
              className="w-12 h-12"
            />
          </div>
          <p className="mt-4 text-white/60">
            Depositing 3,000 USDC into {selectedProtocol?.name}
          </p>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-medium mb-2">Transaction Successful!</h3>
          <p className="text-white/60 mb-6">
            Your USDC has been successfully deposited into {selectedProtocol?.name}
          </p>
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
            {[1, 2, 3].map((s) => (
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
                {s < 3 && (
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
          {step === 3 && renderStep3()}
        </div>
      )}
    </div>
  );
};