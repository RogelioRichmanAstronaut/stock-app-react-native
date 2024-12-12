import React from 'react';
import { Pressable, StyleSheet, View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { StockItemProps } from '../types/stock';
import { formatPrice, formatPercentageChange, getChangeColor } from '../utils/stockUtils';
import { useTheme } from '../context/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const screenWidth = Dimensions.get('window').width;

export function StockItem({ stock, onPress }: StockItemProps) {
  const { isDark } = useTheme();
  const changeColor = getChangeColor(stock.daily_change);

  const chartData = {
    labels: [],
    datasets: [{
      data: stock.chartData.map(point => point.value),
    }],
  };

  const chartConfig = {
    backgroundGradientFrom: isDark ? '#1C1C1E' : '#FFFFFF',
    backgroundGradientTo: isDark ? '#1C1C1E' : '#FFFFFF',
    color: (opacity = 1) => changeColor,
    strokeWidth: 2,
    decimalPlaces: 0,
  };

  return (
    <AnimatedPressable
      entering={FadeInRight}
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          shadowColor: isDark ? '#000' : '#666',
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.leftContent}>
        <Animated.Text
          style={[
            styles.symbol,
            { color: isDark ? '#FFFFFF' : '#000000' },
          ]}>
          {stock.symbol}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.name,
            { color: isDark ? '#8E8E93' : '#666666' },
          ]}>
          {stock.name}
        </Animated.Text>
        {stock.shares_owned && (
          <Animated.Text style={[styles.shares, { color: isDark ? '#8E8E93' : '#666666' }]}>
            {stock.shares_owned} shares
          </Animated.Text>
        )}
      </View>

      <View style={styles.chartContent}>
        <LineChart
          data={chartData}
          width={120}
          height={40}
          chartConfig={chartConfig}
          bezier
          withDots={false}
          withInnerLines={false}
          withOuterLines={false}
          withHorizontalLabels={false}
          withVerticalLabels={false}
          style={styles.chart}
        />
      </View>

      <View style={styles.rightContent}>
        <Animated.Text
          style={[
            styles.price,
            { color: isDark ? '#FFFFFF' : '#000000' },
          ]}>
          {formatPrice(stock.price)}
        </Animated.Text>
        <Animated.Text style={[styles.change, { color: changeColor }]}>
          {formatPercentageChange(stock.daily_change)}
        </Animated.Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  leftContent: {
    flex: 1,
    marginRight: 12,
  },
  chartContent: {
    flex: 2,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  rightContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  chart: {
    marginRight: -16,
    marginLeft: -16,
    paddingRight: 0,
  },
  symbol: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  name: {
    fontSize: 13,
    marginBottom: 2,
  },
  shares: {
    fontSize: 13,
  },
  price: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  change: {
    fontSize: 13,
  },
});
