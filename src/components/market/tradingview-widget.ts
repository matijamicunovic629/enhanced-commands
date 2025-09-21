// Advanced TradingView Charting Library integration
interface ChartingLibraryWidgetOptions {
  container: HTMLElement;
  symbol: string;
  interval: string;
  theme?: 'light' | 'dark';
  timezone?: string;
  style?: string;
  locale?: string;
  enable_publishing?: boolean;
  hide_top_toolbar?: boolean;
  hide_legend?: boolean;
  save_image?: boolean;
  studies?: {
    id: string;
    visible: boolean;
  }[];
  disabled_features?: string[];
}

export class widget {
  private _container: HTMLElement;
  private _options: ChartingLibraryWidgetOptions;
  private _widget: any = null;

  constructor(options: ChartingLibraryWidgetOptions) {
    this._options = {
      ...options,
      enable_publishing: false,
      hide_legend: false,
      save_image: true,
      style: '1'
    };
    this._container = options.container;
    this._init();
  }

  private _init() {
    try {
      // Create iframe for TradingView widget
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', this._generateWidgetUrl());
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';

      // Clear container and append iframe
      this._container.innerHTML = '';
      this._container.appendChild(iframe);

      // Store reference to iframe
      this._widget = iframe;
    } catch (error) {
      console.error('Error initializing TradingView widget:', error);
      this._container.innerHTML = '<div class="flex items-center justify-center h-full text-white/60">Unable to load chart</div>';
    }
  }

  private _generateWidgetUrl(): string {
    const {
      symbol,
      interval,
      theme = 'dark',
      timezone = 'Etc/UTC',
      style = '1',
      locale = 'en',
      enable_publishing = false,
      hide_top_toolbar = false,
      hide_legend = false
    } = this._options;

    // Convert symbol format (e.g., "BINANCE:BTCUSDT" -> "BINANCE%3ABTCUSDT")
    const encodedSymbol = encodeURIComponent(symbol);

    const params = new URLSearchParams({
      symbol: encodedSymbol,
      interval,
      theme,
      timezone,
      style,
      locale,
      enable_publishing: enable_publishing.toString(),
      hide_top_toolbar: hide_top_toolbar.toString(),
      hide_legend: hide_legend.toString()
    });

    // Add studies if specified
    if (this._options.studies) {
      this._options.studies.forEach(study => {
        params.append('studies', study.id);
      });
    }

    return `https://s.tradingview.com/widgetembed/?${params.toString()}`;
  }

  public remove() {
    if (this._widget) {
      this._widget.remove();
      this._widget = null;
    }
    this._container.innerHTML = '';
  }
}