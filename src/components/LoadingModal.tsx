import React from 'react';
import { Bot, Loader2, Sparkles } from 'lucide-react';

interface LoadingModalProps {
  isOpen: boolean;
  query: string;
  processingType?: 'general' | 'price' | 'news' | 'trending' | 'swap' | 'dca' | 'yield';
}

export const LoadingModal: React.FC<LoadingModalProps> = ({ 
  isOpen, 
  query, 
  processingType = 'general' 
}) => {
  if (!isOpen) return null;

  const getProcessingMessage = () => {
    switch (processingType) {
      case 'price':
        return 'Fetching real-time price data...';
      case 'news':
        return 'Gathering latest crypto news...';
      case 'trending':
        return 'Analyzing trending tokens...';
      case 'swap':
        return 'Finding best swap routes...';
      case 'dca':
        return 'Setting up DCA strategy...';
      case 'yield':
        return 'Scanning yield opportunities...';
      default:
        return 'Processing your request...';
    }
  };

  const getIcon = () => {
    switch (processingType) {
      case 'price':
      case 'trending':
        return <Sparkles className="w-6 h-6 text-blue-500" />;
      case 'news':
        return <Bot className="w-6 h-6 text-purple-500" />;
      case 'swap':
      case 'dca':
      case 'yield':
        return <Bot className="w-6 h-6 text-green-500" />;
      default:
        return <Bot className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 mb-24 z-50 px-6">
      <div className="relative bg-gradient-to-b from-black/60 to-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-[800px] mx-auto shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
            {getIcon()}
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI Assistant</h2>
            <p className="text-sm text-white/60">"{query}"</p>
          </div>
        </div>

        {/* Processing Animation */}
        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-pulse" />
          </div>

          <h3 className="text-xl font-medium mb-2">{getProcessingMessage()}</h3>
          <p className="text-white/60 text-center max-w-md">
            Please wait while I analyze your request and gather the information you need.
          </p>

          {/* Processing Steps */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-white/80">Analyzing command...</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-blue-500/50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <span className="text-white/60">Fetching data...</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-blue-500/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              <span className="text-white/40">Preparing response...</span>
            </div>
          </div>
        </div>

        {/* Triangle Pointer */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
          <div className="border-8 border-transparent border-t-white/10" />
        </div>
      </div>
    </div>
  );
};