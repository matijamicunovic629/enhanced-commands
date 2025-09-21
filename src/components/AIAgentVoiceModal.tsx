import React from 'react';
import { Command, Volume2 } from 'lucide-react';

interface VoiceCommand {
  command: string;
  description: string;
}

interface AIAgentVoiceModalProps {
  isOpen: boolean;
  transcript: string;
  commands?: VoiceCommand[];
}

export const AIAgentVoiceModal: React.FC<AIAgentVoiceModalProps> = ({ isOpen, transcript, commands = [] }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-gradient-to-b from-black/60 to-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-[600px] mx-auto">
        {/* Voice Wave Animation */}
        <div className="relative mb-8">
          <div className="flex items-center justify-center gap-1 h-24">
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
          <h3 className="text-2xl font-medium mb-4">Listening...</h3>
          {transcript ? (
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-lg text-white/90 font-medium">{transcript}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white/60 justify-center">
                <Command className="w-5 h-5" />
                <span>Available Commands:</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {commands.map((command, index) => (
                  <div 
                    key={index} 
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:from-white/15 hover:to-white/10 transition-colors"
                  >
                    <div className="flex flex-col h-full">
                      <p className="font-medium text-blue-400 mb-2">"{command.command}"</p>
                      {command.description && (
                        <p className="text-sm text-white/60">{command.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Volume Indicator */}
        <div className="flex items-center justify-center gap-2">
          <Volume2 className="w-4 h-4 text-white/40" />
          <div className="flex items-center gap-1">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-white/20 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 100}ms`,
                  height: `${8 + Math.random() * 12}px`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};