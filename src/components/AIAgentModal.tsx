import { useState, useEffect } from 'react';
import { 
  Bot, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  Maximize2, 
  Minimize2, 
  Mic, 
  Send, 
  Brain,
  LineChart,
  Wallet,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Landmark,
  Trash2,
  Calendar,
  Clock,
  DollarSign,
  Loader2
} from 'lucide-react';
import { VoiceModal } from './VoiceModal';
import { Message } from '../types';
import { PriceChart } from './PriceChart';
import { TrendingCoins } from './TrendingCoins';
import { NewsWidget } from './widgets/NewsWidget';
import { YieldProcess } from './YieldProcess';
import { SwapProcess } from './SwapProcess';
import { BridgeProcess } from './BridgeProcess';
import { PortfolioProcess } from './PortfolioProcess';
import { StakeProcess } from './StakeProcess';
import { ProjectAnalysisProcess } from './ProjectAnalysisProcess';
import { TransactionPreviewModal } from './TransactionPreviewModal';
import { useStore } from '../store/useStore';
import { mockDeFiPositions } from '../lib/wallet';
import { generateResponse } from '../lib/openai';
import { getCoinInfo } from '../lib/coingecko';

interface AIAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type WalletTab = 'assets' | 'defi';

export default function AIAgentModal({ isOpen, onClose }: AIAgentModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showYieldProcess, setShowYieldProcess] = useState(false);
  const [showSwapProcess, setShowSwapProcess] = useState(false);
  const [showBridgeProcess, setShowBridgeProcess] = useState(false);
  const [showPortfolioProcess, setShowPortfolioProcess] = useState(false);
  const [showStakeProcess, setShowStakeProcess] = useState(false);
  const [showProjectAnalysis, setShowProjectAnalysis] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [showTransactionPreview, setShowTransactionPreview] = useState(false);
  const [transactionCommand, setTransactionCommand] = useState<any>(null);
  const [isWalletPanelOpen, setIsWalletPanelOpen] = useState(true);
  const [activeWalletTab, setActiveWalletTab] = useState<WalletTab>('assets');
  
  // DCA States
  const [showDCA, setShowDCA] = useState(false);
  const [dcaConfirmed, setDcaConfirmed] = useState(false);
  const [dcaLoading, setDcaLoading] = useState(false);
  const [dcaType, setDcaType] = useState<'eth' | 'btc'>('eth');

  // Reset all process states
  const resetProcessStates = () => {
    setShowYieldProcess(false);
    setShowSwapProcess(false);
    setShowBridgeProcess(false);
    setShowPortfolioProcess(false);
    setShowStakeProcess(false);
    setShowProjectAnalysis(false);
    setShowTransactionPreview(false);
    setShowDCA(false);
    setDcaConfirmed(false);
    setDcaLoading(false);
  };

  const processCommand = async (text: string) => {
    try {
      setIsProcessing(true);
      const normalizedText = text.toLowerCase().trim();
      let response: any = null;

      // Process chained commands
      const commands = normalizedText.split(/\s+(?:and|&)\s+/i);
      
      for (const command of commands) {
        const normalizedCommand = command.trim();

        // ETH DCA command
        if (normalizedCommand.match(/create\s+(?:a\s+)?dca\s+to\s+purchase\s+(\d+)\s+usdc\s+worth\s+of\s+eth\s+on\s+(?:a\s+)?daily\s+basis/i)) {
          resetProcessStates();
          setDcaType('eth');
          setShowDCA(true);
          response = { text: 'Setting up ETH DCA plan...' };
        }
        // Bitcoin DCA command
        else if (normalizedCommand.match(/create\s+(?:a\s+)?dca\s+to\s+purchase\s+(\d+)\s+usdc\s+worth\s+of\s+btc\s+on\s+(?:a\s+)?weekly\s+basis/i)) {
          resetProcessStates();
          setDcaType('btc');
          setShowDCA(true);
          response = { text: 'Setting up BTC DCA plan...' };
        }
        // General DCA command fallback
        else if (normalizedCommand.includes('create') && normalizedCommand.includes('dca') && normalizedCommand.includes('usdc')) {
          resetProcessStates();
          // Default to ETH if not specified
          setDcaType('eth');
          setShowDCA(true);
          response = { text: 'Setting up DCA plan...' };
        }
        // Find yield command
        else if (normalizedCommand.includes('find best yield') || normalizedCommand.includes('best yield')) {
          resetProcessStates();
          setShowYieldProcess(true);
          response = { text: 'Opening yield finder...' };
        }
        // Swap command
        else if (normalizedCommand.includes('swap') || normalizedCommand.includes('exchange')) {
          resetProcessStates();
          // Parse swap command for preview
          const swapMatch = normalizedCommand.match(/swap\s+(\d+(?:\.\d+)?)\s+(\w+)\s+for\s+(\w+)/i);
          if (swapMatch) {
            setTransactionCommand({
              type: 'swap',
              amount: swapMatch[1],
              fromToken: swapMatch[2].toUpperCase(),
              toToken: swapMatch[3].toUpperCase()
            });
            setShowTransactionPreview(true);
            response = { text: 'Opening transaction preview...' };
          } else {
            setShowSwapProcess(true);
            response = { text: 'Opening swap interface...' };
          }
        }
        // Bridge command
        else if (normalizedCommand.includes('bridge')) {
          resetProcessStates();
          setShowBridgeProcess(true);
          response = { text: 'Opening bridge interface...' };
        }
        // Portfolio command
        else if (normalizedCommand.includes('portfolio') || normalizedCommand.includes('build portfolio')) {
          resetProcessStates();
          setShowPortfolioProcess(true);
          response = { text: 'Opening portfolio builder...' };
        }
        // Stake command
        else if (normalizedCommand.includes('stake')) {
          resetProcessStates();
          setShowStakeProcess(true);
          response = { text: 'Opening staking interface...' };
        }
        // Project evaluation command
        else if (normalizedCommand.match(/(?:analyze|evaluate)\s+project\s+([^\s]+)/i)) {
          const projectNameMatch = normalizedCommand.match(/project\s+([^\s]+)/i);
          if (projectNameMatch) {
            resetProcessStates();
            setProjectName(projectNameMatch[1]);
            setShowProjectAnalysis(true);
            response = { text: `Analyzing project ${projectNameMatch[1]}...` };
          }
        }
        // Use OpenAI for other commands
        else {
          response = await generateResponse(command);
        }
        
        // Add response to messages if we got one
        if (response) {
          setMessages(prev => [...prev, {
            role: 'user',
            content: command
          }, {
            role: 'assistant',
            content: response.text,
            data: response.data,
            trending: response.trending,
            news: response.news
          }]);
        }
      }

      // If no commands matched
      if (!response) {
        setMessages(prev => [...prev, {
          role: 'user',
          content: text
        }, {
          role: 'assistant',
          content: "I'm not sure how to help with that. Try asking about prices, trending tokens, latest news, or use commands like 'stake ETH', or 'analyze project wayfinder'."
        }]);
      }
    } catch (error) {
      console.error('Error processing command:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.'
      }]);
    } finally {
      setIsProcessing(false);
      setTranscript('');
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setTranscript('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      setTimeout(() => setTranscript(''), 3000);
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript = transcript;
          setTranscript(finalTranscript.trim());
          processCommand(finalTranscript);
          stopListening();
        } else {
          interimTranscript += transcript;
          setTranscript(interimTranscript);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setTranscript('');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Speech recognition start error:', error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    setTranscript('');
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetProcessStates();
    }
  }, [isOpen]);

  const clearMessages = () => {
    setMessages([]);
  };

  const handleDcaConfirm = () => {
    setDcaLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      setDcaLoading(false);
      setDcaConfirmed(true);
      
      // Hide DCA interface after a delay
      setTimeout(() => {
        setShowDCA(false);
        setDcaConfirmed(false);
      }, 3000);
    }, 500);
  };

  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center mb-8">
        <Brain className="w-12 h-12 text-blue-500" />
      </div>
      
      <h1 className="text-4xl font-bold mb-4">Crypto Companion</h1>
      <p className="text-white/60 text-center max-w-md mb-8">
        Your AI assistant for crypto market insights and DeFi operations
      </p>

      <div className="grid grid-cols-2 gap-8 w-[800px] max-w-full">
        {/* Market Data Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-blue-400" />
            <span>Market Data</span>
          </h2>
          <div className="space-y-2">
            {[
              { command: "What is the Bitcoin price?", description: "Get real-time BTC price" },
              { command: "Show me trending tokens", description: "View trending cryptocurrencies" },
              { command: "Show me the latest news", description: "Get latest crypto news" },
              { command: "Evaluate project wayfinder", description: "Analyze project potential" }
            ].map((cmd) => (
              <button
                key={cmd.command}
                onClick={() => {
                  processCommand(cmd.command);
                  setInput('');
                }}
                className="w-full p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl hover:from-white/15 hover:to-white/10 transition-all hover:scale-[1.02]"
              >
                <div className="flex flex-col h-full">
                  <p className="font-medium text-blue-400 mb-2">{cmd.command}</p>
                  <p className="text-sm text-white/60">{cmd.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Trading & Portfolio Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-400" />
            <span>Trading & Portfolio</span>
          </h2>
          <div className="space-y-2">
            {[
              { command: "Find the best yield for my USDC", description: "Search optimal yield opportunities" },
              { command: "Stake ETH", description: "Stake ETH with Lido" },
              { command: "Build my portfolio", description: "Create optimized portfolio" },
              { command: "Create a DCA to purchase 10 USDC worth of ETH on daily basis", description: "Set up ETH DCA plan" },
              { command: "Create a DCA to purchase 50 USDC worth of BTC on weekly basis", description: "Set up BTC DCA plan" }
            ].map((cmd) => (
              <button
                key={cmd.command}
                onClick={() => {
                  processCommand(cmd.command);
                  setInput('');
                }}
                className="w-full p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl hover:from-white/15 hover:to-white/10 transition-all hover:scale-[1.02]"
              >
                <div className="flex flex-col h-full">
                  <p className="font-medium text-blue-400 mb-2">{cmd.command}</p>
                  <p className="text-sm text-white/60">{cmd.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderWalletPanel = () => {
    // Filter positions correctly
    const assetPositions = mockDeFiPositions.filter(p => !p.type || p.type === 'STAKING');
    const defiPositions = mockDeFiPositions.filter(p => p.type === 'LENDING');

    return (
      <div className={`absolute right-0 top-[73px] bottom-[89px] border-l border-white/10 transition-all duration-300 ${
        isWalletPanelOpen ? 'w-80' : 'w-0'
      } overflow-hidden`}>
        <div className="h-full w-80 flex flex-col glass">
          {/* Total Balance */}
          <div className="p-4 border-b border-white/10">
            <div className="text-sm text-white/60">Total Balance</div>
            <div className="text-2xl font-bold mt-1">$15,650.32</div>
            <div className="flex items-center gap-1 mt-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+1.57% TODAY</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveWalletTab('assets')}
              className={`flex items-center gap-2 flex-1 p-2 text-sm transition-colors ${
                activeWalletTab === 'assets'
                  ? 'bg-white/10 font-medium'
                  : 'hover:bg-white/5'
              }`}
            >
              <Wallet className="w-4 h-4" />
              Assets
            </button>
            <button
              onClick={() => setActiveWalletTab('defi')}
              className={`flex items-center gap-2 flex-1 p-2 text-sm transition-colors ${
                activeWalletTab === 'defi'
                  ? 'bg-white/10 font-medium'
                  : 'hover:bg-white/5'
              }`}
            >
              <Landmark className="w-4 h-4" />
              DeFi
            </button>
          </div>

          {/* Assets List */}
          <div className="flex-1 overflow-y-auto ai-chat-scrollbar">
            <div className="p-4 space-y-2">
              {activeWalletTab === 'assets' ? (
                // Assets Tab
                assetPositions.map((position) => (
                  <div
                    key={position.id}
                    className="flex items-center justify-between p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <img 
                        src={position.token.logo} 
                        alt={position.token.symbol} 
                        className="w-6 h-6"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://via.placeholder.com/24/4A90E2/FFFFFF?text=${position.token.symbol.charAt(0)}`;
                        }}
                      />
                      <div>
                        <div className="font-medium text-sm">{position.token.symbol}</div>
                        <div className="text-xs text-white/60">
                          {position.amount.toLocaleString()} {position.token.symbol}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">${position.value.toLocaleString()}</div>
                      {position.type === 'STAKING' && (
                        <div className="text-xs text-green-400">
                          {position.apy}% APY
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                // DeFi Tab
                defiPositions.map((position) => (
                  <div
                    key={position.id}
                    className="flex items-center justify-between p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <img 
                        src={position.protocolLogo} 
                        alt={position.protocol} 
                        className="w-6 h-6"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://via.placeholder.com/24/4A90E2/FFFFFF?text=${position.protocol.charAt(0)}`;
                        }}
                      />
                      <div>
                        <div className="font-medium text-sm">{position.protocol}</div>
                        <div className="text-xs text-white/60">
                          {position.amount.toLocaleString()} {position.token.symbol}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">${position.value.toLocaleString()}</div>
                      <div className="text-xs text-green-400">
                        {position.apy}% APY
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsWalletPanelOpen(!isWalletPanelOpen)}
          className="absolute top-1/2 -translate-y-1/2 p-1.5 bg-white/10 hover:bg-white/20 rounded-l-lg transition-colors"
          style={{ left: isWalletPanelOpen ? '-24px' : '0' }}
        >
          {isWalletPanelOpen ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    );
  };

  const renderDCAInterface = () => {
    const isEthDCA = dcaType === 'eth';
    const dcaAmount = isEthDCA ? 10 : 50;
    const dcaFrequency = isEthDCA ? 'Daily' : 'Weekly';
    const dcaToken = isEthDCA ? 'ETH' : 'BTC';
    const dcaTokenLogo = isEthDCA 
      ? 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'
      : 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png';
    const dcaEstimatedMonthly = isEthDCA ? 300 : 200;
    const dcaNextExecution = isEthDCA ? 'Tomorrow' : 'Next Monday';

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="text-xl font-medium">DCA Setup</h3>
            <p className="text-white/60">Dollar-Cost Averaging Plan</p>
          </div>
        </div>

        <div className="flex-1 bg-white/5 rounded-xl p-6">
          {!dcaConfirmed ? (
            <div className="space-y-6">
              {/* From Token */}
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png" 
                    alt="USDC" 
                    className="w-10 h-10"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/40/4A90E2/FFFFFF?text=USDC";
                    }}
                  />
                  <div>
                    <div className="text-sm text-white/60">From</div>
                    <div className="text-xl font-medium">{dcaAmount} USDC</div>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-white/40" />
                <div className="flex items-center gap-3">
                  <img 
                    src={dcaTokenLogo} 
                    alt={dcaToken} 
                    className="w-10 h-10"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/40/4A90E2/FFFFFF?text=${dcaToken}`;
                    }}
                  />
                  <div>
                    <div className="text-sm text-white/60">To</div>
                    <div className="text-xl font-medium">{dcaToken}</div>
                  </div>
                </div>
              </div>

              {/* Frequency */}
              <div className="p-4 bg-white/5 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-white/60" />
                    <span className="text-white/60">Frequency</span>
                  </div>
                  <span className="font-medium">{dcaFrequency}</span>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-white/60" />
                    <span className="text-white/60">Time</span>
                  </div>
                  <span className="font-medium">12:00 PM UTC</span>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-white/60" />
                    <span className="text-white/60">Estimated Monthly</span>
                  </div>
                  <span className="font-medium">{dcaEstimatedMonthly} USDC</span>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleDcaConfirm}
                className="w-full mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg font-medium"
              >
                {dcaLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Confirm DCA Plan'
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-medium mb-4">Your {dcaToken} DCA plan has been scheduled</h3>
              <div className="bg-white/5 rounded-xl p-4 mb-6 max-w-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/60">Amount:</span>
                  <span className="font-medium">{dcaAmount} USDC</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/60">Asset:</span>
                  <span className="font-medium">{dcaToken}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/60">Frequency:</span>
                  <span className="font-medium">{dcaFrequency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Next execution:</span>
                  <span className="font-medium">{dcaNextExecution}, 12:00 PM UTC</span>
                </div>
              </div>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                <span>View in DCA Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

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
        {showYieldProcess ? (
          <YieldProcess onClose={() => {
            setShowYieldProcess(false);
            setMessages([]);
          }} />
        ) : showSwapProcess ? (
          <SwapProcess onClose={() => {
            setShowSwapProcess(false);
            setMessages([]);
          }} />
        ) : showBridgeProcess ? (
          <BridgeProcess onClose={() => {
            setShowBridgeProcess(false);
            setMessages([]);
          }} />
        ) : showPortfolioProcess ? (
          <PortfolioProcess onClose={() => {
            setShowPortfolioProcess(false);
            setMessages([]);
          }} />
        ) : showStakeProcess ? (
          <StakeProcess onClose={() => {
            setShowStakeProcess(false);
            setMessages([]);
          }} />
        ) : showProjectAnalysis ? (
          <ProjectAnalysisProcess 
            onClose={() => {
              setShowProjectAnalysis(false);
              setMessages([]);
            }}
            projectName={projectName}
          />
        ) : showDCA ? (
          renderDCAInterface()
        ) : (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Bot className="w-5 h-5" />
                <h2 className="text-xl font-semibold">AI Agent</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto ai-chat-scrollbar">
                <div className="p-6 space-y-6">
                  {messages.length === 0 ? (
                    renderMenu()
                  ) : (
                    messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[90%] p-4 rounded-xl ${
                            message.role === 'user'
                              ? 'bg-blue-500/20 ml-auto'
                              : 'bg-white/10'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          {message.data && (
                            <div className="w-[800px] mt-4">
                              <PriceChart data={message.data} />
                            </div>
                          )}
                          {message.trending && <TrendingCoins coins={message.trending} />}
                          {message.news && <NewsWidget news={message.news} />}
                        </div>
                      </div>
                    ))
                  )}
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 p-3 rounded-lg flex gap-2">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder='Try "What is the Bitcoin price?", "Show me trending tokens", or "Show me the latest news"'
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-white/20"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (input.trim()) {
                            processCommand(input);
                            setInput('');
                          }
                        }
                      }}
                    />
                    {messages.length > 0 && (
                      <button
                        onClick={clearMessages}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-lg transition-colors text-red-400 hover:text-red-300"
                        title="Clear conversation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <button
                    className={`p-2 rounded-lg transition-colors ${
                      isListening ? 'bg-red-500/50' : 'hover:bg-white/10'
                    } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      isListening ? stopListening() : startListening();
                    }}
                    disabled={isProcessing}
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (input.trim() && !isProcessing) {
                        processCommand(input);
                        setInput('');
                      }
                    }}
                    disabled={isProcessing || !input.trim()}
                    className={`p-2 rounded-lg transition-colors ${
                      input.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white/10 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Wallet Panel */}
            {renderWalletPanel()}
          </div>
        )}
      </div>

      <VoiceModal 
        isOpen={isListening} 
        transcript={transcript}
        commands={[
          { command: "What is the Bitcoin price?", description: "Get real-time BTC price" },
          { command: "Show me trending tokens", description: "View trending cryptocurrencies" },
          { command: "Show me the latest news", description: "Get latest crypto news" },
          { command: "Swap 1 ETH for USDC", description: "Preview token swap transaction" },
          { command: "Create a DCA to purchase 10 USDC worth of ETH on daily basis", description: "Set up ETH DCA plan" },
          { command: "Create a DCA to purchase 50 USDC worth of BTC on weekly basis", description: "Set up BTC DCA plan" }
        ]}
      />

      <TransactionPreviewModal
        isOpen={showTransactionPreview}
        onClose={() => setShowTransactionPreview(false)}
        command={transactionCommand || { type: 'swap' }}
        originalText={input}
      />
    </div>
  );
}