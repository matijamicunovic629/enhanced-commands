import React, { useState, useEffect } from 'react';
import { X, Mic, MicOff, Video, VideoOff, MonitorUp, Settings, SignalHigh } from 'lucide-react';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    ens: string;
    avatar: string;
  } | null;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({ isOpen, onClose, user }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState<'Excellent' | 'Good' | 'Poor'>('Excellent');

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCallDuration(0);
    }
  }, [isOpen]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[800px] h-[600px] glass border border-white/10 rounded-xl overflow-hidden">
        {/* Main Video Area */}
        <div className="absolute inset-0 bg-black">
          {/* Connection Quality Indicator */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
            <SignalHigh className={`w-4 h-4 ${
              connectionQuality === 'Excellent' ? 'text-green-400' :
              connectionQuality === 'Good' ? 'text-yellow-400' : 'text-red-400'
            }`} />
            <span className="text-sm">{connectionQuality}</span>
          </div>

          {/* Call Stats */}
          <div className="absolute top-4 left-36 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
            <div className="text-xs">
              <span className="text-green-400">1080p</span> | 2.5 Mbps
            </div>
            <div className="text-xs text-white/60">
              Loss: 0.11% | Ping: 45ms
            </div>
          </div>

          {/* Timer */}
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
            <span className="text-lg font-medium">{formatDuration(callDuration)}</span>
          </div>
        </div>

        {/* User Info */}
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-lg font-medium">
              {user?.name.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0a0a0c]" />
          </div>
          <div>
            <div className="font-medium">{user?.name}</div>
            <div className="text-sm text-white/60">{user?.ens}</div>
          </div>
        </div>

        {/* Control Bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-xl bg-black/60 backdrop-blur-sm">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-lg transition-colors ${
              isMuted ? 'bg-red-500/20 text-red-500' : 'hover:bg-white/10'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-3 rounded-lg transition-colors ${
              isVideoOff ? 'bg-red-500/20 text-red-500' : 'hover:bg-white/10'
            }`}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-3 rounded-lg transition-colors ${
              isScreenSharing ? 'bg-blue-500' : 'hover:bg-white/10'
            }`}
          >
            <MonitorUp className="w-5 h-5" />
          </button>
          <button
            className="p-3 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-3 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};