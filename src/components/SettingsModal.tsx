import React, { useState } from 'react';
import { 
  X, 
  LayoutGrid, 
  Palette, 
  Users, 
  Key,
  Settings
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { AppearanceSettings } from './AppearanceSettings';
import { ReferralModal } from './ReferralModal';
import { ApiKeySettings } from './ApiKeySettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'widgets' | 'appearance' | 'referral' | 'api-keys';

const widgetConfigs = [
  { type: 'Portfolio Overview', icon: LayoutGrid, description: 'Display portfolio value and positions' },
  { type: 'Market News', icon: Settings, description: 'Latest crypto news and updates' },
  { type: 'Market Pulse', icon: Settings, description: 'Live cryptocurrency price charts' },
  { type: 'Fear & Greed Index', icon: Settings, description: 'Market sentiment indicator' },
  { type: 'Quick Swap', icon: Settings, description: 'Instant token swaps' },
  { type: 'Price Converter', icon: Settings, description: 'Convert between tokens and fiat' },
  { type: 'Ask Anything', icon: Settings, description: 'AI-powered crypto assistant' },
  { type: 'Trending', icon: Settings, description: 'Top trending cryptocurrencies' },
  { type: 'Twitter Feed', icon: Settings, description: 'Latest tweets from crypto influencers' },
  { type: 'Direct Messages', icon: Settings, description: 'Chat with other traders' }
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('widgets');
  const [showReferralModal, setShowReferralModal] = useState(false);
  const { widgetVisibility, toggleWidgetVisibility, resetWidgetVisibility } = useStore();

  if (!isOpen) return null;

  const tabs = [
    { id: 'widgets', label: 'Widgets', icon: LayoutGrid },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'referral', label: 'Referral', icon: Users },
    { id: 'api-keys', label: 'API Keys', icon: Key }
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="glass w-full max-w-5xl rounded-xl">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-xl font-semibold">Settings</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex">
            {/* Sidebar */}
            <div className="w-56 p-4 border-r border-white/10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'referral') {
                      setShowReferralModal(true);
                    } else {
                      setActiveTab(tab.id as SettingsTab);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 p-6 max-h-[calc(100vh-200px)] overflow-y-auto settings-scrollbar">
              {activeTab === 'widgets' && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium">Widget Visibility</h3>
                      <p className="text-sm text-white/60">
                        Choose which widgets to show in your workspace
                      </p>
                    </div>
                    <button
                      onClick={resetWidgetVisibility}
                      className="px-3 py-1 text-sm rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Reset All
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {widgetConfigs.map(({ type, icon: Icon, description }) => (
                      <div
                        key={type}
                        className="flex items-center justify-between p-4 rounded-lg glass"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white/5">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">{type}</h4>
                            <p className="text-sm text-white/60">{description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleWidgetVisibility(type)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            widgetVisibility[type] ? 'bg-blue-500' : 'bg-white/10'
                          } relative`}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                              widgetVisibility[type] ? 'left-7' : 'left-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {activeTab === 'appearance' && <AppearanceSettings />}
              {activeTab === 'api-keys' && <ApiKeySettings />}
            </div>
          </div>
        </div>
      </div>

      <ReferralModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
      />
    </>
  );
};