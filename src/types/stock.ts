export interface ChartData {
  timestamp: number;
  value: number;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  daily_change: number;
  market_cap?: string;
  volume?: number;
  open?: number;
  high?: number;
  low?: number;
  pe_ratio?: number;
  dividend_yield?: number;
  sector?: string;
  chartData: ChartData[];
  shares_owned?: number;
}

export interface WalletInfo {
  total_value: number;
  daily_change_percentage: number;
  daily_change_value: number;
  chart_data: ChartData[];
}

export interface StockListProps {
  stocks: Stock[];
  onStockPress: (stock: Stock) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  sortBy?: 'name' | 'price' | 'daily_change';
  filterText?: string;
}

export interface StockItemProps {
  stock: Stock;
  onPress: () => void;
}

export interface StockDetailProps {
  stock: Stock;
}

export interface WalletHeaderProps {
  walletInfo: WalletInfo;
}
