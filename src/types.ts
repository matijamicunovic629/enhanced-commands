// ... (keep existing interfaces)

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