import React, { useCallback, useState, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { router } from 'expo-router';
import Animated from 'react-native-reanimated';
import { StockList } from '../components/StockList';
import { WalletHeader } from '../components/WalletHeader';
import { useStocks } from '../hooks/useStocks';
import { Stock, WalletInfo } from '../types/stock';
import { generateRandomChartData, generateStockChartData } from '../utils/chartUtils';
import { useTheme } from '../context/ThemeContext';

const SORT_OPTIONS = ['name', 'price', 'daily_change'] as const;

export function StockScreen() {
  const { stocks: rawStocks, isLoading, error, refreshStocks } = useStocks();
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState<typeof SORT_OPTIONS[number]>('daily_change');
  const { isDark } = useTheme();

  // Add chart data to stocks
  const stocks = useMemo(() => {
    return rawStocks.map(stock => ({
      ...stock,
      chartData: generateStockChartData(stock),
    }));
  }, [rawStocks]);

  const walletInfo: WalletInfo = useMemo(() => {
    const total = stocks.reduce((acc, stock) => {
      return acc + (stock.price * (stock.shares_owned || 0));
    }, 0);

    const dailyChange = stocks.reduce((acc, stock) => {
      return acc + (stock.price * stock.daily_change / 100 * (stock.shares_owned || 0));
    }, 0);

    return {
      total_value: total,
      daily_change_value: dailyChange,
      daily_change_percentage: (dailyChange / (total - dailyChange)) * 100,
      chart_data: generateRandomChartData(20, dailyChange >= 0 ? 'up' : 'down'),
    };
  }, [stocks]);

  const filteredAndSortedStocks = useMemo(() => {
    return stocks
      .filter(stock => {
        if (!filterText) return true;
        return (
          stock.symbol.toLowerCase().includes(filterText.toLowerCase()) ||
          stock.name.toLowerCase().includes(filterText.toLowerCase())
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'price':
            return b.price - a.price;
          case 'daily_change':
            return b.daily_change - a.daily_change;
          default:
            return 0;
        }
      });
  }, [stocks, filterText, sortBy]);

  const handleStockPress = useCallback((stock: Stock) => {
    router.push({
      pathname: `/stock/${stock.symbol}`,
      params: { stock: JSON.stringify(stock) }
    });
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: isDark ? '#000000' : '#F2F2F7' }]}>
        <ActivityIndicator testID="loading-indicator" size="large" color={isDark ? '#FFFFFF' : '#000000'} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: isDark ? '#000000' : '#F2F2F7' }]}>
        <Animated.Text testID="error-message" style={[styles.error, { color: '#FF3B30' }]}>{error}</Animated.Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#F2F2F7' }]}>
      <WalletHeader walletInfo={walletInfo} />
      
      <View style={styles.filterContainer}>
        <TextInput
          testID="stock-search-input"
          style={[
            styles.searchInput,
            {
              backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
              color: isDark ? '#FFFFFF' : '#000000',
            },
          ]}
          placeholder="Search stocks..."
          placeholderTextColor={isDark ? '#8E8E93' : '#3C3C43'}
          value={filterText}
          onChangeText={setFilterText}
        />
        <View style={styles.sortButtons}>
          {SORT_OPTIONS.map((option) => (
            <Animated.Text
              testID={`sort-button-${option}`}
              key={option}
              onPress={() => setSortBy(option)}
              style={[
                styles.sortButton,
                {
                  color: sortBy === option
                    ? (isDark ? '#FFFFFF' : '#000000')
                    : (isDark ? '#8E8E93' : '#666666'),
                },
              ]}>
              {option.replace('_', ' ')}
            </Animated.Text>
          ))}
        </View>
      </View>

      <StockList
        stocks={filteredAndSortedStocks}
        onStockPress={handleStockPress}
        onRefresh={refreshStocks}
        isRefreshing={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchInput: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  sortButton: {
    fontSize: 14,
    fontWeight: '600',
    padding: 8,
  },
});
