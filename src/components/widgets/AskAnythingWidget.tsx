import React, { useState, useCallback, useEffect } from 'react';
import { Mic, Send, History, Star, FileText, ChevronDown } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { VoiceModal } from '../VoiceModal';
import { QuickInfoModal } from '../QuickInfoModal';
import { LoadingModal } from '../LoadingModal';
import { useCommandCenterStore } from '../../store/commandCenterStore';
import { CommandHistory } from '../CommandHistory';
import { FavoriteCommands } from '../FavoriteCommands';
import { CommandTemplates } from '../CommandTemplates';

interface VoiceCommand {
  command: string;
  action: () => void;
}

export const AskAnythingWidget: React.FC = () => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);
  const [isManualStop, setIsManualStop] = useState(false);
  const [noSpeechTimeout, setNoSpeechTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showSlashCommands, setShowSlashCommands] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  
  // Quick Info Modal state
  const [showQuickInfo, setShowQuickInfo] = useState(false);
  const [quickInfoQuery, setQuickInfoQuery] = useState('');
  const [quickInfoCoinId, setQuickInfoCoinId] = useState<string | null>(null);
  const [quickInfoCommandType, setQuickInfoCommandType] = useState<'price' | 'yield' | 'swap'>('price');
  const [quickInfoSwapData, setQuickInfoSwapData] = useState<any>(null);
  const [quickInfoDcaData, setQuickInfoDcaData] = useState<any>(null);
  
  // Loading modal state
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingQuery, setLoadingQuery] = useState('');
  const [loadingType, setLoadingType] = useState<'general' | 'price' | 'news' | 'trending' | 'swap' | 'dca' | 'yield'>('general');
  
  // Command Center state
  const {
    addToHistory,
    showHistory,
    showFavorites,
    showTemplates,
    toggleHistory,
    toggleFavorites,
    toggleTemplates,
    selectedTemplate,
    setSelectedTemplate
  } = useCommandCenterStore();

  const {
    setIsAIAgentOpen,
    setIsSettingsOpen,
    setIsDashboardOpen,
    setIsDefiOpen,
    setIsSwapOpen,
    setIsMarketDataOpen,
    setIsChatOpen,
    setIsCartOpen,
    setIsSocialFeedOpen,
    setIsGamesOpen,
    setIsWalletOpen,
    setMarketDataView
  } = useStore();

  // Cleanup function for recognition instance and timeouts
  const cleanupRecognition = useCallback(() => {
    if (recognitionInstance) {
      try {
        setIsManualStop(true);
        recognitionInstance.abort();
      } catch (error) {
        // Ignore errors during cleanup
      }
      setRecognitionInstance(null);
    }
    if (noSpeechTimeout) {
      clearTimeout(noSpeechTimeout);
      setNoSpeechTimeout(null);
    }
  }, [recognitionInstance, noSpeechTimeout]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupRecognition();
    };
  }, [cleanupRecognition]);

  const openMarketDataSection = (view: 'overview' | 'trending' | 'dex' | 'defi' | 'news' | 'alerts' | 'technical' | 'calendar' | 'feed') => {
    setIsMarketDataOpen(true);
    setMarketDataView(view);
  };

  // Crypto price query patterns
  const cryptoPricePatterns = [
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?bitcoin\s+price/i, coinId: 'bitcoin' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?ethereum\s+price/i, coinId: 'ethereum' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?eth\s+price/i, coinId: 'ethereum' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?btc\s+price/i, coinId: 'bitcoin' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?solana\s+price/i, coinId: 'solana' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?sol\s+price/i, coinId: 'solana' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?cardano\s+price/i, coinId: 'cardano' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?ada\s+price/i, coinId: 'cardano' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?dogecoin\s+price/i, coinId: 'dogecoin' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?doge\s+price/i, coinId: 'dogecoin' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?polkadot\s+price/i, coinId: 'polkadot' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?dot\s+price/i, coinId: 'polkadot' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?chainlink\s+price/i, coinId: 'chainlink' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?link\s+price/i, coinId: 'chainlink' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?avalanche\s+price/i, coinId: 'avalanche-2' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?avax\s+price/i, coinId: 'avalanche-2' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?polygon\s+price/i, coinId: 'matic-network' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?matic\s+price/i, coinId: 'matic-network' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?uniswap\s+price/i, coinId: 'uniswap' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?uni\s+price/i, coinId: 'uniswap' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?aave\s+price/i, coinId: 'aave' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?shiba\s+(?:inu\s+)?price/i, coinId: 'shiba-inu' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?shib\s+price/i, coinId: 'shiba-inu' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?binance\s+coin\s+price/i, coinId: 'binancecoin' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?bnb\s+price/i, coinId: 'binancecoin' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?ripple\s+price/i, coinId: 'ripple' },
    { pattern: /(?:what\s+is\s+(?:the\s+)?)?xrp\s+price/i, coinId: 'ripple' }
  ];

  // Yield query patterns
  const newsQueryPatterns = [
    /show\s+me\s+(?:the\s+)?latest\s+news/i,
    /(?:latest\s+)?crypto\s+news/i,
    /(?:latest\s+)?market\s+news/i,
    /what\s+is\s+(?:the\s+)?latest\s+news/i,
    /news/i
  ];

  const yieldQueryPatterns = [
    /find\s+(?:best\s+)?yield\s+for\s+(?:my\s+)?usdc/i,
    /find\s+(?:best\s+)?yield\s+for\s+(?:my\s+)?usdt/i,
    /find\s+(?:best\s+)?yield\s+for\s+(?:my\s+)?dai/i,
    /(?:best\s+)?yield\s+(?:for\s+)?usdc/i,
    /(?:best\s+)?yield\s+(?:for\s+)?usdt/i,
    /(?:best\s+)?yield\s+(?:for\s+)?dai/i
  ];

  // Swap query patterns
  const swapQueryPatterns = [
    /(?:i\s+want\s+to\s+)?swap\s+(\d+(?:\.\d+)?)\s+(\w+)\s+for\s+(\w+)/i,
    /(?:i\s+want\s+to\s+)?exchange\s+(\d+(?:\.\d+)?)\s+(\w+)\s+for\s+(\w+)/i,
    /(?:i\s+want\s+to\s+)?trade\s+(\d+(?:\.\d+)?)\s+(\w+)\s+for\s+(\w+)/i
  ];

  // Slash commands
  const slashCommands = [
    { command: '/price', description: 'Check cryptocurrency prices', example: '/price bitcoin' },
    { command: '/swap', description: 'Quick token swap', example: '/swap 1 ETH for USDC' },
    { command: '/send', description: 'Send tokens', example: '/send 100 USDC to vitalik.eth' },
    { command: '/stake', description: 'Stake tokens', example: '/stake 1 ETH' },
    { command: '/bridge', description: 'Bridge tokens', example: '/bridge 1000 USDC to Arbitrum' },
    { command: '/portfolio', description: 'Build portfolio', example: '/portfolio build' },
    { command: '/yield', description: 'Find best yield', example: '/yield USDC' },
    { command: '/news', description: 'Latest crypto news', example: '/news' },
    { command: '/trending', description: 'Trending tokens', example: '/trending' },
    { command: '/dashboard', description: 'Open dashboard', example: '/dashboard' },
    { command: '/defi', description: 'Open DeFi interface', example: '/defi' },
    { command: '/games', description: 'Open games', example: '/games' },
    { command: '/settings', description: 'Open settings', example: '/settings' }
  ];

  const voiceCommands: VoiceCommand[] = [
    { command: 'open dashboard', action: () => setIsDashboardOpen(true) },
    { command: 'open settings', action: () => setIsSettingsOpen(true) },
    { command: 'open defi', action: () => setIsDefiOpen(true) },
    { command: 'open swap', action: () => setIsSwapOpen(true) },
    { command: 'open chat', action: () => setIsChatOpen(true) },
    { command: 'open cart', action: () => setIsCartOpen(true) },
    { command: 'open social', action: () => setIsSocialFeedOpen(true) },
    { command: 'open games', action: () => setIsGamesOpen(true) },
    { command: 'open wallet', action: () => setIsWalletOpen(true) },
    { command: 'open market data', action: () => setIsMarketDataOpen(true) },
    { command: 'open overview', action: () => openMarketDataSection('overview') },
    { command: 'open trending', action: () => openMarketDataSection('trending') },
    { command: 'open dex', action: () => openMarketDataSection('dex') },
    { command: 'open news', action: () => openMarketDataSection('news') },
    { command: 'open alerts', action: () => openMarketDataSection('alerts') },
    { command: 'open technical', action: () => openMarketDataSection('technical') },
    { command: 'open calendar', action: () => openMarketDataSection('calendar') },
    { command: 'open feed', action: () => openMarketDataSection('feed') }
  ];

  const handleClick = () => {
    if (input.trim()) {
      processCommand(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      processCommand(input);
      setInput('');
    } else if (e.key === 'Escape') {
      setShowSlashCommands(false);
      setSlashQuery('');
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    
    // Handle slash commands
    if (value.startsWith('/')) {
      const query = value.slice(1).toLowerCase();
      setSlashQuery(query);
      setShowSlashCommands(true);
    } else {
      setShowSlashCommands(false);
      setSlashQuery('');
    }
  };

  const handleSlashCommandSelect = (command: string) => {
    setInput(command.example);
    setShowSlashCommands(false);
    setSlashQuery('');
  };

  const processCommand = (text: string) => {
    const normalizedText = text.toLowerCase().trim();
    
    // Show loading modal immediately
    setLoadingQuery(text);
    setShowLoadingModal(true);
    
    // Debug logging for DCA commands
    console.log('AskAnything: Processing command:', text);
    console.log('AskAnything: Normalized text:', normalizedText);
    
    // Check for trending tokens commands FIRST
    const trendingPatterns = [
      /show\s+me\s+trending\s+tokens/i,
      /trending\s+tokens/i,
      /trending\s+cryptocurrencies/i,
      /what\s+are\s+trending\s+tokens/i,
      /^trending$/i
    ];
    
    for (const pattern of trendingPatterns) {
      if (pattern.test(normalizedText)) {
        console.log('AskAnything: Trending command matched!');
        setLoadingType('trending');
        setQuickInfoQuery(text);
        setQuickInfoCoinId(null);
        setQuickInfoCommandType('trending');
        setQuickInfoSwapData(null);
        setQuickInfoDcaData(null);
        setTimeout(() => {
          setShowLoadingModal(false);
          setShowQuickInfo(true);
          setIsProcessing(false);
          setTranscript('');
        }, 1500);
        return true;
      }
    }
    
    // Check for DCA commands FIRST (highest priority)
    const dcaPattern1 = /create\s+(?:a\s+)?dca\s+to\s+purchase\s+(\d+)\s+usdc\s+worth\s+of\s+(\w+)\s+on\s+(?:a\s+)?(\w+)\s+basis/i;
    const dcaPattern2 = /create\s+(?:a\s+)?dca\s+to\s+buy\s+(\d+)\s+usdc\s+worth\s+of\s+(\w+)\s+on\s+(?:a\s+)?(\w+)\s+basis/i;
    const dcaPattern3 = /dca.*(\d+).*usdc.*(\w+).*(daily|weekly|monthly)/i;
    
    const dcaMatch1 = normalizedText.match(dcaPattern1);
    const dcaMatch2 = normalizedText.match(dcaPattern2);
    const dcaMatch3 = normalizedText.match(dcaPattern3);
    
    console.log('AskAnything: DCA pattern 1 match:', dcaMatch1);
    console.log('AskAnything: DCA pattern 2 match:', dcaMatch2);
    console.log('AskAnything: DCA pattern 3 match:', dcaMatch3);
    
    const dcaMatch = dcaMatch1 || dcaMatch2 || dcaMatch3;
    
    if (dcaMatch) {
      console.log('AskAnything: DCA command matched!', dcaMatch);
      const [, amount, token, frequency] = dcaMatch;
      setLoadingType('dca');
      setQuickInfoDcaData({ amount, token: token.toUpperCase(), frequency });
      setQuickInfoCommandType('dca');
      setQuickInfoQuery(text);
      setTimeout(() => {
        setShowLoadingModal(false);
        setShowQuickInfo(true);
        setIsProcessing(false);
        setTranscript('');
      }, 1500);
      return true;
    }
    
    // Also check for simpler DCA patterns
    if (normalizedText.includes('create') && normalizedText.includes('dca')) {
      console.log('AskAnything: Simple DCA pattern matched');
      // Default values for simple DCA
      setLoadingType('dca');
      setQuickInfoDcaData({ amount: '10', token: 'ETH', frequency: 'daily' });
      setQuickInfoCommandType('dca');
      setQuickInfoQuery(text);
      setTimeout(() => {
        setShowLoadingModal(false);
        setShowQuickInfo(true);
        setIsProcessing(false);
        setTranscript('');
      }, 1500);
    }
    // Add to history
    addToHistory(text, 'query');
    
    // Check for news queries first
    for (const pattern of newsQueryPatterns) {
      if (pattern.test(normalizedText)) {
        setLoadingType('news');
        setQuickInfoQuery(text);
        setQuickInfoCoinId(null);
        setQuickInfoCommandType('news');
        setQuickInfoDcaData(null);
        setQuickInfoSwapData(null);
        setTimeout(() => {
          setShowLoadingModal(false);
          setShowQuickInfo(true);
          setIsProcessing(false);
          setTranscript('');
        }, 1500);
        return true;
      }
    }
    
    // Check for swap queries first
    for (const pattern of swapQueryPatterns) {
      const match = normalizedText.match(pattern);
      if (match) {
        const [, fromAmount, fromToken, toToken] = match;
        setLoadingType('swap');
        setQuickInfoQuery(text);
        setQuickInfoCoinId(null);
        setQuickInfoCommandType('swap');
        setQuickInfoDcaData(null);
        setQuickInfoSwapData({
          fromAmount,
          fromToken: fromToken.toUpperCase(),
          toAmount: '0.0223', // Fixed amount for ETH
          toToken: toToken.toUpperCase()
        });
        setTimeout(() => {
          setShowLoadingModal(false);
          setShowQuickInfo(true);
          setIsProcessing(false);
          setTranscript('');
        }, 1500);
        return true;
      }
    }
    
    // Check for yield queries first
    for (const pattern of yieldQueryPatterns) {
      if (pattern.test(normalizedText)) {
        setLoadingType('yield');
        setQuickInfoQuery(text);
        setQuickInfoCoinId(null);
        setQuickInfoCommandType('yield');
        setQuickInfoDcaData(null);
        setQuickInfoSwapData(null);
        setTimeout(() => {
          setShowLoadingModal(false);
          setShowQuickInfo(true);
          setIsProcessing(false);
          setTranscript('');
        }, 1500);
        return true;
      }
    }
    
    // Handle slash commands
    if (text.startsWith('/')) {
      const commandPart = text.slice(1).split(' ')[0].toLowerCase();
      const args = text.slice(commandPart.length + 2);
      
      switch (commandPart) {
        case 'price':
          if (args) {
            // Try to find matching coin
            for (const { pattern, coinId } of cryptoPricePatterns) {
              if (pattern.test(`${args} price`)) {
                setLoadingType('price');
                setQuickInfoQuery(text);
                setQuickInfoCoinId(coinId);
                setQuickInfoCommandType('price');
                setQuickInfoDcaData(null);
                setQuickInfoSwapData(null);
                setTimeout(() => {
                  setShowLoadingModal(false);
                  setShowQuickInfo(true);
                  setIsProcessing(false);
                  setTranscript('');
                }, 1500);
                return true;
              }
            }
          }
          break;
        case 'yield':
          setLoadingType('yield');
          setQuickInfoQuery(text);
          setQuickInfoCoinId(null);
          setQuickInfoCommandType('yield');
          setQuickInfoDcaData(null);
          setQuickInfoSwapData(null);
          setTimeout(() => {
            setShowLoadingModal(false);
            setShowQuickInfo(true);
            setIsProcessing(false);
            setTranscript('');
          }, 1500);
          return true;
        case 'swap':
          setShowLoadingModal(false);
          setIsSwapOpen(true);
          return true;
        case 'send':
          setShowLoadingModal(false);
          setIsWalletOpen(true);
          return true;
        case 'stake':
          setShowLoadingModal(false);
          setIsDefiOpen(true);
          return true;
        case 'bridge':
          setShowLoadingModal(false);
          setIsAIAgentOpen(true);
          return true;
        case 'portfolio':
          setShowLoadingModal(false);
          setIsDashboardOpen(true);
          return true;
        case 'yield':
          setShowLoadingModal(false);
          setIsAIAgentOpen(true);
          return true;
        case 'news':
          setShowLoadingModal(false);
          openMarketDataSection('news');
          return true;
        case 'news':
          setLoadingType('news');
          setQuickInfoQuery(text);
          setQuickInfoCoinId(null);
          setQuickInfoCommandType('news');
          setTimeout(() => {
            setShowLoadingModal(false);
            setShowQuickInfo(true);
            setIsProcessing(false);
            setTranscript('');
          }, 1500);
          return true;
        case 'trending':
          setShowLoadingModal(false);
          openMarketDataSection('trending');
          return true;
        case 'dashboard':
          setShowLoadingModal(false);
          setIsDashboardOpen(true);
          return true;
        case 'defi':
          setShowLoadingModal(false);
          setIsDefiOpen(true);
          return true;
        case 'games':
          setShowLoadingModal(false);
          setIsGamesOpen(true);
          return true;
        case 'settings':
          setShowLoadingModal(false);
          setIsSettingsOpen(true);
          return true;
      }
    }
    
    // Check for crypto price queries first
    for (const { pattern, coinId } of cryptoPricePatterns) {
      if (pattern.test(normalizedText)) {
        setLoadingType('price');
        setQuickInfoQuery(text);
        setQuickInfoCoinId(coinId);
        setQuickInfoCommandType('price');
        setQuickInfoDcaData(null);
        setQuickInfoSwapData(null);
        setTimeout(() => {
          setShowLoadingModal(false);
          setShowQuickInfo(true);
          setIsProcessing(false);
          setTranscript('');
        }, 1500);
        return true;
      }
    }
    
    // Check for voice commands
    for (const { command, action } of voiceCommands) {
      if (normalizedText.includes(command)) {
        setLoadingType('general');
        action();
        setTimeout(() => {
          setShowLoadingModal(false);
          setIsProcessing(false);
          setTranscript('');
        }, 1500);
        return true;
      }
    }

    // Fallback to AI Agent for complex queries
    setShowLoadingModal(false);
    setIsAIAgentOpen(true);
    return false;
  };

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setInput(template.template);
  };

  const handleFavoriteSelect = (command: string) => {
    setInput(command);
  };

  const handleHistorySelect = (command: string) => {
    setInput(command);
  };

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setTranscript('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      setTimeout(() => setTranscript(''), 3000);
      return;
    }

    // Clean up any existing recognition instance
    cleanupRecognition();
    setIsManualStop(false);

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let hasRecognizedSpeech = false;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setRecognitionInstance(recognition);
      hasRecognizedSpeech = false;

      // Set a timeout for no speech detection
      const timeout = setTimeout(() => {
        if (!hasRecognizedSpeech && isListening) {
          setTranscript('No speech detected. Please try again.');
          setTimeout(() => {
            cleanupRecognition();
            setTranscript('');
          }, 2000);
        }
      }, 5000); // 5 seconds timeout

      setNoSpeechTimeout(timeout);
    };

    recognition.onresult = (event: any) => {
      hasRecognizedSpeech = true;
      // Clear no-speech timeout since we got a result
      if (noSpeechTimeout) {
        clearTimeout(noSpeechTimeout);
        setNoSpeechTimeout(null);
      }

      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript = transcript;
          setTranscript(finalTranscript.trim());
          processCommand(finalTranscript);
          cleanupRecognition();
        } else {
          interimTranscript += transcript;
          setTranscript(interimTranscript);
        }
      }
    };

    recognition.onerror = (event: any) => {
      // Clear no-speech timeout on error
      if (noSpeechTimeout) {
        clearTimeout(noSpeechTimeout);
        setNoSpeechTimeout(null);
      }

      // Prevent logging of aborted errors when manually stopped
      if (event.error === 'aborted' && isManualStop) {
        event.preventDefault();
        return;
      }

      // Handle other errors silently and gracefully
      switch (event.error) {
        case 'no-speech':
          if (!hasRecognizedSpeech) {
            setTranscript('No speech detected. Please try again.');
            setTimeout(() => {
              cleanupRecognition();
              setTranscript('');
            }, 2000);
          }
          break;
        case 'audio-capture':
          setTranscript('Microphone not found. Please check your device settings.');
          setTimeout(() => {
            cleanupRecognition();
            setTranscript('');
          }, 2000);
          break;
        case 'not-allowed':
          setTranscript('Microphone access denied. Please allow microphone access.');
          setTimeout(() => {
            cleanupRecognition();
            setTranscript('');
          }, 2000);
          break;
        default:
          if (!isProcessing && !hasRecognizedSpeech) {
            setTranscript('Something went wrong. Please try again.');
            setTimeout(() => {
              cleanupRecognition();
              setTranscript('');
            }, 2000);
          }
      }
    };

    recognition.onend = () => {
      // Clear no-speech timeout if it exists
      if (noSpeechTimeout) {
        clearTimeout(noSpeechTimeout);
        setNoSpeechTimeout(null);
      }

      setIsListening(false);
      setRecognitionInstance(null);
      setIsManualStop(false);
      
      // Only clear transcript if we're not processing a command
      if (!isProcessing && !hasRecognizedSpeech) {
        setTimeout(() => setTranscript(''), 2000);
      }
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Speech recognition start error:', error);
      setIsListening(false);
      setTranscript('Failed to start voice recognition. Please try again.');
      setTimeout(() => {
        cleanupRecognition();
        setTranscript('');
      }, 2000);
    }
  }, [isProcessing, cleanupRecognition, isManualStop, noSpeechTimeout, isListening]);

  const stopListening = useCallback(() => {
    cleanupRecognition();
    setIsListening(false);
    setTranscript('');
  }, [cleanupRecognition]);

  return (
    <>
      <div className="w-[800px] h-14 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg flex items-center px-4 gap-3 shadow-lg">
        {/* Command Center Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleHistory}
            className={`p-1.5 rounded-md transition-colors ${
              showHistory ? 'bg-blue-500/50' : 'hover:bg-white/10'
            }`}
            title="Command History"
          >
            <History className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={toggleFavorites}
            className={`p-1.5 rounded-md transition-colors ${
              showFavorites ? 'bg-yellow-500/50' : 'hover:bg-white/10'
            }`}
            title="Favorite Commands"
          >
            <Star className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={toggleTemplates}
            className={`p-1.5 rounded-md transition-colors ${
              showTemplates ? 'bg-purple-500/50' : 'hover:bg-white/10'
            }`}
            title="Command Templates"
          >
            <FileText className="w-4 h-4 text-white" />
          </button>
        </div>
        
        <div className="h-6 w-px bg-white/10" />
        
        <input
          type="text"
          placeholder='Ask anything... (Try "What is the Bitcoin price?", "Open dashboard", "Open technical", etc.)'
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40"
        />
        <div className="flex items-center gap-2">
          <button 
            className={`p-1.5 rounded-md transition-colors ${
              isListening ? 'bg-red-500/50' : 'hover:bg-white/10'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              isListening ? stopListening() : startListening();
            }}
            disabled={isProcessing}
          >
            <Mic className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={handleClick}
            className={`p-1.5 rounded-md transition-colors hover:bg-white/10 ${!input.trim() && 'opacity-50 cursor-not-allowed'}`}
            disabled={!input.trim()}
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Slash Commands Dropdown */}
      {showSlashCommands && (
        <div className="fixed inset-x-0 bottom-0 mb-24 z-50 px-6">
          <div className="relative bg-gradient-to-b from-black/60 to-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-[800px] mx-auto shadow-2xl animate-slide-up">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Slash Commands</h3>
              <p className="text-sm text-white/60">Type / followed by a command</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto ai-chat-scrollbar">
              {slashCommands
                .filter(cmd => cmd.command.toLowerCase().includes(slashQuery))
                .map((cmd) => (
                  <button
                    key={cmd.command}
                    onClick={() => handleSlashCommandSelect(cmd)}
                    className="flex flex-col gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                  >
                    <div className="font-medium text-blue-400">{cmd.command}</div>
                    <div className="text-sm text-white/60">{cmd.description}</div>
                    <div className="text-xs text-white/40 font-mono">{cmd.example}</div>
                  </button>
                ))}
            </div>
            
            {/* Triangle Pointer */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
              <div className="border-8 border-transparent border-t-white/10" />
            </div>
          </div>
        </div>
      )}

      <VoiceModal 
        isOpen={isListening} 
        transcript={transcript}
        commands={[
          { command: "What is the Bitcoin price?", description: "Get real-time BTC price" },
          { command: "What is the Ethereum price?", description: "Get real-time ETH price" },
          { command: "Show me trending tokens", description: "View trending cryptocurrencies" },
          { command: "Open dashboard", description: "Open portfolio dashboard" },
          { command: "Open technical", description: "Open technical analysis" },
          { command: "Open trending", description: "View trending tokens" },
          { command: "Open news", description: "Latest crypto news" }
        ]}
      />

      <LoadingModal
        isOpen={true}
        query={loadingQuery}
        processingType={loadingType}
      />

      <QuickInfoModal
        isOpen={showQuickInfo}
        onClose={() => setShowQuickInfo(false)}
        query={quickInfoQuery}
        coinId={quickInfoCoinId}
        commandType={quickInfoCommandType}
        swapData={quickInfoSwapData}
        dcaData={quickInfoDcaData}
      />

      {/* Command Center Panels */}
      {showHistory && (
        <CommandHistory
          isOpen={showHistory}
          onClose={() => toggleHistory()}
          onSelect={handleHistorySelect}
        />
      )}

      {showFavorites && (
        <FavoriteCommands
          isOpen={showFavorites}
          onClose={() => toggleFavorites()}
          onSelect={handleFavoriteSelect}
        />
      )}

      {showTemplates && (
        <CommandTemplates
          isOpen={showTemplates}
          onClose={() => toggleTemplates()}
          onSelect={handleTemplateSelect}
        />
      )}
    </>
  );
};