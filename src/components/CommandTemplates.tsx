import React from 'react';
import { FileText, ArrowRight, Edit, Trash2, Plus } from 'lucide-react';
import { useCommandCenterStore } from '../store/commandCenterStore';

interface CommandTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: any) => void;
}

export const CommandTemplates: React.FC<CommandTemplatesProps> = ({ isOpen, onClose, onSelect }) => {
  const { templates, removeTemplate, setSelectedTemplate } = useCommandCenterStore();
  const [selectedCategory, setSelectedCategory] = React.useState<'all' | 'trading' | 'defi' | 'portfolio' | 'market'>('all');
  const [showAddForm, setShowAddForm] = React.useState(false);

  const filteredTemplates = templates.filter(template =>
    selectedCategory === 'all' || template.category === selectedCategory
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trading':
        return 'bg-blue-500/20 text-blue-400';
      case 'defi':
        return 'bg-green-500/20 text-green-400';
      case 'portfolio':
        return 'bg-purple-500/20 text-purple-400';
      case 'market':
        return 'bg-orange-500/20 text-orange-400';
      default:
        return 'bg-white/20 text-white/60';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[800px] glass border border-white/10 rounded-xl shadow-lg z-50">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-medium">Command Templates</h3>
          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-sm">
            {templates.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-green-400"
            title="Add template"
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
        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-4">
          {['all', 'trading', 'defi', 'portfolio', 'market'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors capitalize ${
                selectedCategory === category ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {showAddForm && (
          <div className="mb-4 p-4 bg-white/5 rounded-lg">
            <h4 className="font-medium mb-3">Create New Template</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Template name"
                className="w-full bg-white/5 px-3 py-2 rounded-lg outline-none placeholder:text-white/40"
              />
              <input
                type="text"
                placeholder="Template command (use {variable} for placeholders)"
                className="w-full bg-white/5 px-3 py-2 rounded-lg outline-none placeholder:text-white/40"
              />
              <textarea
                placeholder="Description"
                className="w-full bg-white/5 px-3 py-2 rounded-lg outline-none placeholder:text-white/40 h-20"
              />
              <select className="w-full bg-white/5 px-3 py-2 rounded-lg outline-none">
                <option value="trading">Trading</option>
                <option value="defi">DeFi</option>
                <option value="portfolio">Portfolio</option>
                <option value="market">Market</option>
              </select>
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
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto ai-chat-scrollbar">
          {filteredTemplates.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-white/60">
              No templates found
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onSelect(template);
                  onClose();
                }}
                className="flex flex-col gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium truncate">{template.name}</div>
                  <div className="flex items-center gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(template.category)}`}>
                      {template.category.toUpperCase()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTemplate(template.id);
                      }}
                      className="p-1 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-white/60 truncate">{template.description}</div>
                <div className="text-xs text-blue-400 font-mono truncate">{template.template}</div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};