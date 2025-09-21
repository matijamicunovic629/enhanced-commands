declare global {
  interface Window {
    TradingView: {
      widget: new (configuration: {
        container: HTMLElement;
        symbol: string;
        interval: string;
        timezone?: string;
        theme?: string;
        style?: string;
        locale?: string;
        toolbar_bg?: string;
        enable_publishing?: boolean;
        allow_symbol_change?: boolean;
        save_image?: boolean;
        studies?: string[];
        width?: string | number;
        height?: string | number;
      }) => any;
    };
  }
}

export {};