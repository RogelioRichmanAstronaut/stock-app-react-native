import { renderHook, act } from '@testing-library/react-native';
import { useStocks } from '../useStocks';

// Mock the stock data
jest.mock('../../../assets/dummy_stock_data.json', () => ({
  stocks: []
}));

describe('useStocks', () => {
  it('should handle loading state and data', async () => {
    const { result } = renderHook(() => useStocks());
    
    // Initial state
    expect(result.current.stocks).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });
});
