import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Animated, { FadeIn } from 'react-native-reanimated';
import { WalletHeaderProps } from '../types/stock';
import { formatPrice, formatPercentageChange, getChangeColor } from '../utils/stockUtils';
import { useTheme } from '../context/ThemeContext';

const screenWidth = Dimensions.get('window').width;

export function WalletHeader({ walletInfo }: WalletHeaderProps) {
  const { isDark } = useTheme();
  const changeColor = getChangeColor(walletInfo.daily_change_percentage);

  const chartData = {
    labels: [],
    datasets: [{
      data: walletInfo.chart_data.map(point => point.value),
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
    <Animated.View
      entering={FadeIn}
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
        },
      ]}>
      <View style={styles.header}>
        <Animated.Text style={[styles.label, { color: isDark ? '#8E8E93' : '#666666' }]}>
          ACCOUNT
        </Animated.Text>
        <Animated.Text style={[styles.value, { color: isDark ? '#FFFFFF' : '#000000' }]}>
          {formatPrice(walletInfo.total_value)}
        </Animated.Text>
        <Animated.Text style={[styles.change, { color: changeColor }]}>
          {formatPercentageChange(walletInfo.daily_change_percentage)}
          {' • '}
          {formatPrice(walletInfo.daily_change_value)}
        </Animated.Text>
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={screenWidth - 64}
          height={100}
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

      <View style={styles.timeframes}>
        {['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'].map((timeframe) => (
          <Animated.Text
            key={timeframe}
            style={[
              styles.timeframeText,
              { color: timeframe === '6M' ? changeColor : isDark ? '#8E8E93' : '#666666' },
            ]}>
            {timeframe}
          </Animated.Text>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  value: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 4,
  },
  change: {
    fontSize: 16,
    fontWeight: '500',
  },
  chartContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  timeframes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
