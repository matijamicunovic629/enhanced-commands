import React from 'react';
import { Command, Volume2 } from 'lucide-react';
import { useStore } from '../store/useStore';

interface VoiceCommand {
  command: string;
  description?: string;
}

interface VoiceModalProps {
  isOpen: boolean;
  transcript: string;
  commands?: VoiceCommand[];
}

export const VoiceModal: React.FC<VoiceModalProps> = ({ isOpen, transcript, commands = [] }) => {
  const { theme } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 mb-24 z-50 px-6">
      <div className={`relative ${
        theme === 'light'
          ? 'bg-gradient-to-b from-white/60 to-white/80'
          : 'bg-gradient-to-b from-black/60 to-black/80'
      } backdrop-blur-xl border ${
        theme === 'light' ? 'border-black/10' : 'border-white/10'
      } rounded-2xl p-6 w-[800px] mx-auto shadow-2xl animate-slide-up`}>
        {/* Voice Wave */}
        <div className="relative mb-6">
          <div className="flex items-center justify-center gap-1 h-16">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 bg-red-500 rounded-full animate-voice-wave"
                style={{
                  height: '100%',
                  animationDelay: `${i * 0.05}s`,
                  transform: 'scaleY(0.2)',
                  transformOrigin: 'center'
                }}
              />
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="text-center mb-6">
          <h3 className={`text-2xl font-medium mb-4 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>Listening...</h3>
          {transcript ? (
            <div className={`${
              theme === 'light' ? 'bg-black/5' : 'bg-white/5'
            } rounded-xl p-4 backdrop-blur-sm`}>
              <p className={`text-lg font-medium ${
                theme === 'light' ? 'text-gray-800' : 'text-white/90'
              }`}>{transcript}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`flex items-center gap-2 justify-center ${
                theme === 'light' ? 'text-gray-600' : 'text-white/60'
              }`}>
                <Command className="w-5 h-5" />
                <span>Available commands:</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {commands.map((command, index) => (
                  <div key={index} className={`${
                    theme === 'light' ? 'bg-black/5' : 'bg-white/5'
                  } rounded-lg p-3 backdrop-blur-sm`}>
                    <p className={`font-medium mb-1 ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>"{command.command}"</p>
                    {command.description && (
                      <p className={theme === 'light' ? 'text-gray-600' : 'text-white/60'}>
                        {command.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Volume Indicator */}
        <div className="flex items-center justify-center gap-2">
          <Volume2 className={`w-4 h-4 ${
            theme === 'light' ? 'text-gray-400' : 'text-white/40'
          }`} />
          <div className="flex items-center gap-1">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full animate-pulse ${
                  theme === 'light' ? 'bg-gray-300' : 'bg-white/20'
                }`}
                style={{
                  animationDelay: `${i * 100}ms`,
                  height: `${8 + Math.random() * 12}px`
                }}
              />
            ))}
          </div>
        </div>

        {/* Triangle Pointer */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
          <div className={`border-8 border-transparent ${
            theme === 'light' ? 'border-t-black/10' : 'border-t-white/10'
          }`} />
        </div>
      </div>
    </div>
  );
};