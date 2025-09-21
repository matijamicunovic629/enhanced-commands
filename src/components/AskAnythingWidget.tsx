import React, { useState, useCallback, useEffect } from 'react';
import { Mic, Send } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { VoiceModal } from '../VoiceModal';

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

  const voiceCommands: VoiceCommand[] = [
    // ... (keep existing commands)
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
    }
  };

  const processCommand = (text: string) => {
    const normalizedText = text.toLowerCase().trim();
    
    for (const { command, action } of voiceCommands) {
      if (normalizedText.includes(command)) {
        setIsProcessing(true);
        action();
        setTimeout(() => {
          setIsProcessing(false);
          setTranscript('');
        }, 1500);
        return true;
      }
    }

    setIsAIAgentOpen(true);
    return false;
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
        <input
          type="text"
          placeholder="Ask anything... (Try saying 'open dashboard', 'open calendar', 'open technical', etc.)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
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

      <VoiceModal 
        isOpen={isListening} 
        transcript={transcript}
        commands={voiceCommands}
      />
    </>
  );
};