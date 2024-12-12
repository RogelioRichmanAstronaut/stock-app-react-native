import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import Animated, { FadeIn } from 'react-native-reanimated';
import { StockDetailProps } from '../types/stock';
import { formatPrice, formatPercentageChange, getChangeColor } from '../utils/stockUtils';
import { generateStockChartData } from '../utils/chartUtils';
import { useTheme } from '../context/ThemeContext';
import { BlurView } from 'expo-blur';

const screenWidth = Dimensions.get('window').width;
const TIME_PERIODS = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'];

interface GlassButtonProps {
  onPress?: () => void;
  variant: 'buy' | 'sell';
  isDark: boolean;
  children: React.ReactNode;
}

const GlassButton: React.FC<GlassButtonProps> = ({ 
  onPress, 
  variant, 
  isDark, 
  children 
}) => {
  const colors = {
    buy: {
      bg: 'rgba(34, 197, 94, 0.1)',
      border: 'rgba(34, 197, 94, 0.2)',
      shadow: '#22C55E',
      text: '#22C55E'
    },
    sell: {
      bg: 'rgba(59, 130, 246, 0.1)',
      border: 'rgba(59, 130, 246, 0.2)',
      shadow: '#3B82F6',
      text: '#3B82F6'
    }
  };

  const buttonColor = colors[variant];

  return (
    <Pressable 
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isDark 
            ? variant === 'buy' 
              ? 'rgba(48, 209, 88, 0.1)' 
              : '#2C2C2E'
            : buttonColor.bg,
          borderWidth: isDark ? 0 : 1,
          borderColor: isDark ? 'transparent' : buttonColor.border,
          shadowColor: isDark ? 'transparent' : buttonColor.shadow,
          shadowOffset: isDark ? undefined : { width: 0, height: 4 },
          shadowOpacity: isDark ? 0 : 0.1,
          shadowRadius: isDark ? 0 : 12,
          opacity: pressed ? 0.8 : 1,
        },
      ]}>
      {!isDark && (
        <BlurView
          intensity={20}
          style={StyleSheet.absoluteFillObject}
          tint="light"
        />
      )}
      <View style={styles.buttonContent}>
        {children}
      </View>
    </Pressable>
  );
};

export function StockDetailScreen() {
  const params = useLocalSearchParams();
  const stock = JSON.parse(params.stock as string);
  const { isDark } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  
  const chartData = useMemo(() => {
    const data = generateStockChartData(stock);
    return {
      labels: [],
      datasets: [{
        data: data.map(d => d.value),
      }],
    };
  }, [stock]);

  const chartConfig = {
    backgroundGradientFrom: isDark ? '#000000' : '#FFFFFF',
    backgroundGradientTo: isDark ? '#000000' : '#FFFFFF',
    color: (opacity = 1) => getChangeColor(stock.daily_change),
    strokeWidth: 2,
    decimalPlaces: 2,
    propsForBackgroundLines: {
      strokeDasharray: '', // solid background lines
      stroke: isDark ? '#333333' : '#E5E5E5',
      strokeWidth: 1,
    },
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.symbolContainer}>
          <Animated.Text
            entering={FadeIn}
            style={[styles.symbol, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            {stock.symbol}
          </Animated.Text>
          <Animated.Text
            style={[styles.name, { color: isDark ? '#8E8E93' : '#666666' }]}>
            {stock.name}
          </Animated.Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Animated.Text
            style={[styles.price, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            {formatPrice(stock.price)}
          </Animated.Text>
          <Animated.Text
            style={[styles.change, { color: getChangeColor(stock.daily_change) }]}>
            {formatPercentageChange(stock.daily_change)}
          </Animated.Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          withHorizontalLines
          withVerticalLines={false}
          withDots={false}
          style={styles.chart}
        />

        <View style={styles.periodSelector}>
          {TIME_PERIODS.map((period) => (
            <Pressable
              key={period}
              onPress={() => setSelectedPeriod(period)}
              style={[
                styles.periodButton,
                period === selectedPeriod && {
                  backgroundColor: isDark ? '#333333' : '#F2F2F7',
                },
              ]}>
              <Animated.Text
                style={[
                  styles.periodText,
                  {
                    color: period === selectedPeriod
                      ? (isDark ? '#FFFFFF' : '#000000')
                      : (isDark ? '#8E8E93' : '#666666'),
                  },
                ]}>
                {period}
              </Animated.Text>
            </Pressable>
          ))}
        </View>
      </View>

      {stock.shares_owned ? (
        <View style={[styles.assetsCard, { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }]}>
          <View style={styles.assetsHeader}>
            <Animated.Text style={[styles.assetsLabel, { color: isDark ? '#8E8E93' : '#666666' }]}>
              MY ASSETS
            </Animated.Text>
            <Animated.Text style={[styles.assetsValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              {formatPrice(stock.price * stock.shares_owned)}
            </Animated.Text>
            <Animated.Text style={[styles.sharesText, { color: isDark ? '#8E8E93' : '#666666' }]}>
              {stock.shares_owned} shares
            </Animated.Text>
          </View>
          <View style={styles.buttonContainer}>
            <GlassButton
              variant="sell"
              isDark={isDark}>
              <Animated.Text style={[
                styles.buttonText,
                { color: isDark ? '#7BA6B4' : '#3B82F6' }
              ]}>
                Sell
              </Animated.Text>
              <Animated.Text style={[
                styles.buttonSubtext,
                { color: isDark ? '#CBD5E1' : '#3B82F6' }
              ]}>
                {stock.shares_owned} shares
              </Animated.Text>
            </GlassButton>

            <GlassButton
              variant="buy"
              isDark={isDark}>
              <Animated.Text style={[
                styles.buttonText,
                { color: isDark ? '#30D158' : '#22C55E' }
              ]}>
                Buy
              </Animated.Text>
              <Animated.Text style={[
                styles.buttonSubtext,
                { color: isDark ? 'rgba(48, 209, 88, 0.7)' : '#22C55E' }
              ]}>
                Add shares
              </Animated.Text>
            </GlassButton>
          </View>
        </View>
      ) : null}

      <View style={[styles.statsCard, { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }]}>
        <Animated.Text style={[styles.statsHeader, { color: isDark ? '#FFFFFF' : '#000000' }]}>
          KEY STATISTICS
        </Animated.Text>
        <View style={styles.statsGrid}>
          {[
            { label: 'Open', value: formatPrice(stock.open) },
            { label: 'High', value: formatPrice(stock.high) },
            { label: 'Low', value: formatPrice(stock.low) },
            { label: 'Vol', value: (stock.volume / 1000000).toFixed(2) + 'M' },
            { label: 'P/E', value: stock.pe_ratio?.toFixed(2) || '-' },
            { label: 'Mkt Cap', value: stock.market_cap },
          ].map(({ label, value }) => (
            <View key={label} style={styles.statItem}>
              <Animated.Text style={[styles.statLabel, { color: isDark ? '#8E8E93' : '#666666' }]}>
                {label}
              </Animated.Text>
              <Animated.Text style={[styles.statValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                {value}
              </Animated.Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 24,
  },
  symbolContainer: {
    flex: 1,
  },
  symbol: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  change: {
    fontSize: 16,
    fontWeight: '600',
  },
  chartContainer: {
    marginBottom: 24,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
  },
  assetsCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  assetsHeader: {
    marginBottom: 16,
  },
  assetsLabel: {
    fontSize: 13,
    marginBottom: 8,
  },
  assetsValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  sharesText: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonContent: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  buttonSubtext: {
    fontSize: 13,
  },
  statsCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  statsHeader: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  statItem: {
    width: '40%',
  },
  statLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '600',
  },
});
