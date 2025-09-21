import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Save, Check, AlertCircle, Loader2 } from 'lucide-react';
import { setApiKey, getApiKey } from '../lib/apiKeys';

interface ApiKeyConfig {
  service: string;
  label: string;
  description: string;
  placeholder: string;
  validation?: (key: string) => boolean;
}

const apiKeyConfigs: ApiKeyConfig[] = [
  {
    service: 'coingecko',
    label: 'CoinGecko Pro API Key',
    description: 'Required for real-time price data and market information',
    placeholder: 'CG-xxxxxxxxxxxxxxxxxxxxxxxx',
    validation: (key: string) => key.startsWith('CG-') && key.length > 10
  },
  {
    service: 'cryptonews',
    label: 'CryptoNews API Key',
    description: 'Required for latest cryptocurrency news updates',
    placeholder: 'Enter your CryptoNews API key',
    validation: (key: string) => key.length > 10
  }
];

export const ApiKeySettings: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing API keys on mount
  useEffect(() => {
    const loadApiKeys = async () => {
      const loadingState: Record<string, boolean> = {};
      
      for (const config of apiKeyConfigs) {
        loadingState[config.service] = true;
        setLoading(prev => ({ ...prev, ...loadingState }));
        
        try {
          const key = await getApiKey(config.service);
          if (key) {
            setApiKeys(prev => ({ ...prev, [config.service]: key }));
          }
        } catch (error) {
          console.error(`Error loading ${config.service} API key:`, error);
        } finally {
          setLoading(prev => ({ ...prev, [config.service]: false }));
        }
      }
    };

    loadApiKeys();
  }, []);

  const handleSaveKey = async (service: string) => {
    const key = apiKeys[service];
    const config = apiKeyConfigs.find(c => c.service === service);
    
    if (!key || !config) return;

    // Validate key format if validation function exists
    if (config.validation && !config.validation(key)) {
      setErrors(prev => ({ 
        ...prev, 
        [service]: `Invalid ${config.label} format` 
      }));
      return;
    }

    setSaving(prev => ({ ...prev, [service]: true }));
    setErrors(prev => ({ ...prev, [service]: '' }));

    try {
      const success = await setApiKey(service, key);
      
      if (success) {
        setSaved(prev => ({ ...prev, [service]: true }));
        // Clear saved indicator after 3 seconds
        setTimeout(() => {
          setSaved(prev => ({ ...prev, [service]: false }));
        }, 3000);
      } else {
        setErrors(prev => ({ 
          ...prev, 
          [service]: 'Failed to save API key' 
        }));
      }
    } catch (error) {
      console.error(`Error saving ${service} API key:`, error);
      setErrors(prev => ({ 
        ...prev, 
        [service]: 'Error saving API key' 
      }));
    } finally {
      setSaving(prev => ({ ...prev, [service]: false }));
    }
  };

  const toggleShowKey = (service: string) => {
    setShowKeys(prev => ({ ...prev, [service]: !prev[service] }));
  };

  const handleKeyChange = (service: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [service]: value }));
    // Clear any existing errors when user starts typing
    if (errors[service]) {
      setErrors(prev => ({ ...prev, [service]: '' }));
    }
    // Clear saved indicator when user modifies the key
    if (saved[service]) {
      setSaved(prev => ({ ...prev, [service]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-1">API Keys</h2>
        <p className="text-sm text-white/60">
          Configure API keys for external services to enable real-time data
        </p>
      </div>

      <div className="space-y-6">
        {apiKeyConfigs.map((config) => (
          <div key={config.service} className="bg-white/5 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Key className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium">{config.label}</h3>
                <p className="text-sm text-white/60">{config.description}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showKeys[config.service] ? 'text' : 'password'}
                  value={apiKeys[config.service] || ''}
                  onChange={(e) => handleKeyChange(config.service, e.target.value)}
                  placeholder={config.placeholder}
                  className={`w-full bg-white/5 border rounded-lg px-4 py-3 pr-24 outline-none focus:border-white/20 ${
                    errors[config.service] ? 'border-red-500' : 'border-white/10'
                  }`}
                  disabled={loading[config.service]}
                />
                
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleShowKey(config.service)}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    disabled={loading[config.service]}
                  >
                    {showKeys[config.service] ? (
                      <EyeOff className="w-4 h-4 text-white/60" />
                    ) : (
                      <Eye className="w-4 h-4 text-white/60" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleSaveKey(config.service)}
                    disabled={
                      !apiKeys[config.service] || 
                      loading[config.service] || 
                      saving[config.service]
                    }
                    className={`p-1 rounded-lg transition-colors ${
                      saved[config.service]
                        ? 'text-green-400'
                        : 'hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    {loading[config.service] || saving[config.service] ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white/60" />
                    ) : saved[config.service] ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Save className="w-4 h-4 text-white/60" />
                    )}
                  </button>
                </div>
              </div>

              {errors[config.service] && (
                <div className="flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors[config.service]}</span>
                </div>
              )}

              {saved[config.service] && (
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <Check className="w-4 h-4" />
                  <span>API key saved successfully</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5 text-yellow-400" />
          <span className="font-medium">Security Notice</span>
        </div>
        <p className="text-sm text-white/80">
          API keys are securely stored in your Supabase database and are only accessible by the application. 
          Never share your API keys with others or include them in public repositories.
        </p>
      </div>
    </div>
  );
};