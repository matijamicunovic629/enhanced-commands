import React from 'react';
import { Star, Plus, Trash2, ArrowRight, DollarSign, Landmark, TrendingUp, BarChart2 } from 'lucide-react';
import { useCommandCenterStore } from '../store/commandCenterStore';
import * as Icons from 'lucide-react';

interface FavoriteCommandsProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (command: string) => void;
}

export const FavoriteCommands: React.FC<FavoriteCommandsProps> = ({ isOpen, onClose, onSelect }) => {
  const { favorites, removeFromFavorites } = useCommandCenterStore();
  const [showAddForm, setShowAddForm] = React.useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[800px] glass border border-white/10 rounded-xl shadow-lg z-50">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Star className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-medium">Favorite Commands</h3>
          <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-sm">
            {favorites.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-green-400"
            title="Add favorite"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-45" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {showAddForm && (
          <div className="mb-4 p-4 bg-white/5 rounded-lg">
            <h4 className="font-medium mb-3">Add New Favorite</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Command name"
                className="w-full bg-white/5 px-3 py-2 rounded-lg outline-none placeholder:text-white/40"
              />
              <input
                type="text"
                placeholder="Command text"
                className="w-full bg-white/5 px-3 py-2 rounded-lg outline-none placeholder:text-white/40"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto ai-chat-scrollbar">
          {favorites.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-white/60">
              No favorite commands yet
            </div>
          ) : (
            favorites.map((favorite) => {
              const IconComponent = Icons[favorite.icon as keyof typeof Icons] || DollarSign;
              return (
                <button
                  key={favorite.id}
                  onClick={() => {
                    onSelect(favorite.command);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left group"
                >
                  <div className={`w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center ${favorite.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{favorite.name}</div>
                    <div className="text-sm text-white/60 truncate">{favorite.command}</div>
                    <div className="text-xs text-white/40 capitalize">{favorite.category}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromFavorites(favorite.id);
                    }}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};