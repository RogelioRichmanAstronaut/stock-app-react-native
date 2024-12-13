import React from 'react';
import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import { StockListProps } from '../src/types/stock';
import { StockItem } from './StockItem';
import { useTheme } from '../src/context/ThemeContext';

export function StockList({ stocks, onStockPress, onRefresh, isRefreshing }: StockListProps) {
  const { isDark } = useTheme();

  return (
    <FlatList
      data={stocks}
      keyExtractor={(item) => item.symbol}
      renderItem={({ item }) => (
        <StockItem
          stock={item}
          onPress={() => onStockPress(item)}
        />
      )}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing || false}
          onRefresh={onRefresh}
          tintColor={isDark ? '#FFFFFF' : '#000000'}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 8,
  },
});
