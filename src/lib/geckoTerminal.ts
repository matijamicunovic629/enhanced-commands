// Base URL and API key
const BASE_URL = 'https://api.geckoterminal.com/api/v2';

// Network configurations
export interface Network {
  id: string;
  name: string;
  logo: string;
}

// Mock data for fallback
const mockPools = [
  {
    id: 'uniswap_v3_eth_usdc',
    type: 'pool',
    attributes: {
      name: 'ETH/USDC',
      pool_created_at: '2023-01-01T00:00:00Z',
      price_change_percentage: {
        h24: '2.5',
        h1: '0.5'
      },
      base_token_price_usd: '3245.67',
      transactions: {
        h24: 1500
      },
      volume_usd: {
        h24: '25000000'
      },
      reserve_in_usd: '50000000',
      fdv_usd: '100000000'
    },
    relationships: {
      base_token: {
        data: {
          id: 'eth'
        }
      },
      quote_token: {
        data: {
          id: 'usdc'
        }
      }
    },
    included: {
      tokens: [
        {
          id: 'eth',
          type: 'token',
          attributes: {
            name: 'Ethereum',
            symbol: 'ETH',
            logo_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
          }
        },
        {
          id: 'usdc',
          type: 'token',
          attributes: {
            name: 'USD Coin',
            symbol: 'USDC',
            logo_url: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
          }
        }
      ]
    }
  }
];

// Network-specific mock data
const networkMockPools: Record<string, typeof mockPools> = {
  eth: mockPools,
  base: [
    {
      id: 'baseswap_eth_usdc',
      type: 'pool',
      attributes: {
        name: 'ETH/USDC',
        pool_created_at: '2023-06-15T00:00:00Z',
        price_change_percentage: {
          h24: '1.8',
          h1: '0.3'
        },
        base_token_price_usd: '3245.67',
        transactions: {
          h24: 800
        },
        volume_usd: {
          h24: '15000000'
        },
        reserve_in_usd: '25000000',
        fdv_usd: '50000000'
      },
      relationships: {
        base_token: {
          data: {
            id: 'eth'
          }
        },
        quote_token: {
          data: {
            id: 'usdc'
          }
        }
      },
      included: {
        tokens: [
          {
            id: 'eth',
            type: 'token',
            attributes: {
              name: 'Ethereum',
              symbol: 'ETH',
              logo_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
            }
          },
          {
            id: 'usdc',
            type: 'token',
            attributes: {
              name: 'USD Coin',
              symbol: 'USDC',
              logo_url: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
            }
          }
        ]
      }
    }
  ],
  solana: [
    {
      id: 'raydium_sol_usdc',
      type: 'pool',
      attributes: {
        name: 'SOL/USDC',
        pool_created_at: '2023-01-15T00:00:00Z',
        price_change_percentage: {
          h24: '3.2',
          h1: '0.7'
        },
        base_token_price_usd: '110.25',
        transactions: {
          h24: 2500
        },
        volume_usd: {
          h24: '20000000'
        },
        reserve_in_usd: '35000000',
        fdv_usd: '70000000'
      },
      relationships: {
        base_token: {
          data: {
            id: 'sol'
          }
        },
        quote_token: {
          data: {
            id: 'usdc'
          }
        }
      },
      included: {
        tokens: [
          {
            id: 'sol',
            type: 'token',
            attributes: {
              name: 'Solana',
              symbol: 'SOL',
              logo_url: 'https://cryptologos.cc/logos/solana-sol-logo.png'
            }
          },
          {
            id: 'usdc',
            type: 'token',
            attributes: {
              name: 'USD Coin',
              symbol: 'USDC',
              logo_url: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
            }
          }
        ]
      }
    }
  ]
};

// Utility functions
export function formatAge(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

export function formatNumber(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
}

// Updated fetch with better error handling
const fetchWithRetry = async (endpoint: string, options: RequestInit = {}, retries = 3): Promise<any> => {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0',
          ...options.headers
        },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after');
          await new Promise(resolve => setTimeout(resolve, (parseInt(retryAfter || '60') * 1000)));
          continue;
        }

        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format: Expected object');
      }

      return data;
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${i + 1} failed:`, {
        endpoint,
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : error
      });
      
      if (i < retries - 1) {
        const backoff = Math.min(1000 * Math.pow(2, i) + Math.random() * 1000, 10000);
        await new Promise(resolve => setTimeout(resolve, backoff));
      }
    }
  }

  // Return network-specific mock data as fallback
  const networkId = endpoint.split('/')[2];
  return { data: networkMockPools[networkId] || mockPools };
};

// Types
export interface Token {
  id: string;
  type: string;
  attributes: {
    name: string;
    symbol: string;
    logo_url?: string;
  };
}

export interface TokenPool {
  id: string;
  type: string;
  attributes: {
    name: string;
    pool_created_at: string;
    price_change_percentage: {
      h24?: string;
      h1?: string;
    };
    base_token_price_usd?: string;
    transactions?: {
      h24?: number;
    };
    volume_usd?: {
      h24?: string;
    };
    reserve_in_usd?: string;
    fdv_usd?: string;
  };
  relationships: {
    base_token: {
      data: {
        id: string;
      };
    };
    quote_token: {
      data: {
        id: string;
      };
    };
  };
  included?: {
    tokens: Token[];
    dexes?: any[];
    networks?: any[];
  };
}

// Updated pool fetching functions with network support
export async function getTrendingPools(network = 'eth', include = 'base_token,quote_token'): Promise<TokenPool[]> {
  try {
    const data = await fetchWithRetry(`/networks/${network}/trending_pools?include=${include}`);
    return data.data.map((pool: TokenPool) => ({
      ...pool,
      included: {
        tokens: data.included?.filter((item: any) => item.type === 'token') || [],
        dexes: data.included?.filter((item: any) => item.type === 'dex') || [],
        networks: data.included?.filter((item: any) => item.type === 'network') || []
      }
    }));
  } catch (error) {
    console.error('Error fetching trending pools:', {
      network,
      include,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error
    });
    return networkMockPools[network] || mockPools;
  }
}

export async function getNewPools(network = 'eth', include = 'base_token,quote_token'): Promise<TokenPool[]> {
  try {
    const data = await fetchWithRetry(`/networks/${network}/new_pools?include=${include}`);
    return data.data.map((pool: TokenPool) => ({
      ...pool,
      included: {
        tokens: data.included?.filter((item: any) => item.type === 'token') || [],
        dexes: data.included?.filter((item: any) => item.type === 'dex') || [],
        networks: data.included?.filter((item: any) => item.type === 'network') || []
      }
    }));
  } catch (error) {
    console.error('Error fetching new pools:', error);
    return networkMockPools[network] || mockPools;
  }
}

export async function getTopPools(network = 'eth', include = 'base_token,quote_token'): Promise<TokenPool[]> {
  try {
    const data = await fetchWithRetry(`/networks/${network}/pools?page=1&include=${include}`);
    return data.data.map((pool: TokenPool) => ({
      ...pool,
      included: {
        tokens: data.included?.filter((item: any) => item.type === 'token') || [],
        dexes: data.included?.filter((item: any) => item.type === 'dex') || [],
        networks: data.included?.filter((item: any) => item.type === 'network') || []
      }
    }));
  } catch (error) {
    console.error('Error fetching top pools:', error);
    return networkMockPools[network] || mockPools;
  }
}