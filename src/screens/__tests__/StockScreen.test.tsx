import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import { StockScreen } from '../StockScreen';
import { render } from '../../test-utils/test-utils';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  return {
    createAnimatedComponent: (component) => component,
  };
});

// Mock the components that use Animated
jest.mock('@/components/StockList', () => {
  const mockReact = require('react');
  const mockRN = require('react-native');
  return {
    StockList: ({ stocks }) => 
      mockReact.createElement(
        mockRN.View,
        { testID: 'stock-list' },
        stocks.map(stock =>
          mockReact.createElement(
            mockRN.View,
            { 
              key: stock.symbol,
              testID: 'stock-item'
            },
            mockReact.createElement(
              mockRN.Text,
              null,
              stock.name
            )
          )
        )
      ),
  };
});

jest.mock('@/components/WalletHeader', () => {
  const mockReact = require('react');
  const mockRN = require('react-native');
  return {
    WalletHeader: () => 
      mockReact.createElement(
        mockRN.View,
        { testID: 'wallet-header' }
      ),
  };
});

// Mock stock data
const mockStocks = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 150.0,
    daily_change: 2.5,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 2800.0,
    daily_change: -1.2,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 280.0,
    daily_change: 1.8,
  },
];

// Mock the useStocks hook
jest.mock('@/hooks/useStocks', () => ({
  useStocks: () => ({
    stocks: mockStocks,
    isLoading: false,
    error: null,
    refreshStocks: jest.fn(),
  }),
}));

describe('StockScreen Filter Tests', () => {
  describe('Search functionality', () => {
    it('filters stocks by symbol', () => {
      const { getByTestId, queryAllByTestId } = render(<StockScreen />);
      
      const searchInput = getByTestId('stock-search-input');
      fireEvent.changeText(searchInput, 'AAPL');

      const stockItems = queryAllByTestId('stock-item');
      expect(stockItems).toHaveLength(1);
      expect(stockItems[0]).toHaveTextContent('Apple Inc.');
    });

    it('filters stocks by name', () => {
      const { getByTestId, queryAllByTestId } = render(<StockScreen />);
      
      const searchInput = getByTestId('stock-search-input');
      fireEvent.changeText(searchInput, 'micro');

      const stockItems = queryAllByTestId('stock-item');
      expect(stockItems).toHaveLength(1);
      expect(stockItems[0]).toHaveTextContent('Microsoft Corporation');
    });

    it('shows all stocks when search is empty', () => {
      const { getByTestId, queryAllByTestId } = render(<StockScreen />);
      
      const searchInput = getByTestId('stock-search-input');
      fireEvent.changeText(searchInput, '');

      const stockItems = queryAllByTestId('stock-item');
      expect(stockItems).toHaveLength(3);
    });

    it('shows no stocks when search has no matches', () => {
      const { getByTestId, queryAllByTestId } = render(<StockScreen />);
      
      const searchInput = getByTestId('stock-search-input');
      fireEvent.changeText(searchInput, 'xyz');

      const stockItems = queryAllByTestId('stock-item');
      expect(stockItems).toHaveLength(0);
    });

    it('is case insensitive', () => {
      const { getByTestId, queryAllByTestId } = render(<StockScreen />);
      
      const searchInput = getByTestId('stock-search-input');
      fireEvent.changeText(searchInput, 'apple');

      const stockItems = queryAllByTestId('stock-item');
      expect(stockItems).toHaveLength(1);
      expect(stockItems[0]).toHaveTextContent('Apple Inc.');
    });
  });
});
