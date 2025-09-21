import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { useStore } from '../store/useStore';

export const StarMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { menuItems, toggleStarMenuItem, isTopbarBottom } = useStore();
  const starredItems = menuItems.filter((item) => item.isStarred);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
      >
        <Icons.Star className={`w-4 h-4 ${starredItems.length > 0 ? 'text-yellow-400' : ''}`} />
        {starredItems.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-500 text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {starredItems.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute ${isTopbarBottom ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 w-64 rounded-xl glass border border-white/10 shadow-lg z-50`}>
            <div className="p-2">
              {menuItems.map((item) => {
                const IconComponent = Icons[item.icon as keyof typeof Icons];
                return (
                  <button
                    key={item.id}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors group"
                    onClick={() => toggleStarMenuItem(item.id)}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <Icons.Star
                      className={`w-4 h-4 transition-colors ${
                        item.isStarred
                          ? 'text-yellow-400'
                          : 'text-white/40 opacity-0 group-hover:opacity-100'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};