import React, { useState } from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';
import { AuthModal } from './AuthModal';

export const AccountMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const setIsSettingsOpen = useStore((state) => state.setIsSettingsOpen);
  const isTopbarBottom = useStore((state) => state.isTopbarBottom);

  const menuItems = [
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => {
        setIsSettingsOpen(true);
        setIsOpen(false);
      },
    },
    {
      icon: LogOut,
      label: 'Sign In',
      onClick: () => {
        setIsAuthOpen(true);
        setIsOpen(false);
      },
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
      >
        <User className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute ${isTopbarBottom ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 w-48 rounded-xl glass border border-white/10 shadow-lg z-50`}>
            <div className="py-2">
              {menuItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors group cursor-pointer"
                  onClick={item.onClick}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
};