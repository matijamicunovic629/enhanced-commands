import React from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Widget } from './Widget';
import { AskAnythingWidget } from './widgets/AskAnythingWidget';
import { useStore } from '../store/useStore';

export const Workspace: React.FC = () => {
  const { widgets, updateWidget, widgetVisibility, isTopbarVisible, isTopbarBottom } = useStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const widget = widgets.find(w => w.id === active.id);
    
    if (widget) {
      updateWidget(widget.id, {
        position: {
          x: widget.position.x + delta.x,
          y: widget.position.y + delta.y,
        },
      });
    }
  };

  // Filter widgets based on visibility settings
  const visibleWidgets = widgets.filter(widget => widgetVisibility[widget.type]);

  return (
    <div className={`fixed inset-0 ${isTopbarVisible ? (isTopbarBottom ? 'pb-12' : 'pt-12') : ''} transition-all duration-300`}>
      <div className="relative w-full h-full p-6">
        <DndContext onDragEnd={handleDragEnd}>
          {visibleWidgets.map((widget) => (
            <Widget
              key={widget.id}
              id={widget.id}
              type={widget.type}
              position={widget.position}
              size={widget.size}
            />
          ))}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <AskAnythingWidget />
          </div>
        </DndContext>
      </div>
    </div>
  );
};