import React from 'react';
import { X, Newspaper, Twitter, TrendingUp } from 'lucide-react';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (type: 'news' | 'twitter' | 'trending') => void;
}

const widgets = [
  {
    type: 'news' as const,
    name: 'News Feed',
    description: 'Latest crypto news and updates',
    icon: Newspaper
  },
  {
    type: 'twitter' as const,
    name: 'Twitter Feed',
    description: 'Real-time crypto Twitter updates',
    icon: Twitter
  },
  {
    type: 'trending' as const,
    name: 'Trending',
    description: 'Top trending cryptocurrencies',
    icon: TrendingUp
  }
];

export const AddWidgetModal: React.FC<AddWidgetModalProps> = ({ isOpen, onClose, onAdd }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass border border-white/10 rounded-xl p-6 w-[500px]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Add Widget</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {widgets.map(widget => (
            <button
              key={widget.type}
              onClick={() => {
                onAdd(widget.type);
                onClose();
              }}
              className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <widget.icon className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h4 className="font-medium mb-1">{widget.name}</h4>
                <p className="text-sm text-white/60">{widget.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};