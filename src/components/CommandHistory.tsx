import React from 'react';
import { Clock, Search, Trash2, ArrowRight } from 'lucide-react';
import { useCommandCenterStore } from '../store/commandCenterStore';

interface CommandHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (command: string) => void;
}

export const CommandHistory: React.FC<CommandHistoryProps> = ({ isOpen, onClose, onSelect }) => {
  const { history, clearHistory } = useCommandCenterStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredHistory = history.filter(item =>
    item.command.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'transaction':
        return 'bg-blue-500/20 text-blue-400';
      case 'query':
        return 'bg-green-500/20 text-green-400';
      case 'navigation':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-white/20 text-white/60';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[800px] glass border border-white/10 rounded-xl shadow-lg z-50">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-medium">Command History</h3>
          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-sm">
            {history.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearHistory}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400"
            title="Clear history"
          >
            <Trash2 className="w-4 h-4" />
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
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search command history..."
            className="w-full bg-white/5 pl-10 pr-4 py-2 rounded-lg outline-none placeholder:text-white/40"
          />
        </div>

        <div className="max-h-64 overflow-y-auto ai-chat-scrollbar space-y-2">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              {searchQuery ? 'No matching commands found' : 'No command history yet'}
            </div>
          ) : (
            filteredHistory.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item.command);
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
              >
                <span className={`px-2 py-0.5 rounded-full text-xs ${getTypeColor(item.type)}`}>
                  {item.type.toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.command}</div>
                  <div className="text-sm text-white/60">
                    {item.timestamp.toLocaleString()}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/40" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};