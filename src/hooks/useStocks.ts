import { useState, useEffect } from 'react';
import { Stock } from '../types/stock';
import stockData from '../../assets/dummy_stock_data.json';

export function useStocks() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    setIsLoading(true);
    try {
      setStocks(stockData.stocks);
      setError(null);
    } catch (err) {
      setError('Failed to load stocks data');
      console.error('Error loading stocks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    stocks,
    isLoading,
    error,
    refreshStocks: loadStocks,
  };
}
