import React, { useState } from 'react';
import { X, Mail, Phone, Wallet, Key, ToggleLeft as Google, Disc as Discord } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass border border-white/10 rounded-xl p-8 w-[400px] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-2xl font-bold mb-2">
          {isSignUp ? 'Create account' : 'Welcome back'}
        </h2>
        <p className="text-white/60 mb-6">
          {isSignUp ? 'Join Kaaom today.' : 'Access your Kaaom wallet.'}
        </p>

        <div className="space-y-3">
          {/* OAuth Buttons */}
          <button className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
            <Google className="w-5 h-5" />
            <span className="flex-1 text-left">Google</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
            <Discord className="w-5 h-5" />
            <span className="flex-1 text-left">Discord</span>
          </button>

          <div className="relative">
            <div className="absolute inset-y-1/2 w-full border-t border-white/10" />
            <div className="relative text-center">
              <span className="glass px-2 text-sm text-white/40">or</span>
            </div>
          </div>

          {/* Email & Phone Options */}
          <button className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
            <Mail className="w-5 h-5" />
            <span className="flex-1 text-left">Continue with email</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
            <Phone className="w-5 h-5" />
            <span className="flex-1 text-left">Continue with phone</span>
          </button>

          {/* Web3 & Passkey Options */}
          <button className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
            <Wallet className="w-5 h-5" />
            <span className="flex-1 text-left">Connect your web3 wallet</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
            <Key className="w-5 h-5" />
            <span className="flex-1 text-left">Use a passkey</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
};