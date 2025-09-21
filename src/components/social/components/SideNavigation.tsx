import React from 'react';
import { MessageSquare, TrendingUp, Search, Bell, BarChart2 } from 'lucide-react';
import { NavItem } from '../types';

interface SideNavigationProps {
  activeNavItem: NavItem;
  onNavChange: (item: NavItem) => void;
}

export const SideNavigation: React.FC<SideNavigationProps> = ({ activeNavItem, onNavChange }) => {
  const navItems = [
    { id: 'feed' as const, label: 'Feed', icon: MessageSquare },
    { id: 'rallying' as const, label: 'Rallying', icon: TrendingUp },
    { id: 'explore' as const, label: 'Explore', icon: Search },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'leaderboard' as const, label: 'Leaderboard', icon: BarChart2 }
  ];

  return (
    <div className="w-64 border-r border-white/10">
      <div className="p-4 space-y-2">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavChange(id)}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              activeNavItem === id ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};