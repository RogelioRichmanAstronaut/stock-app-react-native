import { ChartData } from '../types/stock';

export function generateRandomChartData(points: number = 20, trend: 'up' | 'down' | 'volatile' = 'volatile'): ChartData[] {
  const data: ChartData[] = [];
  let currentValue = 100;
  const now = Date.now();
  const hourInMs = 3600000;

  for (let i = 0; i < points; i++) {
    const timestamp = now - (points - i) * hourInMs;
    let change: number;

    switch (trend) {
      case 'up':
        change = (Math.random() * 5) - 1; // Mostly positive changes
        break;
      case 'down':
        change = (Math.random() * 5) - 4; // Mostly negative changes
        break;
      default:
        change = (Math.random() * 6) - 3; // Mixed changes
    }

    currentValue = Math.max(currentValue + change, 1);
    data.push({
      timestamp,
      value: currentValue,
    });
  }

  return data;
}

export function generateStockChartData(stock: { price: number; daily_change: number }): ChartData[] {
  const points = 20;
  const data: ChartData[] = [];
  let currentValue = stock.price;
  const now = Date.now();
  const hourInMs = 3600000;
  const trend = stock.daily_change >= 0 ? 'up' : 'down';

  // Calculate starting value based on daily change
  const startValue = stock.price / (1 + stock.daily_change / 100);

  for (let i = 0; i < points; i++) {
    const timestamp = now - (points - i) * hourInMs;
    const progress = i / (points - 1); // 0 to 1
    const value = startValue + (stock.price - startValue) * progress;
    
    // Add some noise to make it look more realistic
    const noise = (Math.random() - 0.5) * (stock.price * 0.005);
    data.push({
      timestamp,
      value: value + noise,
    });
  }

  return data;
}
