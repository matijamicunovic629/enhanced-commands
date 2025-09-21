import React, { useState } from 'react';
import { Plus, GripVertical } from 'lucide-react';
import { DndContext, DragEndEvent, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { NewsWidget } from '../widgets/NewsWidget';
import { TwitterWidget } from '../widgets/TwitterWidget';
import { TrendingWidget } from '../widgets/TrendingWidget';
import { AddWidgetModal } from './AddWidgetModal';

interface Widget {
  id: string;
  type: 'news' | 'twitter' | 'trending';
  position: { x: number; y: number };
}

interface DraggableWidgetProps {
  id: string;
  type: string;
  position: { x: number; y: number };
  onRemove: (id: string) => void;
  children: React.ReactNode;
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({ id, type, position, onRemove, children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
    position: 'absolute',
    left: position.x,
    top: position.y,
    width: 400,
    zIndex: 50
  } : {
    position: 'absolute',
    left: position.x,
    top: position.y,
    width: 400
  };

  return (
    <div
      ref={setNodeRef}
      style={style as React.CSSProperties}
      className="bg-white/5 rounded-xl"
    >
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div 
          className="flex items-center gap-2 cursor-move" 
          {...attributes} 
          {...listeners}
        >
          <GripVertical className="w-4 h-4 text-white/40" />
          <span className="font-medium">{type}</span>
        </div>
        <button
          onClick={() => onRemove(id)}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
        >
          <Plus className="w-4 h-4 rotate-45" />
        </button>
      </div>
      <div className="max-h-[500px] overflow-y-auto ai-chat-scrollbar">
        {children}
      </div>
    </div>
  );
};

export const MarketFeed: React.FC = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [showAddWidget, setShowAddWidget] = useState(false);

  const addWidget = (type: 'news' | 'twitter' | 'trending') => {
    const newWidget: Widget = {
      id: Math.random().toString(36).substring(7),
      type,
      position: {
        x: 20 + (widgets.length * 20), // Offset each new widget
        y: 20 + (widgets.length * 20)
      }
    };
    setWidgets(prev => [...prev, newWidget]);
  };

  const removeWidget = (id: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const widget = widgets.find(w => w.id === active.id);
    
    if (widget) {
      setWidgets(prev => prev.map(w => 
        w.id === active.id ? {
          ...w,
          position: {
            x: w.position.x + delta.x,
            y: w.position.y + delta.y,
          }
        } : w
      ));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setShowAddWidget(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Widget</span>
        </button>
      </div>

      <div className="relative h-[calc(100vh-200px)] overflow-auto ai-chat-scrollbar">
        <DndContext onDragEnd={handleDragEnd}>
          {widgets.map(widget => (
            <DraggableWidget
              key={widget.id}
              id={widget.id}
              type={widget.type}
              position={widget.position}
              onRemove={removeWidget}
            >
              {widget.type === 'news' && <NewsWidget />}
              {widget.type === 'twitter' && <TwitterWidget />}
              {widget.type === 'trending' && <TrendingWidget />}
            </DraggableWidget>
          ))}
        </DndContext>
      </div>

      <AddWidgetModal
        isOpen={showAddWidget}
        onClose={() => setShowAddWidget(false)}
        onAdd={addWidget}
      />
    </div>
  );
};