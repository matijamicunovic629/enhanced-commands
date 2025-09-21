import React, { useState } from 'react';
import { 
  Bell, Settings, Plus, Trash2, RefreshCw, 
  DollarSign, LineChart, BarChart2, Users,
  Wallet, TrendingUp, Ship, Send, MessageSquare,
  Volume2, Search, ChevronDown, Info
} from 'lucide-react';

interface AlertTypeConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
  valueLabel: string;
  placeholder: string;
  customFields?: {
    name: string;
    label: string;
    type: 'text' | 'number' | 'select';
    placeholder?: string;
    options?: { value: string; label: string; }[];
  }[];
}

interface Alert {
  id: string;
  name: string;
  type: string;
  condition: 'above' | 'below';
  value: number;
  createdAt: string;
  lastTriggered: string | null;
  isActive: boolean;
  customData?: Record<string, any>;
}

interface NotificationSettings {
  email: {
    enabled: boolean;
    address: string;
  };
  desktop: {
    enabled: boolean;
  };
  telegram: {
    enabled: boolean;
  };
  discord: {
    enabled: boolean;
  };
  emailPreference: 'instant' | 'hourly' | 'daily';
  sound: boolean;
}

const alertTypes: AlertTypeConfig[] = [
  {
    id: 'price',
    label: 'Price Alert',
    icon: DollarSign,
    color: 'bg-blue-500/20 text-blue-400',
    description: 'Get notified when token price hits your target',
    valueLabel: 'Price',
    placeholder: 'Enter price in USD',
    customFields: [
      {
        name: 'token',
        label: 'Token',
        type: 'select',
        placeholder: 'Select token',
        options: [
          { value: 'BTC', label: 'Bitcoin (BTC)' },
          { value: 'ETH', label: 'Ethereum (ETH)' },
          { value: 'SOL', label: 'Solana (SOL)' }
        ]
      },
      {
        name: 'timeframe',
        label: 'Time Frame',
        type: 'select',
        options: [
          { value: '1h', label: '1 Hour' },
          { value: '24h', label: '24 Hours' },
          { value: '7d', label: '7 Days' }
        ]
      }
    ]
  },
  {
    id: 'volume',
    label: 'Volume Alert',
    icon: LineChart,
    color: 'bg-purple-500/20 text-purple-400',
    description: 'Track significant volume changes',
    valueLabel: 'Volume',
    placeholder: 'Enter volume in USD',
    customFields: [
      {
        name: 'token',
        label: 'Token',
        type: 'select',
        placeholder: 'Select token',
        options: [
          { value: 'BTC', label: 'Bitcoin (BTC)' },
          { value: 'ETH', label: 'Ethereum (ETH)' },
          { value: 'SOL', label: 'Solana (SOL)' }
        ]
      },
      {
        name: 'percentageChange',
        label: 'Percentage Change',
        type: 'number',
        placeholder: 'Enter % change'
      }
    ]
  },
  {
    id: 'tvl',
    label: 'TVL Alert',
    icon: Wallet,
    color: 'bg-green-500/20 text-green-400',
    description: 'Monitor Total Value Locked changes',
    valueLabel: 'TVL',
    placeholder: 'Enter TVL in USD',
    customFields: [
      {
        name: 'protocol',
        label: 'Protocol',
        type: 'select',
        placeholder: 'Select protocol',
        options: [
          { value: 'aave', label: 'Aave' },
          { value: 'uniswap', label: 'Uniswap' },
          { value: 'curve', label: 'Curve' }
        ]
      },
      {
        name: 'changeType',
        label: 'Change Type',
        type: 'select',
        options: [
          { value: 'absolute', label: 'Absolute Value' },
          { value: 'percentage', label: 'Percentage Change' }
        ]
      }
    ]
  },
  {
    id: 'social',
    label: 'Social Alert',
    icon: Users,
    color: 'bg-pink-500/20 text-pink-400',
    description: 'Track social media mentions and sentiment',
    valueLabel: 'Mentions',
    placeholder: 'Enter number of mentions',
    customFields: [
      {
        name: 'platform',
        label: 'Platform',
        type: 'select',
        options: [
          { value: 'twitter', label: 'Twitter' },
          { value: 'reddit', label: 'Reddit' },
          { value: 'telegram', label: 'Telegram' }
        ]
      },
      {
        name: 'sentiment',
        label: 'Sentiment',
        type: 'select',
        options: [
          { value: 'any', label: 'Any' },
          { value: 'positive', label: 'Positive' },
          { value: 'negative', label: 'Negative' }
        ]
      },
      {
        name: 'keywords',
        label: 'Keywords',
        type: 'text',
        placeholder: 'Enter keywords (comma separated)'
      }
    ]
  },
  {
    id: 'marketcap',
    label: 'Market Cap Alert',
    icon: BarChart2,
    color: 'bg-orange-500/20 text-orange-400',
    description: 'Monitor market capitalization changes',
    valueLabel: 'Market Cap',
    placeholder: 'Enter market cap in USD',
    customFields: [
      {
        name: 'token',
        label: 'Token',
        type: 'select',
        placeholder: 'Select token',
        options: [
          { value: 'BTC', label: 'Bitcoin (BTC)' },
          { value: 'ETH', label: 'Ethereum (ETH)' },
          { value: 'SOL', label: 'Solana (SOL)' }
        ]
      },
      {
        name: 'timeWindow',
        label: 'Time Window',
        type: 'select',
        options: [
          { value: '1h', label: '1 Hour' },
          { value: '24h', label: '24 Hours' },
          { value: '7d', label: '7 Days' }
        ]
      }
    ]
  },
  {
    id: 'trend',
    label: 'Trend Alert',
    icon: TrendingUp,
    color: 'bg-yellow-500/20 text-yellow-400',
    description: 'Get notified when tokens start trending',
    valueLabel: 'Rank',
    placeholder: 'Enter trending rank',
    customFields: [
      {
        name: 'platform',
        label: 'Platform',
        type: 'select',
        options: [
          { value: 'coingecko', label: 'CoinGecko' },
          { value: 'dextools', label: 'DexTools' },
          { value: 'dexscreener', label: 'DexScreener' }
        ]
      },
      {
        name: 'minMarketCap',
        label: 'Minimum Market Cap',
        type: 'number',
        placeholder: 'Enter min market cap in USD'
      }
    ]
  },
  {
    id: 'whale',
    label: 'Whale Alert',
    icon: Ship,
    color: 'bg-cyan-500/20 text-cyan-400',
    description: 'Track large token transfers',
    valueLabel: 'Amount',
    placeholder: 'Enter amount in tokens',
    customFields: [
      {
        name: 'token',
        label: 'Token',
        type: 'select',
        placeholder: 'Select token',
        options: [
          { value: 'BTC', label: 'Bitcoin (BTC)' },
          { value: 'ETH', label: 'Ethereum (ETH)' },
          { value: 'SOL', label: 'Solana (SOL)' }
        ]
      },
      {
        name: 'transferType',
        label: 'Transfer Type',
        type: 'select',
        options: [
          { value: 'all', label: 'All Transfers' },
          { value: 'exchange_inflow', label: 'Exchange Inflow' },
          { value: 'exchange_outflow', label: 'Exchange Outflow' }
        ]
      },
      {
        name: 'trackWallet',
        label: 'Track Specific Wallet',
        type: 'text',
        placeholder: 'Enter wallet address (optional)'
      }
    ]
  }
];

const mockAlerts: Alert[] = [
  {
    id: '1',
    name: 'BTC Above 50K',
    type: 'price',
    condition: 'above',
    value: 50000,
    createdAt: 'Mar 15, 11:00 AM',
    lastTriggered: 'Mar 15, 04:30 PM',
    isActive: true,
    customData: {
      token: 'BTC',
      timeframe: '24h'
    }
  },
  {
    id: '2',
    name: 'High ETH Volume',
    type: 'volume',
    condition: 'above',
    value: 5000000000,
    createdAt: 'Mar 14, 09:00 AM',
    lastTriggered: null,
    isActive: true,
    customData: {
      token: 'ETH',
      percentageChange: 50
    }
  },
  {
    id: '3',
    name: 'DeFi TVL Drop',
    type: 'tvl',
    condition: 'below',
    value: 50000000000,
    createdAt: 'Mar 13, 03:00 PM',
    lastTriggered: 'Mar 14, 10:15 AM',
    isActive: false,
    customData: {
      protocol: 'aave',
      changeType: 'percentage'
    }
  }
];

export const MarketAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: {
      enabled: true,
      address: ''
    },
    desktop: {
      enabled: true
    },
    telegram: {
      enabled: false
    },
    discord: {
      enabled: false
    },
    emailPreference: 'instant',
    sound: true
  });

  const [newAlert, setNewAlert] = useState({
    type: '',
    name: '',
    condition: 'above' as const,
    value: '',
    customData: {}
  });

  const handleCreateAlert = () => {
    if (!newAlert.type || !newAlert.name || !newAlert.value) return;

    const alert: Alert = {
      id: Math.random().toString(36).substring(7),
      name: newAlert.name,
      type: newAlert.type,
      condition: newAlert.condition,
      value: parseFloat(newAlert.value),
      createdAt: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      lastTriggered: null,
      isActive: true,
      customData: newAlert.customData
    };

    setAlerts(prev => [...prev, alert]);
    setShowCreateAlert(false);
    setNewAlert({ type: '', name: '', condition: 'above', value: '', customData: {} });
  };

  const toggleAlertStatus = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getTypeConfig = (type: string) => {
    return alertTypes.find(t => t.id === type);
  };

  const getTypeLabel = (type: string) => {
    const config = getTypeConfig(type);
    return config ? (
      <span className={`px-3 py-1 rounded-full text-sm ${config.color}`}>
        {config.label.toUpperCase()}
      </span>
    ) : null;
  };

  const handleCustomFieldChange = (fieldName: string, value: string) => {
    setNewAlert(prev => ({
      ...prev,
      customData: {
        ...prev.customData,
        [fieldName]: value
      }
    }));
  };

  const renderCustomFields = () => {
    const selectedType = alertTypes.find(type => type.id === newAlert.type);
    if (!selectedType?.customFields) return null;

    return (
      <div className="space-y-4">
        {selectedType.customFields.map(field => (
          <div key={field.name}>
            <label className="block text-sm text-white/60 mb-2">{field.label}</label>
            {field.type === 'select' ? (
              <select
                value={(newAlert.customData as any)[field.name] || ''}
                onChange={e => handleCustomFieldChange(field.name, e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-white/20"
              >
                <option value="">{field.placeholder || `Select ${field.label.toLowerCase()}`}</option>
                {field.options?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={(newAlert.customData as any)[field.name] || ''}
                onChange={e => handleCustomFieldChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-white/20"
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Alerts</h2>
          <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-sm">
            {alerts.filter(a => a.isActive).length} Active
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowCreateAlert(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Alert</span>
          </button>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-white/60">TYPE</th>
              <th className="text-left py-3 px-4 text-white/60">NAME</th>
              <th className="text-left py-3 px-4 text-white/60">CONDITION</th>
              <th className="text-left py-3 px-4 text-white/60">CREATED</th>
              <th className="text-left py-3 px-4 text-white/60">LAST TRIGGERED</th>
              <th className="text-left py-3 px-4 text-white/60">STATUS</th>
              <th className="text-left py-3 px-4 text-white/60">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map(alert => (
              <tr key={alert.id} className="border-b border-white/5 last:border-0">
                <td className="py-3 px-4">
                  {getTypeLabel(alert.type)}
                </td>
                <td className="py-3 px-4 font-medium">{alert.name}</td>
                <td className="py-3 px-4">
                  <span className="text-white/60">{alert.condition}</span>{' '}
                  <span>${alert.value.toLocaleString()}</span>
                </td>
                <td className="py-3 px-4 text-white/60">{alert.createdAt}</td>
                <td className="py-3 px-4 text-white/60">
                  {alert.lastTriggered || 'Never'}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => toggleAlertStatus(alert.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      alert.isActive ? 'bg-green-500' : 'bg-white/10'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        alert.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Alert Modal */}
      {showCreateAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreateAlert(false)} />
          <div className="relative glass border border-white/10 rounded-xl p-6 w-[500px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Create New Alert</h3>
              <button
                onClick={() => setShowCreateAlert(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 rotate-45" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Select Alert Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {alertTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setNewAlert(prev => ({ ...prev, type: type.id }))}
                      className={`p-3 rounded-lg transition-colors text-left ${
                        newAlert.type === type.id
                          ? 'bg-blue-500'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <type.icon className="w-4 h-4" />
                        <span className="font-medium">{type.label}</span>
                      </div>
                      <p className="text-xs text-white/60">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {newAlert.type && (
                <>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Alert Name</label>
                    <input
                      type="text"
                      value={newAlert.name}
                      onChange={e => setNewAlert(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter alert name"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-white/20"
                    />
                  </div>

                  {renderCustomFields()}

                  <div>
                    <label className="block text-sm text-white/60 mb-2">Condition</label>
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        value={newAlert.condition}
                        onChange={e => setNewAlert(prev => ({ ...prev, condition: e.target.value as 'above' | 'below' }))}
                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-white/20"
                      >
                        <option value="above">Above</option>
                        <option value="below">Below</option>
                      </select>
                      <input
                        type="text"
                        value={newAlert.value}
                        onChange={e => setNewAlert(prev => ({ ...prev, value: e.target.value }))}
                        placeholder="Enter value"
                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-white/20"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Bell className="w-4 h-4" />
                    <span>You'll receive notifications when your conditions are met</span>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateAlert(false)}
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAlert}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                >
                  Create Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
          <div className="relative glass border border-white/10 rounded-xl p-6 w-[500px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Notification Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 rotate-45" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Notification Channels */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Send className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Email Alerts</div>
                      <div className="text-sm text-white/60">Receive alerts via email</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificationSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, enabled: !prev.email.enabled }
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificationSettings.email.enabled ? 'bg-green-500' : 'bg-white/10'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.email.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {notificationSettings.email.enabled && (
                  <input
                    type="email"
                    value={notificationSettings.email.address}
                    onChange={e => setNotificationSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, address: e.target.value }
                    }))}
                    placeholder="Enter your email"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-white/20"
                  />
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Desktop Notifications</div>
                      <div className="text-sm text-white/60">Get browser notifications</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificationSettings(prev => ({
                      ...prev,
                      desktop: { enabled: !prev.desktop.enabled }
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificationSettings.desktop.enabled ? 'bg-green-500' : 'bg-white/10'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.desktop.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Telegram Alerts</div>
                      <div className="text-sm text-white/60">Get alerts on Telegram</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificationSettings(prev => ({
                      ...prev,
                      telegram: { enabled: !prev.telegram.enabled }
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificationSettings.telegram.enabled ? 'bg-green-500' : 'bg-white/10'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.telegram.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Discord Alerts</div>
                      <div className="text-sm text-white/60">Get alerts on Discord</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificationSettings(prev => ({
                      ...prev,
                      discord: { enabled: !prev.discord.enabled }
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificationSettings.discord.enabled ? 'bg-green-500' : 'bg-white/10'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.discord.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Email Preferences */}
              {notificationSettings.email.enabled && (
                <div>
                  <h4 className="text-lg font-medium mb-4">Email Preferences</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={notificationSettings.emailPreference === 'instant'}
                        onChange={() => setNotificationSettings(prev => ({
                          ...prev,
                          emailPreference: 'instant'
                        }))}
                        className="form-radio text-blue-500"
                      />
                      <span>Send instantly</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={notificationSettings.emailPreference === 'hourly'}
                        onChange={() => setNotificationSettings(prev => ({
                          ...prev,
                          emailPreference: 'hourly'
                        }))}
                        className="form-radio text-blue-500"
                      />
                       <span>Hourly digest</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={notificationSettings.emailPreference === 'daily'}
                        onChange={() => setNotificationSettings(prev => ({
                          ...prev,
                          emailPreference: 'daily'
                        }))}
                        className="form-radio text-blue-500"
                      />
                      <span>Daily digest</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Sound & Display */}
              <div>
                <h4 className="text-lg font-medium mb-4">Sound & Display</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Alert Sounds</div>
                      <div className="text-sm text-white/60">Play sound for new alerts</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificationSettings(prev => ({
                      ...prev,
                      sound: !prev.sound
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificationSettings.sound ? 'bg-green-500' : 'bg-white/10'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.sound ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};