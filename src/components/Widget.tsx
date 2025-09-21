import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { AskAnythingWidget } from './widgets/AskAnythingWidget';
import { QuickSwapWidget } from './widgets/QuickSwapWidget';
import { MarketPulseWidget } from './widgets/PriceWidget';
import { MarketNewsWidget } from './widgets/MarketNewsWidget';
import { FearGreedWidget } from './widgets/FearGreedWidget';
import { PortfolioWidget } from './widgets/PortfolioWidget';
import { TrendingWidget } from './widgets/TrendingWidget';
import { PriceConverterWidget } from './widgets/PriceConverterWidget';
import { TwitterWidget } from './widgets/TwitterWidget';
import { DirectMessagesWidget } from './widgets/DirectMessagesWidget';
import { GripVertical, X } from 'lucide-react';
import { useStore } from '../store/useStore';

interface WidgetProps {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

const widgetComponents: Record<string, React.FC> = {
  'Portfolio Overview': PortfolioWidget,
  'Ask Anything': AskAnythingWidget,
  'Quick Swap': QuickSwapWidget,
  'Market Pulse': MarketPulseWidget,
  'Market News': MarketNewsWidget,
  'Fear & Greed Index': FearGreedWidget,
  'Trending': TrendingWidget,
  'Price Converter': PriceConverterWidget,
  'Twitter Feed': TwitterWidget,
  'Direct Messages': DirectMessagesWidget,
};

export const Widget: React.FC<WidgetProps> = ({ id, type, position, size }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  const { toggleWidgetVisibility } = useStore();

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
  } : undefined;

  const WidgetComponent = widgetComponents[type];

  // Special case for Ask Anything widget - no header
  const isAskAnything = type === 'Ask Anything';

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
      className={`widget group ${isAskAnything ? 'border-none bg-transparent' : ''}`}
    >
      {!isAskAnything && (
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
            onClick={() => toggleWidgetVisibility(type)}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
            title="Close widget"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>
      )}
      <div className={isAskAnything ? 'h-full' : 'h-[calc(100%-48px)]'}>
        {WidgetComponent ? <WidgetComponent /> : (
          <div className="p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-white/10 rounded w-1/2"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};