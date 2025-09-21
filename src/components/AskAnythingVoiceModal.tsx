import React from 'react';
import { Command, Volume2 } from 'lucide-react';

interface VoiceCommand {
  command: string;
  description: string;
}

interface AskAnythingVoiceModalProps {
  isOpen: boolean;
  transcript: string;
  commands?: VoiceCommand[];
}

export const AskAnythingVoiceModal: React.FC<AskAnythingVoiceModalProps> = ({ isOpen, transcript, commands = [] }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 mb-24 z-50 px-6">
      <div className="relative bg-gradient-to-b from-black/60 to-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-[800px] mx-auto shadow-2xl animate-slide-up">
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
          <h3 className="text-2xl font-medium mb-4">Listening...</h3>
          {transcript ? (
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-lg text-white/90 font-medium">{transcript}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white/60 justify-center">
                <Command className="w-5 h-5" />
                <span>Try saying:</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-white/80">
                {commands.map((command, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3 backdrop-blur-sm">
                    <p className="font-medium mb-1">"{command.command}"</p>
                    <p className="text-sm text-white/60">{command.description}</p>
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

        {/* Triangle Pointer */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
          <div className="border-8 border-transparent border-t-white/10" />
        </div>
      </div>
    </div>
  );
};