import React, { useState, useEffect } from 'react';
import { Bot, ArrowRight, CheckCircle2, X, Wallet } from 'lucide-react';

interface SendProcessProps {
  onClose: () => void;
}

export const SendProcess: React.FC<SendProcessProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionProgress, setTransactionProgress] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState('Initializing transaction...');

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

  const renderPreview = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
          <Wallet className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h3 className="text-xl font-medium">Send USDC</h3>
          <p className="text-white/60">Review transaction details</p>
        </div>
      </div>

      <div className="flex-1 bg-white/5 rounded-xl p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <img 
                src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" 
                alt="USDC" 
                className="w-10 h-10"
              />
              <div>
                <div className="text-sm text-white/60">Amount</div>
                <div className="text-xl font-medium">100 USDC</div>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-white/40" />
            <div className="flex items-center gap-3">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=vitalik"
                alt="Vitalik" 
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="text-sm text-white/60">Recipient</div>
                <div className="text-xl font-medium">vitalik.eth</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-white/60">Network</span>
              <span className="font-medium">Ethereum</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Transaction Fee</span>
              <span className="font-medium">~0.01 USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Total Amount</span>
              <span className="font-medium">100.01 USDC</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowConfirmation(true)}
          className="w-full mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg font-medium"
        >
          Confirm Send
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
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=vitalik"
              alt="Vitalik" 
              className="w-12 h-12 rounded-full"
            />
          </div>
          <p className="mt-4 text-white/60">
            Sending 100 USDC to vitalik.eth
          </p>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-medium mb-2">Transaction Successful!</h3>
          <p className="text-white/60 mb-2">
            Successfully sent 100 USDC to vitalik.eth
          </p>
          <p className="text-sm text-white/40">
            Transaction fee: 0.01 USDC
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg mt-6"
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
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-blue-500' : 'bg-white/10'
            }`}>
              <span>1</span>
            </div>
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
          {renderPreview()}
        </div>
      )}
    </div>
  );
};