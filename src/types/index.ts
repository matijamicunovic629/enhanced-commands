// Add missing types
export interface CoinData {
  id: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  image: string;
  chartData: {
    timestamp: number;
    price: number;
  }[];
}

export interface SearchResult {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

export interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  marketCapRank: number;
  priceUsd: number;
  volume: number;
}

export interface MarketToken {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  sparkline: number[];
}

export interface NewsItem {
  title: string;
  source: string;
  time: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  link: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    tension: number;
  }[];
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      display: boolean;
    };
    tooltip?: {
      mode: 'index';
      intersect: boolean;
    };
  };
  scales: {
    x: {
      grid: {
        display?: boolean;
        color?: string;
      };
      ticks: {
        color: string;
        maxRotation?: number;
        autoSkip?: boolean;
        maxTicksLimit?: number;
      };
    };
    y: {
      grid: {
        color: string;
      };
      ticks: {
        color: string;
        callback?: (value: number) => string;
      };
    };
  };
}