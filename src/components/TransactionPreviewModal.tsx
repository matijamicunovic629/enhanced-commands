import React, { useState, useEffect } from 'react';
import { 
  X, ArrowRight, CheckCircle2, Loader2, 
  AlertTriangle, Info, Clock, DollarSign,
  Zap, Shield, TrendingUp, Maximize2, Minimize2
} from 'lucide-react';
import { TransactionCommand } from '../types/commandCenter';
import { getCoinInfo } from '../lib/coingecko';

interface TransactionPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  command: TransactionCommand;
  originalText: string;
}

interface PreviewStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export const TransactionPreviewModal: React.FC<TransactionPreviewModalProps> = ({
  isOpen,
  onClose,
  command,
  originalText
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tokenLogos, setTokenLogos] = useState<Record<string, string>>({});
  const [estimatedFee, setEstimatedFee] = useState(2.50);
  const [estimatedTime, setEstimatedTime] = useState('~30 seconds');

  const steps: PreviewStep[] = [
    {
      id: 'analyze',
      title: 'Analyzing Command',
      description: `Processing: "${originalText}"`,
      status: 'pending'
    },
    {
      id: 'prepare',
      title: 'Preparing Transaction',
      description: 'Calculating optimal route and fees',
      status: 'pending'
    },
    {
      id: 'execute',
      title: 'Executing Transaction',
      description: 'Submitting to blockchain network',
      status: 'pending'
    },
    {
      id: 'confirm',
      title: 'Confirming Transaction',
      description: 'Waiting for network confirmation',
      status: 'pending'
    }
  ];

  // Fetch token logos
  useEffect(() => {
    const fetchLogos = async () => {
      const logos: Record<string, string> = {};
      
      if (command.fromToken) {
        try {
          const fromInfo = await getCoinInfo(command.fromToken.toLowerCase());
          logos[command.fromToken] = fromInfo.image;
        } catch (error) {
          logos[command.fromToken] = `https://via.placeholder.com/40/4A90E2/FFFFFF?text=${command.fromToken.charAt(0)}`;
        }
      }
      
      if (command.toToken) {
        try {
          const toInfo = await getCoinInfo(command.toToken.toLowerCase());
          logos[command.toToken] = toInfo.image;
        } catch (error) {
          logos[command.toToken] = `https://via.placeholder.com/40/4A90E2/FFFFFF?text=${command.toToken.charAt(0)}`;
        }
      }
      
      setTokenLogos(logos);
    };

    if (isOpen) {
      fetchLogos();
    }
  }, [isOpen, command]);

  // Animation sequence
  useEffect(() => {
    if (isOpen && !isProcessing && !showSuccess) {
      const timer = setTimeout(() => {
        setIsProcessing(true);
        executeSteps();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const executeSteps = async () => {
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    setShowSuccess(true);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  const getTransactionTitle = () => {
    switch (command.type) {
      case 'swap':
        return `Swap ${command.fromToken} for ${command.toToken}`;
      case 'send':
        return `Send ${command.fromToken}`;
      case 'bridge':
        return `Bridge ${command.fromToken} to ${command.chain}`;
      case 'stake':
        return `Stake ${command.fromToken}`;
      case 'lend':
        return `Lend ${command.fromToken}`;
      default:
        return 'Transaction Preview';
    }
  };

  const renderPreview = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-4">{getTransactionTitle()}</h3>
        <p className="text-lg text-white/60">Review transaction details before proceeding</p>
      </div>

      {/* Transaction Details */}
      <div className="bg-white/5 rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          {command.fromToken && (
            <div className="flex items-center gap-3">
              <img 
                src={tokenLogos[command.fromToken] || `https://via.placeholder.com/40/4A90E2/FFFFFF?text=${command.fromToken.charAt(0)}`}
                alt={command.fromToken}
                className="w-16 h-16"
              />
              <div>
                <div className="text-base text-white/60">From</div>
                <div className="text-xl font-medium">{command.amount || '0'} {command.fromToken}</div>
              </div>
            </div>
          )}
          
          {command.toToken && (
            <>
              <ArrowRight className="w-8 h-8 text-white/40" />
              <div className="flex items-center gap-3">
                <img 
                  src={tokenLogos[command.toToken] || `https://via.placeholder.com/40/4A90E2/FFFFFF?text=${command.toToken.charAt(0)}`}
                  alt={command.toToken}
                  className="w-16 h-16"
                />
                <div>
                  <div className="text-base text-white/60">To</div>
                  <div className="text-xl font-medium">{command.toToken}</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Transaction Info */}
        <div className="space-y-4 p-6 bg-white/5 rounded-lg">
          <div className="flex justify-between">
            <span className="text-lg text-white/60">Estimated Fee</span>
            <span className="text-lg font-medium">${estimatedFee}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-lg text-white/60">Estimated Time</span>
            <span className="text-lg font-medium">{estimatedTime}</span>
          </div>
          {command.recipient && (
            <div className="flex justify-between">
              <span className="text-lg text-white/60">Recipient</span>
              <span className="text-lg font-mono">{command.recipient}</span>
            </div>
          )}
          {command.chain && (
            <div className="flex justify-between">
              <span className="text-lg text-white/60">Network</span>
              <span className="text-lg font-medium">{command.chain}</span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setIsProcessing(true)}
        className="w-full py-4 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-lg font-medium"
      >
        Confirm Transaction
      </button>
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center space-y-8">
      <div className="relative w-40 h-40 mx-auto">
        <div className="absolute inset-0">
          <svg className="w-full h-full">
            <circle
              cx="80"
              cy="80"
              r="75"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="10"
            />
            <circle
              cx="80"
              cy="80"
              r="75"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="10"
              strokeDasharray={`${((currentStep + 1) / steps.length) * 471} 471`}
              className="transform -rotate-90 transition-all duration-1000"
            />
          </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-medium mb-4">{steps[currentStep]?.title}</h3>
        <p className="text-lg text-white/60">{steps[currentStep]?.description}</p>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center gap-4 p-4 rounded-lg ${
              index <= currentStep ? 'bg-blue-500/20' : 'bg-white/5'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index < currentStep ? 'bg-green-500' :
              index === currentStep ? 'bg-blue-500' : 'bg-white/10'
            }`}>
              {index < currentStep ? (
                <CheckCircle2 className="w-5 h-5 text-white" />
              ) : (
                <span className="text-base">{index + 1}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="text-lg font-medium">{step.title}</div>
              <div className="text-base text-white/60">{step.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-8">
      <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </div>
      
      <div>
        <h3 className="text-3xl font-bold mb-4">Transaction Successful!</h3>
        <p className="text-lg text-white/60">Your {command.type} has been completed successfully</p>
      </div>

      <div className="bg-white/5 rounded-xl p-6">
        <div className="space-y-3 text-base">
          <div className="flex justify-between">
            <span className="text-white/60">Transaction Hash</span>
            <span className="font-mono text-lg">0x742d...f44e</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Network Fee</span>
            <span className="font-medium">${estimatedFee}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Completion Time</span>
            <span className="font-medium">{estimatedTime}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-lg"
      >
        Close
      </button>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative glass border border-white/10 shadow-lg transition-all duration-300 ease-in-out ${
        isFullscreen
          ? 'w-full h-full rounded-none'
          : 'w-[800px] h-[700px] rounded-xl'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Transaction Preview</h2>
              <p className="text-white/60">Review before proceeding</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto ai-chat-scrollbar p-4">
          {showSuccess ? renderSuccess() : isProcessing ? renderProcessing() : renderPreview()}
        </div>
      </div>
    </div>
  );
};