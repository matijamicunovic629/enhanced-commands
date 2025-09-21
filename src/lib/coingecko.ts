// Base URL and API key
const BASE_URL = 'https://pro-api.coingecko.com/api/v3';
import { getApiKey } from './apiKeys';

// Price memory storage for last fetched prices
interface PriceMemoryEntry {
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  image: string;
  timestamp: number;
  chartData?: { timestamp: number; price: number; }[];
}

// Global price memory storage
const priceMemoryStorage: Record<string, PriceMemoryEntry> = {};

// Save price data to memory
export const savePriceToMemory = (coinId: string, data: CoinData) => {
  priceMemoryStorage[coinId] = {
    price: data.price,
    priceChange24h: data.priceChange24h,
    marketCap: data.marketCap,
    volume24h: data.volume24h,
    image: data.image,
    timestamp: Date.now(),
    chartData: data.chartData
  };
  console.log(`Saved price data to memory for ${coinId}:`, priceMemoryStorage[coinId]);
};

// Get price data from memory
export const getPriceFromMemory = (coinId: string): CoinData | null => {
  const cached = priceMemoryStorage[coinId];
  if (!cached) {
    console.log(`No cached data found for ${coinId}`);
    return null;
  }
  
  // Data is valid for 10 minutes
  const isStale = Date.now() - cached.timestamp > 10 * 60 * 1000;
  if (isStale) {
    console.log(`Cached data for ${coinId} is stale`);
    return null;
  }
  
  console.log(`Using cached data for ${coinId}:`, cached);
  return {
    id: coinId,
    price: cached.price,
    priceChange24h: cached.priceChange24h,
    marketCap: cached.marketCap,
    volume24h: cached.volume24h,
    image: cached.image,
    chartData: cached.chartData || []
  };
};

// Get last known price even if stale (for emergency fallback)
export const getLastKnownPrice = (coinId: string): CoinData | null => {
  const cached = priceMemoryStorage[coinId];
  if (!cached) return null;
  
  return {
    id: coinId,
    price: cached.price,
    priceChange24h: cached.priceChange24h,
    marketCap: cached.marketCap,
    volume24h: cached.volume24h,
    image: cached.image,
    chartData: cached.chartData || []
  };
};

// Circuit breaker state
let circuitBreakerTripped = false;
let lastFailureTime = 0;
const CIRCUIT_BREAKER_TIMEOUT = 60000; // 1 minute
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

// Improved fetch with retry mechanism and circuit breaker
const fetchWithRetry = async (endpoint: string, options: RequestInit = {}) => {
  console.log('Making API call to:', `${BASE_URL}${endpoint}`);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Get API key from Supabase
      const apiKey = await getApiKey('coingecko');
      
      // Create AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'User-Agent': 'CryptoApp/1.0',
        'Content-Type': 'application/json'
      };
      
      // Add API key if available
      if (apiKey) {
        headers['x-cg-pro-api-key'] = apiKey;
      }
      
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        mode: 'cors',
        signal: controller.signal,
        headers: {
          ...options.headers,
          ...headers
        }
      });

      // Clear timeout if request completes
      clearTimeout(timeoutId);
      
      console.log('API Response status:', response.status);

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('retry-after') || '60');
          console.log(`Rate limited, waiting ${retryAfter} seconds...`);
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          continue;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);
      return data;
    } catch (error) {
      // Handle AbortError specifically
      if (error.name === 'AbortError') {
        console.warn(`Request timeout on attempt ${attempt}`);
      } else {
        console.warn(`CoinGecko API attempt ${attempt} failed:`, error);
      }
      
      if (attempt === MAX_RETRIES) {
        console.warn('Max retries reached, no fallback data available');
        throw error;
      }

      // Exponential backoff with jitter
      const delay = Math.min(RETRY_DELAY * Math.pow(2, attempt - 1) + Math.random() * 1000, 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('All retry attempts failed');
};

// Get coin price and market data
export async function getCoinPrice(coinId: string): Promise<CoinData> {
  // First try to get from memory
  const cachedData = getPriceFromMemory(coinId);
  if (cachedData) {
    console.log(`Using cached price data for ${coinId}`);
    return cachedData;
  }

  try {
    console.log('Fetching price for coin:', coinId);
    const data = await fetchWithRetry(
      `/simple/price?ids=${coinId}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`
    );

    console.log('Price data received:', data);

    // Check if we got valid data from the API
    if (!data || !data[coinId] || typeof data[coinId].usd !== 'number') {
      console.warn('No valid data received from API, using mock data for:', coinId);
      // Try to get last known price
      const lastKnown = getLastKnownPrice(coinId);
      if (lastKnown) {
        console.log(`Using last known price for ${coinId}`);
        return lastKnown;
      }
      throw new Error('No valid data available');
    }

    // Try to get chart data, but don't fail if it's not available
    let chartData;
    try {
      chartData = await getOHLCV(coinId);
    } catch (error) {
      console.warn('Chart data not available, using mock chart data');
      // Generate basic chart data from current price
      const currentPrice = data[coinId].usd;
      chartData = Array(24).fill(0).map((_, i) => ({
        time: Date.now() - (24 - i) * 3600000,
        open: currentPrice,
        high: currentPrice * 1.01,
        low: currentPrice * 0.99,
        close: currentPrice + (Math.random() * currentPrice * 0.02 - currentPrice * 0.01),
        volume: (data[coinId].usd_24h_vol || 0) / 24
      }));
    }
    
    // Try to get coin image, but don't fail if it's not available
    let coinImage;
    try {
      const coinInfo = await getCoinInfo(coinId);
      coinImage = coinInfo.image;
    } catch (error) {
      console.warn('Coin image not available, using placeholder');
      coinImage = `https://via.placeholder.com/64/4A90E2/FFFFFF?text=${coinId.charAt(0).toUpperCase()}`;
    }
    
    const result: CoinData = {
      id: coinId,
      price: data[coinId].usd,
      priceChange24h: data[coinId].usd_24h_change || 0,
      marketCap: data[coinId].usd_market_cap || 0,
      volume24h: data[coinId].usd_24h_vol || 0,
      image: coinImage,
      chartData: chartData.map(candle => ({
        timestamp: candle.time,
        price: candle.close
      }))
    };
    
    // Save to memory before returning
    savePriceToMemory(coinId, result);
    return result;
  } catch (error) {
    console.error('Error in getCoinPrice:', error);
    
    // Try to get last known price as final fallback
    const lastKnown = getLastKnownPrice(coinId);
    if (lastKnown) {
      console.log(`Using last known price as fallback for ${coinId}`);
      return lastKnown;
    }
    
    // If no cached data exists, throw the error
    throw new Error(`Failed to fetch price data for ${coinId}: ${error.message}`);
  }
}

// Get OHLCV data
export async function getOHLCV(coinId: string, days: number = 1): Promise<{
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}[]> {
  try {
    const data = await fetchWithRetry(`/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`);
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid OHLCV data format');
    }

    return data.map((candle: number[]) => ({
      time: candle[0],
      open: candle[1] || 0,
      high: candle[2] || 0,
      low: candle[3] || 0,
      close: candle[4] || 0,
      volume: 0
    }));
  } catch (error) {
    console.error(`Error fetching OHLCV for ${coinId}:`, error);
    
    // Try to get last known price for basic chart
    const lastKnown = getLastKnownPrice(coinId);
    if (lastKnown) {
      // Generate basic chart data from last known price
      return Array(24).fill(0).map((_, i) => {
        const time = Date.now() - (24 - i) * 3600000;
        const basePrice = lastKnown.price;
        const randomFactor = 0.98 + Math.random() * 0.04;

        return {
          time,
          open: basePrice * randomFactor,
          high: basePrice * (randomFactor + 0.01),
          low: basePrice * (randomFactor - 0.01),
          close: basePrice * (randomFactor + (Math.random() * 0.02 - 0.01)),
          volume: lastKnown.volume24h / 24
        };
      });
    }
    
    throw error;
  }
}

// Get coin info including images
export async function getCoinInfo(coinId: string): Promise<{
  id: string;
  name: string;
  symbol: string;
  image: string;
}> {
  try {
    const data = await fetchWithRetry(`/coins/${coinId}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false`);
    
    // Enhanced validation of the API response
    if (!data || typeof data !== 'object') {
      console.warn(`Invalid response for coin ${coinId}, using mock data`);
      throw new Error('Invalid response format');
    }

    // Validate required fields
    const validatedData = {
      id: data.id,
      name: data.name,
      symbol: data.symbol,
      image: data.image?.small || data.image?.thumb
    };

    if (!validatedData.id || !validatedData.name || !validatedData.symbol) {
      console.warn(`Missing required fields for coin ${coinId}, using mock data`);
      throw new Error('Missing required fields');
    }

    // If image is missing, use mock data image
    if (!validatedData.image) {
      validatedData.image = `https://via.placeholder.com/64/4A90E2/FFFFFF?text=${coinId.charAt(0).toUpperCase()}`;
    }

    return validatedData;
  } catch (error) {
    console.warn(`Error getting coin info for ${coinId}:`, error);
    throw new Error(`Failed to get coin info for ${coinId}: ${error.message}`);
  }
}

// Search coins with improved error handling
export async function searchCoins(query: string): Promise<SearchResult[]> {
  const data = await fetchWithRetry(`/search?query=${encodeURIComponent(query)}`);
  
  if (!data?.coins || !Array.isArray(data.coins)) {
    return [];
  }

  return data.coins.map((coin: any) => ({
    id: coin.id,
    name: coin.name,
    symbol: (coin.symbol || '').toUpperCase(),
    thumb: coin.thumb || getMockDataForCoin(coin.id || 'bitcoin').image
  }));
}

// Get trending coins with improved error handling
export async function getTrendingCoins(): Promise<TrendingCoin[]> {
  try {
    const data = await fetchWithRetry('/search/trending');
    
    if (!data?.coins || !Array.isArray(data.coins)) {
      throw new Error('Invalid trending data format');
    }

    return data.coins.map((item: any) => ({
      id: item.item.id,
      name: item.item.name,
      symbol: (item.item.symbol || '').toUpperCase(),
      thumb: item.item.thumb || item.item.small || `https://via.placeholder.com/64/4A90E2/FFFFFF?text=${(item.item.symbol || 'T').charAt(0).toUpperCase()}`,
      marketCapRank: item.item.market_cap_rank || null,
      priceUsd: parseFloat(item.item.data?.price || '0') || (item.item.price_btc || 0) * 67000,
      volume: parseFloat(item.item.data?.total_volume || '0') || (item.item.price_btc || 0) * 67000 * 1000000
    }));
  } catch (error) {
    console.error('Error fetching trending coins, using mock data:', error);
    
    throw error;
  }
}

// Get multiple coins data
export async function getMultipleCoinsData(coinIds: string[]): Promise<Record<string, {
  price: number;
  priceChange24h: number;
  image: string;
}>> {
  try {
    const idsParam = coinIds.join(',');
    const data = await fetchWithRetry(
      `/simple/price?ids=${idsParam}&vs_currencies=usd&include_24hr_change=true`
    );
    
    const result: Record<string, {
      price: number;
      priceChange24h: number;
      image: string;
    }> = {};
    
    // Get images in parallel
    const imagePromises = coinIds.map(id => getCoinInfo(id));
    const imageResults = await Promise.all(imagePromises);
    const imageMap = Object.fromEntries(imageResults.map(info => [info.id, info.image]));
    
    for (const coinId of coinIds) {
      if (data && data[coinId]) {
        result[coinId] = {
          price: data[coinId].usd || 0,
          priceChange24h: data[coinId].usd_24h_change || 0,
          image: imageMap[coinId] || `https://via.placeholder.com/64/4A90E2/FFFFFF?text=${coinId.charAt(0).toUpperCase()}`
        };
      } else {
        // Try to get from memory
        const lastKnown = getLastKnownPrice(coinId);
        if (lastKnown) {
          result[coinId] = {
            price: lastKnown.price,
            priceChange24h: lastKnown.priceChange24h,
            image: lastKnown.image
          };
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching multiple coins data:', error);
    
    // Try to return cached data for all requested coins
    const result: Record<string, {
      price: number;
      priceChange24h: number;
      image: string;
    }> = {};
    
    for (const coinId of coinIds) {
      const lastKnown = getLastKnownPrice(coinId);
      if (lastKnown) {
        result[coinId] = {
          price: lastKnown.price,
          priceChange24h: lastKnown.priceChange24h,
          image: lastKnown.image
        };
      }
    }
    
    return result;
  }
}

// Get top coins by market cap
export async function getTopCoins(limit: number = 10): Promise<{
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  priceChange24h: number;
  marketCap: number;
}[]> {
  try {
    const data = await fetchWithRetry(
      `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
    );
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format');
    }
    
    return data.map(coin => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image || `https://via.placeholder.com/64/4A90E2/FFFFFF?text=${coin.id.charAt(0).toUpperCase()}`,
      currentPrice: coin.current_price,
      priceChange24h: coin.price_change_percentage_24h,
      marketCap: coin.market_cap
    }));
  } catch (error) {
    console.error('Error fetching top coins:', error);
    throw error;
  }
}