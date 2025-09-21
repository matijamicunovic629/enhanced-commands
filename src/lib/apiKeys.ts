// API Key management utilities
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cache for API keys to avoid repeated requests
const apiKeyCache: Record<string, { key: string; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      lastError = error as Error;
      console.warn(`API key fetch attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  throw lastError!;
}

export async function getApiKey(service: string): Promise<string | null> {
  try {
    // Check cache for other services or if env vars not available
    const cached = apiKeyCache[service];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.key;
    }

    // Try to fetch from Supabase Edge Function
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const response = await fetchWithRetry(`${SUPABASE_URL}/functions/v1/get-api-key`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ service })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.apiKey) {
            // Cache the retrieved key
            apiKeyCache[service] = {
              key: data.apiKey,
              timestamp: Date.now()
            };
            return data.apiKey;
          }
        }
      } catch (error) {
        console.warn(`Error fetching API key from Supabase for ${service}:`, error);
      }
    }

    // Fallback to environment variables
    if (service === 'coingecko') {
      const envKey = import.meta.env.VITE_COINGECKO_API_KEY;
      if (envKey) {
        // Cache the key
        apiKeyCache[service] = {
          key: envKey,
          timestamp: Date.now()
        };
        return envKey;
      }
    }
    
    if (service === 'cryptonews') {
      const envKey = import.meta.env.VITE_CRYPTONEWS_API_KEY;
      if (envKey) {
        // Cache the key
        apiKeyCache[service] = {
          key: envKey,
          timestamp: Date.now()
        };
        return envKey;
      }
    }

    // No API key available
    console.warn(`API key for ${service} not available in Supabase, environment variables, or cache`);
    return null;
  } catch (error) {
    console.warn(`Error fetching API key for ${service}:`, error);
    return null;
  }
}

export async function setApiKey(service: string, apiKey: string): Promise<boolean> {
  try {
    // Try to store in Supabase Edge Function first
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const response = await fetchWithRetry(`${SUPABASE_URL}/functions/v1/set-api-key`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ service, apiKey })
        });

        if (response.ok) {
          // Also cache locally for immediate use
          apiKeyCache[service] = {
            key: apiKey,
            timestamp: Date.now()
          };
          console.log(`API key for ${service} stored in Supabase and cached locally`);
          return true;
        } else {
          console.warn(`Failed to store API key in Supabase for ${service}, falling back to local cache`);
        }
      } catch (error) {
        console.warn(`Error storing API key in Supabase for ${service}:`, error);
      }
    }

    // Fallback to local cache only
    apiKeyCache[service] = {
      key: apiKey,
      timestamp: Date.now()
    };
    console.log(`API key for ${service} cached locally only`);
    return true;
  } catch (error) {
    console.error(`Error setting API key for ${service}:`, error);
    return false;
  }
}

// Clear cache for a specific service
export function clearApiKeyCache(service?: string) {
  if (service) {
    delete apiKeyCache[service];
  } else {
    Object.keys(apiKeyCache).forEach(key => delete apiKeyCache[key]);
  }
}