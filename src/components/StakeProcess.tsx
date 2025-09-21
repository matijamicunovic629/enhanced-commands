import React, { useState, useEffect } from 'react';
import { Bot, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { getCoinInfo } from '../lib/coingecko';

interface StakeProcessProps {
  onClose: () => void;
}

export const StakeProcess: React.FC<StakeProcessProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionProgress, setTransactionProgress] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState('Initializing transaction...');
  const [ethLogo, setEthLogo] = useState('');
  const [lidoLogo, setLidoLogo] = useState('');

  useEffect(() => {
    // Fetch logos
    const fetchLogos = async () => {
      try {
        const ethInfo = await getCoinInfo('ethereum');
        if (ethInfo && ethInfo.image) {
          setEthLogo(ethInfo.image);
        } else {
          setEthLogo('https://via.placeholder.com/40/4A90E2/FFFFFF?text=ETH');
        }
        
        // For Lido, try to get it or use a placeholder
        try {
          const lidoInfo = await getCoinInfo('lido-dao');
          if (lidoInfo && lidoInfo.image) {
            setLidoLogo(lidoInfo.image);
          } else {
            setLidoLogo('https://via.placeholder.com/40/4A90E2/FFFFFF?text=LIDO');
          }
        } catch (error) {
          setLidoLogo('https://via.placeholder.com/40/4A90E2/FFFFFF?text=LIDO');
        }
      } catch (error) {
        console.error('Error fetching logos:', error);
        setEthLogo('https://via.placeholder.com/40/4A90E2/FFFFFF?text=ETH');
        setLidoLogo('https://via.placeholder.com/40/4A90E2/FFFFFF?text=LIDO');
      }
    };
    
    fetchLogos();
  }, []);

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
        { progress: 50, status: 'Submitting to Lido...' },
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
      <h3 className="mt-8 text-xl font-medium">Analyzing Staking Protocols</h3>
      <p className="mt-2 text-white/60 text-center max-w-md">
        Finding the best liquid staking solution for your ETH...
      </p>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-6">
        <img 
          src={lidoLogo || "https://via.placeholder.com/48/4A90E2/FFFFFF?text=LIDO"}
          alt="Lido"
          className="w-12 h-12"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/48/4A90E2/FFFFFF?text=LIDO";
          }}
        />
        <div>
          <h3 className="text-xl font-medium">Stake with Lido</h3>
          <p className="text-white/60">Best liquid staking protocol for ETH</p>
        </div>
      </div>

      <div className="flex-1 bg-white/5 rounded-xl p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <img 
                src={ethLogo || "https://via.placeholder.com/40/4A90E2/FFFFFF?text=ETH"}
                alt="ETH" 
                className="w-10 h-10"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/40/4A90E2/FFFFFF?text=ETH";
                }}
              />
              <div>
                <div className="text-sm text-white/60">You stake</div>
                <div className="text-xl font-medium">1.0 ETH</div>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-white/40" />
            <div className="flex items-center gap-3">
              <img 
                src={lidoLogo || "https://via.placeholder.com/40/4A90E2/FFFFFF?text=LIDO"}
                alt="stETH" 
                className="w-10 h-10"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/40/4A90E2/FFFFFF?text=LIDO";
                }}
              />
              <div>
                <div className="text-sm text-white/60">You receive</div>
                <div className="text-xl font-medium">1.0 stETH</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-white/60">Current APR</span>
              <span className="text-green-400 font-medium">5.3%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Rewards Distribution</span>
              <span className="font-medium">Daily</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Network Fee</span>
              <span className="font-medium">~$2.50</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Unstaking Period</span>
              <span className="font-medium">2-3 days</span>
            </div>
          </div>

          <div className="p-4 bg-blue-500/10 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
              <span className="font-medium">Benefits</span>
            </div>
            <ul className="space-y-2 text-sm text-white/80">
              <li>• Liquid staking token (stETH) can be used in DeFi</li>
              <li>• No minimum deposit</li>
              <li>• Daily rewards distribution</li>
              <li>• No slashing penalties for users</li>
            </ul>
          </div>
        </div>

        <button
          onClick={() => setShowConfirmation(true)}
          className="w-full mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg font-medium"
        >
          Stake 1 ETH
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
              src={ethLogo || "https://via.placeholder.com/40/4A90E2/FFFFFF?text=ETH"}
              alt="ETH" 
              className="w-12 h-12"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/48/4A90E2/FFFFFF?text=ETH";
              }}
            />
            <ArrowRight className="w-6 h-6 text-white/40" />
            <img 
              src={lidoLogo || "https://via.placeholder.com/40/4A90E2/FFFFFF?text=LIDO"}
              alt="stETH" 
              className="w-12 h-12"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/48/4A90E2/FFFFFF?text=LIDO";
              }}
            />
          </div>
          <p className="mt-4 text-white/60">
            Staking 1.0 ETH with Lido
          </p>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-medium mb-2">Successfully Staked!</h3>
          <div className="space-y-2 mb-6">
            <p className="text-white/60">
              You have staked 1.0 ETH and received 1.0 stETH
            </p>
            <p className="text-green-400">
              Expected Annual Yield: ~0.053 ETH ($172.25)
            </p>
            <p className="text-sm text-white/40">
              Transaction Fee: $2.50
            </p>
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